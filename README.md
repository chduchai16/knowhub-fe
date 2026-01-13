# KnowHub - Frontend

KnowHub là một nền tảng kết nối cộng đồng và chia sẻ kiến thức.

> [!NOTE]  
> Dự án hiện đang trong quá trình phát triển (In Progress).

## 🚀 Công nghệ sử dụng

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Context API
- **Authentication:** JWT (Cookie based)

## ✨ Tính năng hiện tại

- **Landing Page:** Thiết kế hiện đại theo phong cách Notion.
- **Authentication:** Đăng nhập và đăng ký người dùng.
- **Client Layout:** Giao diện sidebar phong cách Instagram.
- **Tìm kiếm:** Sheet tìm kiếm người dùng real-time.
- **Bảng tin (Feed):** Hiển thị các bài viết từ cộng đồng.
- **Trang cá nhân:** Quản lý thông tin và bài viết cá nhân.
- **Responsive:** Hỗ trợ tốt trên Desktop, Tablet và Mobile.

## 🛠 Phát triển dự án (Local)

1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Cài đặt biến môi trường:**
   Tạo file `.env.local` và cấu hình các biến cần thiết (nếu có).

3. **Chạy môi trường development:**
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại: [http://localhost:3000](http://localhost:3000)

## 📁 Cấu trúc thư mục chính

- `src/app`: Định nghĩa các routes và layout (App Router).
- `src/features`: Chứa các module tính năng (Auth, Client, Admin).
- `src/shared`: Chứa các components, hooks và services dùng chung.
- `src/assets`: Hình ảnh và tài nguyên tĩnh.

---
© 2026 KnowHub Team.
