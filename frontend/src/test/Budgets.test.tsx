import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Budgets from "../pages/Budgets";
import { api, type Budget } from "../lib/api";

vi.mock("../lib/api", () => ({
  api: {
    budgets: vi.fn(),
    categories: vi.fn(),
    createBudget: vi.fn(),
    updateBudget: vi.fn(),
    deleteBudget: vi.fn(),
  },
  fmtVND: (amount: number) => String(amount),
}));

describe("Budgets form", () => {
  const toast = vi.fn();
  const createdBudget: Budget = {
    id: 4,
    categoryId: 3,
    category: "Food",
    icon: "food",
    amount: 900,
    spent: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.budgets).mockResolvedValueOnce([]).mockResolvedValue([createdBudget]);
    vi.mocked(api.categories).mockResolvedValue([{
      id: 3, name: "Food", type: "Expense", icon: "food", transactions: 0,
    }]);
    vi.mocked(api.createBudget).mockResolvedValue(createdBudget);
  });

  it("creates a budget and displays the refreshed budget", async () => {
    render(<Budgets toast={toast} />);
    fireEvent.click(await screen.findByRole("button", { name: "+ Thêm ngân sách" }));
    fireEvent.change(screen.getByPlaceholderText("0"), { target: { value: "900" } });
    fireEvent.click(screen.getByRole("button", { name: "Lưu" }));

    await screen.findByText("Food");
    expect(api.createBudget).toHaveBeenCalledWith(expect.objectContaining({
      categoryId: 3,
      amount: 900,
      month: createdBudget.month,
      year: createdBudget.year,
    }));
    expect(toast).toHaveBeenCalledWith("Đã tạo ngân sách mới! 📊");
  });

  it("rejects a duplicate category and month in the form", async () => {
    vi.mocked(api.budgets).mockReset();
    vi.mocked(api.budgets).mockResolvedValue([createdBudget]);
    render(<Budgets toast={toast} />);
    fireEvent.click(await screen.findByRole("button", { name: "+ Thêm ngân sách" }));
    fireEvent.change(screen.getByPlaceholderText("0"), { target: { value: "900" } });
    fireEvent.click(screen.getByRole("button", { name: "Lưu" }));

    await waitFor(() => expect(toast).toHaveBeenCalledWith(
      "Đã có ngân sách cho danh mục này tháng này!",
      "error",
    ));
    expect(api.createBudget).not.toHaveBeenCalled();
  });
});
