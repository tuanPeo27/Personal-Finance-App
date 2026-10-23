import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Dashboard from "../pages/Dashboard";
import { api, type Dashboard as DashboardSummary } from "../lib/api";

vi.mock("../lib/api", () => ({
  api: {
    dashboard: vi.fn(),
    dashboardExpenseByCategory: vi.fn(),
    dashboardMonthlyStatistics: vi.fn(),
    transactions: vi.fn(),
    budgets: vi.fn(),
    goals: vi.fn(),
  },
  fmtVND: (amount: number) => String(amount),
  getStoredUser: () => ({ id: 1, fullName: "Taylor", email: "taylor@example.test" }),
}));

vi.mock("recharts", () => {
  const Container = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  const Empty = () => null;
  return {
    AreaChart: Container,
    Area: Empty,
    BarChart: Container,
    Bar: Empty,
    PieChart: Container,
    Pie: Container,
    Cell: Empty,
    XAxis: Empty,
    YAxis: Empty,
    Tooltip: Empty,
    ResponsiveContainer: Container,
    CartesianGrid: Empty,
  };
});

describe("Dashboard", () => {
  const setPage = vi.fn();
  const toast = vi.fn();
  const summary: DashboardSummary = {
    totalBalance: 1_250,
    totalIncome: 800,
    totalExpense: 250,
    net: 550,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.dashboard).mockResolvedValue(summary);
    vi.mocked(api.dashboardExpenseByCategory).mockResolvedValue([]);
    vi.mocked(api.dashboardMonthlyStatistics).mockResolvedValue([]);
    vi.mocked(api.transactions).mockResolvedValue([{
      id: 1,
      date: "2026-10-01",
      description: "Monthly pay",
      category: "Salary",
      categoryId: 1,
      categoryIcon: "salary",
      account: "Bank",
      accountId: 1,
      type: "Income",
      amount: 800,
    }]);
    vi.mocked(api.budgets).mockResolvedValue([]);
    vi.mocked(api.goals).mockResolvedValue([]);
  });

  it("shows summary values, recent transactions and dashboard navigation", async () => {
    render(<Dashboard setPage={setPage} toast={toast} />);

    expect(await screen.findByText(/Taylor/)).toBeInTheDocument();
    expect(screen.getByText("1250")).toBeInTheDocument();
    expect(screen.getByText("Monthly pay")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Xem tất cả →" }));
    expect(setPage).toHaveBeenCalledWith("transactions");
  });
});
