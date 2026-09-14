using backend.Data;
using backend.DTOs.Account;
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

    // GET ALL
    public async Task<IEnumerable<AccountResponse>> GetAllAsync(
        int userId)
    {
        return await _context.Accounts
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new AccountResponse
            {
                Id = x.Id,
                Name = x.Name,
                Type = x.Type,
                Balance = x.Balance,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();
    }

    // GET BY ID
    public async Task<AccountResponse?> GetByIdAsync(
        int userId,
        int accountId)
    {
        return await _context.Accounts
            .Where(x =>
                x.Id == accountId &&
                x.UserId == userId)
            .Select(x => new AccountResponse
            {
                Id = x.Id,
                Name = x.Name,
                Type = x.Type,
                Balance = x.Balance,
                CreatedAt = x.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    // CREATE
    public async Task<AccountResponse> CreateAsync(
        int userId,
        CreateAccountRequest request)
    {
        var account = new Account
        {
            UserId = userId,
            Name = request.Name,
            Type = request.Type,
            Balance = request.Balance,
            CreatedAt = DateTime.UtcNow
        };

        _context.Accounts.Add(account);

        await _context.SaveChangesAsync();

        return new AccountResponse
        {
            Id = account.Id,
            Name = account.Name,
            Type = account.Type,
            Balance = account.Balance,
            CreatedAt = account.CreatedAt
        };
    }

    // UPDATE
    public async Task<AccountResponse?> UpdateAsync(
        int userId,
        int accountId,
        UpdateAccountRequest request)
    {
        var account = await _context.Accounts
            .FirstOrDefaultAsync(x =>
                x.Id == accountId &&
                x.UserId == userId);

        if (account == null)
            return null;

        account.Name = request.Name;
        account.Type = request.Type;

        await _context.SaveChangesAsync();

        return new AccountResponse
        {
            Id = account.Id,
            Name = account.Name,
            Type = account.Type,
            Balance = account.Balance,
            CreatedAt = account.CreatedAt
        };
    }

    // DELETE
    public async Task<bool> DeleteAsync(
        int userId,
        int accountId)
    {
        var account = await _context.Accounts
            .FirstOrDefaultAsync(x =>
                x.Id == accountId &&
                x.UserId == userId);

        if (account == null)
            return false;

        _context.Accounts.Remove(account);

        await _context.SaveChangesAsync();

        return true;
    }
}