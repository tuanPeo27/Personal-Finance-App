using backend.Data;
using backend.Options;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Configuration;
using Microsoft.Data.Sqlite;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace FinanceApp.Tests.Integration;

public sealed class TestApplicationFactory : WebApplicationFactory<Program>
{
    public const string JwtKey = "FinanceApp.IntegrationTests.JwtKey.2026.MustBeLongEnough";

    private readonly SqliteConnection _connection = new("Data Source=:memory:");

    public TestApplicationFactory()
    {
        _connection.Open();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.UseContentRoot(Path.GetFullPath(
            Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "backend")));
        builder.ConfigureAppConfiguration((_, configuration) =>
        {
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = JwtKey,
                ["Jwt:ExpirationHours"] = "1"
            });
        });
        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll<AppDbContext>();
            services.RemoveAll<DbContextOptions<AppDbContext>>();
            services.RemoveAll<IDbContextOptionsConfiguration<AppDbContext>>();
            services.AddDbContext<AppDbContext>(options => options.UseSqlite(_connection));
            services.PostConfigure<JwtOptions>(options =>
            {
                options.Key = JwtKey;
                options.ExpirationHours = 1;
            });
            services.PostConfigure<JwtBearerOptions>(
                JwtBearerDefaults.AuthenticationScheme,
                options => options.TokenValidationParameters.IssuerSigningKey =
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtKey)));
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        if (disposing)
        {
            _connection.Dispose();
        }
    }
}

public sealed class TestApplicationFixture : IAsyncLifetime
{
    private readonly TestApplicationFactory _factory = new();
    private string? _previousJwtKey;
    private string? _previousEnvironment;

    public HttpClient CreateClient() => _factory.CreateClient();

    public async Task InitializeAsync()
    {
        _previousJwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
        _previousEnvironment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
        Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "Testing");
        Environment.SetEnvironmentVariable("JWT_KEY", TestApplicationFactory.JwtKey);

        try
        {
            _ = _factory.CreateClient();
            await using var scope = _factory.Services.CreateAsyncScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await context.Database.EnsureCreatedAsync();
        }
        catch
        {
            RestoreProcessState();
            throw;
        }
    }

    public Task DisposeAsync()
    {
        _factory.Dispose();
        RestoreProcessState();
        return Task.CompletedTask;
    }

    private void RestoreProcessState()
    {
        Environment.SetEnvironmentVariable("JWT_KEY", _previousJwtKey);
        Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", _previousEnvironment);
    }
}
