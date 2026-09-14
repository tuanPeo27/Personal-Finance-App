using backend.Models;

namespace backend.Services.Interfaces;

public interface IAuthService
{
    Task<User?> RegisterAsync(
        string fullName,
        string email,
        string password);

    Task<User?> LoginAsync(
        string email,
        string password);

    Task<User?> GetByEmailAsync(string email);
}