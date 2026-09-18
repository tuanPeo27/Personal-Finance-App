using backend.Data;
using backend.DTOs.Category;
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

    public async Task<IEnumerable<CategoryResponse>> GetAllAsync(
        int userId)
    {
        return await _context.Categories
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.Name)
            .Select(x => new CategoryResponse
            {
                Id = x.Id,
                Name = x.Name,
                Type = x.Type,
                Icon = x.Icon,
                TransactionCount = x.Transactions.Count()
            })
            .ToListAsync();
    }

    public async Task<CategoryResponse?> GetByIdAsync(
        int userId,
        int categoryId)
    {
        return await _context.Categories
            .Where(x =>
                x.Id == categoryId &&
                x.UserId == userId)
            .Select(x => new CategoryResponse
            {
                Id = x.Id,
                Name = x.Name,
                Type = x.Type,
                Icon = x.Icon,
                TransactionCount = x.Transactions.Count()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<CategoryResponse>> GetByTypeAsync(
        int userId,
        string type)
    {
        return await _context.Categories
            .Where(x =>
                x.UserId == userId &&
                x.Type == type)
            .OrderBy(x => x.Name)
            .Select(x => new CategoryResponse
            {
                Id = x.Id,
                Name = x.Name,
                Type = x.Type,
                Icon = x.Icon,
                TransactionCount = x.Transactions.Count()
            })
            .ToListAsync();
    }

    public async Task<CategoryResponse> CreateAsync(
        int userId,
        CreateCategoryRequest request)
    {
        var category = new Category
        {
            UserId = userId,
            Name = request.Name,
            Type = request.Type,
            Icon = request.Icon
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return new CategoryResponse
        {
            Id = category.Id,
            Name = category.Name,
            Type = category.Type,
            Icon = category.Icon,
            TransactionCount = 0
        };
    }

    public async Task<CategoryResponse?> UpdateAsync(
        int userId,
        int categoryId,
        UpdateCategoryRequest request)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(x =>
                x.Id == categoryId &&
                x.UserId == userId);

        if (category == null)
            return null;

        category.Name = request.Name;
        category.Type = request.Type;
        category.Icon = request.Icon;

        await _context.SaveChangesAsync();
        var transactionCount = await _context.Transactions
            .CountAsync(x => x.CategoryId == category.Id && x.UserId == userId);

        return new CategoryResponse
        {
            Id = category.Id,
            Name = category.Name,
            Type = category.Type,
            Icon = category.Icon,
            TransactionCount = transactionCount
        };
    }

    public async Task<bool> DeleteAsync(
        int userId,
        int categoryId)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(x =>
                x.Id == categoryId &&
                x.UserId == userId);

        if (category == null)
            return false;

        var usedInTransactions = await _context.Transactions
            .AnyAsync(x =>
                x.CategoryId == categoryId &&
                x.UserId == userId);

        var usedInBudgets = await _context.Budgets
            .AnyAsync(x =>
                x.CategoryId == categoryId &&
                x.UserId == userId);

        if (usedInTransactions || usedInBudgets)
            return false;

        _context.Categories.Remove(category);

        await _context.SaveChangesAsync();

        return true;
    }
}