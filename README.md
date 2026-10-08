# 🎁 GiftSpace - Nền tảng Thương mại Điện tử Quà tặng & Trải nghiệm

* ✍️ **Tác giả:** Nguyễn Anh Tuấn
* 🛠️ **Dự án:** Nền tảng Thương mại Điện tử Quà tặng GiftSpace (Backend API)
* 📬 **Liên hệ:** anhtuancode@gmail.com

---

## 🚀 Giới thiệu

**GiftSpace** là nền tảng thương mại điện tử chuyên biệt về quà tặng, gói quà tùy biến và trải nghiệm cá nhân hóa. Hệ thống backend được xây dựng trên nền tảng **NestJS** kết hợp với **Prisma ORM** và cơ sở dữ liệu **Mysql**, hướng tới kiến trúc module hóa chuẩn enterprise, xử lý dữ liệu type-safe, bảo mật cao và dễ dàng mở rộng.

Hệ thống hỗ trợ phân quyền người dùng đa cấp bậc (**USER**, **ADMIN**), bảo mật phiên đăng nhập bằng cặp token **Access Token & Refresh Token** có cơ chế xoay vòng (Token Rotation), tự động chuẩn hóa dữ liệu trả về và đóng gói triển khai môi trường nhanh chóng bằng **Docker**.

---

## 🧩 Tính năng chính

* ✅ **Xác thực hai lớp nâng cao (JWT Authentication):** Đăng ký, đăng nhập bảo mật với Bcrypt; cấp cặp token gồm Access Token (15 phút) và Refresh Token (7 ngày); tự động băm Refresh Token lưu vào database.
* ✅ **Cơ chế Token Rotation & Thu hồi phiên:** Tự động hủy và cấp mới cặp token khi làm mới phiên (`/auth/refresh`); chủ động thu hồi quyền truy cập khi đăng xuất (`/auth/logout`).
* ✅ **Phân quyền người dùng (Role-Based Access Control - RBAC):** Kiểm soát truy cập chặt chẽ bằng bộ đôi `@Roles(Role.ADMIN)` metadata và `RolesGuard`.
* ✅ **Tối ưu hóa Developer Experience với Custom Decorators:** Trích xuất thông tin người dùng sạch sẽ, type-safe bằng `@CurrentUser()`.
* ✅ **Chuẩn hóa phản hồi API toàn cục (Global Response Interceptor):** Tự động bọc toàn bộ dữ liệu trả về với cấu trúc chuẩn (`status`, `statusCode`, `method`, `path`, `data`, `doc`, `datetime`).
* ✅ **Xử lý ngoại lệ tập trung (Global Exception Filter):** Bắt và định dạng mọi mã lỗi HTTP (400, 401, 403, 409, 500) đồng nhất với format thành công để tối ưu kết nối với Frontend.
* ✅ **Kiểm tra dữ liệu đầu vào tự động (Validation Pipes):** Tự động lọc rác và kiểm tra hợp lệ DTO bằng `class-validator`.
* ✅ **Quản lý dữ liệu quan hệ với Prisma ORM:** Mô hình hóa thực thể, tự động sinh migration và quản trị trực quan với Prisma Studio.

---

## ⚙️ Kiến trúc hệ thống

| Thành phần | Công nghệ | Vai trò |
| :--- | :--- | :--- |
| **Backend Framework** | NestJS (TypeScript) | Kiến trúc Module hóa, Dependency Injection, Controller/Service |
| **ORM & Data Layer** | Prisma ORM | Quản lý schema dữ liệu, migration và truy vấn type-safe |
| **Database** | Mysql | Cơ sở dữ liệu quan hệ lưu trữ người dùng, phân quyền, token |
| **Authentication & Security** | Passport.js, JWT, Bcrypt | Xác thực người dùng, bảo vệ route, mã hóa mật khẩu và token |
| **Validation & Transform** | class-validator, class-transformer | Ràng buộc kiểu dữ liệu DTO và kiểm tra biến môi trường `.env` |
| **DevOps & Container** | Docker, Docker Compose | Đóng gói môi trường cơ sở dữ liệu PostgreSQL đồng nhất |

---

## 🛠️ Thư viện cốt lõi sử dụng trong dự án


# Framework & Core
npm i @nestjs/common @nestjs/core @nestjs/config rxjs

# Cơ sở dữ liệu & ORM
npm i prisma @prisma/client

# Xác thực & Bảo mật
npm i @nestjs/passport passport passport-jwt @nestjs/jwt bcrypt
npm i -D @types/passport-jwt @types/bcrypt

# Kiểm tra dữ liệu (Validation)
npm i class-validator class-transformer


## 🛠️ Yêu cầu môi trường (Prerequisites)
Trước khi thiết lập dự án trên máy mới, hãy đảm bảo các công cụ sau đã sẵn sàng:

Node.js: Phiên bản >= 18.x hoặc 20.x LTS (Tải tại nodejs.org)

Package Manager: npm (đi kèm cài đặt Node.js)

Docker & Docker Desktop: Đang bật và chạy ngầm trên máy (Tải tại docker.com)

Git: Dùng để clone mã nguồn dự án

## 💻 Hướng dẫn chạy dự án chi tiết từ A - Z (Setup on New Machine)
Thực hiện tuần tự 7 bước sau để cài đặt và khởi chạy hệ thống:

Bước 1: Tải mã nguồn về máy
git clone <URL_REPO_CUA_BAN>
cd backend

Bước 2: Cài đặt toàn bộ gói thư viện
npm install

Bước 3: Thiết lập biến môi trường (.env)
Tạo một file có tên .env tại thư mục gốc của backend (nằm ngang hàng với package.json), sau đó dán nội dung cấu hình dưới đây:

PORT=8000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/giftspace_db?schema=public"
JWT_ACCESS_SECRET="GiftSpace_Access_Secret_2026_!@#"
JWT_ACCESS_EXPIRES_IN="900"
JWT_REFRESH_SECRET="GiftSpace_Refresh_Secret_2026_$%^"
JWT_REFRESH_EXPIRES_IN="604800"


## Bước 4: Khởi động Cơ sở dữ liệu Mysql bằng Docker
Đảm bảo Docker Desktop đang mở. Tại thư mục gốc backend/ (nơi chứa file docker-compose.yml), chạy lệnh:

docker compose up -d

## Bước 5: Đồng bộ Database Schema & Sinh Prisma Client
Sau khi PostgreSQL container đã khởi chạy thành công, chạy 2 lệnh sau để tạo bảng trong cơ sở dữ liệu và nạp kiểu dữ liệu TypeScript:

# 1. Chạy migration để áp dụng toàn bộ bảng vào PostgreSQL
npx prisma migrate dev

# 2. Sinh mã nguồn type-safe cho Prisma Client
npx prisma generate


## Bước 6: Khởi chạy giao diện quản lý cơ sở dữ liệu:
npx prisma studio

## Bước 7: Khởi chạy ứng dụng Backend
Khởi chạy server ở chế độ phát triển (hỗ trợ tự động reload khi sửa code):

npm run start:dev
