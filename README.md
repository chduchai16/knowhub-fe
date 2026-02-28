# KnowHub - Frontend

KnowHub là ứng dụng frontend cho nền tảng mạng xã hội chia sẻ kiến thức. Được xây dựng bằng Next.js, kết nối tới backend thông qua REST API và WebSocket.

---

## Công nghệ sử dụng

- Next.js 16 (App Router, standalone output)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui (Radix UI)
- Axios
- React Hook Form + Zod
- STOMP over SockJS (WebSocket - cho tính năng chat)
- SSE - Server-Sent Events (cho thông báo real-time)
- Sonner (toast notifications)
- JWT (cookie-based authentication)

---

## Tính năng chính

**Xác thực**
- Đăng ký, đăng nhập
- Xác thực bằng JWT lưu trong cookie
- Đăng nhập / đăng ký qua Google OAuth2
- Đăng nhập / đăng ký qua Facebook OAuth2

**Bảng tin (Feed)**
- Xem bài viết từ cộng đồng
- Tạo bài viết kèm ảnh hoặc video
- Crop ảnh trước khi đăng
- Bình luận, tương tác bài viết

**Trang cá nhân**
- Xem và chỉnh sửa thông tin cá nhân
- Xem bài viết của người dùng
- Follow / Unfollow

**Khám phá**
- Tìm kiếm người dùng, bài viết theo tag

**Nhắn tin**
- Chat real-time qua WebSocket (STOMP)

**Thông báo**
- Nhận thông báo real-time qua SSE
- Điều hướng thông minh theo loại thông báo

**Cài đặt**
- Đổi mật khẩu, quyền riêng tư, báo cáo

**Admin Panel**
- Quản lý người dùng, bài viết, bình luận, tag
- Quản lý vai trò và quyền hạn
- Dashboard thống kê
- Xem nhật ký hoạt động và xử lý báo cáo

---

## Cài đặt và chạy local

**1. Cài dependencies**

```bash
npm install
```

**2. Tạo file môi trường**

Tạo file `.env.local` ở thư mục gốc:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_WS_URL=http://localhost:8080/ws/chat
```

> OAuth redirect mặc định trỏ tới `http://localhost:8080/oauth2/authorization/{provider}`.  
> Nếu backend chạy ở địa chỉ khác, chỉ cần đổi `NEXT_PUBLIC_API_URL` — URL OAuth sẽ tự cập nhật theo.

---

## Cấu hình OAuth (Google & Facebook)

OAuth được xử lý hoàn toàn ở phía **backend** (Spring Boot). Frontend chỉ redirect người dùng tới backend rồi nhận token về.

**Luồng hoạt động:**

```
Người dùng click "Google" / "Facebook"
  → Redirect tới backend: /oauth2/authorization/{provider}
  → Backend xác thực với Google / Facebook
  → Backend redirect về: {FRONTEND_URL}/oauth-success?token=<jwt>
  → Frontend (/oauth-success) lưu token vào cookie
  → Redirect về trang chính
```

**Các URL OAuth:**

| Provider | URL |
|----------|-----|
| Google | `{BACKEND_URL}/oauth2/authorization/google` |
| Facebook | `{BACKEND_URL}/oauth2/authorization/facebook` |

**Cấu hình cần thiết phía backend:**

- Google: Đăng ký OAuth Client tại [Google Cloud Console](https://console.cloud.google.com/), thêm `http://localhost:8080/login/oauth2/code/google` vào Authorized redirect URIs.
- Facebook: Đăng ký app tại [Meta for Developers](https://developers.facebook.com/), thêm `http://localhost:8080/login/oauth2/code/facebook` vào Valid OAuth Redirect URIs.

**3. Chạy development server**

```bash
npm run dev
```

Ứng dụng chạy tại `http://localhost:3000`.

---

## Build production

```bash
npm run build
npm run start
```

---

## Triển khai bằng Docker

Dự án hỗ trợ inject biến môi trường lúc runtime thông qua `entrypoint.sh`, không cần build lại image khi đổi URL backend.

**Build image**

```bash
docker build -t knowhub-fe .
```

**Chạy container**

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://your-backend:8080/api \
  -e NEXT_PUBLIC_WS_URL=http://your-backend:8080/ws/chat \
  knowhub-fe
```

---

## Cấu trúc thư mục

Dự án theo kiến trúc Feature-Based, mỗi tính năng là một module độc lập.

```
src/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Đăng nhập, đăng ký
│   ├── (client)/               # Feed, profile, post, messages, settings, explore
│   └── (admin)/                # Toàn bộ trang admin
│
├── features/                   # Modules theo nghiệp vụ
│   ├── auth/
│   ├── post/
│   ├── comment/
│   ├── user/
│   ├── message/
│   ├── notification/
│   ├── tag/
│   ├── role/
│   ├── permission/
│   ├── report/
│   ├── activity/
│   └── dashboard/
│
├── components/                 # Layout components (header, sidebar, footer)
│   ├── layout/admin/
│   └── layout/client/
│
└── shared/                     # Dùng chung toàn dự án
    ├── components/ui/          # shadcn/ui components
    ├── components/common/      # Components tái sử dụng
    ├── hooks/                  # Custom hooks
    ├── services/               # API services dùng chung
    ├── configs/                # Cấu hình axios
    ├── constants/              # Biến môi trường
    ├── models/                 # TypeScript interfaces dùng chung
    ├── sse/                    # Logic SSE cho thông báo
    └── utils/                  # Hàm tiện ích
```

Mỗi feature thường bao gồm:

- `components/` - React components (có thể chia thêm `admin/`, `client/` nếu cần)
- `models/` - TypeScript interfaces
- `schemas/` - Zod validation schemas
- `services/` - Gọi API
- `hooks/` - Custom hooks riêng của feature (nếu có)

---

## Ghi chú

- Biến môi trường `NEXT_PUBLIC_API_URL` và `NEXT_PUBLIC_WS_URL` được resolve lúc runtime khi chạy Docker thông qua cơ chế thay thế placeholder trong `entrypoint.sh`. Nếu chạy local thì lấy từ `.env.local`.
- Authentication dựa trên JWT lưu trong cookie, middleware Next.js kiểm tra token trước khi cho phép truy cập các route được bảo vệ.
- Real-time thông báo dùng SSE (Server-Sent Events), chat dùng STOMP over SockJS.

---

© 2026 KnowHub Team.