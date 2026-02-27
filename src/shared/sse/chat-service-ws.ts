import SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';
import { socketUrl } from '../constants/environment';
import { WebSocketService } from '../services/websocket.service';

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

  // Override base connect to return Promise
  public connect(token: string, onConnected?: () => void): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.stompClient && (this.stompClient as any).active) {
        resolve();
        return;
      }

      const socket = new SockJS(socketUrl);

      this.stompClient = new StompJs.Client({
        webSocketFactory: () => socket as any,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.stompClient.onConnect = () => {
        console.log('WebSocket connected');
        onConnected?.();
        resolve();
      };

      this.stompClient.onStompError = (frame: any) => {
        console.error('STOMP error:', frame);
        reject(new Error(`STOMP error: ${frame.body}`));
      };

      this.stompClient.onWebSocketError = (event: any) => {
        console.error('WebSocket error:', event);
        reject(new Error('WebSocket connection error'));
      };

      this.stompClient.activate();
    });
  }

  subcribe(destination: string, callback: SubscriptionCallback, maxRetries: number = 5): void {
    if (this.subcriptions.has(destination)) {
      return; // Already subscribed
    }

    const attemptSubscription = (retries: number = 0) => {
      if (!this.stompClient || !(this.stompClient as any).active) {
        if (retries < maxRetries) {
          // Retry with exponential backoff
          const delay = Math.min(1000 * Math.pow(2, retries), 5000);
          setTimeout(() => attemptSubscription(retries + 1), delay);
          return;
        } else {
          console.error(`Failed to subscribe to ${destination} - STOMP client not connected`);
          return;
        }
      }

      const subscription = this.stompClient.subscribe(destination, (message: any) => {
        try {
          const body = JSON.parse(message.body);
          callback(body);
        } catch (error) {
          console.error('Failed to parse message:', error);
          callback(message.body);
        }
      });

      this.subcriptions.set(destination, subscription);
      this.messageCallbacks.set(destination, callback);
    };

    attemptSubscription();
  }

  unSubcribe(destination: string): void {
    const subscription = this.subcriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subcriptions.delete(destination);
      this.messageCallbacks.delete(destination);
    }
  }

  sendMessage(destination: string, message: any, maxRetries: number = 3): void {
    const attemptSend = (retries: number = 0) => {
      if (!this.stompClient || !(this.stompClient as any).active) {
        if (retries < maxRetries) {
          // Retry with exponential backoff
          const delay = Math.min(500 * Math.pow(2, retries), 3000);
          setTimeout(() => attemptSend(retries + 1), delay);
          return;
        } else {
          console.error('STOMP client is not connected - failed to send message');
          return;
        }
      }

      this.stompClient.publish({
        destination,
        body: JSON.stringify(message),
      });
    };

    attemptSend();
  }

  sendChatMessage(receiverId: number, content: string, maxRetries: number = 3): void {
    const attemptSend = (retries: number = 0) => {
      if (!this.stompClient || !(this.stompClient as any).active) {
        if (retries < maxRetries) {
          // Retry with exponential backoff
          const delay = Math.min(500 * Math.pow(2, retries), 3000);
          setTimeout(() => attemptSend(retries + 1), delay);
          return;
        } else {
          console.error('STOMP client is not connected - failed to send chat message');
          return;
        }
      }

      this.stompClient.publish({
        destination: '/app/chat.send',
        body: JSON.stringify({
          receiverId,
          content,
        }),
      });
    };

    attemptSend();
  }

  subscribeToMessages(callback: SubscriptionCallback, maxRetries: number = 5): void {
    if (this.subcriptions.has('/user/queue/messages')) {
      return; // Already subscribed
    }

    const attemptSubscription = (retries: number = 0) => {
      if (!this.stompClient || !(this.stompClient as any).active) {
        if (retries < maxRetries) {
          // Retry with exponential backoff
          const delay = Math.min(1000 * Math.pow(2, retries), 5000);
          setTimeout(() => attemptSubscription(retries + 1), delay);
          return;
        } else {
          console.error('STOMP client failed to connect after maximum retries');
          return;
        }
      }

      const subscription = this.stompClient.subscribe('/user/queue/messages', (message: any) => {
        try {
          const body = JSON.parse(message.body);
          callback(body);
        } catch (error) {
          console.error('Failed to parse message:', error);
          callback(message.body);
        }
      });

      this.subcriptions.set('/user/queue/messages', subscription);
      this.messageCallbacks.set('/user/queue/messages', callback);
    };

    attemptSubscription();
  }

  disconnect(): void {
    // Unsubscribe from all before disconnecting
    this.subcriptions.forEach((_: any, destination: string) => {
      this.unSubcribe(destination);
    });

    if (this.stompClient && (this.stompClient as any).active) {
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
      if (this.isConnected()) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return false;
  }
}

export { ChatService };
