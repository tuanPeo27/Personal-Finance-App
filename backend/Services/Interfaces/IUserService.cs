using backend.DTOs.User;

namespace backend.Services.Interfaces;

public interface IUserService
{
    Task<UserResponse?> GetByIdAsync(int userId);

    Task<UserResponse?> UpdateAsync(
        int userId,
        UpdateUserRequest request);

    Task<bool> DeleteAsync(int userId);
}