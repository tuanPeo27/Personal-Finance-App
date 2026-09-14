using backend.DTOs.Account;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AccountController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AccountController(
        IAccountService accountService)
    {
        _accountService = accountService;
    }

    private int GetUserId()
    {
        return int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );
    }

    // GET: api/account
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();

        var accounts = await _accountService
            .GetAllAsync(userId);

        return Ok(accounts);
    }

    // GET: api/account/1
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = GetUserId();

        var account = await _accountService
            .GetByIdAsync(userId, id);

        if (account == null)
            return NotFound(new
            {
                message = "Account not found."
            });

        return Ok(account);
    }

    // POST: api/account
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateAccountRequest request)
    {
        var userId = GetUserId();

        var account = await _accountService
            .CreateAsync(userId, request);

        return CreatedAtAction(
            nameof(GetById),
            new { id = account.Id },
            account
        );
    }

    // PUT: api/account/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateAccountRequest request)
    {
        var userId = GetUserId();

        var account = await _accountService
            .UpdateAsync(userId, id, request);

        if (account == null)
            return NotFound(new
            {
                message = "Account not found."
            });

        return Ok(account);
    }

    // DELETE: api/account/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();

        var deleted = await _accountService
            .DeleteAsync(userId, id);

        if (!deleted)
            return NotFound(new
            {
                message = "Account not found."
            });

        return NoContent();
    }
}