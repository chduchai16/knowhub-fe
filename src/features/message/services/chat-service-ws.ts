import SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';
import { socketUrl } from '../../../shared/constants/environment';
import { WebSocketService } from '../../../shared/services/websocket.service';

type SubscriptionCallback = (message: any) => void;

class ChatService extends WebSocketService {
  private static instance: ChatService;
  private messageCallbacks: Map<string, SubscriptionCallback> = new Map();

  private constructor() {
    super();
  }

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  /** Connect to STOMP/WebSocket server using the provided JWT token */
  public connect(token: string, onConnected?: () => void): Promise<void> {
    console.log(`[ChatService] connect() called. socketUrl=${socketUrl}, token=${token ? token.slice(0,20)+'...' : 'EMPTY'}`);
    return new Promise((resolve, reject) => {
      if (this.stompClient && (this.stompClient as any).active) {
        console.log('[ChatService] Already connected — skipping.');
        resolve();
        return;
      }

      let resolved = false;

      this.stompClient = new StompJs.Client({
        // Create a NEW SockJS instance every time (fixes stale socket on reconnect)
        webSocketFactory: () => {
          console.log('[ChatService] webSocketFactory: creating new SockJS to', socketUrl);
          return new SockJS(socketUrl) as any;
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: (str) => console.log('[STOMP DEBUG]', str),
      });

      this.stompClient.onConnect = (frame) => {
        console.log('[ChatService] onConnect fired:', frame);
        console.log(`[ChatService] Pending callbacks to re-subscribe: ${this.messageCallbacks.size}`);

        // Re-subscribe to every registered callback after (re)connect
        this.messageCallbacks.forEach((callback, destination) => {
          console.log(`[ChatService] Re-subscribing to ${destination}`);
          if (this.stompClient && (this.stompClient as any).active) {
            const subscription = this.stompClient.subscribe(destination, (message: any) => {
              console.log(`%c[ChatService] ★ RAW FRAME on ${destination}`, 'color:lime;font-weight:bold', message.body);
              try {
                const parsed = JSON.parse(message.body);
                console.log(`[ChatService] ★ PARSED:`, parsed);
                callback(parsed);
              } catch {
                console.warn(`[ChatService] Failed to parse body:`, message.body);
                callback(message.body);
              }
            });
            this.subcriptions.set(destination, subscription);
            console.log(`[ChatService] Subscribed to ${destination} ✓`);
          }
        });

        onConnected?.();
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };

      this.stompClient.onDisconnect = () => {
        console.warn('[ChatService] onDisconnect fired');
      };

      // Intercept ALL incoming STOMP frames — helps detect if server sends to a different destination
      this.stompClient.onUnhandledMessage = (message: any) => {
        console.warn('%c[ChatService] ⚠ UNHANDLED MESSAGE (wrong destination?)', 'color:yellow;font-weight:bold', message.headers, message.body);
      };

      this.stompClient.onUnhandledFrame = (frame: any) => {
        console.warn('[ChatService] ⚠ UNHANDLED FRAME:', frame);
      };

      this.stompClient.onStompError = (frame: any) => {
        console.error('[ChatService] STOMP error:', frame);
        if (!resolved) {
          resolved = true;
          reject(new Error(`STOMP error: ${frame.body}`));
        }
      };

      this.stompClient.onWebSocketError = (event: any) => {
        console.error('[ChatService] WebSocket error:', event);
        if (!resolved) {
          resolved = true;
          reject(new Error('WebSocket connection error'));
        }
      };

      this.stompClient.onWebSocketClose = (event: any) => {
        console.warn('[ChatService] WebSocket closed:', event?.code, event?.reason);
      };

      console.log('[ChatService] Calling activate()...');
      this.stompClient.activate();
    });
  }

  /** Subscribe to an arbitrary STOMP destination */
  subcribe(destination: string, callback: SubscriptionCallback): void {
    console.log(`[ChatService] subcribe() called for ${destination}. isConnected=${this.isConnected()}`);
    // Always register the callback so onConnect can re-subscribe after reconnect
    this.messageCallbacks.set(destination, callback);

    if (!this.stompClient || !(this.stompClient as any).active) {
      // Not connected yet — onConnect will subscribe when ready
      console.log(`[ChatService] Not connected yet — callback queued for ${destination}`);
      return;
    }

    // Already connected: subscribe immediately (unless already subscribed)
    if (!this.subcriptions.has(destination)) {
      const subscription = this.stompClient.subscribe(destination, (message: any) => {
        console.log(`%c[ChatService] ★ RAW FRAME on ${destination}`, 'color:lime;font-weight:bold', message.body);
        try {
          const parsed = JSON.parse(message.body);
          console.log(`[ChatService] ★ PARSED:`, parsed);
          callback(parsed);
        } catch {
          console.warn(`[ChatService] Failed to parse body:`, message.body);
          callback(message.body);
        }
      });
      this.subcriptions.set(destination, subscription);
      console.log(`[ChatService] Subscribed immediately to ${destination} ✓`);
    } else {
      console.log(`[ChatService] Already subscribed to ${destination} — skipping.`);
    }
  }

  /** Unsubscribe from a STOMP destination */
  unSubcribe(destination: string): void {
    const subscription = this.subcriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subcriptions.delete(destination);
    }
    this.messageCallbacks.delete(destination);
  }

  /** Publish a raw message to any destination */
  sendMessage(destination: string, message: any, maxRetries: number = 3): void {
    const attemptSend = (retries: number = 0) => {
      if (!this.stompClient || !(this.stompClient as any).active) {
        if (retries < maxRetries) {
          const delay = Math.min(500 * Math.pow(2, retries), 3000);
          setTimeout(() => attemptSend(retries + 1), delay);
          return;
        }
        console.error('[ChatService] STOMP not connected – failed to send message');
        return;
      }
      this.stompClient.publish({ destination, body: JSON.stringify(message) });
    };

    attemptSend();
  }

  /** Send a 1-to-1 chat message via WebSocket */
  sendChatMessage(receiverId: number, content: string, maxRetries: number = 3): void {
    this.sendMessage('/app/chat.send', { receiverId, content }, maxRetries);
  }

  /**
   * Subscribe to the personal incoming-message queue.
   * Messages are delivered here when another user sends you a message.
   * Safe to call before connection is established — onConnect will pick it up.
   */
  subscribeToMessages(callback: SubscriptionCallback): void {
    this.subcribe('/user/queue/messages', callback);
  }

  /** Disconnect and clean up all subscriptions */
  disconnect(): void {
    // Unsubscribe active STOMP handles — but KEEP messageCallbacks
    // so that onConnect can re-subscribe them after reconnect
    this.subcriptions.forEach((subscription) => {
      try { subscription.unsubscribe(); } catch { /* ignore */ }
    });
    this.subcriptions.clear();
    // NOTE: messageCallbacks intentionally NOT cleared here

    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
  }

  isConnected(): boolean {
    return (this.stompClient as any)?.active ?? false;
  }

  async waitForConnection(maxWait: number = 10000): Promise<boolean> {
    const startTime = Date.now();
    while (Date.now() - startTime < maxWait) {
      if (this.isConnected()) return true;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return false;
  }
}

export { ChatService };
