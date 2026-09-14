import type { Page } from "../App";

const navItems = [
  { id: "dashboard", label: "Tổng quan", icon: "⊞" },
  { id: "accounts", label: "Tài khoản", icon: "🏦" },
  { id: "transactions", label: "Giao dịch", icon: "↔" },
  { id: "categories", label: "Danh mục", icon: "🏷" },
  { id: "budgets", label: "Ngân sách", icon: "📊" },
  { id: "goals", label: "Mục tiêu", icon: "🎯" },
];

interface Props {
  page: Page;
  setPage: (p: Page) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

export default function Sidebar({ page, setPage, open, setOpen }: Props) {
  const go = (p: Page) => {
    setPage(p);
    setOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-[#e8e4f5] z-50 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-[#e8e4f5]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7c6fcd] to-[#4ecdc4] flex items-center justify-center shadow-md">
              <span className="text-white font-display font-900 text-lg">F</span>
            </div>
            <span className="font-display font-800 text-xl text-[#1e1b4b]">Finly</span>
            <span className="ml-auto text-xs bg-[#ede9fb] text-[#7c6fcd] font-600 px-2 py-0.5 rounded-full">Pro</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-xs font-600 text-[#6b7280] uppercase tracking-wider px-3 mb-3">Menu chính</p>
          {navItems.map((item) => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id as Page)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-600 transition-all duration-200 ${active ? "bg-[#ede9fb] text-[#7c6fcd]" : "text-[#6b7280] hover:bg-[#faf8ff] hover:text-[#1e1b4b]"}`}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7c6fcd]" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-[#e8e4f5] space-y-0.5">
          <button
            onClick={() => go("profile")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-600 transition-all ${page === "profile" ? "bg-[#ede9fb] text-[#7c6fcd]" : "text-[#6b7280] hover:bg-[#faf8ff] hover:text-[#1e1b4b]"}`}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7c6fcd] to-[#4ecdc4] flex items-center justify-center text-white text-xs font-700">NT</div>
            <div className="flex-1 text-left">
              <p className="text-xs font-700 text-[#1e1b4b]">Nguyễn Tuấn</p>
              <p className="text-xs text-[#6b7280]">tuan@email.com</p>
            </div>
          </button>
          <button
            onClick={() => go("login")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-600 text-[#f87171] hover:bg-red-50 transition-all"
          >
            <span className="text-base w-5 text-center">🚪</span>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e8e4f5] z-40 lg:hidden flex">
        {navItems.map((item) => {
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => go(item.id as Page)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-600 transition-colors ${active ? "text-[#7c6fcd]" : "text-[#6b7280]"}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px]">{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
