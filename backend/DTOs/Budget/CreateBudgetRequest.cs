using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Budget;

public class CreateBudgetRequest
{
    [Required]
    public int CategoryId { get; set; }

    [Required]
    [Range(0.01, 10000000, ErrorMessage = "Amount must be greater than 0.")]
    public decimal Amount { get; set; }

    [Required]
    [Range(1, 12)]
    public int Month { get; set; }

    [Required]
    [Range(2000, 2100)]
    public int Year { get; set; }
}