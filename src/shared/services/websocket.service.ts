import { Client, StompSubscription } from '@stomp/stompjs';

export class WebSocketService {
    protected stompClient: Client | null = null;
    protected subcriptions: Map<string, StompSubscription> = new Map();
}