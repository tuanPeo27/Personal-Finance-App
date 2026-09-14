using backend.DTOs.Auth;

namespace backend.Services.Interfaces;

public interface IAuthService
{
    Task<bool> RegisterAsync(RegisterRequest request);

    Task<LoginResponse?> LoginAsync(LoginRequest request);
}