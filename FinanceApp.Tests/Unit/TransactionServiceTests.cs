using backend.Data;
using backend.DTOs.Transaction;
using backend.Models;
using backend.Services.Implementations;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace FinanceApp.Tests.Unit;

public class TransactionServiceTests
{
    [Fact]
    public async Task CreateUpdateAndDelete_keep_account_balance_consistent()
    {
        await using var context = CreateContext();
        var account = new Account
        {
            UserId = 1,
            Name = "Primary",
            Type = "Bank",
            Balance = 1_000m
        };
        var category = new Category
        {
            UserId = 1,
            Name = "Food",
            Type = "Expense"
        };
        context.AddRange(account, category);
        await context.SaveChangesAsync();
        var service = new TransactionService(context, Mock.Of<INotificationService>());

        var created = await service.CreateAsync(1, new CreateTransactionRequest
        {
            AccountId = account.Id,
            CategoryId = category.Id,
            Amount = 125m,
            Type = "Expense",
            TransactionDate = new DateTime(2026, 10, 5)
        });

        Assert.NotNull(created);
        Assert.Equal(875m, account.Balance);

        var updated = await service.UpdateAsync(1, created.Id, new UpdateTransactionRequest
        {
            AccountId = account.Id,
            CategoryId = category.Id,
            Amount = 200m,
            Type = "Income",
            TransactionDate = new DateTime(2026, 10, 6)
        });

        Assert.NotNull(updated);
        Assert.Equal(1_200m, account.Balance);

        var deleted = await service.DeleteAsync(1, created.Id);

        Assert.True(deleted);
        Assert.Equal(1_000m, account.Balance);
        Assert.Empty(await context.Transactions.ToListAsync());
    }

    [Fact]
    public async Task Create_rejects_account_or_category_owned_by_another_user()
    {
        await using var context = CreateContext();
        context.AddRange(
            new Account { UserId = 2, Name = "Other", Type = "Cash", Balance = 100m },
            new Category { UserId = 1, Name = "Food", Type = "Expense" });
        await context.SaveChangesAsync();
        var service = new TransactionService(context, Mock.Of<INotificationService>());

        var transaction = await service.CreateAsync(1, new CreateTransactionRequest
        {
            AccountId = 1,
            CategoryId = 1,
            Amount = 25m,
            Type = "Expense",
            TransactionDate = DateTime.UtcNow
        });

        Assert.Null(transaction);
        Assert.Empty(await context.Transactions.ToListAsync());
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }
}
