import { backendUrl } from "@/shared/constants/environment";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm token vào request nếu có
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: trả về data và xử lý lỗi toàn cục
api.interceptors.response.use(
  (response) => response.data, // trả về data trực tiếp
  (error: AxiosError<any>) => {
    // Nếu có response từ server
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "Đã xảy ra lỗi không xác định";
      toast.error(message);

      if (status === 401) {
        // Ví dụ: redirect sang login
        Cookies.remove("token");
      }
    } else if (error.request) {
      // Khi không nhận được response
      toast.error("Không thể kết nối tới server");
    } else {
      // Lỗi khác
      toast.error(error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
