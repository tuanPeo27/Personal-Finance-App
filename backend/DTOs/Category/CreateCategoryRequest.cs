using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Category;

public class CreateCategoryRequest
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [RegularExpression(
        "^(Income|Expense)$",
        ErrorMessage = "Type must be Income or Expense.")]
    public string Type { get; set; } = string.Empty;

    [StringLength(50)]
    public string? Icon { get; set; }
}