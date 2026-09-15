using backend.DTOs.Budget;

namespace backend.Services.Interfaces;

public interface IBudgetService
{
    Task<IEnumerable<BudgetResponse>> GetAllAsync(int userId);

    Task<BudgetResponse?> GetByIdAsync(
        int userId,
        int budgetId);

    Task<IEnumerable<BudgetResponse>> GetByMonthAsync(
        int userId,
        int month,
        int year);

    Task<BudgetResponse?> CreateAsync(
        int userId,
        CreateBudgetRequest request);

    Task<BudgetResponse?> UpdateAsync(
        int userId,
        int budgetId,
        UpdateBudgetRequest request);

    Task<bool> DeleteAsync(
        int userId,
        int budgetId);
}