using backend.Extensions;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/financial-goals")]
[Authorize]
public class FinancialGoalsController : ControllerBase
{
    private readonly IFinancialGoalService _goalService;

    public FinancialGoalsController(
        IFinancialGoalService goalService)
    {
        _goalService = goalService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.GetUserId();

        return Ok(
            await _goalService.GetAllAsync(userId));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = User.GetUserId();

        var goal = await _goalService.GetByIdAsync(
            userId,
            id);

        if (goal == null)
            return NotFound();

        return Ok(goal);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        string name,
        decimal targetAmount,
        DateTime? deadline)
    {
        var userId = User.GetUserId();

        var goal = await _goalService.CreateAsync(
            userId,
            name,
            targetAmount,
            deadline);

        return Ok(goal);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        string name,
        decimal targetAmount,
        DateTime? deadline)
    {
        var userId = User.GetUserId();

        var goal = await _goalService.UpdateAsync(
            userId,
            id,
            name,
            targetAmount,
            deadline);

        if (goal == null)
            return NotFound();

        return Ok(goal);
    }

    [HttpPut("{id}/progress")]
    public async Task<IActionResult> UpdateProgress(
        int id,
        decimal currentAmount)
    {
        var userId = User.GetUserId();

        var goal =
            await _goalService.UpdateProgressAsync(
                userId,
                id,
                currentAmount);

        if (goal == null)
            return BadRequest(
                "Invalid goal or amount.");

        return Ok(goal);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.GetUserId();

        var result = await _goalService.DeleteAsync(
            userId,
            id);

        if (!result)
            return NotFound();

        return Ok(new
        {
            message = "Financial goal deleted successfully."
        });
    }
}