using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;
using backend.DTOs.Auth;
using backend.DTOs.Budget;
using backend.DTOs.FinancialGoal;
using backend.DTOs.Transaction;

namespace FinanceApp.Tests.Integration;

[CollectionDefinition("Finance API integration", DisableParallelization = true)]
public sealed class FinanceApiCollection : ICollectionFixture<TestApplicationFixture>
{
    public const string Name = "Finance API integration";
}

[Collection(FinanceApiCollection.Name)]
public class FinanceApiIntegrationTests(TestApplicationFixture fixture)
{
    [Fact]
    public async Task Protected_endpoints_require_a_valid_bearer_token()
    {
        using var client = fixture.CreateClient();
        var routes = new[]
        {
            "/api/accounts",
            "/api/categories",
            "/api/transactions",
            "/api/budgets",
            "/api/goals",
            "/api/notifications",
            "/api/dashboard?month=10&year=2026"
        };

        foreach (var route in routes)
        {
            Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync(route)).StatusCode);
        }

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            "not-a-valid-jwt");
        Assert.Equal(
            HttpStatusCode.Unauthorized,
            (await client.GetAsync("/api/accounts")).StatusCode);
    }

    [Fact]
    public async Task Accounts_and_categories_are_persisted_and_isolated_by_user()
    {
        using var owner = fixture.CreateClient();
        using var otherUser = fixture.CreateClient();
        await RegisterAndAuthenticateAsync(owner);
        await RegisterAndAuthenticateAsync(otherUser);

        var accountResponse = await owner.PostAsJsonAsync("/api/accounts", new
        {
            name = "Daily account",
            type = "Bank",
            balance = 1_500m
        });
        Assert.Equal(HttpStatusCode.Created, accountResponse.StatusCode);
        var account = await ReadJsonAsync(accountResponse);
        var accountId = account.RootElement.GetProperty("id").GetInt32();
        Assert.Equal(HttpStatusCode.OK, (await owner.GetAsync("/api/accounts")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await otherUser.GetAsync($"/api/accounts/{accountId}")).StatusCode);

        var categoryResponse = await owner.PostAsJsonAsync("/api/categories", new
        {
            name = "Groceries",
            type = "Expense",
            icon = "basket"
        });
        Assert.Equal(HttpStatusCode.OK, categoryResponse.StatusCode);
        var category = await ReadJsonAsync(categoryResponse);
        var categoryId = category.RootElement.GetProperty("id").GetInt32();
        Assert.Equal(HttpStatusCode.OK, (await owner.GetAsync($"/api/categories/{categoryId}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await otherUser.GetAsync($"/api/categories/{categoryId}")).StatusCode);
    }

    [Fact]
    public async Task Transactions_validate_payload_and_update_account_balance_on_create_update_delete()
    {
        using var client = fixture.CreateClient();
        await RegisterAndAuthenticateAsync(client);
        var accountId = await CreateAccountAsync(client, 1_000m);
        var categoryId = await CreateCategoryAsync(client, "Food", "Expense");

        var invalidResponse = await client.PostAsJsonAsync("/api/transactions", new
        {
            accountId,
            categoryId,
            amount = 0m,
            type = "Expense",
            transactionDate = DateTime.UtcNow
        });
        Assert.Equal(HttpStatusCode.BadRequest, invalidResponse.StatusCode);

        var transactionResponse = await client.PostAsJsonAsync("/api/transactions", new
        {
            accountId,
            categoryId,
            amount = 200m,
            type = "Expense",
            description = "Market",
            transactionDate = DateTime.UtcNow
        });
        Assert.Equal(HttpStatusCode.OK, transactionResponse.StatusCode);
        var transaction = await ReadJsonAsync(transactionResponse);
        var transactionId = transaction.RootElement.GetProperty("id").GetInt32();
        Assert.Equal(800m, await GetAccountBalanceAsync(client, accountId));

        var updateResponse = await client.PutAsJsonAsync(
            $"/api/transactions/{transactionId}",
            new
            {
                accountId,
                categoryId,
                amount = 100m,
                type = "Income",
                description = "Refund",
                transactionDate = DateTime.UtcNow
            });
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);
        Assert.Equal(1_100m, await GetAccountBalanceAsync(client, accountId));

        Assert.Equal(
            HttpStatusCode.OK,
            (await client.DeleteAsync($"/api/transactions/{transactionId}")).StatusCode);
        Assert.Equal(1_000m, await GetAccountBalanceAsync(client, accountId));
    }

    [Fact]
    public async Task Budgets_report_monthly_spending_and_reject_duplicates_and_invalid_months()
    {
        using var client = fixture.CreateClient();
        await RegisterAndAuthenticateAsync(client);
        var accountId = await CreateAccountAsync(client, 2_000m);
        var categoryId = await CreateCategoryAsync(client, "Dining", "Expense");
        const int month = 10;
        const int year = 2026;
        var spendResponse = await client.PostAsJsonAsync("/api/transactions", new
        {
            accountId,
            categoryId,
            amount = 35m,
            type = "Expense",
            description = "Lunch",
            transactionDate = new DateTime(year, month, 8)
        });
        Assert.Equal(HttpStatusCode.OK, spendResponse.StatusCode);

        var budgetRequest = new CreateBudgetRequest
        {
            CategoryId = categoryId,
            Amount = 100m,
            Month = month,
            Year = year
        };
        var created = await client.PostAsJsonAsync("/api/budgets", budgetRequest);
        Assert.Equal(HttpStatusCode.OK, created.StatusCode);
        var budget = await ReadJsonAsync(created);
        Assert.Equal(35m, budget.RootElement.GetProperty("spentAmount").GetDecimal());
        Assert.Equal(65m, budget.RootElement.GetProperty("remainingAmount").GetDecimal());

        Assert.Equal(
            HttpStatusCode.Conflict,
            (await client.PostAsJsonAsync("/api/budgets", budgetRequest)).StatusCode);
        Assert.Equal(
            HttpStatusCode.BadRequest,
            (await client.PostAsJsonAsync("/api/budgets", new
            {
                categoryId,
                amount = 100m,
                month = 13,
                year
            })).StatusCode);
        Assert.Equal(
            HttpStatusCode.OK,
            (await client.GetAsync($"/api/budgets/month?month={month}&year={year}")).StatusCode);
    }

    [Fact]
    public async Task Goals_and_notifications_support_progress_and_read_state()
    {
        using var client = fixture.CreateClient();
        await RegisterAndAuthenticateAsync(client);
        var goalResponse = await client.PostAsJsonAsync("/api/goals", new CreateFinancialGoalRequest
        {
            Name = "Emergency fund",
            TargetAmount = 500m,
            CurrentAmount = 100m
        });
        Assert.Equal(HttpStatusCode.OK, goalResponse.StatusCode);
        var goal = await ReadJsonAsync(goalResponse);
        var goalId = goal.RootElement.GetProperty("id").GetInt32();

        Assert.Equal(
            HttpStatusCode.BadRequest,
            (await client.PutAsJsonAsync(
                $"/api/goals/{goalId}/progress",
                new UpdateGoalProgressRequest { CurrentAmount = 501m })).StatusCode);
        var progressResponse = await client.PutAsJsonAsync(
            $"/api/goals/{goalId}/progress",
            new UpdateGoalProgressRequest { CurrentAmount = 500m });
        Assert.Equal(HttpStatusCode.OK, progressResponse.StatusCode);
        var completedGoal = await ReadJsonAsync(progressResponse);
        Assert.Equal("Completed", completedGoal.RootElement.GetProperty("status").GetString());

        var unreadResponse = await client.GetAsync("/api/notifications/unread");
        Assert.Equal(HttpStatusCode.OK, unreadResponse.StatusCode);
        var unread = await ReadJsonAsync(unreadResponse);
        var notificationId = unread.RootElement[0].GetProperty("id").GetInt32();
        Assert.Equal(
            HttpStatusCode.OK,
            (await client.PutAsync($"/api/notifications/{notificationId}/read", null)).StatusCode);
        var afterRead = await ReadJsonAsync(await client.GetAsync("/api/notifications/unread"));
        Assert.Empty(afterRead.RootElement.EnumerateArray());
    }

    [Fact]
    public async Task Dashboard_aggregates_monthly_totals_and_expense_categories()
    {
        using var client = fixture.CreateClient();
        await RegisterAndAuthenticateAsync(client);
        var accountId = await CreateAccountAsync(client, 1_000m);
        var incomeCategoryId = await CreateCategoryAsync(client, "Salary", "Income");
        var expenseCategoryId = await CreateCategoryAsync(client, "Transport", "Expense");
        const int month = 10;
        const int year = 2026;

        Assert.Equal(HttpStatusCode.OK, (await client.PostAsJsonAsync("/api/transactions", new
        {
            accountId,
            categoryId = incomeCategoryId,
            amount = 500m,
            type = "Income",
            description = "Pay",
            transactionDate = new DateTime(year, month, 3)
        })).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await client.PostAsJsonAsync("/api/transactions", new
        {
            accountId,
            categoryId = expenseCategoryId,
            amount = 125m,
            type = "Expense",
            description = "Bus",
            transactionDate = new DateTime(year, month, 4)
        })).StatusCode);

        var response = await client.GetAsync($"/api/dashboard?month={month}&year={year}");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var summary = await ReadJsonAsync(response);
        Assert.Equal(1_375m, summary.RootElement.GetProperty("totalBalance").GetDecimal());
        Assert.Equal(500m, summary.RootElement.GetProperty("totalIncome").GetDecimal());
        Assert.Equal(125m, summary.RootElement.GetProperty("totalExpense").GetDecimal());
        Assert.Equal(375m, summary.RootElement.GetProperty("net").GetDecimal());

        var categoriesResponse = await client.GetAsync(
            $"/api/dashboard/expense-by-category?month={month}&year={year}");
        Assert.Equal(HttpStatusCode.OK, categoriesResponse.StatusCode);
        var categories = await ReadJsonAsync(categoriesResponse);
        Assert.Equal("Transport", categories.RootElement[0].GetProperty("categoryName").GetString());
    }

    private async Task<int> CreateAccountAsync(HttpClient client, decimal balance)
    {
        var response = await client.PostAsJsonAsync("/api/accounts", new
        {
            name = "Test account",
            type = "Bank",
            balance
        });
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var result = await ReadJsonAsync(response);
        return result.RootElement.GetProperty("id").GetInt32();
    }

    private async Task<int> CreateCategoryAsync(HttpClient client, string name, string type)
    {
        var response = await client.PostAsJsonAsync("/api/categories", new
        {
            name,
            type,
            icon = "test"
        });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await ReadJsonAsync(response);
        return result.RootElement.GetProperty("id").GetInt32();
    }

    private static async Task<decimal> GetAccountBalanceAsync(HttpClient client, int accountId)
    {
        var result = await ReadJsonAsync(await client.GetAsync($"/api/accounts/{accountId}"));
        return result.RootElement.GetProperty("balance").GetDecimal();
    }

    private static async Task RegisterAndAuthenticateAsync(HttpClient client)
    {
        var email = $"{Guid.NewGuid():N}@example.test";
        var registration = await client.PostAsJsonAsync("/api/auth/register", new
        {
            fullName = "Integration User",
            email,
            password = "Passw0rd!"
        });
        Assert.Equal(HttpStatusCode.Created, registration.StatusCode);

        var login = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest
        {
            Email = email,
            Password = "Passw0rd!"
        });
        Assert.Equal(HttpStatusCode.OK, login.StatusCode);
        var body = await ReadJsonAsync(login);
        var token = body.RootElement.GetProperty("token").GetString();
        Assert.True(
            new JwtSecurityTokenHandler().ReadJwtToken(token).ValidTo > DateTime.UtcNow,
            "The login response contained an expired JWT.");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            token);
    }

    private static async Task<JsonDocument> ReadJsonAsync(HttpResponseMessage response)
    {
        response.EnsureSuccessStatusCode();
        return JsonDocument.Parse(await response.Content.ReadAsStringAsync());
    }
}
