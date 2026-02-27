import { PageResponse } from "@/shared/models/page-response";
import { Inbox } from "../models/inbox";
import api from "@/shared/configs/axios.config";
import { Message } from "../models/message";

export class MessageService {
    
    // danh sách hộp thư đến
    public static async getInboxes(page : number , search?: string) : Promise<PageResponse<Inbox>> {
        const response = await api.get<PageResponse<Inbox>>("/messages/inbox", {
            params: {
                page: page - 1,
                search
            }
        });
        return response.data;
    }

    // chi tiết cuộc hội thoại
    public static async getConversation(congtactId : number , page : number , limit : number) : Promise<PageResponse<Message>> {
        const response = await api.get(`messages` , {
            params: {
                contactId: congtactId,
                page: page - 1,
                limit
            }
        });
        return response.data;
    }

    // xóa cuộc hộ thoại 
    public static async deleteConversation(contactId : number) {
        await api.delete(`/messages/conversation/${contactId}`);
    }

    // xóa tin nhắn 
    public static async deleteMessage(messageId : number) {
        await api.delete(`/messages/${messageId}`);
    }

    public static async updateMessage(messageId : number, content : string) : Promise<Message> {
        const response = await api.put(`/messages`, {
            id: messageId,
            content
        });
        return response.data;
    }

    // Gửi tin nhắn mới cho user (tự động tạo conversation nếu chưa tồn tại)
    public static async sendMessage(receiverId: number, payload: { content: string }) : Promise<Message> {
        const response = await api.post<Message>(`/messages`, {
            receiverId,
            ...payload
        });
        return response.data;
    }
}