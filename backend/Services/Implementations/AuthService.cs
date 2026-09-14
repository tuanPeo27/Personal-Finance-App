using backend.Data;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace backend.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;

    public AuthService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> RegisterAsync(
        string fullName,
        string email,
        string password)
    {
        email = email.Trim().ToLower();

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == email);

        if (existingUser != null)
            return null;

        var user = new User
        {
            FullName = fullName,
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<User?> LoginAsync(
        string email,
        string password)
    {
        email = email.Trim().ToLower();

        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == email);

        if (user == null)
            return null;

        var validPassword = BCrypt.Net.BCrypt
            .Verify(password, user.PasswordHash);

        return validPassword ? user : null;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        email = email.Trim().ToLower();

        return await _context.Users
            .FirstOrDefaultAsync(x => x.Email == email);
    }
}