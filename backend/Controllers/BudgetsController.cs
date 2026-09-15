using backend.DTOs.Budget;
using backend.Extensions;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/budgets")]
[Authorize]
public class BudgetsController : ControllerBase
{
    private readonly IBudgetService _budgetService;

    public BudgetsController(
        IBudgetService budgetService)
    {
        _budgetService = budgetService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.GetUserId();

        return Ok(
            await _budgetService.GetAllAsync(userId));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = User.GetUserId();

        var budget = await _budgetService.GetByIdAsync(
            userId,
            id);

        if (budget == null)
            return NotFound();

        return Ok(budget);
    }

    [HttpGet("month")]
    public async Task<IActionResult> GetByMonth(
        int month,
        int year)
    {
        var userId = User.GetUserId();

        return Ok(
            await _budgetService.GetByMonthAsync(
                userId,
                month,
                year));
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateBudgetRequest request)
    {
        var userId = User.GetUserId();

        try
        {
            var budget = await _budgetService.CreateAsync(
                userId,
                request);

            if (budget == null)
                return BadRequest(
                    "Category does not exist or does not belong to user.");

            return Ok(budget);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateBudgetRequest request)
    {
        var userId = User.GetUserId();

        var budget = await _budgetService.UpdateAsync(
            userId,
            id,
            request);

        if (budget == null)
            return NotFound();

        return Ok(budget);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.GetUserId();

        var result = await _budgetService.DeleteAsync(
            userId,
            id);

        if (!result)
            return BadRequest(
                "Budget does not exist.");

        return Ok(new
        {
            message = "Budget deleted successfully."
        });
    }
}