using backend.Models;

namespace backend.Services.Interfaces;

public interface IUserService
{
    Task<User?> GetByIdAsync(int userId);

    Task<User?> UpdateProfileAsync(
        int userId,
        string fullName,
        string email);

    Task<bool> ChangePasswordAsync(
        int userId,
        string currentPassword,
        string newPassword);
}