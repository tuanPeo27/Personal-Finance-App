using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Budget> Budgets => Set<Budget>();
    public DbSet<FinancialGoal> FinancialGoals => Set<FinancialGoal>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(x => x.Email)
            .IsUnique();

        modelBuilder.Entity<Account>()
            .Property(x => x.Balance)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Transaction>()
            .Property(x => x.Amount)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Budget>()
            .Property(x => x.Amount)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<FinancialGoal>()
            .Property(x => x.TargetAmount)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<FinancialGoal>()
            .Property(x => x.CurrentAmount)
            .HasColumnType("decimal(18,2)");

        // User -> Accounts
        modelBuilder.Entity<Account>()
            .HasOne(x => x.User)
            .WithMany(x => x.Accounts)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // User -> Categories
        modelBuilder.Entity<Category>()
            .HasOne(x => x.User)
            .WithMany(x => x.Categories)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // User -> Transactions
        modelBuilder.Entity<Transaction>()
            .HasOne(x => x.User)
            .WithMany(x => x.Transactions)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Account -> Transactions
        modelBuilder.Entity<Transaction>()
            .HasOne(x => x.Account)
            .WithMany(x => x.Transactions)
            .HasForeignKey(x => x.AccountId)
            .OnDelete(DeleteBehavior.Restrict);

        // Category -> Transactions
        modelBuilder.Entity<Transaction>()
            .HasOne(x => x.Category)
            .WithMany(x => x.Transactions)
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // User -> Budgets
        modelBuilder.Entity<Budget>()
            .HasOne(x => x.User)
            .WithMany(x => x.Budgets)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Category -> Budgets
        modelBuilder.Entity<Budget>()
            .HasOne(x => x.Category)
            .WithMany(x => x.Budgets)
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // User -> FinancialGoals
        modelBuilder.Entity<FinancialGoal>()
            .HasOne(x => x.User)
            .WithMany(x => x.FinancialGoals)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // User -> Notifications
        modelBuilder.Entity<Notification>()
            .Property(x => x.Title)
            .HasMaxLength(150);

        modelBuilder.Entity<Notification>()
            .Property(x => x.Message)
            .HasMaxLength(500);

        modelBuilder.Entity<Notification>()
            .Property(x => x.Type)
            .HasMaxLength(50);

        modelBuilder.Entity<Notification>()
            .HasOne(x => x.User)
            .WithMany(x => x.Notifications)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}