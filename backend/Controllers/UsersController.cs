using backend.Extensions;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var userId = User.GetUserId();

        var user = await _userService.GetByIdAsync(userId);

        if (user == null)
            return NotFound();

        return Ok(new
        {
            user.Id,
            user.FullName,
            user.Email,
            user.CreatedAt
        });
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateProfile(
        string fullName,
        string email)
    {
        var userId = User.GetUserId();

        var user = await _userService.UpdateProfileAsync(
            userId,
            fullName,
            email);

        if (user == null)
            return BadRequest("Email already exists.");

        return Ok(user);
    }

    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword(
        string currentPassword,
        string newPassword)
    {
        var userId = User.GetUserId();

        var result = await _userService.ChangePasswordAsync(
            userId,
            currentPassword,
            newPassword);

        if (!result)
            return BadRequest(
                "Current password is incorrect.");

        return Ok(new
        {
            message = "Password changed successfully."
        });
    }
}