using backend.Data;
using backend.DTOs.Transaction;
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

    public async Task<IEnumerable<TransactionResponse>> GetAllAsync(int userId)
    {
        return await _context.Transactions
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.TransactionDate)
            .ThenByDescending(x => x.CreatedAt)
            .Select(x => new TransactionResponse
            {
                Id = x.Id,

                AccountId = x.AccountId,
                AccountName = x.Account != null
                    ? x.Account.Name
                    : string.Empty,

                CategoryId = x.CategoryId,
                CategoryName = x.Category != null
                    ? x.Category.Name
                    : string.Empty,

                Amount = x.Amount,
                Type = x.Type,
                Description = x.Description,
                TransactionDate = x.TransactionDate,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<TransactionResponse?> GetByIdAsync(
        int userId,
        int transactionId)
    {
        return await _context.Transactions
            .Where(x =>
                x.Id == transactionId &&
                x.UserId == userId)
            .Select(x => new TransactionResponse
            {
                Id = x.Id,

                AccountId = x.AccountId,
                AccountName = x.Account != null
                    ? x.Account.Name
                    : string.Empty,

                CategoryId = x.CategoryId,
                CategoryName = x.Category != null
                    ? x.Category.Name
                    : string.Empty,

                Amount = x.Amount,
                Type = x.Type,
                Description = x.Description,
                TransactionDate = x.TransactionDate,
                CreatedAt = x.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<TransactionResponse>> GetByAccountAsync(
        int userId,
        int accountId)
    {
        return await _context.Transactions
            .Where(x =>
                x.UserId == userId &&
                x.AccountId == accountId)
            .OrderByDescending(x => x.TransactionDate)
            .ThenByDescending(x => x.CreatedAt)
            .Select(x => new TransactionResponse
            {
                Id = x.Id,

                AccountId = x.AccountId,
                AccountName = x.Account != null
                    ? x.Account.Name
                    : string.Empty,

                CategoryId = x.CategoryId,
                CategoryName = x.Category != null
                    ? x.Category.Name
                    : string.Empty,

                Amount = x.Amount,
                Type = x.Type,
                Description = x.Description,
                TransactionDate = x.TransactionDate,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<TransactionResponse>> GetByCategoryAsync(
        int userId,
        int categoryId)
    {
        return await _context.Transactions
            .Where(x =>
                x.UserId == userId &&
                x.CategoryId == categoryId)
            .OrderByDescending(x => x.TransactionDate)
            .ThenByDescending(x => x.CreatedAt)
            .Select(x => new TransactionResponse
            {
                Id = x.Id,

                AccountId = x.AccountId,
                AccountName = x.Account != null
                    ? x.Account.Name
                    : string.Empty,

                CategoryId = x.CategoryId,
                CategoryName = x.Category != null
                    ? x.Category.Name
                    : string.Empty,

                Amount = x.Amount,
                Type = x.Type,
                Description = x.Description,
                TransactionDate = x.TransactionDate,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<TransactionResponse?> CreateAsync(
        int userId,
        CreateTransactionRequest request)
    {
        var account = await _context.Accounts
            .FirstOrDefaultAsync(x =>
                x.Id == request.AccountId &&
                x.UserId == userId);

        if (account == null)
            return null;

        var category = await _context.Categories
            .FirstOrDefaultAsync(x =>
                x.Id == request.CategoryId &&
                x.UserId == userId);

        if (category == null)
            return null;

        if (request.Type == "Income")
        {
            account.Balance += request.Amount;
        }
        else
        {
            account.Balance -= request.Amount;
        }

        var transaction = new Transaction
        {
            UserId = userId,
            AccountId = request.AccountId,
            CategoryId = request.CategoryId,
            Amount = request.Amount,
            Type = request.Type,
            Description = request.Description,
            TransactionDate = request.TransactionDate,
            CreatedAt = DateTime.UtcNow
        };

        _context.Transactions.Add(transaction);

        await _context.SaveChangesAsync();

        await CheckBudgetAsync(
            userId,
            transaction.CategoryId,
            transaction.TransactionDate);

        return new TransactionResponse
        {
            Id = transaction.Id,

            AccountId = transaction.AccountId,
            AccountName = account.Name,

            CategoryId = transaction.CategoryId,
            CategoryName = category.Name,

            Amount = transaction.Amount,
            Type = transaction.Type,
            Description = transaction.Description,
            TransactionDate = transaction.TransactionDate,
            CreatedAt = transaction.CreatedAt
        };
    }

    public async Task<TransactionResponse?> UpdateAsync(
        int userId,
        int transactionId,
        UpdateTransactionRequest request)
    {
        var transaction = await _context.Transactions
            .FirstOrDefaultAsync(x =>
                x.Id == transactionId &&
                x.UserId == userId);

        if (transaction == null)
            return null;

        var newAccount = await _context.Accounts
            .FirstOrDefaultAsync(x =>
                x.Id == request.AccountId &&
                x.UserId == userId);

        if (newAccount == null)
            return null;

        var newCategory = await _context.Categories
            .FirstOrDefaultAsync(x =>
                x.Id == request.CategoryId &&
                x.UserId == userId);

        if (newCategory == null)
            return null;

        var oldAccount = await _context.Accounts
            .FirstOrDefaultAsync(x =>
                x.Id == transaction.AccountId &&
                x.UserId == userId);

        if (oldAccount == null)
            return null;

        // 1. Reverse old transaction
        if (transaction.Type == "Income")
        {
            oldAccount.Balance -= transaction.Amount;
        }
        else
        {
            oldAccount.Balance += transaction.Amount;
        }

        // 2. Apply new transaction
        if (request.Type == "Income")
        {
            newAccount.Balance += request.Amount;
        }
        else
        {
            newAccount.Balance -= request.Amount;
        }

        // 3. Update transaction
        transaction.AccountId = request.AccountId;
        transaction.CategoryId = request.CategoryId;
        transaction.Amount = request.Amount;
        transaction.Type = request.Type;
        transaction.Description = request.Description;
        transaction.TransactionDate = request.TransactionDate;

        await _context.SaveChangesAsync();

        await CheckBudgetAsync(
            userId,
            transaction.CategoryId,
            transaction.TransactionDate);

        return new TransactionResponse
        {
            Id = transaction.Id,

            AccountId = transaction.AccountId,
            AccountName = newAccount.Name,

            CategoryId = transaction.CategoryId,
            CategoryName = newCategory.Name,

            Amount = transaction.Amount,
            Type = transaction.Type,
            Description = transaction.Description,
            TransactionDate = transaction.TransactionDate,
            CreatedAt = transaction.CreatedAt
        };
    }

    public async Task<bool> DeleteAsync(
        int userId,
        int transactionId)
    {
        var transaction = await _context.Transactions
            .FirstOrDefaultAsync(x =>
                x.Id == transactionId &&
                x.UserId == userId);

        if (transaction == null)
            return false;

        var account = await _context.Accounts
            .FirstOrDefaultAsync(x =>
                x.Id == transaction.AccountId &&
                x.UserId == userId);

        if (account == null)
            return false;

        // Reverse transaction effect
        if (transaction.Type == "Income")
        {
            account.Balance -= transaction.Amount;
        }
        else
        {
            account.Balance += transaction.Amount;
        }

        _context.Transactions.Remove(transaction);

        await _context.SaveChangesAsync();

        return true;
    }

    private async Task CheckBudgetAsync(
        int userId,
        int categoryId,
        DateTime transactionDate)
    {
        var budget = await _context.Budgets
            .FirstOrDefaultAsync(x =>
                x.UserId == userId &&
                x.CategoryId == categoryId &&
                x.Month == transactionDate.Month &&
                x.Year == transactionDate.Year);

        if (budget == null)
            return;

        var spentAmount = await _context.Transactions
            .Where(x =>
                x.UserId == userId &&
                x.CategoryId == categoryId &&
                x.Type == "Expense" &&
                x.TransactionDate.Month == transactionDate.Month &&
                x.TransactionDate.Year == transactionDate.Year)
            .SumAsync(x => (decimal?)x.Amount) ?? 0;

        if (spentAmount <= budget.Amount)
            return;

        var category = await _context.Categories
            .FirstOrDefaultAsync(x =>
                x.Id == categoryId &&
                x.UserId == userId);

        var categoryName = category?.Name ?? "category";

        var existingNotification = await _context.Notifications
            .AnyAsync(x =>
                x.UserId == userId &&
                x.Type == "BudgetExceeded" &&
                x.Message.Contains(categoryName) &&
                x.CreatedAt.Month == transactionDate.Month &&
                x.CreatedAt.Year == transactionDate.Year);

        if (existingNotification)
            return;

        await _notificationService.CreateAsync(
            userId,
            "Budget exceeded",
            $"Your budget for {categoryName} has been exceeded.",
            "BudgetExceeded");
    }
}