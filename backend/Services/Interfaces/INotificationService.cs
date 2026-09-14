using backend.Models;

namespace backend.Services.Interfaces;

public interface INotificationService
{
    Task<IEnumerable<Notification>> GetAllAsync(int userId);

    Task<IEnumerable<Notification>> GetUnreadAsync(int userId);

    Task<Notification?> GetByIdAsync(
        int userId,
        int notificationId);

    Task<Notification> CreateAsync(
        int userId,
        string title,
        string message,
        string type);

    Task<bool> MarkAsReadAsync(
        int userId,
        int notificationId);

    Task<bool> MarkAllAsReadAsync(int userId);

    Task<bool> DeleteAsync(
        int userId,
        int notificationId);
}