using backend.Data;
using backend.Models;
using backend.Services.Implementations;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Tests.Unit;

public class DashboardServiceTests
{
    [Fact]
    public async Task Dashboard_totals_are_scoped_to_user_and_requested_month()
    {
        await using var context = CreateContext();
        context.AddRange(
            new Account { UserId = 1, Name = "One", Type = "Cash", Balance = 300m },
            new Account { UserId = 1, Name = "Two", Type = "Bank", Balance = 450m },
            new Account { UserId = 2, Name = "Other", Type = "Cash", Balance = 9_000m },
            new Transaction
            {
                UserId = 1,
                Amount = 2_000m,
                Type = "Income",
                TransactionDate = new DateTime(2026, 10, 1)
            },
            new Transaction
            {
                UserId = 1,
                Amount = 350m,
                Type = "Expense",
                TransactionDate = new DateTime(2026, 10, 2)
            },
            new Transaction
            {
                UserId = 1,
                Amount = 500m,
                Type = "Income",
                TransactionDate = new DateTime(2026, 9, 30)
            },
            new Transaction
            {
                UserId = 2,
                Amount = 70_000m,
                Type = "Income",
                TransactionDate = new DateTime(2026, 10, 1)
            });
        await context.SaveChangesAsync();
        var service = new DashboardService(context);

        Assert.Equal(750m, await service.GetTotalBalanceAsync(1));
        Assert.Equal(2_000m, await service.GetTotalIncomeAsync(1, 10, 2026));
        Assert.Equal(350m, await service.GetTotalExpenseAsync(1, 10, 2026));
        Assert.Equal(0m, await service.GetTotalIncomeAsync(1, 8, 2026));
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }
}
