using backend.Data;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementations;

public class FinancialGoalService : IFinancialGoalService
{
    private readonly AppDbContext _context;
    private readonly INotificationService _notificationService;

    public FinancialGoalService(
        AppDbContext context,
        INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    public async Task<IEnumerable<FinancialGoal>> GetAllAsync(
        int userId)
    {
        return await _context.FinancialGoals
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<FinancialGoal?> GetByIdAsync(
        int userId,
        int goalId)
    {
        return await _context.FinancialGoals
            .FirstOrDefaultAsync(x =>
                x.Id == goalId &&
                x.UserId == userId);
    }

    public async Task<FinancialGoal> CreateAsync(
        int userId,
        string name,
        decimal targetAmount,
        DateTime? deadline)
    {
        var goal = new FinancialGoal
        {
            UserId = userId,
            Name = name,
            TargetAmount = targetAmount,
            CurrentAmount = 0,
            Deadline = deadline,
            Status = "Active",
            CreatedAt = DateTime.UtcNow
        };

        _context.FinancialGoals.Add(goal);

        await _context.SaveChangesAsync();

        return goal;
    }

    public async Task<FinancialGoal?> UpdateAsync(
        int userId,
        int goalId,
        string name,
        decimal targetAmount,
        DateTime? deadline)
    {
        var goal = await GetByIdAsync(
            userId,
            goalId);

        if (goal == null)
            return null;

        goal.Name = name;
        goal.TargetAmount = targetAmount;
        goal.Deadline = deadline;

        if (goal.CurrentAmount >= goal.TargetAmount)
            goal.Status = "Completed";
        else
            goal.Status = "Active";

        await _context.SaveChangesAsync();

        return goal;
    }

    public async Task<FinancialGoal?> UpdateProgressAsync(
        int userId,
        int goalId,
        decimal currentAmount)
    {
        if (currentAmount < 0)
            return null;

        var goal = await GetByIdAsync(
            userId,
            goalId);

        if (goal == null)
            return null;

        var wasCompleted =
            goal.Status == "Completed";

        goal.CurrentAmount = currentAmount;

        if (goal.CurrentAmount >= goal.TargetAmount)
        {
            goal.Status = "Completed";

            if (!wasCompleted)
            {
                await _notificationService.CreateAsync(
                    userId,
                    "Goal completed",
                    $"Congratulations! You completed your goal: {goal.Name}.",
                    "GoalCompleted");
            }
        }
        else
        {
            goal.Status = "Active";
        }

        await _context.SaveChangesAsync();

        return goal;
    }

    public async Task<bool> DeleteAsync(
        int userId,
        int goalId)
    {
        var goal = await GetByIdAsync(
            userId,
            goalId);

        if (goal == null)
            return false;

        _context.FinancialGoals.Remove(goal);

        await _context.SaveChangesAsync();

        return true;
    }
}