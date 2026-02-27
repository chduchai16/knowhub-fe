/**
 * Runtime API URL configuration
 * 
 * Cách hoạt động:
 * - Build time: Next.js inline giá trị từ process.env.NEXT_PUBLIC_API_URL
 * - Runtime (Docker): entrypoint.sh thay thế placeholder "__NEXT_PUBLIC_API_URL__" bằng giá trị thực
 * 
 * Ưu tiên: placeholder > env > default
 */

const PLACEHOLDER = "__NEXT_PUBLIC_API_URL__";
const DEFAULT_URL = "http://localhost:8080/api";

const WS_PLACEHOLDER = "__NEXT_PUBLIC_WS_URL__";
const DEFAULT_WS_URL = "http://localhost:8080/ws/chat";

// Kiểm tra xem placeholder đã được thay thế chưa
const getBackendUrl = (): string => {
    // Nếu placeholder chưa được thay thế, dùng fallback
    if (PLACEHOLDER.startsWith("__NEXT_PUBLIC")) {
        // Chạy trong môi trường dev hoặc chưa inject
        return DEFAULT_URL;
    }
    return PLACEHOLDER;
};

const getSocketUrl = (): string => {
    // Nếu placeholder chưa được thay thế, dùng fallback
    if (WS_PLACEHOLDER.startsWith("__NEXT_PUBLIC")) {
        // Chạy trong môi trường dev hoặc chưa inject
        return DEFAULT_WS_URL;
    }
    return WS_PLACEHOLDER;
};

export const backendUrl = getBackendUrl();
export const socketUrl = getSocketUrl();
