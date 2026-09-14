using backend.DTOs.Account;

namespace backend.Services.Interfaces;

public interface IAccountService
{
    Task<IEnumerable<AccountResponse>> GetAllAsync(int userId);

    Task<AccountResponse?> GetByIdAsync(
        int userId,
        int accountId);

    Task<AccountResponse> CreateAsync(
        int userId,
        CreateAccountRequest request);

    Task<AccountResponse?> UpdateAsync(
        int userId,
        int accountId,
        UpdateAccountRequest request);

    Task<bool> DeleteAsync(
        int userId,
        int accountId);
}