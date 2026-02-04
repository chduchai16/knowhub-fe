/**
 * Server-side environment configuration
 * Chỉ sử dụng trong Server Components (layout.tsx, page.tsx với async)
 * 
 * File này dùng process.env trực tiếp vì Server Components 
 * có quyền truy cập env tại runtime
 */

export const serverBackendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
