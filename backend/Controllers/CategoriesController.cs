using backend.DTOs.Category;
using backend.Extensions;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.GetUserId();

        return Ok(
            await _categoryService.GetAllAsync(userId));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = User.GetUserId();

        var category =
            await _categoryService.GetByIdAsync(
                userId,
                id);

        if (category == null)
            return NotFound();

        return Ok(category);
    }

    [HttpGet("type/{type}")]
    public async Task<IActionResult> GetByType(string type)
    {
        var userId = User.GetUserId();

        return Ok(
            await _categoryService.GetByTypeAsync(
                userId,
                type));
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateCategoryRequest request)
    {
        var userId = User.GetUserId();

        var category =
            await _categoryService.CreateAsync(
                userId,
                request);

        return Ok(category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateCategoryRequest request)
    {
        var userId = User.GetUserId();

        var category =
            await _categoryService.UpdateAsync(
                userId,
                id,
                request);

        if (category == null)
            return NotFound();

        return Ok(category);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.GetUserId();

        var result =
            await _categoryService.DeleteAsync(
                userId,
                id);

        if (!result)
            return BadRequest(
                "Category does not exist or is being used.");

        return Ok(new
        {
            message = "Category deleted successfully."
        });
    }
}