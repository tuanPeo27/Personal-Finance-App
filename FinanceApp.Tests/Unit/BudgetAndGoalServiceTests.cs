using backend.Data;
using backend.DTOs.Budget;
using backend.DTOs.FinancialGoal;
using backend.DTOs.Notification;
using backend.Models;
using backend.Services.Implementations;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace FinanceApp.Tests.Unit;

public class BudgetAndGoalServiceTests
{
    [Fact]
    public async Task Budget_response_calculates_spend_remaining_and_percentage()
    {
        await using var context = CreateContext();
        var category = new Category { UserId = 1, Name = "Food", Type = "Expense" };
        context.Add(category);
        await context.SaveChangesAsync();
        context.AddRange(
            new Budget
            {
                UserId = 1,
                CategoryId = category.Id,
                Amount = 500m,
                Month = 10,
                Year = 2026
            },
            new Transaction
            {
                UserId = 1,
                CategoryId = category.Id,
                Amount = 125m,
                Type = "Expense",
                TransactionDate = new DateTime(2026, 10, 2)
            });
        await context.SaveChangesAsync();
        var service = new BudgetService(context);

        var budget = Assert.Single(await service.GetByMonthAsync(1, 10, 2026));

        Assert.Equal(125m, budget.SpentAmount);
        Assert.Equal(375m, budget.RemainingAmount);
        Assert.Equal(25d, budget.PercentageUsed);
        Assert.False(budget.IsExceeded);
    }

    [Fact]
    public async Task Goal_progress_updates_status_and_notifies_once_on_completion()
    {
        await using var context = CreateContext();
        var notificationService = new Mock<INotificationService>();
        notificationService
            .Setup(service => service.CreateAsync(
                1,
                It.IsAny<string>(),
                It.IsAny<string>(),
                "FinancialGoalCompleted"))
            .ReturnsAsync(new NotificationResponse());
        var service = new FinancialGoalService(context, notificationService.Object);
        var goal = await service.CreateAsync(1, new CreateFinancialGoalRequest
        {
            Name = "Emergency fund",
            TargetAmount = 1_000m,
            CurrentAmount = 250m
        });

        var completed = await service.UpdateProgressAsync(
            1,
            goal.Id,
            new UpdateGoalProgressRequest { CurrentAmount = 1_000m });

        Assert.NotNull(completed);
        Assert.Equal("Completed", completed.Status);
        Assert.Equal(0m, completed.RemainingAmount);
        Assert.Equal(100d, completed.PercentageCompleted);
        notificationService.Verify(
            service => service.CreateAsync(
                1,
                It.IsAny<string>(),
                It.IsAny<string>(),
                "FinancialGoalCompleted"),
            Times.Once);
    }

    [Fact]
    public async Task Goal_rejects_progress_above_target_without_mutating_state()
    {
        await using var context = CreateContext();
        var service = new FinancialGoalService(
            context,
            Mock.Of<INotificationService>());
        var goal = await service.CreateAsync(1, new CreateFinancialGoalRequest
        {
            Name = "Travel",
            TargetAmount = 500m,
            CurrentAmount = 100m
        });

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            service.UpdateProgressAsync(
                1,
                goal.Id,
                new UpdateGoalProgressRequest { CurrentAmount = 501m }));

        var saved = await context.FinancialGoals.SingleAsync();
        Assert.Equal(100m, saved.CurrentAmount);
        Assert.Equal("Active", saved.Status);
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }
}
