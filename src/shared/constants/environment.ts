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

// Kiểm tra xem placeholder đã được thay thế chưa
const getBackendUrl = (): string => {
    // Nếu placeholder chưa được thay thế, dùng fallback
    if (PLACEHOLDER.startsWith("__NEXT_PUBLIC")) {
        // Chạy trong môi trường dev hoặc chưa inject
        return DEFAULT_URL;
    }
    return PLACEHOLDER;
};

export const backendUrl = getBackendUrl();
