import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import type { Page } from "../App";
import { getStoredUser } from "../lib/api";
import { fmtVND, transactions, budgets, goals, chartMonths, incomeData, expenseData, balanceData } from "../data/mockData";

interface Props {
  setPage: (p: Page) => void;
  toast: (msg: string, t?: "success" | "error" | "warning") => void;
}

const summaryCards = [
  { label: "Tổng số dư", value: 28750000, icon: "💎", color: "from-[#7c6fcd] to-[#5a4fb5]", textColor: "text-white" },
  { label: "Tổng thu nhập", value: 28800000, icon: "📈", color: "from-[#10b981] to-[#059669]", textColor: "text-white" },
  { label: "Tổng chi tiêu", value: 16000000, icon: "📉", color: "from-[#f87171] to-[#ef4444]", textColor: "text-white" },
  { label: "Tiết kiệm", value: 12800000, icon: "🏆", color: "from-[#fbbf24] to-[#f59e0b]", textColor: "text-white" },
];

const pieData = [
  { name: "Ăn uống", value: 35, color: "#7c6fcd" },
  { name: "Mua sắm", value: 22, color: "#4ecdc4" },
  { name: "Di chuyển", value: 12, color: "#ff9a8b" },
  { name: "Giải trí", value: 10, color: "#818cf8" },
  { name: "Hóa đơn", value: 11, color: "#fbbf24" },
  { name: "Khác", value: 10, color: "#e8e4f5" },
];

const balanceChart = chartMonths.map((m, i) => ({ month: m, balance: balanceData[i] }));
const barChart = chartMonths.map((m, i) => ({ month: m, income: incomeData[i], expense: expenseData[i] }));

const fmtM = (v: number) => `${(v / 1000000).toFixed(0)}tr`;

export default function Dashboard({ setPage }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const user = getStoredUser();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Greeting */}
      <div>
        <h2 className="font-display font-900 text-2xl text-[#1e1b4b]">{greeting}, {user?.fullName ?? "bạn"}! 👋</h2>
        <p className="text-[#6b7280] text-sm">Đây là tổng quan tài chính của bạn hôm nay.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((c) => (
          <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-2xl p-4 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-700 text-white/80 uppercase tracking-wide">{c.label}</span>
              <span className="text-xl">{c.icon}</span>
            </div>
            <p className="font-display font-900 text-white text-lg leading-tight">{fmtVND(c.value)}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Balance trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-[#e8e4f5]">
          <h3 className="font-display font-800 text-base text-[#1e1b4b] mb-4">Xu hướng số dư</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={balanceChart}>
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c6fcd" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c6fcd" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0eef9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtM} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [fmtVND(Number(v)), "Số dư"]} contentStyle={{ borderRadius: 12, border: "1px solid #e8e4f5", fontSize: 12 }} />
              <Area type="monotone" dataKey="balance" stroke="#7c6fcd" strokeWidth={2.5} fill="url(#balGrad)" dot={{ fill: "#7c6fcd", r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8e4f5]">
          <h3 className="font-display font-800 text-base text-[#1e1b4b] mb-4">Chi tiêu theo danh mục</h3>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value"
                onMouseEnter={(_, i) => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}>
                {pieData.map((entry, i) => (
                  <Cell key={entry.name} fill={entry.color} opacity={activeIndex === null || activeIndex === i ? 1 : 0.5} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, ""]} contentStyle={{ borderRadius: 12, border: "1px solid #e8e4f5", fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-3">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-[#6b7280]">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8e4f5]">
        <h3 className="font-display font-800 text-base text-[#1e1b4b] mb-4">Thu nhập vs Chi tiêu</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={barChart} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0eef9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmtM} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => fmtVND(Number(v))} contentStyle={{ borderRadius: 12, border: "1px solid #e8e4f5", fontSize: 12 }} />
            <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} name="Thu nhập" />
            <Bar dataKey="expense" fill="#f87171" radius={[6, 6, 0, 0]} name="Chi tiêu" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-[#e8e4f5]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-800 text-base text-[#1e1b4b]">Giao dịch gần đây</h3>
            <button onClick={() => setPage("transactions")} className="text-xs font-700 text-[#7c6fcd] hover:underline">Xem tất cả →</button>
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#faf8ff] flex items-center justify-center text-base flex-shrink-0">{t.categoryIcon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-600 text-[#1e1b4b] truncate">{t.description}</p>
                  <p className="text-xs text-[#6b7280]">{t.account} · {t.date}</p>
                </div>
                <span className={`text-sm font-800 ${t.type === "income" ? "text-[#10b981]" : "text-[#f87171]"}`}>
                  {t.type === "income" ? "+" : "-"}{fmtVND(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget + Goals */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8e4f5]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-800 text-sm text-[#1e1b4b]">Ngân sách tháng này</h3>
              <button onClick={() => setPage("budgets")} className="text-xs font-700 text-[#7c6fcd] hover:underline">Xem thêm</button>
            </div>
            <div className="space-y-3">
              {budgets.slice(0, 3).map((b) => {
                const pct = Math.min((b.spent / b.amount) * 100, 100);
                const over = b.spent > b.amount;
                return (
                  <div key={b.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-600 text-[#1e1b4b] flex items-center gap-1">{b.icon} {b.category}</span>
                      <span className={`font-700 ${over ? "text-[#fb923c]" : "text-[#6b7280]"}`}>{Math.round(pct)}%</span>
                    </div>
                    <div className="h-1.5 bg-[#e8e4f5] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${over ? "bg-[#fb923c]" : "bg-[#7c6fcd]"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8e4f5]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-800 text-sm text-[#1e1b4b]">Mục tiêu tài chính</h3>
              <button onClick={() => setPage("goals")} className="text-xs font-700 text-[#7c6fcd] hover:underline">Xem thêm</button>
            </div>
            <div className="space-y-3">
              {goals.filter(g => g.status === "active").slice(0, 3).map((g) => {
                const pct = Math.round((g.current / g.target) * 100);
                return (
                  <div key={g.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-600 text-[#1e1b4b] flex items-center gap-1">{g.icon} {g.name}</span>
                      <span className="font-700 text-[#818cf8]">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-[#e8e4f5] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#818cf8] to-[#7c6fcd] rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
