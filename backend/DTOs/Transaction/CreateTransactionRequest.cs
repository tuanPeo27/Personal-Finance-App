using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Transaction;

public class CreateTransactionRequest
{
    [Required]
    public int AccountId { get; set; }

    [Required]
    public int CategoryId { get; set; }

    [Required]
    [Range(0.01, 10000000, ErrorMessage = "Amount must be greater than 0.")]
    public decimal Amount { get; set; }

    [Required]
    [RegularExpression(
        "^(Income|Expense)$",
        ErrorMessage = "Type must be Income or Expense.")]
    public string Type { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Required]
    public DateTime TransactionDate { get; set; }
}