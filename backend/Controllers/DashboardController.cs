using backend.Extensions;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(
        IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboard(
        int month,
        int year)
    {
        var userId = User.GetUserId();

        var balance =
            await _dashboardService.GetTotalBalanceAsync(
                userId);

        var income =
            await _dashboardService.GetTotalIncomeAsync(
                userId,
                month,
                year);

        var expense =
            await _dashboardService.GetTotalExpenseAsync(
                userId,
                month,
                year);

        return Ok(new
        {
            totalBalance = balance,
            totalIncome = income,
            totalExpense = expense,
            net = income - expense
        });
    }

    [HttpGet("income")]
    public async Task<IActionResult> GetIncome(
        int month,
        int year)
    {
        var userId = User.GetUserId();

        return Ok(
            await _dashboardService.GetTotalIncomeAsync(
                userId,
                month,
                year));
    }

    [HttpGet("expense")]
    public async Task<IActionResult> GetExpense(
        int month,
        int year)
    {
        var userId = User.GetUserId();

        return Ok(
            await _dashboardService.GetTotalExpenseAsync(
                userId,
                month,
                year));
    }

    [HttpGet("expense-by-category")]
    public async Task<IActionResult> GetExpenseByCategory(
        int month,
        int year)
    {
        var userId = User.GetUserId();

        return Ok(
            await _dashboardService
                .GetExpenseByCategoryAsync(
                    userId,
                    month,
                    year));
    }

    [HttpGet("monthly-statistics")]
    public async Task<IActionResult> GetMonthlyStatistics(
        int year)
    {
        var userId = User.GetUserId();

        return Ok(
            await _dashboardService
                .GetMonthlyStatisticsAsync(
                    userId,
                    year));
    }
}