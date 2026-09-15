using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Budget;

public class UpdateBudgetRequest
{
    [Required]
    [Range(0.01, 1000000000)]
    public decimal Amount { get; set; }
}