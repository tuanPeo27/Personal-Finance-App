# Báo cáo kiểm thử tự động

**Ngày chạy:** 2026-10-23  
**Phạm vi:** Backend ASP.NET Core + frontend React hiện có trong repository.

## Tổng kết

| Nhóm | Trạng thái | Kết quả cuối | Ghi chú |
|---|---|---:|---|
| Backend Unit Test (xUnit) | PASS | 6 passed, 0 failed | EF Core InMemory; kiểm tra transaction/balance, dashboard, budget, financial goal |
| Backend Integration Test (xUnit + WebApplicationFactory) | PASS | 6 passed, 0 failed | TestServer thật, SQLite in-memory, JWT, validation và phân tách dữ liệu theo user |
| Frontend Test (Vitest + React Testing Library) | PASS | 7 passed, 0 failed | jsdom; Login, Transactions, Budgets, Dashboard |
| Frontend TypeScript | PASS | exit code 0 | `tsc --noEmit` |
| Frontend production build | PASS | exit code 0 | Vite build thành công; có cảnh báo chunk lớn và cảnh báo tương thích cấu hình Vite có sẵn |

**Tổng:** 19 test case PASS; 0 FAIL; 0 BLOCKED trong các nhóm test được yêu cầu.

## Đối chiếu chức năng thực tế

- Test tích hợp dùng endpoint `api/goals`, đúng theo `[Route("api/[controller]")]` của `GoalsController`; không giả định route `api/FinancialGoals`.
- Backend hiện yêu cầu đăng nhập với `[Authorize]` và các service truy vấn theo `UserId`. `User` chưa có trường role/claim phân quyền vai trò và controller không khai báo `[Authorize(Roles = ...)]`; vì vậy test xác minh JWT và quyền truy cập dữ liệu giữa hai user, không dựng test role chưa có trong code.
- Notifications không có API tạo trực tiếp. Integration test tạo notification qua luồng hoàn tất financial goal đã có, sau đó kiểm tra unread và mark-as-read.
- Không sửa công thức nghiệp vụ hiện tại để làm test pass. `Program.cs` chỉ bỏ đọc `.env` và bỏ seed/migrate khi môi trường là `Testing`; test host tự dùng SQLite in-memory.

## Danh sách test case và kết quả

### Backend Unit Test

| ID | Test case | Đối chiếu hành vi | Trạng thái |
|---|---|---|---|
| BU-01 | Tạo, sửa và xóa giao dịch giữ số dư tài khoản nhất quán | Income/Expense thay đổi Balance; update đảo giao dịch cũ rồi áp dụng giao dịch mới; delete đảo tác động | PASS |
| BU-02 | Từ chối giao dịch khi account/category không thuộc user | `TransactionService.CreateAsync` kiểm tra chủ sở hữu trước khi lưu | PASS |
| BU-03 | Tổng số dư và thu/chi lấy đúng user và tháng | Các phép tổng hợp của `DashboardService` | PASS |
| BU-04 | Tính số đã chi, còn lại, phần trăm sử dụng và trạng thái vượt ngân sách | `BudgetService.GetByMonthAsync` | PASS |
| BU-05 | Tiến độ mục tiêu hoàn tất và chỉ phát notification khi đạt đích | `FinancialGoalService.UpdateProgressAsync` và notification type hiện có | PASS |
| BU-06 | Từ chối tiến độ cao hơn số tiền mục tiêu, không thay đổi dữ liệu | Quy tắc kiểm tra trong `FinancialGoalService` | PASS |

### Backend Integration Test

| ID | Test case | Endpoint/hành vi đã kiểm tra | Trạng thái |
|---|---|---|---|
| BI-01 | Thiếu hoặc gửi JWT không hợp lệ bị từ chối | Accounts, Categories, Transactions, Budgets, Goals, Notifications, Dashboard | PASS |
| BI-02 | Đăng ký/đăng nhập, tạo và đọc Accounts/Categories; user khác không đọc được | `api/auth/*`, `api/accounts`, `api/categories`; 404 khi truy cập tài nguyên của user khác | PASS |
| BI-03 | Transaction payload không hợp lệ bị từ chối; tạo/sửa/xóa cập nhật số dư | `api/transactions`; amount = 0 trả 400 | PASS |
| BI-04 | Budget tính spending theo tháng; duplicate trả 409; tháng ngoài range trả 400 | `api/budgets`, `api/budgets/month` | PASS |
| BI-05 | Financial goal nhận tiến độ hợp lệ, từ chối quá target; notification chuyển unread → read | `api/goals`, `api/goals/{id}/progress`, `api/notifications/unread`, `api/notifications/{id}/read` | PASS |
| BI-06 | Dashboard tổng hợp balance, income, expense, net và expense theo category | `api/dashboard`, `api/dashboard/expense-by-category` | PASS |

### Frontend Test

| ID | Test case | Component/hành vi đã kiểm tra | Trạng thái |
|---|---|---|---|
| FE-01 | Đăng nhập thành công lưu token/user và điều hướng Dashboard | `Login` | PASS |
| FE-02 | Lỗi đăng nhập được thông báo, không điều hướng | `Login` | PASS |
| FE-03 | Tạo transaction gửi đúng dữ liệu và hiển thị danh sách mới | `Transactions` | PASS |
| FE-04 | Không lưu transaction khi thiếu amount/description | `Transactions` | PASS |
| FE-05 | Tạo budget và hiển thị dữ liệu sau khi tải lại | `Budgets` | PASS |
| FE-06 | Chặn budget trùng category/tháng ngay trên form | `Budgets` | PASS |
| FE-07 | Dashboard hiển thị tổng quan, giao dịch gần đây và điều hướng | `Dashboard` | PASS |

## Môi trường và giới hạn

- .NET SDK: `10.0.102`; Node.js: `v22.20.0`.
- Docker daemon: **UNAVAILABLE** (`docker info` không kết nối được daemon). Integration không phụ thuộc Docker; dùng SQLite in-memory thay SQL Server.
- ASP.NET Core TestServer khởi động thành công trong integration suite. **Chưa kiểm tra standalone startup với SQL Server thật**; kết quả không đại diện cho độ tương thích của SQLite với mọi khác biệt SQL Server.
- Frontend tests là component tests với jsdom theo yêu cầu Vitest + React Testing Library; không chạy browser E2E và không tự sinh ảnh chụp.
- Restore .NET báo cảnh báo dependency hiện có: `System.Security.Cryptography.Pkcs 9.0.11` (NU1902/NU1903); không nâng dependency vì ngoài phạm vi test.
- `npm install` báo 3 high-severity dependency audit findings; chưa audit/remediate trong phạm vi công việc viết test.

## Lệnh chạy

Chạy từ thư mục gốc repository trên PowerShell:

```powershell
dotnet test FinanceApp.Tests\FinanceApp.Tests.csproj
npm --prefix frontend test
npm exec --prefix frontend -- tsc -p frontend\tsconfig.json --noEmit
npm --prefix frontend run build
```

Chạy riêng backend unit hoặc integration:

```powershell
dotnet test FinanceApp.Tests\FinanceApp.Tests.csproj --filter "FullyQualifiedName~FinanceApp.Tests.Unit"
dotnet test FinanceApp.Tests\FinanceApp.Tests.csproj --filter "FullyQualifiedName~FinanceApiIntegrationTests"
```

## Ảnh minh chứng

Vitest/React Testing Library chạy trong jsdom nên bộ test hiện tại không tạo screenshot. Nếu cần ảnh minh chứng thủ công từ trình duyệt, lưu tại:

`test-results/screenshots/`

Thư mục này được tạo trong repository để dùng làm vị trí thống nhất cho ảnh bổ sung; hiện chưa có ảnh được tạo.
