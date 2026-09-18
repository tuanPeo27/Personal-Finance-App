using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // ================================
        // 1. APPLY MIGRATIONS
        // ================================
        await context.Database.MigrateAsync();

        // ================================
        // 2. CHECK IF DATA ALREADY EXISTS
        // ================================
        if (await context.Users.AnyAsync())
        {
            return;
        }

        // ================================
// 3. PASSWORD HASHER
// ================================

// ================================
// 4. TEST USERS
// ================================

    var admin = new User
    {
        FullName = "Admin User",
        Email = "admin@gmail.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
        CreatedAt = DateTime.UtcNow
    };

    var user = new User
    {
        FullName = "Test User",
        Email = "user@gmail.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("User@123"),
        CreatedAt = DateTime.UtcNow
    };

    context.Users.AddRange(admin, user);

await context.SaveChangesAsync();
        // ================================
        // 5. CATEGORIES
        // ================================

        var adminCategories = new List<Category>
        {
            new Category
            {
                UserId = admin.Id,
                Name = "Salary",
                Type = "Income",
                Icon = "💰"
            },
            new Category
            {
                UserId = admin.Id,
                Name = "Food",
                Type = "Expense",
                Icon = "🍔"
            },
            new Category
            {
                UserId = admin.Id,
                Name = "Transportation",
                Type = "Expense",
                Icon = "🚗"
            },
            new Category
            {
                UserId = admin.Id,
                Name = "Entertainment",
                Type = "Expense",
                Icon = "🎮"
            },
            new Category
            {
                UserId = admin.Id,
                Name = "Shopping",
                Type = "Expense",
                Icon = "🛒"
            }
        };

        var userCategories = new List<Category>
        {
            new Category
            {
                UserId = user.Id,
                Name = "Salary",
                Type = "Income",
                Icon = "💰"
            },
            new Category
            {
                UserId = user.Id,
                Name = "Food",
                Type = "Expense",
                Icon = "🍔"
            },
            new Category
            {
                UserId = user.Id,
                Name = "Transportation",
                Type = "Expense",
                Icon = "🚗"
            },
            new Category
            {
                UserId = user.Id,
                Name = "Entertainment",
                Type = "Expense",
                Icon = "🎮"
            }
        };

        context.Categories.AddRange(
            adminCategories
                .Concat(userCategories)
        );

        await context.SaveChangesAsync();

        // ================================
        // 6. ACCOUNTS
        // ================================

        var adminBank = new Account
        {
            UserId = admin.Id,
            Name = "Main Bank",
            Type = "Bank",
            Balance = 15000000,
            CreatedAt = DateTime.UtcNow
        };

        var adminCash = new Account
        {
            UserId = admin.Id,
            Name = "Cash",
            Type = "Cash",
            Balance = 3000000,
            CreatedAt = DateTime.UtcNow
        };

        var userBank = new Account
        {
            UserId = user.Id,
            Name = "Personal Bank",
            Type = "Bank",
            Balance = 10000000,
            CreatedAt = DateTime.UtcNow
        };

        var userWallet = new Account
        {
            UserId = user.Id,
            Name = "E-Wallet",
            Type = "E-Wallet",
            Balance = 2000000,
            CreatedAt = DateTime.UtcNow
        };

        context.Accounts.AddRange(
            adminBank,
            adminCash,
            userBank,
            userWallet
        );

        await context.SaveChangesAsync();

        // ================================
        // 7. TRANSACTIONS
        // ================================

        var salaryCategory =
            adminCategories.First(x => x.Name == "Salary");

        var foodCategory =
            adminCategories.First(x => x.Name == "Food");

        var transportationCategory =
            adminCategories.First(x => x.Name == "Transportation");

        var entertainmentCategory =
            adminCategories.First(x => x.Name == "Entertainment");

        var transactions = new List<Transaction>
        {
            // Income
            new Transaction
            {
                UserId = admin.Id,
                AccountId = adminBank.Id,
                CategoryId = salaryCategory.Id,
                Amount = 20000000,
                Type = "Income",
                Description = "Monthly salary",
                TransactionDate = DateTime.UtcNow.AddDays(-10),
                CreatedAt = DateTime.UtcNow
            },

            // Food
            new Transaction
            {
                UserId = admin.Id,
                AccountId = adminBank.Id,
                CategoryId = foodCategory.Id,
                Amount = 150000,
                Type = "Expense",
                Description = "Lunch",
                TransactionDate = DateTime.UtcNow.AddDays(-5),
                CreatedAt = DateTime.UtcNow
            },

            // Transportation
            new Transaction
            {
                UserId = admin.Id,
                AccountId = adminCash.Id,
                CategoryId = transportationCategory.Id,
                Amount = 100000,
                Type = "Expense",
                Description = "Gas",
                TransactionDate = DateTime.UtcNow.AddDays(-4),
                CreatedAt = DateTime.UtcNow
            },

            // Entertainment
            new Transaction
            {
                UserId = admin.Id,
                AccountId = adminBank.Id,
                CategoryId = entertainmentCategory.Id,
                Amount = 300000,
                Type = "Expense",
                Description = "Movie",
                TransactionDate = DateTime.UtcNow.AddDays(-2),
                CreatedAt = DateTime.UtcNow
            }
        };

        context.Transactions.AddRange(transactions);

        await context.SaveChangesAsync();

        // ================================
        // 8. BUDGETS
        // ================================

        var currentMonth = DateTime.UtcNow.Month;
        var currentYear = DateTime.UtcNow.Year;

        var budgetFood = new Budget
        {
            UserId = admin.Id,
            CategoryId = foodCategory.Id,
            Amount = 3000000,
            Month = currentMonth,
            Year = currentYear,
            CreatedAt = DateTime.UtcNow
        };

        var budgetTransportation = new Budget
        {
            UserId = admin.Id,
            CategoryId = transportationCategory.Id,
            Amount = 1500000,
            Month = currentMonth,
            Year = currentYear,
            CreatedAt = DateTime.UtcNow
        };

        var budgetEntertainment = new Budget
        {
            UserId = admin.Id,
            CategoryId = entertainmentCategory.Id,
            Amount = 1000000,
            Month = currentMonth,
            Year = currentYear,
            CreatedAt = DateTime.UtcNow
        };

        context.Budgets.AddRange(
            budgetFood,
            budgetTransportation,
            budgetEntertainment
        );

        // ================================
        // 9. FINANCIAL GOALS
        // ================================

        var financialGoal = new FinancialGoal
        {
            UserId = admin.Id,
            Name = "Buy a new laptop",
            TargetAmount = 30000000,
            CurrentAmount = 12000000,
            Deadline = DateTime.UtcNow.AddMonths(6),
            Status = "Active",
            CreatedAt = DateTime.UtcNow
        };

        context.FinancialGoals.Add(financialGoal);

        // ================================
        // 10. NOTIFICATIONS
        // ================================

        var notification = new Notification
        {
            UserId = admin.Id,
            Title = "Welcome",
            Message = "Welcome to Personal Finance App!",
            Type = "System",
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        context.Notifications.Add(notification);

        // ================================
        // 11. SAVE EVERYTHING
        // ================================

        await context.SaveChangesAsync();
    }
}