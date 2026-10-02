import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import type { Page } from "../App";
import {
  api,
  fmtVND,
  getStoredUser,
  type Budget,
  type Dashboard as DashboardSummary,
  type DashboardExpenseCategory,
  type DashboardMonthlyStatistic,
  type Goal,
  type Transaction,
} from "../lib/api";

interface Props {
  setPage: (p: Page) => void;
  toast: (msg: string, t?: "success" | "error" | "warning") => void;
}

const chartColors = ["#7c6fcd", "#4ecdc4", "#ff9a8b", "#818cf8", "#fbbf24", "#94a3b8"];
const fmtM = (value: number) => `${(value / 1000000).toFixed(0)}tr`;

export default function Dashboard({ setPage, toast }: Props) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<DashboardExpenseCategory[]>([]);
  const [monthlyStatistics, setMonthlyStatistics] = useState<DashboardMonthlyStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const user = getStoredUser();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      api.dashboard(month, year),
      api.dashboardExpenseByCategory(month, year),
      api.dashboardMonthlyStatistics(year),
      api.transactions(),
      api.budgets(),
      api.goals(),
    ])
      .then(([summaryResult, categoriesResult, statisticsResult, transactionsResult, budgetsResult, goalsResult]) => {
        if (!active) return;

        if (summaryResult.status === "fulfilled") setSummary(summaryResult.value);
        if (categoriesResult.status === "fulfilled") setExpenseCategories(categoriesResult.value);
        if (statisticsResult.status === "fulfilled") setMonthlyStatistics(statisticsResult.value);
        if (transactionsResult.status === "fulfilled") setTransactions(transactionsResult.value);
        if (budgetsResult.status === "fulfilled") setBudgets(budgetsResult.value);
        if (goalsResult.status === "fulfilled") setGoals(goalsResult.value);

        const firstError = [summaryResult, categoriesResult, statisticsResult, transactionsResult, budgetsResult, goalsResult]
          .find((result) => result.status === "rejected");

        if (firstError?.status === "rejected") {
          const message = firstError.reason instanceof Error ? firstError.reason.message : "Không thể tải dữ liệu tổng quan!";
          toast(message, "error");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [month, year, toast]);

  if (loading) {
    return <div className="bg-white rounded-2xl p-10 text-center text-sm text-[#6b7280] border border-[#e8e4f5]">Đang tải tổng quan...</div>;
  }

  const monthlyData = Array.from({ length: 12 }, (_, index) => {
    const monthNumber = index + 1;
    const stats = monthlyStatistics.filter((item) => item.month === monthNumber);
    const income = stats.find((item) => item.type === "Income")?.amount ?? 0;
    const expense = stats.find((item) => item.type === "Expense")?.amount ?? 0;
    return { month: `T${monthNumber}`, income, expense, cashFlow: income - expense };
  });

  let accumulated = 0;
  const cashFlowChart = monthlyData.map((item) => {
    accumulated += item.cashFlow;
    return { ...item, accumulated };
  });

  const pieData = expenseCategories.map((item, index) => ({
    name: item.categoryName,
    value: item.amount,
    color: chartColors[index % chartColors.length],
  }));
  const currentBudgets = budgets.filter((budget) => budget.month === month && budget.year === year).slice(0, 3);
  const activeGoals = goals.filter((goal) => goal.status === "active").slice(0, 3);
  const summaryCards = [
    { label: "Tổng số dư", value: summary?.totalBalance ?? 0, icon: "💎", color: "from-[#7c6fcd] to-[#5a4fb5]" },
    { label: "Tổng thu nhập", value: summary?.totalIncome ?? 0, icon: "📈", color: "from-[#10b981] to-[#059669]" },
    { label: "Tổng chi tiêu", value: summary?.totalExpense ?? 0, icon: "📉", color: "from-[#f87171] to-[#ef4444]" },
    { label: "Tiết kiệm", value: summary?.net ?? 0, icon: "🏆", color: "from-[#fbbf24] to-[#f59e0b]" },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h2 className="font-display font-900 text-2xl text-[#1e1b4b]">{greeting}, {user?.fullName ?? "bạn"}! 👋</h2>
        <p className="text-[#6b7280] text-sm">Đây là tổng quan tài chính của bạn hôm nay.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-2xl p-4 shadow-md`}>
            <div className="flex items-center justify-between mb-3"><span className="text-xs font-700 text-white/80 uppercase tracking-wide">{card.label}</span><span className="text-xl">{card.icon}</span></div>
            <p className="font-display font-900 text-white text-lg leading-tight">{fmtVND(card.value)}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-[#e8e4f5]">
          <h3 className="font-display font-800 text-base text-[#1e1b4b] mb-4">Dòng tiền tích lũy trong năm</h3>
          {monthlyStatistics.length === 0 ? <p className="text-sm text-[#9ca3af] text-center py-8">Chưa có giao dịch trong năm nay</p> : <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={cashFlowChart}>
              <defs><linearGradient id="cashFlowGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7c6fcd" stopOpacity={0.3} /><stop offset="95%" stopColor="#7c6fcd" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0eef9" /><XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} /><YAxis tickFormatter={fmtM} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => [fmtVND(Number(value)), "Dòng tiền"]} contentStyle={{ borderRadius: 12, border: "1px solid #e8e4f5", fontSize: 12 }} /><Area type="monotone" dataKey="accumulated" stroke="#7c6fcd" strokeWidth={2.5} fill="url(#cashFlowGrad)" dot={{ fill: "#7c6fcd", r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8e4f5]">
          <h3 className="font-display font-800 text-base text-[#1e1b4b] mb-4">Chi tiêu theo danh mục</h3>
          {pieData.length === 0 ? <p className="text-sm text-[#9ca3af] text-center py-8">Chưa có chi tiêu trong tháng này</p> : <>
            <ResponsiveContainer width="100%" height={120}><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" onMouseEnter={(_, index) => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>{pieData.map((item, index) => <Cell key={item.name} fill={item.color} opacity={activeIndex === null || activeIndex === index ? 1 : 0.5} />)}</Pie><Tooltip formatter={(value) => [fmtVND(Number(value)), "Chi tiêu"]} contentStyle={{ borderRadius: 12, border: "1px solid #e8e4f5", fontSize: 11 }} /></PieChart></ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-3">{pieData.map((item) => <div key={item.name} className="flex items-center gap-1.5 text-xs text-[#6b7280]"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />{item.name}</div>)}</div>
          </>}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8e4f5]">
        <h3 className="font-display font-800 text-base text-[#1e1b4b] mb-4">Thu nhập vs Chi tiêu</h3>
        {monthlyStatistics.length === 0 ? <p className="text-sm text-[#9ca3af] text-center py-8">Chưa có dữ liệu thu chi trong năm nay</p> : <ResponsiveContainer width="100%" height={160}><BarChart data={monthlyData} barGap={4}><CartesianGrid strokeDasharray="3 3" stroke="#f0eef9" vertical={false} /><XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} /><YAxis tickFormatter={fmtM} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} /><Tooltip formatter={(value) => fmtVND(Number(value))} contentStyle={{ borderRadius: 12, border: "1px solid #e8e4f5", fontSize: 12 }} /><Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} name="Thu nhập" /><Bar dataKey="expense" fill="#f87171" radius={[6, 6, 0, 0]} name="Chi tiêu" /></BarChart></ResponsiveContainer>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-[#e8e4f5]"><div className="flex items-center justify-between mb-4"><h3 className="font-display font-800 text-base text-[#1e1b4b]">Giao dịch gần đây</h3><button onClick={() => setPage("transactions")} className="text-xs font-700 text-[#7c6fcd] hover:underline">Xem tất cả →</button></div><div className="space-y-3">{transactions.length === 0 ? <p className="text-sm text-[#9ca3af] text-center py-8">Chưa có giao dịch nào</p> : transactions.slice(0, 5).map((transaction) => <div key={transaction.id} className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-[#faf8ff] flex items-center justify-center text-base flex-shrink-0">{transaction.categoryIcon}</div><div className="flex-1 min-w-0"><p className="text-sm font-600 text-[#1e1b4b] truncate">{transaction.description}</p><p className="text-xs text-[#6b7280]">{transaction.account} · {transaction.date}</p></div><span className={`text-sm font-800 ${transaction.type === "Income" ? "text-[#10b981]" : "text-[#f87171]"}`}>{transaction.type === "Income" ? "+" : "-"}{fmtVND(transaction.amount)}</span></div>)}</div></div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8e4f5]"><div className="flex items-center justify-between mb-3"><h3 className="font-display font-800 text-sm text-[#1e1b4b]">Ngân sách tháng này</h3><button onClick={() => setPage("budgets")} className="text-xs font-700 text-[#7c6fcd] hover:underline">Xem thêm</button></div><div className="space-y-3">{currentBudgets.length === 0 ? <p className="text-sm text-[#9ca3af] text-center py-4">Chưa có ngân sách tháng này</p> : currentBudgets.map((budget) => { const percent = Math.min((budget.spent / budget.amount) * 100, 100); const over = budget.spent > budget.amount; return <div key={budget.id}><div className="flex items-center justify-between text-xs mb-1"><span className="font-600 text-[#1e1b4b] flex items-center gap-1">{budget.icon} {budget.category}</span><span className={`font-700 ${over ? "text-[#fb923c]" : "text-[#6b7280]"}`}>{Math.round(percent)}%</span></div><div className="h-1.5 bg-[#e8e4f5] rounded-full overflow-hidden"><div className={`h-full rounded-full ${over ? "bg-[#fb923c]" : "bg-[#7c6fcd]"}`} style={{ width: `${percent}%` }} /></div></div>; })}</div></div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8e4f5]"><div className="flex items-center justify-between mb-3"><h3 className="font-display font-800 text-sm text-[#1e1b4b]">Mục tiêu tài chính</h3><button onClick={() => setPage("goals")} className="text-xs font-700 text-[#7c6fcd] hover:underline">Xem thêm</button></div><div className="space-y-3">{activeGoals.length === 0 ? <p className="text-sm text-[#9ca3af] text-center py-4">Chưa có mục tiêu đang thực hiện</p> : activeGoals.map((goal) => { const percent = Math.min(Math.round((goal.current / goal.target) * 100), 100); return <div key={goal.id}><div className="flex items-center justify-between text-xs mb-1"><span className="font-600 text-[#1e1b4b] flex items-center gap-1">{goal.icon} {goal.name}</span><span className="font-700 text-[#818cf8]">{percent}%</span></div><div className="h-1.5 bg-[#e8e4f5] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#818cf8] to-[#7c6fcd] rounded-full" style={{ width: `${percent}%` }} /></div></div>; })}</div></div>
        </div>
      </div>
    </div>
  );
}