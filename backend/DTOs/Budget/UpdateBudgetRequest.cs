using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Budget;

public class UpdateBudgetRequest
{
    [Required]
    [Range(0.01, 1000000000)]
    public decimal Amount { get; set; }

    [Required]
    [Range(1, 12)]
    public int Month { get; set; }

    [Required]
    [Range(2000, 2100)]
    public int Year { get; set; }
}