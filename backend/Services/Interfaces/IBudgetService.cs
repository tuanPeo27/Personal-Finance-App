using backend.Models;

namespace backend.Services.Interfaces;

public interface IBudgetService
{
    Task<IEnumerable<Budget>> GetAllAsync(int userId);

    Task<IEnumerable<Budget>> GetByMonthAsync(
        int userId,
        int month,
        int year);

    Task<Budget?> GetByIdAsync(
        int userId,
        int budgetId);

    Task<Budget?> CreateAsync(
        int userId,
        int categoryId,
        decimal amount,
        int month,
        int year);

    Task<Budget?> UpdateAsync(
        int userId,
        int budgetId,
        decimal amount);

    Task<bool> DeleteAsync(
        int userId,
        int budgetId);

    Task<decimal> GetSpentAmountAsync(
        int userId,
        int categoryId,
        int month,
        int year);
}