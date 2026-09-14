using backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IJwtService _jwtService;

    public AuthController(
        IAuthService authService,
        IJwtService jwtService)
    {
        _authService = authService;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        string fullName,
        string email,
        string password)
    {
        var user = await _authService.RegisterAsync(
            fullName,
            email,
            password);

        if (user == null)
            return BadRequest("Email already exists.");

        return Ok(new
        {
            message = "Register successfully.",
            userId = user.Id,
            user.FullName,
            user.Email
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        string email,
        string password)
    {
        var user = await _authService.LoginAsync(
            email,
            password);

        if (user == null)
            return Unauthorized("Invalid email or password.");

        var token = _jwtService.GenerateToken(user);

        return Ok(new
        {
            token,
            user = new
            {
                user.Id,
                user.FullName,
                user.Email
            }
        });
    }
}