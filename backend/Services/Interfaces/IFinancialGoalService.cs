using backend.Models;

namespace backend.Services.Interfaces;

public interface IFinancialGoalService
{
    Task<IEnumerable<FinancialGoal>> GetAllAsync(int userId);

    Task<FinancialGoal?> GetByIdAsync(
        int userId,
        int goalId);

    Task<FinancialGoal> CreateAsync(
        int userId,
        string name,
        decimal targetAmount,
        DateTime? deadline);

    Task<FinancialGoal?> UpdateAsync(
        int userId,
        int goalId,
        string name,
        decimal targetAmount,
        DateTime? deadline);

    Task<FinancialGoal?> UpdateProgressAsync(
        int userId,
        int goalId,
        decimal currentAmount);

    Task<bool> DeleteAsync(
        int userId,
        int goalId);
}