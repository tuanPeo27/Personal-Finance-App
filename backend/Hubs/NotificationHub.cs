
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    private readonly ILogger<NotificationHub> _logger;

    public NotificationHub(ILogger<NotificationHub> logger)
    {
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        _logger.LogInformation(
            "SignalR connected | UserId: {UserId} | ConnectionId: {ConnectionId} | Time: {Time}",
            Context.UserIdentifier ?? "Unknown",
            Context.ConnectionId,
            DateTime.UtcNow
        );

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(
        Exception? exception)
    {
        _logger.LogInformation(
            exception,
            "SignalR disconnected | UserId: {UserId} | ConnectionId: {ConnectionId} | Time: {Time}",
            Context.UserIdentifier ?? "Unknown",
            Context.ConnectionId,
            DateTime.UtcNow
        );

        await base.OnDisconnectedAsync(exception);
    }
}
