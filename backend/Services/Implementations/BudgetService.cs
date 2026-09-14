using backend.Data;
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

    public async Task<IEnumerable<Budget>> GetAllAsync(
        int userId)
    {
        return await _context.Budgets
            .Include(x => x.Category)
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.Year)
            .ThenByDescending(x => x.Month)
            .ToListAsync();
    }

    public async Task<IEnumerable<Budget>> GetByMonthAsync(
        int userId,
        int month,
        int year)
    {
        return await _context.Budgets
            .Include(x => x.Category)
            .Where(x =>
                x.UserId == userId &&
                x.Month == month &&
                x.Year == year)
            .ToListAsync();
    }

    public async Task<Budget?> GetByIdAsync(
        int userId,
        int budgetId)
    {
        return await _context.Budgets
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x =>
                x.Id == budgetId &&
                x.UserId == userId);
    }

    public async Task<Budget?> CreateAsync(
        int userId,
        int categoryId,
        decimal amount,
        int month,
        int year)
    {
        if (amount <= 0 ||
            month < 1 ||
            month > 12)
        {
            return null;
        }

        var category = await _context.Categories
            .FirstOrDefaultAsync(x =>
                x.Id == categoryId &&
                x.UserId == userId);

        if (category == null)
            return null;

        var exists = await _context.Budgets
            .AnyAsync(x =>
                x.UserId == userId &&
                x.CategoryId == categoryId &&
                x.Month == month &&
                x.Year == year);

        if (exists)
            return null;

        var budget = new Budget
        {
            UserId = userId,
            CategoryId = categoryId,
            Amount = amount,
            Month = month,
            Year = year
        };

        _context.Budgets.Add(budget);

        await _context.SaveChangesAsync();

        return budget;
    }

    public async Task<Budget?> UpdateAsync(
        int userId,
        int budgetId,
        decimal amount)
    {
        var budget = await GetByIdAsync(
            userId,
            budgetId);

        if (budget == null || amount <= 0)
            return null;

        budget.Amount = amount;

        await _context.SaveChangesAsync();

        return budget;
    }

    public async Task<bool> DeleteAsync(
        int userId,
        int budgetId)
    {
        var budget = await GetByIdAsync(
            userId,
            budgetId);

        if (budget == null)
            return false;

        _context.Budgets.Remove(budget);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<decimal> GetSpentAmountAsync(
        int userId,
        int categoryId,
        int month,
        int year)
    {
        return await _context.Transactions
            .Where(x =>
                x.UserId == userId &&
                x.CategoryId == categoryId &&
                x.Type == "Expense" &&
                x.TransactionDate.Month == month &&
                x.TransactionDate.Year == year)
            .SumAsync(x => x.Amount);
    }
}