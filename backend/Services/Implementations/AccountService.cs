using backend.Data;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementations;

public class AccountService : IAccountService
{
    private readonly AppDbContext _context;

    public AccountService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Account>> GetAllAsync(int userId)
    {
        return await _context.Accounts
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<Account?> GetByIdAsync(
        int userId,
        int accountId)
    {
        return await _context.Accounts
            .FirstOrDefaultAsync(x =>
                x.Id == accountId &&
                x.UserId == userId);
    }

    public async Task<Account> CreateAsync(
        int userId,
        string name,
        string type,
        decimal balance)
    {
        var account = new Account
        {
            UserId = userId,
            Name = name,
            Type = type,
            Balance = balance,
            CreatedAt = DateTime.UtcNow
        };

        _context.Accounts.Add(account);
        await _context.SaveChangesAsync();

        return account;
    }

    public async Task<Account?> UpdateAsync(
        int userId,
        int accountId,
        string name,
        string type)
    {
        var account = await GetByIdAsync(userId, accountId);

        if (account == null)
            return null;

        account.Name = name;
        account.Type = type;

        await _context.SaveChangesAsync();

        return account;
    }

    public async Task<bool> DeleteAsync(
        int userId,
        int accountId)
    {
        var account = await GetByIdAsync(userId, accountId);

        if (account == null)
            return false;

        var hasTransactions = await _context.Transactions
            .AnyAsync(x => x.AccountId == accountId);

        if (hasTransactions)
            return false;

        _context.Accounts.Remove(account);
        await _context.SaveChangesAsync();

        return true;
    }
}