using backend.Extensions;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(
        INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.GetUserId();

        return Ok(
            await _notificationService.GetAllAsync(userId));
    }

    [HttpGet("unread")]
    public async Task<IActionResult> GetUnread()
    {
        var userId = User.GetUserId();

        return Ok(
            await _notificationService.GetUnreadAsync(userId));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = User.GetUserId();

        var notification =
            await _notificationService.GetByIdAsync(
                userId,
                id);

        if (notification == null)
            return NotFound();

        return Ok(notification);
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var userId = User.GetUserId();

        var result =
            await _notificationService.MarkAsReadAsync(
                userId,
                id);

        if (!result)
            return NotFound();

        return Ok(new
        {
            message = "Notification marked as read."
        });
    }

    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userId = User.GetUserId();

        await _notificationService.MarkAllAsReadAsync(
            userId);

        return Ok(new
        {
            message = "All notifications marked as read."
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.GetUserId();

        var result =
            await _notificationService.DeleteAsync(
                userId,
                id);

        if (!result)
            return NotFound();

        return Ok(new
        {
            message = "Notification deleted successfully."
        });
    }
}