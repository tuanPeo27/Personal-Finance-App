using backend.Data;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementations;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int userId)
    {
        return await _context.Users
            .FirstOrDefaultAsync(x => x.Id == userId);
    }

    public async Task<User?> UpdateProfileAsync(
        int userId,
        string fullName,
        string email)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Id == userId);

        if (user == null)
            return null;

        email = email.Trim().ToLower();

        var emailExists = await _context.Users
            .AnyAsync(x =>
                x.Email == email &&
                x.Id != userId);

        if (emailExists)
            return null;

        user.FullName = fullName;
        user.Email = email;

        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<bool> ChangePasswordAsync(
        int userId,
        string currentPassword,
        string newPassword)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Id == userId);

        if (user == null)
            return false;

        if (!BCrypt.Net.BCrypt.Verify(
                currentPassword,
                user.PasswordHash))
        {
            return false;
        }

        user.PasswordHash =
            BCrypt.Net.BCrypt.HashPassword(newPassword);

        await _context.SaveChangesAsync();

        return true;
    }
}