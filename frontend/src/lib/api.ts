import axios, { type AxiosRequestConfig } from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5207/api";

export type Account = {
  id: number;
  name: string;
  type: string;
  balance: number;
  transactions: number;
  icon: string;
  color: string;
};

export type Category = {
  id: number;
  name: string;
  type: "Income" | "Expense";
  icon: string;
  transactions: number;
};

export type Transaction = {
  id: number;
  date: string;
  description: string;
  category: string;
  categoryId: number;
  categoryIcon: string;
  account: string;
  accountId: number;
  type: "Income" | "Expense";
  amount: number;
};

export type Budget = {
  id: number;
  categoryId: number;
  category: string;
  icon: string;
  amount: number;
  spent: number;
  month: number;
  year: number;
};

export type Goal = {
  id: number;
  name: string;
  icon: string;
  target: number;
  current: number;
  deadline: string;
  status: "active" | "completed" | "cancelled";
};

export type Dashboard = {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  net: number;
};

const iconColors: Record<string, string> = {
  Cash: "#fbbf24",
  Bank: "#7c6fcd",
  "E-Wallet": "#ff9a8b",
};

export const normalizeAccount = (account: any): Account => ({
  ...account,
  transactions: account.transactions?.length ?? account.transactionCount ?? 0,
  icon: account.icon ?? (account.type === "Bank" ? "🏦" : account.type === "E-Wallet" ? "📱" : "💵"),
  color: account.color ?? iconColors[account.type] ?? "#7c6fcd",
});

export const normalizeCategory = (category: any): Category => ({
  ...category,
  type: category.type === "Income" ? "Income" : "Expense",
  icon: category.icon ?? "💰",
  transactions: category.transactions?.length ?? category.transactionCount ?? 0,
});

export const normalizeTransaction = (transaction: any): Transaction => ({
  id: transaction.id,
  date: (transaction.transactionDate ?? "").split("T")[0],
  description: transaction.description ?? "",
  category: transaction.category?.name ?? "Không phân loại",
  categoryId: transaction.categoryId,
  categoryIcon: transaction.category?.icon ?? "💰",
  account: transaction.account?.name ?? "Không xác định",
  accountId: transaction.accountId,
  type: transaction.type === "Income" ? "Income" : "Expense",
  amount: Number(transaction.amount),
});

export const normalizeBudget = (budget: any, spent = 0): Budget => ({
  id: budget.id,
  categoryId: budget.categoryId,
  category: budget.category?.name ?? "Không phân loại",
  icon: budget.category?.icon ?? "💰",
  amount: Number(budget.amount),
  spent,
  month: budget.month,
  year: budget.year,
});

export const normalizeGoal = (goal: any): Goal => ({
  id: goal.id,
  name: goal.name,
  icon: goal.icon ?? "🎯",
  target: Number(goal.targetAmount),
  current: Number(goal.currentAmount),
  deadline: goal.deadline?.split("T")[0] ?? "",
  status: goal.status === "Completed" ? "completed" : goal.status === "Cancelled" ? "cancelled" : "active",
});

async function request<T>(path: string, options: AxiosRequestConfig = {}): Promise<T> {
  const token = localStorage.getItem("finance_token");
  try {
    const response = await axios<T>({
      baseURL: API_URL,
      url: path,
      ...options,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = typeof error.response?.data === "string"
        ? error.response.data
        : error.response?.data?.message;
      throw new Error(message || error.message || `API request failed (${error.response?.status ?? "unknown"})`);
    }

    throw error;
  }
}

const query = (params: Record<string, string | number | undefined>) => {
  const values = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => value !== undefined && values.set(key, String(value)));
  return values.toString();
};

const get = <T>(path: string) => request<T>(path);
const send = <T>(path: string, params: Record<string, string | number | undefined>, method = "POST") =>
  request<T>(path, { method, params });

export const api = {
  login: (email: string, password: string) => send<{ token: string; user: { fullName: string; email: string } }>("/auth/login", { email, password }),
  register: (fullName: string, email: string, password: string) => send<{ message: string }>("/auth/register", { fullName, email, password }),
  dashboard: (month: number, year: number) => get<Dashboard>(`/dashboard?${query({ month, year })}`),
  accounts: async () => (await get<any[]>("/accounts")).map(normalizeAccount),
  createAccount: (name: string, type: string, balance: number) => send<any>("/accounts", { name, type, balance }),
  updateAccount: (id: number, name: string, type: string) => send<any>(`/accounts/${id}`, { name, type }, "PUT"),
  deleteAccount: (id: number) => request(`/accounts/${id}`, { method: "DELETE" }),
  categories: async () => (await get<any[]>("/categories")).map(normalizeCategory),
  createCategory: (name: string, type: string, icon: string) => send<any>("/categories", { name, type, icon }),
  updateCategory: (id: number, name: string, type: string, icon: string) => send<any>(`/categories/${id}`, { name, type, icon }, "PUT"),
  deleteCategory: (id: number) => request(`/categories/${id}`, { method: "DELETE" }),
  transactions: async () => (await get<any[]>("/transactions")).map(normalizeTransaction),
  createTransaction: (params: Record<string, string | number>) => send<any>("/transactions", params),
  updateTransaction: (id: number, params: Record<string, string | number>) => send<any>(`/transactions/${id}`, params, "PUT"),
  deleteTransaction: (id: number) => request(`/transactions/${id}`, { method: "DELETE" }),
  budgets: async () => (await get<any[]>("/budgets")).map((budget) => normalizeBudget(budget)),
  budgetSpent: (id: number) => get<{ spent: number }>(`/budgets/${id}/spent`),
  createBudget: (params: Record<string, string | number>) => send<any>("/budgets", params),
  updateBudget: (id: number, amount: number) => send<any>(`/budgets/${id}`, { amount }, "PUT"),
  deleteBudget: (id: number) => request(`/budgets/${id}`, { method: "DELETE" }),
  goals: async () => (await get<any[]>("/financial-goals")).map(normalizeGoal),
  createGoal: (name: string, targetAmount: number, deadline: string) => send<any>("/financial-goals", { name, targetAmount, deadline }),
  updateGoal: (id: number, name: string, targetAmount: number, deadline: string) => send<any>(`/financial-goals/${id}`, { name, targetAmount, deadline }, "PUT"),
  updateGoalProgress: (id: number, currentAmount: number) => send<any>(`/financial-goals/${id}/progress`, { currentAmount }, "PUT"),
  deleteGoal: (id: number) => request(`/financial-goals/${id}`, { method: "DELETE" }),
};

export const fmtVND = (n: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
