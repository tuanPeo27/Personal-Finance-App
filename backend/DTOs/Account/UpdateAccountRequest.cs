using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Account;

public class UpdateAccountRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Type { get; set; } = string.Empty;
}