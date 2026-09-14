using backend.Data;
using backend.Hubs;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementations;

public class NotificationService : INotificationService
{
    private readonly AppDbContext _context;
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationService(
        AppDbContext context,
        IHubContext<NotificationHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async Task<IEnumerable<Notification>> GetAllAsync(
        int userId)
    {
        return await _context.Notifications
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Notification>> GetUnreadAsync(
        int userId)
    {
        return await _context.Notifications
            .Where(x =>
                x.UserId == userId &&
                !x.IsRead)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<Notification?> GetByIdAsync(
        int userId,
        int notificationId)
    {
        return await _context.Notifications
            .FirstOrDefaultAsync(x =>
                x.Id == notificationId &&
                x.UserId == userId);
    }

    public async Task<Notification> CreateAsync(
        int userId,
        string title,
        string message,
        string type)
    {
        var notification = new Notification
        {
            UserId = userId,
            Title = title,
            Message = message,
            Type = type,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        // 1. Lưu notification vào database
        _context.Notifications.Add(notification);

        await _context.SaveChangesAsync();

        // 2. Gửi notification realtime đến đúng user
        await _hubContext.Clients
            .User(userId.ToString())
            .SendAsync(
                "ReceiveNotification",
                notification);

        return notification;
    }

    public async Task<bool> MarkAsReadAsync(
        int userId,
        int notificationId)
    {
        var notification = await GetByIdAsync(
            userId,
            notificationId);

        if (notification == null)
            return false;

        notification.IsRead = true;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> MarkAllAsReadAsync(
        int userId)
    {
        var notifications = await _context.Notifications
            .Where(x =>
                x.UserId == userId &&
                !x.IsRead)
            .ToListAsync();

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
        }

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(
        int userId,
        int notificationId)
    {
        var notification = await GetByIdAsync(
            userId,
            notificationId);

        if (notification == null)
            return false;

        _context.Notifications.Remove(notification);

        await _context.SaveChangesAsync();

        return true;
    }
}