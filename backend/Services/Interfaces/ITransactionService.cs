using backend.Models;

namespace backend.Services.Interfaces;

public interface ITransactionService
{
    Task<IEnumerable<Transaction>> GetAllAsync(int userId);

    Task<IEnumerable<Transaction>> GetByDateRangeAsync(
        int userId,
        DateTime from,
        DateTime to);

    Task<IEnumerable<Transaction>> GetByTypeAsync(
        int userId,
        string type);

    Task<Transaction?> GetByIdAsync(
        int userId,
        int transactionId);

    Task<Transaction?> CreateAsync(
        int userId,
        int accountId,
        int categoryId,
        decimal amount,
        string type,
        string? description,
        DateTime transactionDate);

    Task<Transaction?> UpdateAsync(
        int userId,
        int transactionId,
        int accountId,
        int categoryId,
        decimal amount,
        string type,
        string? description,
        DateTime transactionDate);

    Task<bool> DeleteAsync(
        int userId,
        int transactionId);
}