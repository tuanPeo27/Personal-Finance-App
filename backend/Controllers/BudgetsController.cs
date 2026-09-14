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

    public BudgetsController(IBudgetService budgetService)
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

    [HttpGet("{id}/spent")]
    public async Task<IActionResult> GetSpent(
        int id)
    {
        var userId = User.GetUserId();

        var budget = await _budgetService.GetByIdAsync(
            userId,
            id);

        if (budget == null)
            return NotFound();

        var spent =
            await _budgetService.GetSpentAmountAsync(
                userId,
                budget.CategoryId,
                budget.Month,
                budget.Year);

        return Ok(new
        {
            budget.Amount,
            spent,
            remaining = budget.Amount - spent
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        int categoryId,
        decimal amount,
        int month,
        int year)
    {
        var userId = User.GetUserId();

        var budget = await _budgetService.CreateAsync(
            userId,
            categoryId,
            amount,
            month,
            year);

        if (budget == null)
            return BadRequest(
                "Invalid or duplicate budget.");

        return Ok(budget);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        decimal amount)
    {
        var userId = User.GetUserId();

        var budget = await _budgetService.UpdateAsync(
            userId,
            id,
            amount);

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
            return NotFound();

        return Ok(new
        {
            message = "Budget deleted successfully."
        });
    }
}