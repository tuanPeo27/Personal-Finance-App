using backend.Data;
using backend.DTOs.Auth;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IJwtService _jwtService;

    public AuthService(
        AppDbContext context,
        IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<bool> RegisterAsync(RegisterRequest request)
    {
        var email = request.Email.Trim().ToLower();

        var exists = await _context.Users
            .AnyAsync(x => x.Email.ToLower() == email);

        if (exists)
        {
            return false;
        }

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(
                request.Password
            ),
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        var email = request.Email.Trim().ToLower();

        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email.ToLower() == email);

        if (user == null)
        {
            return null;
        }

        var passwordValid = BCrypt.Net.BCrypt.Verify(
            request.Password,
            user.PasswordHash
        );

        if (!passwordValid)
        {
            return null;
        }

        var token = _jwtService.GenerateToken(user);

        return new LoginResponse
        {
            Token = token,
            ExpiresAt = _jwtService.GetExpirationTime(),
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email
        };
    }
}