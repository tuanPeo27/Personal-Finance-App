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
