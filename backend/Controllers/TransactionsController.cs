using backend.DTOs.Transaction;
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

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.GetUserId();

        return Ok(await _transactionService.GetAllAsync(userId));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = User.GetUserId();

        var transaction = await _transactionService
            .GetByIdAsync(userId, id);

        if (transaction == null)
            return NotFound();

        return Ok(transaction);
    }

    [HttpGet("account/{accountId}")]
    public async Task<IActionResult> GetByAccount(int accountId)
    {
        var userId = User.GetUserId();

        return Ok(await _transactionService
            .GetByAccountAsync(userId, accountId));
    }

    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> GetByCategory(int categoryId)
    {
        var userId = User.GetUserId();

        return Ok(await _transactionService
            .GetByCategoryAsync(userId, categoryId));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateTransactionRequest request)
    {
        var userId = User.GetUserId();

        var transaction = await _transactionService
            .CreateAsync(userId, request);

        if (transaction == null)
            return BadRequest(
                "Account or category does not exist or does not belong to user.");

        return Ok(transaction);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateTransactionRequest request)
    {
        var userId = User.GetUserId();

        var transaction = await _transactionService
            .UpdateAsync(userId, id, request);

        if (transaction == null)
            return BadRequest(
                "Transaction, account, or category does not exist or does not belong to user.");

        return Ok(transaction);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.GetUserId();

        var result = await _transactionService
            .DeleteAsync(userId, id);

        if (!result)
            return NotFound();

        return Ok(new
        {
            message = "Transaction deleted successfully."
        });
    }
}