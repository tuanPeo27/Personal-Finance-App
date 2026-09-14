import type { Page } from "../App";

const pageNames: Record<string, string> = {
  dashboard: "Tổng quan",
  accounts: "Tài khoản",
  transactions: "Giao dịch",
  categories: "Danh mục",
  budgets: "Ngân sách",
  goals: "Mục tiêu tài chính",
  profile: "Hồ sơ cá nhân",
};

interface Props {
  page: Page;
  setSidebarOpen: (v: boolean) => void;
  setPage: (p: Page) => void;
}

export default function TopBar({ page, setSidebarOpen, setPage }: Props) {
  return (
    <header className="bg-white border-b border-[#e8e4f5] px-4 md:px-6 lg:px-8 py-3.5 flex items-center gap-4 sticky top-0 z-30">
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden w-9 h-9 rounded-xl bg-[#faf8ff] flex items-center justify-center text-[#6b7280] hover:bg-[#ede9fb] transition-colors"
      >
        ☰
      </button>

      <div className="flex-1">
        <h1 className="font-display font-800 text-lg text-[#1e1b4b]">{pageNames[page]}</h1>
        <p className="text-xs text-[#6b7280]">Tháng 9, 2026</p>
      </div>

      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-xl bg-[#faf8ff] flex items-center justify-center text-[#6b7280] hover:bg-[#ede9fb] transition-colors relative">
          🔔
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f87171]" />
        </button>
        <button
          onClick={() => setPage("profile")}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7c6fcd] to-[#4ecdc4] flex items-center justify-center text-white text-xs font-700 shadow-sm"
        >
          NT
        </button>
      </div>
    </header>
  );
}
