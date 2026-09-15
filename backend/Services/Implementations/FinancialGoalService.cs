using backend.Data;
using backend.DTOs.FinancialGoal;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementations;

public class FinancialGoalService : IFinancialGoalService
{
    private readonly AppDbContext _context;

    public FinancialGoalService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<FinancialGoalResponse>> GetAllAsync(
        int userId)
    {
        var goals = await _context.FinancialGoals
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.Deadline)
            .ToListAsync();

        return goals.Select(MapToResponse);
    }

    public async Task<FinancialGoalResponse?> GetByIdAsync(
        int userId,
        int goalId)
    {
        var goal = await _context.FinancialGoals
            .FirstOrDefaultAsync(x =>
                x.Id == goalId &&
                x.UserId == userId);

        if (goal == null)
            return null;

        return MapToResponse(goal);
    }

    public async Task<FinancialGoalResponse> CreateAsync(
        int userId,
        CreateFinancialGoalRequest request)
    {
        if (request.CurrentAmount > request.TargetAmount)
        {
            throw new InvalidOperationException(
                "Current amount cannot be greater than target amount.");
        }

        var goal = new FinancialGoal
        {
            UserId = userId,
            Name = request.Name,
            TargetAmount = request.TargetAmount,
            CurrentAmount = request.CurrentAmount,
            Deadline = request.Deadline,
            Status = request.CurrentAmount >= request.TargetAmount
                ? "Completed"
                : "Active",
            CreatedAt = DateTime.UtcNow
        };

        _context.FinancialGoals.Add(goal);

        await _context.SaveChangesAsync();

        return MapToResponse(goal);
    }

    public async Task<FinancialGoalResponse?> UpdateAsync(
        int userId,
        int goalId,
        UpdateFinancialGoalRequest request)
    {
        var goal = await _context.FinancialGoals
            .FirstOrDefaultAsync(x =>
                x.Id == goalId &&
                x.UserId == userId);

        if (goal == null)
            return null;

        if (goal.CurrentAmount > request.TargetAmount)
        {
            throw new InvalidOperationException(
                "Target amount cannot be less than current amount.");
        }

        goal.Name = request.Name;
        goal.TargetAmount = request.TargetAmount;
        goal.Deadline = request.Deadline;

        if (goal.CurrentAmount >= goal.TargetAmount)
            goal.Status = "Completed";
        else if (goal.Status == "Completed")
            goal.Status = "Active";

        await _context.SaveChangesAsync();

        return MapToResponse(goal);
    }

    public async Task<FinancialGoalResponse?> UpdateProgressAsync(
        int userId,
        int goalId,
        UpdateGoalProgressRequest request)
    {
        var goal = await _context.FinancialGoals
            .FirstOrDefaultAsync(x =>
                x.Id == goalId &&
                x.UserId == userId);

        if (goal == null)
            return null;

        if (request.CurrentAmount > goal.TargetAmount)
        {
            throw new InvalidOperationException(
                "Current amount cannot be greater than target amount.");
        }

        goal.CurrentAmount = request.CurrentAmount;

        if (goal.CurrentAmount >= goal.TargetAmount)
            goal.Status = "Completed";
        else
            goal.Status = "Active";

        await _context.SaveChangesAsync();

        return MapToResponse(goal);
    }

    public async Task<bool> DeleteAsync(
        int userId,
        int goalId)
    {
        var goal = await _context.FinancialGoals
            .FirstOrDefaultAsync(x =>
                x.Id == goalId &&
                x.UserId == userId);

        if (goal == null)
            return false;

        _context.FinancialGoals.Remove(goal);

        await _context.SaveChangesAsync();

        return true;
    }

    private static FinancialGoalResponse MapToResponse(
        FinancialGoal goal)
    {
        var remainingAmount =
            Math.Max(
                0,
                goal.TargetAmount - goal.CurrentAmount);

        var percentageCompleted =
            goal.TargetAmount > 0
                ? (double)(
                    goal.CurrentAmount /
                    goal.TargetAmount) * 100
                : 0;

        return new FinancialGoalResponse
        {
            Id = goal.Id,
            Name = goal.Name,
            TargetAmount = goal.TargetAmount,
            CurrentAmount = goal.CurrentAmount,
            RemainingAmount = remainingAmount,
            PercentageCompleted = percentageCompleted,
            Status = goal.Status,
            Deadline = goal.Deadline,
            CreatedAt = goal.CreatedAt
        };
    }
}