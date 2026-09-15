using backend.DTOs.Transaction;

namespace backend.Services.Interfaces;

public interface ITransactionService
{
    Task<IEnumerable<TransactionResponse>> GetAllAsync(int userId);

    Task<TransactionResponse?> GetByIdAsync(
        int userId,
        int transactionId);

    Task<IEnumerable<TransactionResponse>> GetByAccountAsync(
        int userId,
        int accountId);

    Task<IEnumerable<TransactionResponse>> GetByCategoryAsync(
        int userId,
        int categoryId);

    Task<TransactionResponse?> CreateAsync(
        int userId,
        CreateTransactionRequest request);

    Task<TransactionResponse?> UpdateAsync(
        int userId,
        int transactionId,
        UpdateTransactionRequest request);

    Task<bool> DeleteAsync(
        int userId,
        int transactionId);
}