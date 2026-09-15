using backend.DTOs.Notification;

namespace backend.Services.Interfaces;

public interface INotificationService
{
    Task<IEnumerable<NotificationResponse>> GetAllAsync(
        int userId);

    Task<IEnumerable<NotificationResponse>> GetUnreadAsync(
        int userId);

    Task<NotificationResponse?> GetByIdAsync(
        int userId,
        int notificationId);

    Task<NotificationResponse> CreateAsync(
        int userId,
        string title,
        string message,
        string type);

    Task<bool> MarkAsReadAsync(
        int userId,
        int notificationId);

    Task<bool> MarkAllAsReadAsync(
        int userId);

    Task<bool> DeleteAsync(
        int userId,
        int notificationId);
}