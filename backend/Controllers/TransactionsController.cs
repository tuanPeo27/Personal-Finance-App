using backend.Extensions;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/transactions")]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(
        ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.GetUserId();

        return Ok(
            await _transactionService.GetAllAsync(userId));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = User.GetUserId();

        var transaction =
            await _transactionService.GetByIdAsync(
                userId,
                id);

        if (transaction == null)
            return NotFound();

        return Ok(transaction);
    }

    [HttpGet("type/{type}")]
    public async Task<IActionResult> GetByType(
        string type)
    {
        var userId = User.GetUserId();

        return Ok(
            await _transactionService.GetByTypeAsync(
                userId,
                type));
    }

    [HttpGet("date-range")]
    public async Task<IActionResult> GetByDateRange(
        DateTime from,
        DateTime to)
    {
        var userId = User.GetUserId();

        return Ok(
            await _transactionService.GetByDateRangeAsync(
                userId,
                from,
                to));
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        int accountId,
        int categoryId,
        decimal amount,
        string type,
        string? description,
        DateTime transactionDate)
    {
        var userId = User.GetUserId();

        var transaction =
            await _transactionService.CreateAsync(
                userId,
                accountId,
                categoryId,
                amount,
                type,
                description,
                transactionDate);

        if (transaction == null)
            return BadRequest(
                "Invalid transaction.");

        return Ok(transaction);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        int accountId,
        int categoryId,
        decimal amount,
        string type,
        string? description,
        DateTime transactionDate)
    {
        var userId = User.GetUserId();

        var transaction =
            await _transactionService.UpdateAsync(
                userId,
                id,
                accountId,
                categoryId,
                amount,
                type,
                description,
                transactionDate);

        if (transaction == null)
            return BadRequest(
                "Invalid transaction.");

        return Ok(transaction);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.GetUserId();

        var result =
            await _transactionService.DeleteAsync(
                userId,
                id);

        if (!result)
            return NotFound();

        return Ok(new
        {
            message = "Transaction deleted successfully."
        });
    }
}