using System.Text;
using backend.Data;
using backend.Hubs;
using backend.Middleware;
using backend.Services.Implementations;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using backend.Options;

using Microsoft.OpenApi;

var envFilePath = new[]
{
    Path.Combine(Directory.GetCurrentDirectory(), ".env"),
    Path.Combine(Directory.GetCurrentDirectory(), "..", ".env")
}
.Select(Path.GetFullPath)
.FirstOrDefault(File.Exists);

if (envFilePath is not null &&
    !string.Equals(
        Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
        "Testing",
        StringComparison.OrdinalIgnoreCase))
{
    DotNetEnv.Env.Load(envFilePath);
}

var builder = WebApplication.CreateBuilder(args);

// =====================================================
// SERVICES - DEPENDENCY INJECTION
// =====================================================

// Controllers
builder.Services.AddControllers();

// Health Checks
builder.Services.AddHealthChecks().AddDbContextCheck<AppDbContext>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập JWT token"
    });

    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = []
    });
});

// =====================================================
// DATABASE
// =====================================================

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString =
        builder.Configuration.GetConnectionString(
            "DefaultConnection");

    if (string.IsNullOrWhiteSpace(connectionString))
    {
        var mssqlPassword =
            Environment.GetEnvironmentVariable(
                "MSSQL_SA_PASSWORD");

        if (string.IsNullOrWhiteSpace(mssqlPassword))
        {
            throw new InvalidOperationException(
                "MSSQL_SA_PASSWORD must be configured when " +
                "ConnectionStrings:DefaultConnection is not provided.");
        }

        connectionString =
            "Server=localhost,1433;" +
            "Database=PersonalFinanceDb;" +
            "User Id=sa;" +
            $"Password={mssqlPassword};" +
            "TrustServerCertificate=True;";
    }

    options.UseSqlServer(
        connectionString
    );
    if (builder.Environment.IsDevelopment())
    {
        options.LogTo(Console.WriteLine, LogLevel.Information);
        options.EnableDetailedErrors();
    }
});

builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection("Jwt"));

var jwtKey =
    builder.Configuration["Jwt:Key"] ??
    Environment.GetEnvironmentVariable("JWT_KEY");

if (string.IsNullOrWhiteSpace(jwtKey) || jwtKey.Length < 32)
{
    throw new InvalidOperationException(
        "JWT Key must be configured and contain at least 32 characters."
    );
}
builder.Configuration["Jwt:Key"] = jwtKey;
// =====================================================
// APPLICATION SERVICES
// =====================================================

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<IBudgetService, BudgetService>();
builder.Services.AddScoped<IFinancialGoalService, FinancialGoalService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// =====================================================
// SIGNALR
// =====================================================

builder.Services.AddSignalR();

// =====================================================
// CORS
// =====================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000", "http://localhost:5173", "http://localhost:8443")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// =====================================================
// JWT AUTHENTICATION
// =====================================================

builder.Services
    .AddAuthentication(
        JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)
                    ),

                ValidateIssuer = false,

                ValidateAudience = false,

                ValidateLifetime = true,

                ClockSkew = TimeSpan.Zero
            };

        // JWT cho SignalR
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken =
                    context.Request.Query["access_token"];

                var path =
                    context.HttpContext.Request.Path;

                if (!string.IsNullOrEmpty(accessToken) &&
                    path.StartsWithSegments(
                        "/hubs/notifications"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });

// =====================================================
// AUTHORIZATION
// =====================================================

builder.Services.AddAuthorization();

// =====================================================
// BUILD APPLICATION
// =====================================================

var app = builder.Build();

// SEED DATA
if (!app.Environment.IsEnvironment("Testing"))
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    await DbSeeder.SeedAsync(context);
}

// =====================================================
// MIDDLEWARE PIPELINE
// =====================================================

app.UseMiddleware<RequestTimingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// HTTPS
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// CORS
app.UseCors("ReactPolicy");

// Authentication
app.UseAuthentication();

// Authorization
app.UseAuthorization();

// =====================================================
// ENDPOINTS
// =====================================================

// Health Check
app.MapHealthChecks("/health");

// API Controllers
app.MapControllers();

// SignalR Hub
app.MapHub<NotificationHub>(
    "/hubs/notifications"
);

app.Run();

public partial class Program { }
