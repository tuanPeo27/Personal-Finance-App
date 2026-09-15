using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.FinancialGoal;

public class UpdateGoalProgressRequest
{
    [Range(0, 1000000000)]
    public decimal CurrentAmount { get; set; }
}