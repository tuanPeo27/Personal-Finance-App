using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.FinancialGoal;

public class UpdateFinancialGoalRequest
{
    [Required]
    [StringLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Range(0.01, 1000000000)]
    public decimal TargetAmount { get; set; }

    public DateTime? Deadline { get; set; }
}