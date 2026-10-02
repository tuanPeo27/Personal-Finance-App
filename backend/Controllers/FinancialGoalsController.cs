using backend.DTOs.FinancialGoal;
using backend.Extensions;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GoalsController : ControllerBase
{
    private readonly IFinancialGoalService _financialGoalService;

    public GoalsController(
        IFinancialGoalService financialGoalService)
    {
        _financialGoalService = financialGoalService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.GetUserId();

        return Ok(
            await _financialGoalService.GetAllAsync(userId));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = User.GetUserId();

        var goal =
            await _financialGoalService.GetByIdAsync(
                userId,
                id);

        if (goal == null)
            return NotFound();

        return Ok(goal);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateFinancialGoalRequest request)
    {
        var userId = User.GetUserId();

        try
        {
            var goal =
                await _financialGoalService.CreateAsync(
                    userId,
                    request);

            return Ok(goal);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateFinancialGoalRequest request)
    {
        var userId = User.GetUserId();

        try
        {
            var goal =
                await _financialGoalService.UpdateAsync(
                    userId,
                    id,
                    request);

            if (goal == null)
                return NotFound();

            return Ok(goal);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}/progress")]
    public async Task<IActionResult> UpdateProgress(
        int id,
        UpdateGoalProgressRequest request)
    {
        var userId = User.GetUserId();

        try
        {
            var goal =
                await _financialGoalService.UpdateProgressAsync(
                    userId,
                    id,
                    request);

            if (goal == null)
                return NotFound();

            return Ok(goal);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.GetUserId();

        var result =
            await _financialGoalService.DeleteAsync(
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