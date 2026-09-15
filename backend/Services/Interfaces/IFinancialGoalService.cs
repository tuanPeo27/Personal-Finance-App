using backend.DTOs.FinancialGoal;

namespace backend.Services.Interfaces;

public interface IFinancialGoalService
{
    Task<IEnumerable<FinancialGoalResponse>> GetAllAsync(
        int userId);

    Task<FinancialGoalResponse?> GetByIdAsync(
        int userId,
        int goalId);

    Task<FinancialGoalResponse> CreateAsync(
        int userId,
        CreateFinancialGoalRequest request);

    Task<FinancialGoalResponse?> UpdateAsync(
        int userId,
        int goalId,
        UpdateFinancialGoalRequest request);

    Task<FinancialGoalResponse?> UpdateProgressAsync(
        int userId,
        int goalId,
        UpdateGoalProgressRequest request);

    Task<bool> DeleteAsync(
        int userId,
        int goalId);
}