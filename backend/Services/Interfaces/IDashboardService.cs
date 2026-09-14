namespace backend.Services.Interfaces;

public interface IDashboardService
{
    Task<decimal> GetTotalBalanceAsync(int userId);

    Task<decimal> GetTotalIncomeAsync(
        int userId,
        int month,
        int year);

    Task<decimal> GetTotalExpenseAsync(
        int userId,
        int month,
        int year);

    Task<object> GetExpenseByCategoryAsync(
        int userId,
        int month,
        int year);

    Task<object> GetMonthlyStatisticsAsync(
        int userId,
        int year);
}