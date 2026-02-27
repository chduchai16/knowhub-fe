import api from "@/shared/configs/axios.config";
import { PageResponse } from "@/shared/models/page-response";
import { Notification } from "../models/notification";

export class NotificationService {

    // lấy danh sách thông báo với phân trang
    public static async getNotifications (page : number, limit : number) : Promise<PageResponse<Notification>> {
        const response = await api.get('/notifications' , { params: { page, limit } });  
        return response.data;              
    }

    // lấy số lượng thông báo chưa đọc
    public static async getUnreadCount () : Promise<number> {
        try { 
            const response = await api.get('/notifications/unread-count');  
            return response.data;
        } catch (error) {
            throw error ;
        }
    }
    
    // đánh dấu 1 thông báo đã đọc
    public static async markAsRead (notificationId : number) : Promise<any> {
        try {
            const response = await api.put(`/notifications/${notificationId}/read`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // đánh dấu tất cả đã đọc
    public static async markAllAsRead () : Promise<any> {
        try {
            const response = await api.put('/notifications/read-all');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
