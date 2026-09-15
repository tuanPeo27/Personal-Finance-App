import axios, { type AxiosRequestConfig } from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5207/api";

// =====================================================
// TYPES
// =====================================================

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

export type AuthResponse = {
  token: string;
  expiresAt: string;
  userId: number;
  fullName: string;
  email: string;
};

export type StoredUser = {
  id: number;
  fullName: string;
  email: string;
};

export const getStoredUser = (): StoredUser | null => {
  const value = localStorage.getItem("finance_user");

  if (!value) return null;

  try {
    return JSON.parse(value) as StoredUser;
  } catch {
    return null;
  }
};

export type Notification = {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

export type MessageResponse = {
  message: string;
};

// =====================================================
// ICON / COLOR
// =====================================================

const iconColors: Record<string, string> = {
  Cash: "#fbbf24",
  Bank: "#7c6fcd",
  "E-Wallet": "#ff9a8b",
};

// =====================================================
// NORMALIZE ACCOUNT
// =====================================================

export const normalizeAccount = (account: any): Account => ({
  ...account,

  transactions:
    account.transactions?.length ??
    account.transactionCount ??
    0,

  icon:
    account.icon ??
    (
      account.type === "Bank"
        ? "🏦"
        : account.type === "E-Wallet"
          ? "📱"
          : "💵"
    ),

  color:
    account.color ??
    iconColors[account.type] ??
    "#7c6fcd",
});

// =====================================================
// NORMALIZE CATEGORY
// =====================================================

export const normalizeCategory = (category: any): Category => ({
  ...category,

  type:
    category.type === "Income"
      ? "Income"
      : "Expense",

  icon:
    category.icon ??
    "💰",

  transactions:
    category.transactions?.length ??
    category.transactionCount ??
    0,
});

// =====================================================
// NORMALIZE TRANSACTION
// =====================================================

export const normalizeTransaction = (
  transaction: any
): Transaction => ({
  id: transaction.id,

  date:
    (transaction.transactionDate ?? "")
      .split("T")[0],

  description:
    transaction.description ?? "",

  category:
    transaction.category?.name ??
    "Không phân loại",

  categoryId:
    transaction.categoryId,

  categoryIcon:
    transaction.category?.icon ??
    "💰",

  account:
    transaction.account?.name ??
    "Không xác định",

  accountId:
    transaction.accountId,

  type:
    transaction.type === "Income"
      ? "Income"
      : "Expense",

  amount:
    Number(transaction.amount),
});

// =====================================================
// NORMALIZE BUDGET
// =====================================================

export const normalizeBudget = (
  budget: any,
  spent = 0
): Budget => ({
  id: budget.id,

  categoryId:
    budget.categoryId,

  category:
    budget.category?.name ??
    budget.categoryName ??
    "Không phân loại",

  icon:
    budget.category?.icon ??
    budget.categoryIcon ??
    "💰",

  amount:
    Number(budget.amount),

  spent: Number(budget.spentAmount ?? spent),

  month:
    budget.month,

  year:
    budget.year,
});

// =====================================================
// NORMALIZE GOAL
// =====================================================

export const normalizeGoal = (
  goal: any
): Goal => ({
  id: goal.id,

  name:
    goal.name,

  icon:
    goal.icon ??
    "🎯",

  target:
    Number(goal.targetAmount),

  current:
    Number(goal.currentAmount),

  deadline:
    goal.deadline?.split("T")[0] ??
    "",

  status:
    goal.status === "Completed"
      ? "completed"
      : goal.status === "Cancelled"
        ? "cancelled"
        : "active",
});

// =====================================================
// BASE REQUEST
// =====================================================

async function request<T>(
  path: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  const token =
    localStorage.getItem("finance_token");

  try {
    const response = await axios<T>({
      baseURL: API_URL,
      url: path,

      ...options,

      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...(options.headers ?? {}),
      },
    });

    return response.data;

  } catch (error) {

    if (axios.isAxiosError(error)) {

      const responseData =
        error.response?.data;

      const message =
        typeof responseData === "string"
          ? responseData
          : responseData?.message;

      throw new Error(
        message ||
        error.message ||
        `API request failed (${error.response?.status ?? "unknown"})`
      );
    }

    throw error;
  }
}

// =====================================================
// QUERY HELPER
// Chỉ sử dụng cho GET filter/search.
// KHÔNG sử dụng cho password hoặc dữ liệu nhạy cảm.
// =====================================================

const query = (
  params: Record<
    string,
    string | number | undefined
  >
) => {
  const values =
    new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {

      if (value !== undefined) {
        values.set(
          key,
          String(value)
        );
      }

    }
  );

  return values.toString();
};

// =====================================================
// HTTP HELPERS
// =====================================================

// GET
const get = <T>(
  path: string
) =>
  request<T>(
    path,
    {
      method: "GET",
    }
  );

// POST
const post = <T>(
  path: string,
  data?: unknown
) =>
  request<T>(
    path,
    {
      method: "POST",
      data,
    }
  );

// PUT
const put = <T>(
  path: string,
  data?: unknown
) =>
  request<T>(
    path,
    {
      method: "PUT",
      data,
    }
  );

// DELETE
const remove = <T>(
  path: string
) =>
  request<T>(
    path,
    {
      method: "DELETE",
    }
  );

// =====================================================
// API
// =====================================================

export const api = {

  // ===================================================
  // AUTH
  // ===================================================

  login: (
    email: string,
    password: string
  ) =>
    post<AuthResponse>(
      "/auth/login",
      {
        email,
        password,
      }
    ),

  register: (
    fullName: string,
    email: string,
    password: string
  ) =>
    post<MessageResponse>(
      "/auth/register",
      {
        fullName,
        email,
        password,
      }
    ),

  // ===================================================
  // DASHBOARD
  // ===================================================

  dashboard: (
    month: number,
    year: number
  ) =>
    get<Dashboard>(
      `/dashboard?${query({
        month,
        year,
      })}`
    ),

  // ===================================================
  // ACCOUNTS
  // ===================================================

  accounts: async () => {

    const data =
      await get<any[]>(
        "/account"
      );

    return data.map(
      normalizeAccount
    );
  },

  createAccount: (
    name: string,
    type: string,
    balance: number
  ) =>
    post<any>(
      "/account",
      {
        name,
        type,
        balance,
      }
    ),

  updateAccount: (
    id: number,
    name: string,
    type: string
  ) =>
    put<any>(
      `/account/${id}`,
      {
        name,
        type,
      }
    ),

  deleteAccount: (
    id: number
  ) =>
    remove(
      `/account/${id}`
    ),

  // ===================================================
  // NOTIFICATIONS
  // ===================================================

  notifications: () =>
    get<Notification[]>(
      "/notifications"
    ),

  unreadNotifications: () =>
    get<Notification[]>(
      "/notifications/unread"
    ),

  markNotificationRead: (id: number) =>
    put<MessageResponse>(
      `/notifications/${id}/read`
    ),

  markAllNotificationsRead: () =>
    put<MessageResponse>(
      "/notifications/read-all"
    ),

  deleteNotification: (id: number) =>
    remove<MessageResponse>(
      `/notifications/${id}`
    ),

  // ===================================================
  // CATEGORIES
  // ===================================================

  categories: async () => {

    const data =
      await get<any[]>(
        "/categories"
      );

    return data.map(
      normalizeCategory
    );
  },

  createCategory: (
    name: string,
    type: string,
    icon: string
  ) =>
    post<any>(
      "/categories",
      {
        name,
        type,
        icon,
      }
    ),

  updateCategory: (
    id: number,
    name: string,
    type: string,
    icon: string
  ) =>
    put<any>(
      `/categories/${id}`,
      {
        name,
        type,
        icon,
      }
    ),

  deleteCategory: (
    id: number
  ) =>
    remove(
      `/categories/${id}`
    ),

  // ===================================================
  // TRANSACTIONS
  // ===================================================

  transactions: async () => {

    const data =
      await get<any[]>(
        "/transactions"
      );

    return data.map(
      normalizeTransaction
    );
  },

  createTransaction: (
    data: Record<
      string,
      string | number
    >
  ) =>
    post<any>(
      "/transactions",
      data
    ),

  updateTransaction: (
    id: number,
    data: Record<
      string,
      string | number
    >
  ) =>
    put<any>(
      `/transactions/${id}`,
      data
    ),

  deleteTransaction: (
    id: number
  ) =>
    remove(
      `/transactions/${id}`
    ),

  // ===================================================
  // BUDGETS
  // ===================================================

  budgets: async () => {

    const data =
      await get<any[]>(
        "/budgets"
      );

    return data.map(
      (budget) =>
        normalizeBudget(
          budget
        )
    );
  },

  createBudget: (
    data: Record<
      string,
      string | number
    >
  ) =>
    post<any>(
      "/budgets",
      data
    ),

  updateBudget: (
    id: number,
    amount: number
  ) =>
    put<any>(
      `/budgets/${id}`,
      {
        amount,
      }
    ),

  deleteBudget: (
    id: number
  ) =>
    remove(
      `/budgets/${id}`
    ),

  // ===================================================
  // FINANCIAL GOALS
  // ===================================================

  goals: async () => {

    const data =
      await get<any[]>(
        "/financial-goals"
      );

    return data.map(
      normalizeGoal
    );
  },

  createGoal: (
    name: string,
    targetAmount: number,
    deadline: string
  ) =>
    post<any>(
      "/financial-goals",
      {
        name,
        targetAmount,
        deadline,
      }
    ),

  updateGoal: (
    id: number,
    name: string,
    targetAmount: number,
    deadline: string
  ) =>
    put<any>(
      `/financial-goals/${id}`,
      {
        name,
        targetAmount,
        deadline,
      }
    ),

  updateGoalProgress: (
    id: number,
    currentAmount: number
  ) =>
    put<any>(
      `/financial-goals/${id}/progress`,
      {
        currentAmount,
      }
    ),

  deleteGoal: (
    id: number
  ) =>
    remove(
      `/financial-goals/${id}`
    ),
};

// =====================================================
// FORMAT VND
// =====================================================

export const fmtVND = (
  n: number
) =>
  new Intl.NumberFormat(
    "vi-VN",
    {
      style: "currency",
      currency: "VND",
    }
  ).format(n);