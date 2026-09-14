using backend.Data;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementations;

public class TransactionService : ITransactionService
{
    private readonly AppDbContext _context;
    private readonly INotificationService _notificationService;

    public TransactionService(
        AppDbContext context,
        INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    public async Task<IEnumerable<Transaction>> GetAllAsync(
        int userId)
    {
        return await _context.Transactions
            .Include(x => x.Account)
            .Include(x => x.Category)
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.TransactionDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Transaction>>
        GetByDateRangeAsync(
            int userId,
            DateTime from,
            DateTime to)
    {
        return await _context.Transactions
            .Include(x => x.Account)
            .Include(x => x.Category)
            .Where(x =>
                x.UserId == userId &&
                x.TransactionDate >= from &&
                x.TransactionDate <= to)
            .OrderByDescending(x => x.TransactionDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Transaction>>
        GetByTypeAsync(
            int userId,
            string type)
    {
        return await _context.Transactions
            .Include(x => x.Account)
            .Include(x => x.Category)
            .Where(x =>
                x.UserId == userId &&
                x.Type == type)
            .OrderByDescending(x => x.TransactionDate)
            .ToListAsync();
    }

    public async Task<Transaction?> GetByIdAsync(
        int userId,
        int transactionId)
    {
        return await _context.Transactions
            .Include(x => x.Account)
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x =>
                x.Id == transactionId &&
                x.UserId == userId);
    }

    public async Task<Transaction?> CreateAsync(
        int userId,
        int accountId,
        int categoryId,
        decimal amount,
        string type,
        string? description,
        DateTime transactionDate)
    {
        if (amount <= 0)
            return null;

        var account = await _context.Accounts
            .FirstOrDefaultAsync(x =>
                x.Id == accountId &&
                x.UserId == userId);

        if (account == null)
            return null;

        var category = await _context.Categories
            .FirstOrDefaultAsync(x =>
                x.Id == categoryId &&
                x.UserId == userId);

        if (category == null)
            return null;

        if (type != "Income" && type != "Expense")
            return null;

        if (type == "Expense" &&
            account.Balance < amount)
        {
            return null;
        }

        var transaction = new Transaction
        {
            UserId = userId,
            AccountId = accountId,
            CategoryId = categoryId,
            Amount = amount,
            Type = type,
            Description = description,
            TransactionDate = transactionDate,
            CreatedAt = DateTime.UtcNow
        };

        if (type == "Income")
            account.Balance += amount;
        else
            account.Balance -= amount;

        _context.Transactions.Add(transaction);

        await _context.SaveChangesAsync();

        if (type == "Expense")
        {
            await CheckBudgetAsync(
                userId,
                categoryId,
                transactionDate);
        }

        return transaction;
    }

    private async Task CheckBudgetAsync(
        int userId,
        int categoryId,
        DateTime transactionDate)
    {
        var month = transactionDate.Month;
        var year = transactionDate.Year;

        var budget = await _context.Budgets
            .FirstOrDefaultAsync(x =>
                x.UserId == userId &&
                x.CategoryId == categoryId &&
                x.Month == month &&
                x.Year == year);

        if (budget == null)
            return;

        var spent = await _context.Transactions
            .Where(x =>
                x.UserId == userId &&
                x.CategoryId == categoryId &&
                x.Type == "Expense" &&
                x.TransactionDate.Month == month &&
                x.TransactionDate.Year == year)
            .SumAsync(x => x.Amount);

        if (spent > budget.Amount)
        {
            await _notificationService.CreateAsync(
                userId,
                "Budget exceeded",
                $"You have exceeded your budget for {month}/{year}.",
                "BudgetExceeded");
        }
        else if (spent >= budget.Amount * 0.8m)
        {
            await _notificationService.CreateAsync(
                userId,
                "Budget warning",
                $"You have used 80% or more of your budget for {month}/{year}.",
                "BudgetWarning");
        }
    }

    public async Task<Transaction?> UpdateAsync(
        int userId,
        int transactionId,
        int accountId,
        int categoryId,
        decimal amount,
        string type,
        string? description,
        DateTime transactionDate)
    {
        var transaction = await GetByIdAsync(
            userId,
            transactionId);

        if (transaction == null || amount <= 0)
            return null;

        var account = await _context.Accounts
            .FirstOrDefaultAsync(x =>
                x.Id == accountId &&
                x.UserId == userId);

        var category = await _context.Categories
            .FirstOrDefaultAsync(x =>
                x.Id == categoryId &&
                x.UserId == userId);

        if (account == null || category == null)
            return null;

        // Roll back old transaction
        if (transaction.Type == "Income")
            transaction.Account!.Balance -= transaction.Amount;
        else
            transaction.Account!.Balance += transaction.Amount;

        if (type == "Expense" &&
            account.Balance < amount)
        {
            return null;
        }

        // Apply new transaction
        if (type == "Income")
            account.Balance += amount;
        else if (type == "Expense")
            account.Balance -= amount;
        else
            return null;

        transaction.AccountId = accountId;
        transaction.CategoryId = categoryId;
        transaction.Amount = amount;
        transaction.Type = type;
        transaction.Description = description;
        transaction.TransactionDate = transactionDate;

        await _context.SaveChangesAsync();

        return transaction;
    }

    public async Task<bool> DeleteAsync(
        int userId,
        int transactionId)
    {
        var transaction = await GetByIdAsync(
            userId,
            transactionId);

        if (transaction == null)
            return false;

        if (transaction.Type == "Income")
            transaction.Account!.Balance -= transaction.Amount;
        else
            transaction.Account!.Balance += transaction.Amount;

        _context.Transactions.Remove(transaction);

        await _context.SaveChangesAsync();

        return true;
    }
}