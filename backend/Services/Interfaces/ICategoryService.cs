using backend.Models;

namespace backend.Services.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<Category>> GetAllAsync(int userId);

    Task<IEnumerable<Category>> GetByTypeAsync(
        int userId,
        string type);

    Task<Category?> GetByIdAsync(
        int userId,
        int categoryId);

    Task<Category> CreateAsync(
        int userId,
        string name,
        string type,
        string? icon);

    Task<Category?> UpdateAsync(
        int userId,
        int categoryId,
        string name,
        string type,
        string? icon);

    Task<bool> DeleteAsync(
        int userId,
        int categoryId);
}