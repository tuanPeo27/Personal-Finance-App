<div align="center">

# 💰 Personal Finance Management System

### Hệ thống quản lý tài chính cá nhân

<p>
  <img src="https://img.shields.io/badge/.NET-10-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET 10">
  <img src="https://img.shields.io/badge/ASP.NET%20Core-Web%20API-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt="ASP.NET Core">
  <img src="https://img.shields.io/badge/Entity%20Framework%20Core-ORM-512BD4?style=for-the-badge" alt="EF Core">
  <img src="https://img.shields.io/badge/SQL%20Server-Database-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white" alt="SQL Server">
</p>

<p>
  <img src="https://img.shields.io/badge/JWT-Authentication-black?style=flat-square" alt="JWT">
  <img src="https://img.shields.io/badge/SignalR-Realtime-512BD4?style=flat-square" alt="SignalR">
  <img src="https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?style=flat-square&logo=swagger&logoColor=black" alt="Swagger">
</p>

<p>
  Ứng dụng hỗ trợ người dùng quản lý thu nhập, chi tiêu, tài khoản tài chính,<br>
  ngân sách và mục tiêu tài chính trên một nền tảng tập trung.
</p>

</div>

---

## 📑 Mục lục

- [✨ Giới thiệu](#-giới-thiệu)
- [🚀 Chức năng](#-chức-năng)
- [🛠️ Công nghệ](#️-công-nghệ)
- [🏗️ Kiến trúc](#️-kiến-trúc)
- [📂 Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [🗄️ Cơ sở dữ liệu](#️-cơ-sở-dữ-liệu)
- [⚙️ Cài đặt môi trường](#️-cài-đặt-môi-trường)
- [📥 Clone project](#-clone-project)
- [📦 Cài đặt packages](#-cài-đặt-packages)
- [🔧 Cấu hình](#-cấu-hình)
- [🗃️ Migration & Database](#️-migration--database)
- [▶️ Chạy project](#️-chạy-project)
- [📚 Swagger / OpenAPI](#-swagger--openapi)
- [🔐 Authentication](#-authentication)
- [🔔 SignalR](#-signalr)
- [⏰ Hosted Service](#-hosted-service)
- [🔄 Middleware Pipeline](#-middleware-pipeline)
- [💉 Dependency Injection](#-dependency-injection)
- [✅ Validation & Filter](#-validation--filter)
- [❤️ Health Check](#️-health-check)
- [🔗 API Endpoints](#-api-endpoints)
- [🌿 Git Workflow](#-git-workflow)
- [🧯 Xử lý lỗi thường gặp](#-xử-lý-lỗi-thường-gặp)
- [🔒 Bảo mật](#-bảo-mật)
- [🧪 Hands-on Lab ASP.NET Core](#-hands-on-lab-aspnet-core)
- [👨‍💻 Tác giả](#-tác-giả)

---

## ✨ Giới thiệu

**Personal Finance Management System** là hệ thống quản lý tài chính cá nhân được xây dựng với mục tiêu giúp người dùng theo dõi và kiểm soát tình hình tài chính một cách đơn giản.

Hệ thống cho phép người dùng:

- Theo dõi số dư của nhiều tài khoản tài chính.
- Quản lý thu nhập và chi tiêu.
- Phân loại các giao dịch.
- Thiết lập ngân sách theo tháng.
- Theo dõi tiến độ mục tiêu tài chính.
- Nhận cảnh báo khi vượt ngân sách.
- Nhận thông báo khi hoàn thành mục tiêu.
- Xem thống kê tài chính trên Dashboard.

> 🎯 **Mục tiêu của project:** xây dựng một Web API thực tế, đồng thời áp dụng các thành phần quan trọng của ASP.NET Core như Middleware, Dependency Injection, Authentication/Authorization, Model Binding & Validation, Filter, Hosted Service, Configuration, Health Check và Swagger/OpenAPI.

---

## 🚀 Chức năng

| Chức năng | Mô tả |
|---|---|
| 🔐 Authentication | Đăng ký, đăng nhập bằng JWT |
| 👤 User | Quản lý thông tin cá nhân |
| 💳 Account | Quản lý tiền mặt, ngân hàng, ví điện tử |
| 🏷️ Category | Quản lý danh mục thu nhập/chi tiêu |
| 💸 Transaction | Quản lý giao dịch thu nhập và chi tiêu |
| 📊 Budget | Thiết lập và theo dõi ngân sách |
| 🎯 Financial Goal | Quản lý mục tiêu tài chính |
| 🔔 Notification | Quản lý thông báo |
| ⚡ Realtime | Gửi thông báo tức thời bằng SignalR |
| 📈 Dashboard | Thống kê và tổng hợp tài chính |
| ⏰ Background Job | Kiểm tra ngân sách định kỳ |
| ❤️ Health Check | Kiểm tra API và database |
| 📚 Swagger | Tự động sinh tài liệu API |

---

## 🛠️ Công nghệ

### Backend

| Công nghệ | Vai trò |
|---|---|
| **.NET 10** | Nền tảng phát triển |
| **ASP.NET Core Web API** | REST API |
| **Entity Framework Core** | ORM / truy cập database |
| **SQL Server** | Cơ sở dữ liệu |
| **JWT Bearer** | Xác thực |
| **BCrypt.Net** | Hash mật khẩu |
| **SignalR** | Realtime Notification |
| **Swagger / OpenAPI** | Tài liệu API |
| **Dependency Injection** | Quản lý dependency |
| **Hosted Service** | Tác vụ nền |
| **Health Checks** | Kiểm tra hệ thống |

### Frontend

Frontend sử dụng hoặc dự kiến sử dụng:

- ⚛️ React
- 📡 Axios
- 🧭 React Router
- JavaScript / TypeScript

---

## 🏗️ Kiến trúc

Project sử dụng mô hình:

```text
┌───────────────────────┐
│    React Frontend     │
└───────────┬───────────┘
            │ HTTP / JSON
            ▼
┌───────────────────────────────┐
│       ASP.NET Core API        │
│                               │
│   ┌───────────────────────┐   │
│   │   Middleware Pipeline │   │
│   └───────────┬───────────┘   │
│               ▼               │
│        ┌─────────────┐        │
│        │ Controllers │        │
│        └──────┬──────┘        │
│               ▼               │
│        ┌─────────────┐        │
│        │  Services   │        │
│        └──────┬──────┘        │
│               ▼               │
│        ┌─────────────┐        │
│        │ AppDbContext│        │
│        └──────┬──────┘        │
└───────────────┼───────────────┘
                ▼
        ┌───────────────┐
        │  SQL Server   │
        └───────────────┘
```

### Luồng xử lý

```text
Request
   ↓
Middleware
   ↓
Controller
   ↓
Service
   ↓
Entity Framework Core
   ↓
SQL Server
   ↓
Response
```

---

## 📂 Cấu trúc thư mục

```text
backend/
│
├── Controllers/
│   ├── AuthController.cs
│   ├── UserController.cs
│   ├── AccountController.cs
│   ├── CategoryController.cs
│   ├── TransactionController.cs
│   ├── BudgetController.cs
│   ├── FinancialGoalController.cs
│   ├── NotificationController.cs
│   └── DashboardController.cs
│
├── Data/
│   └── AppDbContext.cs
│
├── DTOs/
│   ├── Auth/
│   ├── Users/
│   ├── Accounts/
│   ├── Categories/
│   ├── Transactions/
│   ├── Budgets/
│   ├── FinancialGoals/
│   └── Notifications/
│
├── Filters/
│   └── ExecutionTimeFilter.cs
│
├── Hubs/
│   └── NotificationHub.cs
│
├── HostedServices/
│   └── BudgetNotificationHostedService.cs
│
├── Middleware/
│   ├── ExceptionMiddleware.cs
│   └── RequestLoggingMiddleware.cs
│
├── Models/
│   ├── User.cs
│   ├── Account.cs
│   ├── Category.cs
│   ├── Transaction.cs
│   ├── Budget.cs
│   ├── FinancialGoal.cs
│   └── Notification.cs
│
├── Options/
│   └── JwtOptions.cs
│
├── Services/
│   ├── Interfaces/
│   └── Implementations/
│
├── Migrations/
│
├── appsettings.json
├── Program.cs
└── backend.csproj
```

---

## 🗄️ Cơ sở dữ liệu

Hệ thống hiện có **7 bảng chính**:

```text
┌──────────────┐
│    Users     │
└──────┬───────┘
       │
       ├────────────── Accounts
       │
       ├────────────── Categories
       │
       ├────────────── Transactions
       │                         │
       │                         ├── Accounts
       │                         └── Categories
       │
       ├────────────── Budgets
       │                         │
       │                         └── Categories
       │
       ├────────────── FinancialGoals
       │
       └────────────── Notifications
```

### Danh sách bảng

| Bảng | Chức năng |
|---|---|
| `Users` | Thông tin người dùng |
| `Accounts` | Các tài khoản tài chính |
| `Categories` | Danh mục giao dịch |
| `Transactions` | Thu nhập và chi tiêu |
| `Budgets` | Ngân sách theo tháng |
| `FinancialGoals` | Mục tiêu tài chính |
| `Notifications` | Thông báo hệ thống |

---

## ⚙️ Cài đặt môi trường

### Yêu cầu

- Windows 10/11
- **.NET SDK 10**
- **SQL Server**
- SQL Server Management Studio hoặc DBeaver
- Git
- Visual Studio hoặc Visual Studio Code

Kiểm tra .NET:

```powershell
dotnet --version
```

Kiểm tra Entity Framework CLI:

```powershell
dotnet ef --version
```

Nếu chưa có `dotnet-ef`:

```powershell
dotnet tool install --global dotnet-ef
```

Cập nhật:

```powershell
dotnet tool update --global dotnet-ef
```

---

## 📥 Clone project

Clone repository:

```powershell
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Di chuyển vào backend:

```powershell
cd backend
```

Ví dụ:

```powershell
cd E:\Dev\PersonalFinance\backend
```

---

## 📦 Cài đặt packages

Khôi phục packages từ `.csproj`:

```powershell
dotnet restore
```

Các package chính:

```powershell
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Swashbuckle.AspNetCore
dotnet add package BCrypt.Net-Next
dotnet add package Microsoft.Extensions.Diagnostics.HealthChecks.EntityFrameworkCore
```

Sau khi cài:

```powershell
dotnet restore
```

---

## 🔧 Cấu hình

Mở file:

```text
appsettings.json
```

Cấu hình:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },

  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=PersonalFinanceDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },

  "Jwt": {
    "Key": "PersonalFinanceProjectSecretKey2026VeryLong",
    "Issuer": "PersonalFinanceProject",
    "Audience": "PersonalFinanceProject",
    "ExpirationHours": 2
  },

  "AllowedHosts": "*"
}
```

### SQL Server Express

Nếu sử dụng SQL Server Express:

```json
"DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=PersonalFinanceDb;Trusted_Connection=True;TrustServerCertificate=True;"
```

> ⚠️ Không commit JWT secret, database password hoặc các secret production lên GitHub.

---

## 🗃️ Migration & Database

### 1. Kiểm tra build

```powershell
dotnet build
```

### 2. Kiểm tra DbContext

```powershell
dotnet ef dbcontext list
```

### 3. Nếu project chưa có migration

```powershell
dotnet ef migrations add InitialCreate
```

### 4. Tạo / cập nhật database

```powershell
dotnet ef database update
```

Nếu project đã có migration thì chỉ cần:

```powershell
dotnet ef database update
```

---

## ▶️ Chạy project

Chạy Backend:

```powershell
dotnet run
```

Hoặc sử dụng Hot Reload:

```powershell
dotnet watch run
```

Terminal sẽ hiển thị địa chỉ, ví dụ:

```text
Now listening on: https://localhost:7000
Now listening on: http://localhost:5000
```

> Port thực tế phụ thuộc vào cấu hình `launchSettings.json`.

---

## 📚 Swagger / OpenAPI

Project sử dụng **Swashbuckle.AspNetCore** để tự động sinh tài liệu API.

Sau khi Backend chạy, truy cập:

```text
https://localhost:<PORT>/swagger
```

Ví dụ:

```text
https://localhost:7000/swagger
```

### Swagger cung cấp

- 📌 Danh sách Endpoint
- 🔹 HTTP Method
- 📥 Request Parameters
- 📦 Request Body
- 📤 Response
- ✅ Validation
- 🔐 Authentication
- 🧪 Giao diện test API trực tiếp

### API được tự động tổ chức

```text
Swagger
│
├── Auth
├── Users
├── Accounts
├── Categories
├── Transactions
├── Budgets
├── Financial Goals
├── Notifications
└── Dashboard
```

> 💡 **Tài liệu API được sinh tự động từ Controller và DTO/Model.** Khi API thay đổi, Swagger sẽ cập nhật tài liệu tương ứng khi ứng dụng được chạy lại.

---

## 🔗 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Chức năng |
|---|---|---|
| `POST` | `/api/auth/register` | Đăng ký |
| `POST` | `/api/auth/login` | Đăng nhập |

### 👤 Users

| Method | Endpoint | Chức năng |
|---|---|---|
| `GET` | `/api/users/me` | Lấy thông tin cá nhân |
| `PUT` | `/api/users/me` | Cập nhật thông tin |
| `PUT` | `/api/users/change-password` | Đổi mật khẩu |

### 💳 Accounts

| Method | Endpoint |
|---|---|
| `GET` | `/api/accounts` |
| `GET` | `/api/accounts/{id}` |
| `POST` | `/api/accounts` |
| `PUT` | `/api/accounts/{id}` |
| `DELETE` | `/api/accounts/{id}` |

### 🏷️ Categories

| Method | Endpoint |
|---|---|
| `GET` | `/api/categories` |
| `GET` | `/api/categories/{id}` |
| `GET` | `/api/categories/type/{type}` |
| `POST` | `/api/categories` |
| `PUT` | `/api/categories/{id}` |
| `DELETE` | `/api/categories/{id}` |

### 💸 Transactions

| Method | Endpoint |
|---|---|
| `GET` | `/api/transactions` |
| `GET` | `/api/transactions/{id}` |
| `GET` | `/api/transactions/type/{type}` |
| `GET` | `/api/transactions/date-range` |
| `POST` | `/api/transactions` |
| `PUT` | `/api/transactions/{id}` |
| `DELETE` | `/api/transactions/{id}` |

### 📊 Budgets

| Method | Endpoint |
|---|---|
| `GET` | `/api/budgets` |
| `GET` | `/api/budgets/month` |
| `GET` | `/api/budgets/{id}` |
| `POST` | `/api/budgets` |
| `PUT` | `/api/budgets/{id}` |
| `DELETE` | `/api/budgets/{id}` |

### 🎯 Financial Goals

| Method | Endpoint |
|---|---|
| `GET` | `/api/financial-goals` |
| `GET` | `/api/financial-goals/{id}` |
| `POST` | `/api/financial-goals` |
| `PUT` | `/api/financial-goals/{id}` |
| `PUT` | `/api/financial-goals/{id}/progress` |
| `DELETE` | `/api/financial-goals/{id}` |

### 🔔 Notifications

| Method | Endpoint |
|---|---|
| `GET` | `/api/notifications` |
| `GET` | `/api/notifications/unread` |
| `PUT` | `/api/notifications/{id}/read` |
| `PUT` | `/api/notifications/read-all` |
| `DELETE` | `/api/notifications/{id}` |

### 📈 Dashboard

| Method | Endpoint |
|---|---|
| `GET` | `/api/dashboard` |
| `GET` | `/api/dashboard/income` |
| `GET` | `/api/dashboard/expense` |
| `GET` | `/api/dashboard/expense-by-category` |
| `GET` | `/api/dashboard/monthly-statistics` |

### ❤️ Health Check

```http
GET /health
```

### ⚡ SignalR

```text
/hubs/notifications
```

---

## 🔐 Authentication

Hệ thống sử dụng **JWT Bearer Authentication**.

### Đăng nhập

```text
POST /api/auth/login
        ↓
    AuthService
        ↓
Kiểm tra BCrypt Password
        ↓
    JwtService
        ↓
    JWT Token
        ↓
      Client
```

Client gửi token:

```http
Authorization: Bearer <JWT_TOKEN>
```

Các API yêu cầu đăng nhập sẽ kiểm tra JWT trước khi xử lý.

---

## 🔔 SignalR

SignalR được sử dụng để gửi Notification theo thời gian thực.

Hub:

```text
/hubs/notifications
```

### Luồng hoạt động

```text
Transaction
     │
     ▼
Check Budget
     │
     ▼
Create Notification
     │
     ▼
SignalR Hub
     │
     ▼
React Frontend
     │
     ▼
Hiển thị Notification
```

Event:

```text
ReceiveNotification
```

Các trường hợp chính:

- ⚠️ Vượt ngân sách.
- 📊 Cảnh báo ngân sách.
- 🎯 Hoàn thành mục tiêu.

---

## ⏰ Hosted Service

Project sử dụng:

```text
BudgetNotificationHostedService
```

để kiểm tra ngân sách định kỳ.

```text
Mỗi 5 phút
     │
     ▼
Lấy Budget hiện tại
     │
     ▼
Tính tổng Expense
     │
     ▼
So sánh Budget
     │
     ├── Chưa vượt → Kết thúc
     │
     └── Đã vượt
             │
             ▼
       Create Notification
```

---

## 🔄 Middleware Pipeline

ASP.NET Core xử lý request theo Middleware Pipeline:

```text
HTTP Request
     │
     ▼
ExceptionMiddleware
     │
     ▼
RequestTimingMiddleware
     │
     ▼
HTTPS
     │
     ▼
CORS
     │
     ▼
Authentication
     │
     ▼
Authorization
     │
     ▼
Controller
     │
     ▼
Service
     │
     ▼
Database
     │
     ▼
HTTP Response
```

### ExceptionMiddleware

Xử lý các Exception chưa được xử lý và trả về response lỗi.

### RequestTimingMiddleware

Ghi log:

```text
HTTP Method
Request Path
Status Code
Execution Time
```

---

## 💉 Dependency Injection

Project sử dụng Dependency Injection của ASP.NET Core.

Ví dụ đăng ký Service:

```csharp
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<IBudgetService, BudgetService>();
builder.Services.AddScoped<IFinancialGoalService, FinancialGoalService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
```

Controller sử dụng Constructor Injection:

```csharp
public class AccountController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AccountController(IAccountService accountService)
    {
        _accountService = accountService;
    }
}
```

---

## ✅ Validation & Filter

### Model Binding & Validation

API sử dụng DTO và Data Annotations.

Ví dụ:

```csharp
[Range(0.01, double.MaxValue,
    ErrorMessage = "Amount must be greater than 0.")]
public decimal Amount { get; set; }
```

Request không hợp lệ sẽ nhận:

```text
HTTP 400 Bad Request
```

### ExecutionTimeFilter

Filter dùng để đo thời gian thực thi Controller Action:

```text
TransactionController executed in 25 ms
```

---

## ❤️ Health Check

Endpoint:

```http
GET /health
```

Ví dụ:

```text
https://localhost:7000/health
```

Health Check dùng để kiểm tra:

- Backend có hoạt động hay không.
- Kết nối tới SQL Server có hoạt động hay không.

Response khi hệ thống bình thường:

```text
Healthy
```

---

## 🌿 Git Workflow

> ⚠️ **Không commit trực tiếp vào `main`.**

Mỗi thành viên làm việc trên branch riêng:

```text
main
 │
 ├── dev/auth
 ├── dev/account
 ├── dev/category
 ├── dev/transaction
 ├── dev/budget
 └── dev/dashboard
```

### Tạo branch

```powershell
git checkout -b dev/transaction
```

### Cập nhật code mới nhất

```powershell
git pull origin main
```

### Commit

```powershell
git add .
git commit -m "feat: add transaction API"
```

### Push

```powershell
git push origin dev/transaction
```

### Quy trình Review

```text
Feature Branch
      │
      ▼
Pull Request
      │
      ▼
Cross Review
      │
      ▼
Resolve Conflict
      │
      ▼
Build & Test
      │
      ▼
Merge → main
```

---

## 🧯 Xử lý lỗi thường gặp

### ❌ Không tìm thấy DbContext

Chạy:

```powershell
dotnet ef dbcontext list
```

Đảm bảo chạy command tại thư mục chứa `.csproj`.

Kiểm tra:

```text
Data/AppDbContext.cs
```

---

### ❌ Không kết nối được SQL Server

Kiểm tra:

1. SQL Server đang chạy.
2. Server name chính xác.
3. Connection String chính xác.
4. Authentication phù hợp.

Thử:

```powershell
dotnet ef database update
```

---

### ❌ Build lỗi sau khi pull

Chạy lần lượt:

```powershell
dotnet restore
dotnet clean
dotnet build
```

Nếu vẫn lỗi:

```powershell
dotnet nuget locals all --clear
dotnet restore
dotnet build
```

---

### ❌ Migration lỗi

Kiểm tra:

```powershell
dotnet ef migrations list
```

Sau đó:

```powershell
dotnet build
dotnet ef database update
```

---

## 🔒 Bảo mật

Project áp dụng:

- 🔐 BCrypt để hash password.
- 🎫 JWT Authentication.
- 🛡️ Authorization cho API cần đăng nhập.
- 👤 UserId lấy từ JWT thay vì tin tưởng dữ liệu từ Client.
- ✅ Validation dữ liệu đầu vào.
- 🗃️ Entity Framework Core cho truy cập database.

### Không commit

```text
JWT Secret
Database Password
API Key
SMTP Password
Production Secret
```

Nên sử dụng:

- Environment Variables
- User Secrets
- Secret Manager

khi triển khai thực tế.

---

## 🧪 Quy trình chạy lại từ đầu

Nếu một thành viên mới clone project, thực hiện:

```powershell
# 1. Clone
git clone <YOUR_GITHUB_REPOSITORY_URL>

# 2. Vào backend
cd backend

# 3. Restore packages
dotnet restore

# 4. Build
dotnet build

# 5. Update database
dotnet ef database update

# 6. Chạy API
dotnet run
```

Sau đó mở Swagger:

```text
https://localhost:<PORT>/swagger
```

Kiểm tra Health Check:

```text
https://localhost:<PORT>/health
```

### ✅ Project chạy thành công khi

```text
✓ dotnet build       → Build succeeded
✓ Database           → Connected
✓ /swagger           → Hiển thị API
✓ /health            → Healthy
```

---
🐳 Quy trình chạy bằng Docker & Docker Compose

Nếu máy đã cài Docker Desktop, thành viên mới không cần cài SQL Server hoặc .NET SDK để chạy backend. Docker Compose sẽ tự động tạo SQL Server và container backend.

🧪 Chạy project từ đầu bằng Docker Compose

Nếu một thành viên mới clone project, thực hiện:

# 1. Clone project
git clone <YOUR_GITHUB_REPOSITORY_URL>

# 2. Vào thư mục project
cd Personal-Finance-App

# 3. Build và khởi động toàn bộ hệ thống
docker compose up --build

Docker Compose sẽ tự động:

✓ Build backend Docker image
✓ Tạo container SQL Server
✓ Tạo container Backend API
✓ Tạo Docker volume lưu dữ liệu SQL Server
✓ Chờ SQL Server sẵn sàng
✓ Kết nối Backend với SQL Server
✓ Chạy Database Migration
✓ Seed dữ liệu mẫu
🌐 Truy cập Backend API

Sau khi Docker Compose chạy thành công, mở Swagger:

http://localhost:5207/swagger

Health Check:

http://localhost:5207/health
🔐 Tài khoản test

Có thể sử dụng các tài khoản được tạo sẵn bởi DbSeeder:

Admin:
Email: admin@gmail.com
Password: Admin@123

User:
Email: user@gmail.com
Password: User@123

Nếu project sử dụng username thay vì email để đăng nhập, sử dụng đúng trường đăng nhập được khai báo trong API.

🗄️ Kiểm tra Database

SQL Server chạy bên trong Docker container và dữ liệu được lưu trong Docker Volume.

Thông tin kết nối từ máy host:

Server: localhost,1434
Database: PersonalFinanceDb
User: sa
Password: Abc12345@Aa

Có thể sử dụng SQL Server Management Studio (SSMS) để xem:

Databases
└── PersonalFinanceDb
    └── Tables
        ├── Users
        ├── Accounts
        ├── Categories
        ├── Transactions
        └── Budgets
🔄 Dừng project

Để dừng các container:

docker compose down

Dữ liệu database vẫn được giữ lại vì SQL Server sử dụng Docker Volume.

▶️ Chạy lại project

Sau khi đã build lần đầu:

docker compose up

Nếu cần build lại backend sau khi thay đổi code:

docker compose up --build
🗑️ Reset toàn bộ Database

Nếu muốn xóa database hiện tại và tạo lại từ đầu:

docker compose down -v
docker compose up --build

⚠️ docker compose down -v sẽ xóa Docker Volume, đồng nghĩa với việc toàn bộ dữ liệu database hiện tại sẽ bị xóa. Sau đó DbSeeder sẽ tạo lại dữ liệu mẫu.

✅ Project chạy thành công khi
✓ docker compose up --build  → Containers started
✓ SQL Server                 → Healthy
✓ Backend                    → Started
✓ Database                   → Connected
✓ Migration                  → Completed
✓ Seed data                  → Created
✓ /swagger                  → Hiển thị API
✓ /health                   → Healthy
📌 Yêu cầu môi trường

Thành viên mới chỉ cần:

✓ Git
✓ Docker Desktop

Không bắt buộc cài trực tiếp:

✗ SQL Server
✗ SQL Server Management Studio (nếu chỉ chạy/test API)
✗ .NET SDK
✗ NuGet packages
✗ Entity Framework CLI

Docker Compose sẽ đảm nhiệm việc tạo và kết nối các service cần thiết cho project.
---

## 🧪 Hands-on Lab ASP.NET Core

Phần này tóm lược bài thực hành ASP.NET Core .NET 10: xây dựng một Web API nhỏ để quan sát Middleware Pipeline, Dependency Injection và EF Core. Lab dùng project mẫu riêng tên `LabApi`, không thay đổi hay thay thế Personal Finance App trong repository này.

### Mục tiêu và chuẩn bị

Sau phần thực hành chính (khoảng 30–45 phút), bạn sẽ tạo được các endpoint `/ping`, `/di` và `/api/accounts`, đồng thời:

- Quan sát thứ tự Middleware khi xử lý request và response.
- Phân biệt Transient, Scoped và Singleton.
- Kết nối EF Core với SQL Server, tạo Migration và truy vấn dữ liệu.

Chuẩn bị .NET 10 SDK, SQL Server 2022, terminal PowerShell và `curl` hoặc Postman. Cài EF Core CLI một lần nếu máy chưa có:

```powershell
dotnet tool install --global dotnet-ef
```

Tạo và chạy project mẫu:

```powershell
dotnet new webapi --use-controllers -n LabApi -f net10.0
cd LabApi
dotnet run
```

Dùng URL/cổng hiển thị trong terminal khi gọi API. Không đưa mật khẩu SQL Server hoặc JWT key thật vào mã nguồn hay Git; dùng biến môi trường hoặc User Secrets.

### Lab 1 – Middleware Pipeline

Trong `Program.cs`, sau `var app = builder.Build();` và trước `app.Run();`, thêm:

```csharp
app.Use(async (context, next) =>
{
    Console.WriteLine("Middleware 1: vao");
    await next();
    Console.WriteLine("Middleware 1: ra");
});

app.Use(async (context, next) =>
{
    Console.WriteLine("Middleware 2: vao");
    await next();
    Console.WriteLine("Middleware 2: ra");
});

app.MapGet("/ping", () =>
{
    Console.WriteLine("Endpoint");
    return Results.Ok(new { message = "pong" });
});
```

Gọi `GET /ping` (thay `PORT` bằng cổng thực tế):

```powershell
curl http://localhost:PORT/ping
```

Kết quả mong đợi: HTTP 200 với JSON `{"message":"pong"}`; log console đi vào theo thứ tự Middleware 1 → Middleware 2 → Endpoint và quay ra theo thứ tự Middleware 2 → Middleware 1. Các lệnh sau `await next()` chạy trên chiều response.

### Lab 2 – Dependency Injection và Service Lifetime

Tạo `Services/IdServices.cs`:

```csharp
namespace LabApi.Services;

public interface IIdService
{
    Guid Id { get; }
}

public sealed class TransientIdService : IIdService
{
    public Guid Id { get; } = Guid.NewGuid();
}

public sealed class ScopedIdService : IIdService
{
    public Guid Id { get; } = Guid.NewGuid();
}

public sealed class SingletonIdService : IIdService
{
    public Guid Id { get; } = Guid.NewGuid();
}
```

Trong `Program.cs`, thêm `using LabApi.Services;`, đăng ký trước `builder.Build()` và khai báo endpoint:

```csharp
builder.Services.AddTransient<TransientIdService>();
builder.Services.AddScoped<ScopedIdService>();
builder.Services.AddSingleton<SingletonIdService>();

// Sau builder.Build()
app.MapGet("/di", (
    TransientIdService t1, TransientIdService t2,
    ScopedIdService s1, ScopedIdService s2,
    SingletonIdService g1, SingletonIdService g2) =>
    Results.Ok(new
    {
        transient1 = t1.Id,
        transient2 = t2.Id,
        scoped1 = s1.Id,
        scoped2 = s2.Id,
        singleton1 = g1.Id,
        singleton2 = g2.Id
    }));
```

Gọi `GET /di` hai lần và so sánh GUID: Transient khác nhau mỗi lần resolve; Scoped giống nhau trong cùng request nhưng đổi giữa các request; Singleton giữ nguyên trong suốt vòng đời ứng dụng. Không inject dịch vụ Scoped trực tiếp vào Singleton.

### Lab 3 – EF Core và SQL Server

Cài package tương thích với .NET 10:

```powershell
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 10.0.2
dotnet add package Microsoft.EntityFrameworkCore.Design --version 10.0.2
```

Tạo `Models/Account.cs`:

```csharp
namespace LabApi.Models;

public class Account
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Balance { get; set; }
}
```

Tạo `Data/LabDbContext.cs`:

```csharp
using LabApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LabApi.Data;

public class LabDbContext(DbContextOptions<LabDbContext> options)
    : DbContext(options)
{
    public DbSet<Account> Accounts => Set<Account>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>()
            .Property(account => account.Balance)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Account>()
            .Property(account => account.Name)
            .HasMaxLength(100)
            .IsRequired();
    }
}
```

Cấu hình `ConnectionStrings:Default` trong `appsettings.Development.json` (chỉ dùng thông tin local, không commit bí mật) hoặc đặt biến môi trường:

```powershell
$env:ConnectionStrings__Default = "Server=localhost,1433;Database=LabDb;User Id=sa;Password=YOUR_LOCAL_PASSWORD;TrustServerCertificate=True"
```

Thêm hai `using` ở đầu `Program.cs`; đăng ký DbContext trước `builder.Build()`:

```csharp
using LabApi.Data;
using Microsoft.EntityFrameworkCore;

builder.Services.AddDbContext<LabDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("Default")));
```

Sau đó tạo schema và endpoint đọc dữ liệu:

```powershell
dotnet ef migrations add InitialCreate
dotnet ef database update
```

```csharp
app.MapGet("/api/accounts", async (LabDbContext db) =>
{
    var accounts = await db.Accounts
        .AsNoTracking()
        .ToListAsync();

    return Results.Ok(accounts);
});
```

Thêm dữ liệu thử bằng SSMS rồi gọi `GET /api/accounts`:

```sql
INSERT INTO dbo.Accounts (Name, Balance)
VALUES (N'Tiền mặt', 1500000.00),
       (N'Tài khoản ngân hàng', 5000000.00);
```

Xác nhận Migration tạo bảng `Accounts` và `__EFMigrationsHistory`; `Balance` có precision `(18,2)` và endpoint trả về các bản ghi. Nếu API chạy trong Docker Compose, hostname của SQL Server thường là tên service (`db`), không phải `localhost`.

### Lab mở rộng

Các lab sau là nội dung tùy chọn; thực hiện trên project mẫu hoặc môi trường thử nghiệm riêng:

| Lab | Nội dung | Kết quả cần kiểm tra |
| --- | --- | --- |
| Controller và Minimal API | Tạo cùng endpoint theo hai cách, so sánh cách tổ chức | Cả hai endpoint trả JSON |
| JWT Authentication | Phát hành token mẫu và bảo vệ `/me` | Không token/token sai trả 401; token hợp lệ trả 200 |
| SignalR | Tạo Hub và gửi thông báo tới các client đang kết nối | Hai client cùng nhận thông báo |
| React gọi Web API | Tạo ứng dụng React bằng Vite và gọi API qua `fetch` | Hiển thị dữ liệu hoặc lỗi từ API |
| Docker Compose | Chạy API cùng SQL Server, cấu hình health check | Database healthy và API phản hồi |
| Kiểm thử API | Dùng `WebApplicationFactory` kiểm thử endpoint được bảo vệ | Kiểm thử xác nhận request không token trả 401 |
| GitHub Actions | Tự động restore, build và test khi push/PR | Workflow hoàn thành thành công |

JWT demo chỉ dùng để học, không phải quy trình đăng nhập production. Ứng dụng thật cần cấu hình issuer/audience, cấp token an toàn, phân quyền và bảo vệ secret. Khi kết nối frontend, chỉ cho phép CORS với origin cần thiết; cân nhắc rủi ro XSS trước khi lưu token ở client.

### Bài tập và checklist

1. Thêm Middleware ghi HTTP method, path và thời gian xử lý request; giải thích vì sao thời gian được dừng sau `await next()`.
2. Dùng `/di` giải thích sự khác nhau của ba service lifetime trong cùng request và giữa hai request.
3. Tạo endpoint `/api/accounts/above-limit` trả về Account có `Balance > 1_000_000m`, dùng `AsNoTracking()`.

Hoàn thành phần chính khi chạy được `/ping`, `/di` và `/api/accounts`, truy vấn được dữ liệu SQL Server, đồng thời giải thích được thứ tự Middleware, service lifetime và vai trò của Migration. Nếu gặp lỗi kết nối, Migration hoặc CORS, xem thêm [Xử lý lỗi thường gặp](#-xử-lý-lỗi-thường-gặp).

---
## 👨‍💻 Tác giả

<div align="center">

### Personal Finance Management System

```text
Huỳnh Lê Anh Tuấn
Nguyễn Võ Anh Kỳ
Nguyễn Thanh Văn
```
**Đồ án môn Các Công Nghệ Lập Trình Hiện Đại**

<br>

`ASP.NET Core` · `.NET 10` · `EF Core` · `SQL Server` · `JWT` · `SignalR` · `Swagger`

</div>

---

<div align="center">

⭐ Nếu project hữu ích, hãy để lại một Star cho repository!

</div>
