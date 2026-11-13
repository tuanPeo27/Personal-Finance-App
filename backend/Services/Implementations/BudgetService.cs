
using backend.Data;
using backend.DTOs.Budget;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementations;

public class BudgetService : IBudgetService
{
    private readonly AppDbContext _context;

    public BudgetService(AppDbContext context)
    {
        _context = context;
    }

    // GET ALL
    public async Task<IEnumerable<BudgetResponse>> GetAllAsync(
        int userId)
    {
        var budgets = await _context.Budgets
            .Include(x => x.Category)
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.Year)
            .ThenByDescending(x => x.Month)
            .ToListAsync();

        var result = new List<BudgetResponse>();

        foreach (var budget in budgets)
        {
            result.Add(await MapToResponseAsync(budget));
        }

        return result;
    }

    // GET BY ID
    public async Task<BudgetResponse?> GetByIdAsync(
        int userId,
        int budgetId)
    {
        var budget = await _context.Budgets
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x =>
                x.Id == budgetId &&
                x.UserId == userId);

        if (budget == null)
            return null;

        return await MapToResponseAsync(budget);
    }

    // GET BY MONTH
    public async Task<IEnumerable<BudgetResponse>> GetByMonthAsync(
        int userId,
        int month,
        int year)
    {
        var budgets = await _context.Budgets
            .Include(x => x.Category)
            .Where(x =>
                x.UserId == userId &&
                x.Month == month &&
                x.Year == year)
            .OrderBy(x => x.Category.Name)
            .ToListAsync();

        var result = new List<BudgetResponse>();

        foreach (var budget in budgets)
        {
            result.Add(await MapToResponseAsync(budget));
        }

        return result;
    }

    // CREATE
    public async Task<BudgetResponse?> CreateAsync(
        int userId,
        CreateBudgetRequest request)
    {
        // Kiểm tra Category có thuộc User hay không
        var category = await _context.Categories
            .FirstOrDefaultAsync(x =>
                x.Id == request.CategoryId &&
                x.UserId == userId);

        if (category == null)
            return null;

        // Không cho tạo 2 budget cùng category + tháng + năm
        var existingBudget = await _context.Budgets
            .AnyAsync(x =>
                x.UserId == userId &&
                x.CategoryId == request.CategoryId &&
                x.Month == request.Month &&
                x.Year == request.Year);

        if (existingBudget)
        {
            throw new InvalidOperationException(
                "A budget already exists for this category and month.");
        }

        var budget = new Budget
        {
            UserId = userId,
            CategoryId = request.CategoryId,
            Amount = request.Amount,
            Month = request.Month,
            Year = request.Year,
            CreatedAt = DateTime.UtcNow
        };

        _context.Budgets.Add(budget);

        await _context.SaveChangesAsync();

        await _context.Entry(budget)
            .Reference(x => x.Category)
            .LoadAsync();

        return await MapToResponseAsync(budget);
    }

    // UPDATE
    public async Task<BudgetResponse?> UpdateAsync(
        int userId,
        int budgetId,
        UpdateBudgetRequest request)
    {
        var budget = await _context.Budgets
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x =>
                x.Id == budgetId &&
                x.UserId == userId);

        if (budget == null)
            return null;

        var duplicate = await _context.Budgets.AnyAsync(x =>
            x.UserId == userId &&
            x.Id != budgetId &&
            x.CategoryId == budget.CategoryId &&
            x.Month == request.Month &&
            x.Year == request.Year);

        if (duplicate)
        {
            throw new InvalidOperationException(
                "A budget already exists for this category and month.");
        }

        budget.Amount = request.Amount;
        budget.Month = request.Month;
        budget.Year = request.Year;

        await _context.SaveChangesAsync();

        return await MapToResponseAsync(budget);
    }

    // DELETE
    public async Task<bool> DeleteAsync(
        int userId,
        int budgetId)
    {
        var budget = await _context.Budgets
            .FirstOrDefaultAsync(x =>
                x.Id == budgetId &&
                x.UserId == userId);

        if (budget == null)
            return false;

        _context.Budgets.Remove(budget);

        await _context.SaveChangesAsync();

        return true;
    }

    // MAP ENTITY -> RESPONSE
    private async Task<BudgetResponse> MapToResponseAsync(
        Budget budget)
    {
        // Xác định khoảng thời gian của ngân sách
        var startDate = new DateTime(
            budget.Year,
            budget.Month,
            1);

        var endDate = startDate.AddMonths(1);

        // Chỉ tính giao dịch Expense thuộc:
        // - Đúng User
        // - Đúng Category
        // - Đúng tháng và năm của Budget
        var spentAmount = await _context.Transactions
            .Where(x =>
                x.UserId == budget.UserId &&
                x.CategoryId == budget.CategoryId &&
                x.Type == "Expense" &&
                x.TransactionDate >= startDate &&
                x.TransactionDate < endDate)
            .SumAsync(x => (decimal?)x.Amount) ?? 0m;

        // Số tiền ngân sách còn lại
        var remainingAmount =
            budget.Amount - spentAmount;

        // Phần trăm ngân sách đã sử dụng
        var percentageUsed =
            budget.Amount > 0
                ? (double)(spentAmount / budget.Amount * 100m)
                : 0d;

        return new BudgetResponse
        {
            Id = budget.Id,

            CategoryId = budget.CategoryId,

            CategoryName =
                budget.Category?.Name ?? string.Empty,

            Amount = budget.Amount,

            SpentAmount = spentAmount,

            RemainingAmount = remainingAmount,

            PercentageUsed = percentageUsed,

            IsExceeded =
                spentAmount > budget.Amount,

            Month = budget.Month,

            Year = budget.Year,

            CreatedAt = budget.CreatedAt
        };
    }
}
