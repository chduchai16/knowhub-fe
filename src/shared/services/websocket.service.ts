import { Client, IFrame, IMessage, StompConfig } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { socketUrl } from '@/shared/constants/environment';

export class WebSocketService {
    protected stompClient: Client | null = null;
    protected subcriptions: Map<string, any> = new Map();

    protected constructor() {}



    public connect (token : string , onConnected? : ((frame: IFrame) => void) | (() => void) ) {
        if(this.stompClient?.connected) return ;
        const socket = new SockJS(socketUrl);
        this.stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            debug: (str) => {
                console.log(str);
            }
        })
        this.stompClient.onConnect = (frame) => {
            console.log("Connected: " + frame);
            if(onConnected) {
                if(onConnected.length > 0) {
                    (onConnected as (frame: IFrame) => void)(frame);
                } else {
                    (onConnected as () => void)();
                }
            }
        }
        this.stompClient.onStompError = (frame) => {
            console.error("Broker reported error: " + frame.headers['message']);
            console.error("Additional details: " + frame.body);
        }
        this.stompClient.activate();
    }

    public disconnect() {
        if (this.stompClient) {
            this.stompClient.deactivate();
            this.stompClient = null;
        }   
    }

    public subcribe (destination : string , callback: (payload : any) => void){
        if(!this.stompClient || !this.stompClient.connected) {
            console.error("WebSocket is not connected.");
            return;
        }
        const subscription = this.stompClient.subscribe(destination, (message) => {
            callback(JSON.parse(message.body));
        });
        this.subcriptions.set(destination, subscription);
    }

    public sendMessage(destination: string, message: any) {
        if(this.stompClient?.connected) {
            this.stompClient.publish({
                destination,
                body: JSON.stringify(message)
            });
        } else {
            console.error("WebSocket is not connected.");
        }
    }

    public sendChatMessage(receiverId: number, content: string) {
        if(this.stompClient?.connected) {
            this.stompClient.publish({
                destination: '/app/chat.send',
                body: JSON.stringify({
                    receiverId,
                    content
                })
            });
        } else {
            console.error("WebSocket is not connected.");
        }
    }

    public subscribeToMessages(callback: (message: any) => void) {
        if(!this.stompClient || !this.stompClient.connected) {
            console.error("WebSocket is not connected.");
            return;
        }
        const subscription = this.stompClient.subscribe('/user/queue/messages', (message) => {
            callback(JSON.parse(message.body));
        });
        this.subcriptions.set('/user/queue/messages', subscription);
    }

    public isConnected() : boolean {
        return this.stompClient?.connected || false;
    }

    public unSubcribe(destination: string) {
        const subscription = this.subcriptions.get(destination);
        if(subscription) {
            subscription.unsubscribe();
            this.subcriptions.delete(destination);
        }
    }
}