using backend.Models;

namespace backend.Services.Interfaces;

public interface IAccountService
{
    Task<IEnumerable<Account>> GetAllAsync(int userId);

    Task<Account?> GetByIdAsync(int userId, int accountId);

    Task<Account> CreateAsync(
        int userId,
        string name,
        string type,
        decimal balance);

    Task<Account?> UpdateAsync(
        int userId,
        int accountId,
        string name,
        string type);

    Task<bool> DeleteAsync(
        int userId,
        int accountId);
}