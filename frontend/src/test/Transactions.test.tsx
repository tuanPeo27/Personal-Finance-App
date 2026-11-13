import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Transactions from "../pages/Transactions";
import { api, type Transaction } from "../lib/api";

vi.mock("../lib/api", () => ({
  api: {
    transactions: vi.fn(),
    accounts: vi.fn(),
    categories: vi.fn(),
    createTransaction: vi.fn(),
    updateTransaction: vi.fn(),
    deleteTransaction: vi.fn(),
  },
  fmtVND: (amount: number) => String(amount),
}));

describe("Transactions form", () => {
  const toast = vi.fn();
  const savedTransaction: Transaction = {
    id: 10,
    date: "2026-10-10",
    description: "Groceries",
    category: "Food",
    categoryId: 2,
    categoryIcon: "food",
    account: "Daily",
    accountId: 1,
    type: "Expense",
    amount: 75,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.transactions).mockResolvedValueOnce([]).mockResolvedValue([savedTransaction]);
    vi.mocked(api.accounts).mockResolvedValue([{
      id: 1, name: "Daily", type: "Bank", balance: 500, transactions: 0, icon: "bank", color: "blue",
    }]);
    vi.mocked(api.categories).mockResolvedValue([{
      id: 2, name: "Food", type: "Expense", icon: "food", transactions: 0,
    }]);
    vi.mocked(api.createTransaction).mockResolvedValue(savedTransaction);
  });

  it("creates a transaction and refreshes the list", async () => {
    render(<Transactions toast={toast} />);
    fireEvent.click(await screen.findByRole("button", { name: "+ Thêm giao dịch" }));
    fireEvent.change(screen.getByPlaceholderText("0"), { target: { value: "75" } });
    fireEvent.change(screen.getByPlaceholderText("VD: Ăn trưa"), { target: { value: "Groceries" } });
    fireEvent.click(screen.getByRole("button", { name: "Lưu" }));

    await screen.findByText("Groceries");
    expect(api.createTransaction).toHaveBeenCalledWith(expect.objectContaining({
      accountId: 1,
      categoryId: 2,
      amount: 75,
      type: "Expense",
      description: "Groceries",
    }));
    expect(toast).toHaveBeenCalledWith("Thêm giao dịch thành công! ✨");
  });

  it("requires an amount and description before saving", async () => {
    render(<Transactions toast={toast} />);
    fireEvent.click(await screen.findByRole("button", { name: "+ Thêm giao dịch" }));
    fireEvent.click(screen.getByRole("button", { name: "Lưu" }));

    await waitFor(() => expect(toast).toHaveBeenCalledWith(
      "Vui lòng nhập đầy đủ thông tin!",
      "error",
    ));
    expect(api.createTransaction).not.toHaveBeenCalled();
  });
});
