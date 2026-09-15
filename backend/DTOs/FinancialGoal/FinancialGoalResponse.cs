namespace backend.DTOs.FinancialGoal;

public class FinancialGoalResponse
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal TargetAmount { get; set; }

    public decimal CurrentAmount { get; set; }

    public decimal RemainingAmount { get; set; }

    public double PercentageCompleted { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime? Deadline { get; set; }

    public DateTime CreatedAt { get; set; }
}