using backend.Data;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementations;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _context;

    public CategoryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Category>> GetAllAsync(int userId)
    {
        return await _context.Categories
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Category>> GetByTypeAsync(
        int userId,
        string type)
    {
        return await _context.Categories
            .Where(x =>
                x.UserId == userId &&
                x.Type == type)
            .OrderBy(x => x.Name)
            .ToListAsync();
    }

    public async Task<Category?> GetByIdAsync(
        int userId,
        int categoryId)
    {
        return await _context.Categories
            .FirstOrDefaultAsync(x =>
                x.Id == categoryId &&
                x.UserId == userId);
    }

    public async Task<Category> CreateAsync(
        int userId,
        string name,
        string type,
        string? icon)
    {
        var category = new Category
        {
            UserId = userId,
            Name = name,
            Type = type,
            Icon = icon
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return category;
    }

    public async Task<Category?> UpdateAsync(
        int userId,
        int categoryId,
        string name,
        string type,
        string? icon)
    {
        var category =
            await GetByIdAsync(userId, categoryId);

        if (category == null)
            return null;

        category.Name = name;
        category.Type = type;
        category.Icon = icon;

        await _context.SaveChangesAsync();

        return category;
    }

    public async Task<bool> DeleteAsync(
        int userId,
        int categoryId)
    {
        var category =
            await GetByIdAsync(userId, categoryId);

        if (category == null)
            return false;

        var used = await _context.Transactions
            .AnyAsync(x => x.CategoryId == categoryId);

        if (used)
            return false;

        _context.Categories.Remove(category);

        await _context.SaveChangesAsync();

        return true;
    }
}