namespace backend.Models;

public class Category
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Name { get; set; } = string.Empty;

    // Income / Expense
    public string Type { get; set; } = string.Empty;

    public string? Icon { get; set; }

    // Navigation
    public User? User { get; set; }

    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();

    public ICollection<Budget> Budgets { get; set; } = new List<Budget>();
}