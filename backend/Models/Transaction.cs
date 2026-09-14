namespace backend.Models;

public class Transaction
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int AccountId { get; set; }

    public int CategoryId { get; set; }

    public decimal Amount { get; set; }

    // Income / Expense
    public string Type { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime TransactionDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User? User { get; set; }

    public Account? Account { get; set; }

    public Category? Category { get; set; }
}