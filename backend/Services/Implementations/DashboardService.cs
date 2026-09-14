using backend.Data;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementations;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;

    public DashboardService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<decimal> GetTotalBalanceAsync(
        int userId)
    {
        return await _context.Accounts
            .Where(x => x.UserId == userId)
            .SumAsync(x => x.Balance);
    }

    public async Task<decimal> GetTotalIncomeAsync(
        int userId,
        int month,
        int year)
    {
        return await _context.Transactions
            .Where(x =>
                x.UserId == userId &&
                x.Type == "Income" &&
                x.TransactionDate.Month == month &&
                x.TransactionDate.Year == year)
            .SumAsync(x => x.Amount);
    }

    public async Task<decimal> GetTotalExpenseAsync(
        int userId,
        int month,
        int year)
    {
        return await _context.Transactions
            .Where(x =>
                x.UserId == userId &&
                x.Type == "Expense" &&
                x.TransactionDate.Month == month &&
                x.TransactionDate.Year == year)
            .SumAsync(x => x.Amount);
    }

    public async Task<object> GetExpenseByCategoryAsync(
        int userId,
        int month,
        int year)
    {
        return await _context.Transactions
            .Where(x =>
                x.UserId == userId &&
                x.Type == "Expense" &&
                x.TransactionDate.Month == month &&
                x.TransactionDate.Year == year)
            .GroupBy(x => new
            {
                x.CategoryId,
                CategoryName = x.Category!.Name
            })
            .Select(g => new
            {
                CategoryId = g.Key.CategoryId,
                CategoryName = g.Key.CategoryName,
                Amount = g.Sum(x => x.Amount)
            })
            .OrderByDescending(x => x.Amount)
            .ToListAsync();
    }

    public async Task<object> GetMonthlyStatisticsAsync(
        int userId,
        int year)
    {
        return await _context.Transactions
            .Where(x =>
                x.UserId == userId &&
                x.TransactionDate.Year == year)
            .GroupBy(x => new
            {
                Month = x.TransactionDate.Month,
                x.Type
            })
            .Select(g => new
            {
                Month = g.Key.Month,
                Type = g.Key.Type,
                Amount = g.Sum(x => x.Amount)
            })
            .OrderBy(x => x.Month)
            .ToListAsync();
    }
}