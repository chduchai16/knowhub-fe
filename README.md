# KnowHub - Frontend

KnowHub là một nền tảng kết nối cộng đồng và chia sẻ kiến thức.

> [!NOTE]  
> Dự án hiện đang trong quá trình phát triển (In Progress).

## Công nghệ sử dụng

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Context API
- **Authentication:** JWT (Cookie based)

## Tính năng hiện tại

- **Landing Page:** Thiết kế hiện đại theo phong cách Notion.
- **Authentication:** Đăng nhập và đăng ký người dùng với thông báo thành công.
- **Client Layout:** Giao diện sidebar phong cách Instagram, hỗ trợ responsive hoàn chỉnh.
- **Real-time Notifications:** 
    - Nhận thông báo tức thời thông qua **Server-Sent Events (SSE)**.
    - Hiển thị Toast thông báo (Sonner) kèm nút "Xem" nhanh.
    - Tự động cập nhật số lượng thông báo chưa đọc.
    - Điều hướng thông minh dựa trên loại thông báo (Follow -> Profile, Reply -> Post).
- **Admin Panel:** Quản lý người dùng, bài viết, vai trò, quyền hạn.
- **Tìm kiếm:** Sheet tìm kiếm người dùng real-time.
- **Bảng tin (Feed):** Hiển thị các bài viết từ cộng đồng.
- **Trang cá nhân:** Quản lý thông tin và bài viết cá nhân.
- **Responsive:** Hỗ trợ tốt trên Desktop, Tablet và Mobile.

## Phát triển dự án (Local)

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

## Cấu trúc thư mục

Dự án sử dụng **Feature-Based Architecture** để tổ chức code một cách module hóa và dễ bảo trì.

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Auth route group
│   │   ├── login/
│   │   └── register/
│   ├── (client)/                # Client route group
│   │   ├── feed/
│   │   ├── profile/
│   │   ├── post/
│   │   ├── explore/
│   │   ├── notifications/
│   │   ├── messages/
│   │   └── settings/
│   ├── (admin)/                 # Admin route group
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── users/
│   │       ├── roles/
│   │       ├── permissions/
│   │       ├── posts/
│   │       ├── tags/
│   │       ├── reports/
│   │       ├── comments/
│   │       └── activity/
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css
│
├── features/                     # Feature modules (Feature-Based)
│   ├── auth/                    # Authentication feature
│   │   ├── components/
│   │   ├── schemas/
│   │   └── services/
│   ├── user/                    # User management feature
│   │   ├── components/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   ├── post/                    # Post feature
│   │   ├── components/
│   │   ├── models/
│   │   └── services/
│   ├── comment/                 # Comment feature
│   ├── notification/            # Notification feature
│   ├── dashboard/               # Admin dashboard feature
│   ├── role/                    # Role management feature
│   ├── permission/              # Permission management feature
│   ├── report/                  # Report management feature
│   ├── tag/                     # Tag management feature
│   └── activity/                # Activity tracking feature
│
├── components/                   # Layout & common components
│   ├── layout/
│   │   ├── admin/              # Admin layout components
│   │   │   ├── admin-header.tsx
│   │   │   ├── admin-sidebar.tsx
│   │   │   └── admin-footer.tsx
│   │   └── client/             # Client layout components
│   │       ├── client-header.tsx
│   │       └── client-sidebar.tsx
│   └── common/                  # Shared components
│       ├── admin/
│       └── client/
│
└── shared/                       # Shared resources
    ├── components/
    │   ├── ui/                  # shadcn/ui components
    │   └── common/              # Common reusable components
    ├── hooks/                   # Custom React hooks
    │   ├── use-user.tsx
    │   ├── use-role.ts
    │   ├── use-mobile.ts
    │   └── use-debounce.ts
    ├── services/                # API services
    │   ├── media.service.ts
    │   └── user-auth-service.ts
    ├── configs/                 # Configuration files
    │   └── axios.config.ts
    ├── constants/               # Constants & environment
    │   └── environment.ts
    ├── models/                  # Shared TypeScript interfaces
    │   ├── page-response.ts
    │   ├── jwt-payload.ts
    │   └── user-action.ts
    ├── sse/                     # Real-time Server-Sent Events logic
    │   └── notification-sse.ts
    └── utils/                   # Utility functions
        ├── cn.ts
        ├── crop-image.ts
        ├── time.ts
        └── index.ts
```

## Ghi chú kỹ thuật

- **Real-time Engine:** Sử dụng **SSE (Server-Sent Events)** để kết nối liên tục với Server khi user đã đăng nhập, giúp nhận dữ liệu thông báo mà không cần pooling.

### Feature-Based Architecture

Mỗi feature là một module độc lập, không có cấu trúc cố định mà tùy thuộc vào yêu cầu nghiệp vụ:

**Cấu trúc thường gặp:**
- **components/**: React components của feature (có thể phân chia thêm admin/, client/, shared/ nếu cần)
- **models/**: TypeScript interfaces/types (nếu có)
- **schemas/**: Zod validation schemas (nếu có)
- **services/**: API calls và business logic
- **hooks/**: Custom hooks riêng của feature (nếu có)

**Ví dụ:**
- `features/auth/`: components, schemas, services
- `features/user/`: components (admin, client, shared), models, schemas, services
- `features/post/`: components, models, services

**Ưu điểm:**
- Dễ bảo trì và scale
- Code tách biệt theo nghiệp vụ
- Tái sử dụng code hiệu quả
- Team có thể làm việc song song trên các features khác nhau

---
© 2026 KnowHub Team.
