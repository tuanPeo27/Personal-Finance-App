using backend.Extensions;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/accounts")]
[Authorize]
public class AccountsController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AccountsController(IAccountService accountService)
    {
        _accountService = accountService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.GetUserId();

        return Ok(
            await _accountService.GetAllAsync(userId));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = User.GetUserId();

        var account = await _accountService.GetByIdAsync(
            userId,
            id);

        if (account == null)
            return NotFound();

        return Ok(account);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        string name,
        string type,
        decimal balance)
    {
        var userId = User.GetUserId();

        var account = await _accountService.CreateAsync(
            userId,
            name,
            type,
            balance);

        return Ok(account);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        string name,
        string type)
    {
        var userId = User.GetUserId();

        var account = await _accountService.UpdateAsync(
            userId,
            id,
            name,
            type);

        if (account == null)
            return NotFound();

        return Ok(account);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.GetUserId();

        var result = await _accountService.DeleteAsync(
            userId,
            id);

        if (!result)
            return BadRequest(
                "Account does not exist or has transactions.");

        return Ok(new
        {
            message = "Account deleted successfully."
        });
    }
}