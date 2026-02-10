import { serverBackendUrl } from "../constants/server-environment";
import { toast } from "sonner";
import Cookies from "js-cookie";

export function connectNotificationSse (onMesssage : (data : any) => void){
    const token = Cookies.get("token");
    
    const url = token 
        ? `${serverBackendUrl}/notifications/stream?token=${encodeURIComponent(token)}`
        : `${serverBackendUrl}/notifications/stream`;
    
    const eventSource = new EventSource(url, { withCredentials: true });
    eventSource.addEventListener("notification" , (event) => {
        const data = JSON.parse(event.data) ;
        onMesssage(data) ;
    });

    eventSource.onerror = () => {
        toast.error("Kết nối SSE bị lỗi. Vui lòng thử lại sau.");
        eventSource.close();
    };

    return eventSource ;
}