namespace backend.DTOs.Account;

public class AccountResponse
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Type { get; set; } = string.Empty;

    public decimal Balance { get; set; }

    public int TransactionCount { get; set; }

    public DateTime CreatedAt { get; set; }
}