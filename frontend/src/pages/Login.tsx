import { useState } from "react";
import type { Page } from "../App";
import { api } from "../lib/api";

interface Props {
  goTo: (p: Page) => void;
  toast: (msg: string, t?: "success" | "error" | "warning") => void;
}

export default function Login({ goTo, toast }: Props) {
  const [email, setEmail] = useState("tuan@email.com");
  const [password, setPassword] = useState("123456");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast("Vui lòng nhập đầy đủ thông tin!", "error"); return; }
    setLoading(true);
    try {
      const result = await api.login(email, password);
      localStorage.setItem("finance_token", result.token);
      localStorage.setItem("finance_user", JSON.stringify(result.user));
      toast(`Chào mừng trở lại, ${result.user.fullName}! 👋`);
      goTo("dashboard");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Đăng nhập thất bại!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#ede9fb] via-[#e0f7f5] to-[#ffe8e4] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#c4b5fd]/30 blur-2xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[#4ecdc4]/20 blur-3xl" />
        <div className="relative z-10 text-center max-w-sm">
          <div className="text-8xl mb-6">💰</div>
          <h2 className="font-display font-900 text-3xl text-[#1e1b4b] mb-3">Quản lý tài chính<br />thông minh hơn</h2>
          <p className="text-[#6b7280] text-base leading-relaxed">Theo dõi thu chi, lập ngân sách và đạt được mục tiêu tài chính của bạn một cách dễ dàng.</p>
          <div className="mt-8 flex gap-4 justify-center">
            {[["🏦", "Tài khoản"], ["📊", "Ngân sách"], ["🎯", "Mục tiêu"]].map(([icon, label]) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl">{icon}</div>
                <span className="text-xs font-600 text-[#6b7280]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 lg:max-w-md flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c6fcd] to-[#4ecdc4] flex items-center justify-center shadow-md">
              <span className="text-white font-display font-900 text-xl">F</span>
            </div>
            <span className="font-display font-800 text-2xl text-[#1e1b4b]">Personal Finance</span>
          </div>

          <h1 className="font-display font-800 text-2xl text-[#1e1b4b] mb-1">Chào mừng trở lại! 👋</h1>
          <p className="text-[#6b7280] text-sm mb-7">Đăng nhập để tiếp tục quản lý tài chính của bạn</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[#e8e4f5] bg-[#faf8ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 focus:border-[#7c6fcd] transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[#e8e4f5] bg-[#faf8ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 focus:border-[#7c6fcd] transition-all"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-[#6b7280] cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#7c6fcd]"
                />
                Nhớ đăng nhập
              </label>
              <button type="button" className="text-sm font-600 text-[#7c6fcd] hover:underline">Quên mật khẩu?</button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7c6fcd] to-[#5a4fb5] text-white font-700 text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="text-center text-sm text-[#6b7280] mt-6">
            Chưa có tài khoản?{" "}
            <button onClick={() => goTo("register")} className="font-700 text-[#7c6fcd] hover:underline">Đăng ký ngay</button>
          </p>
        </div>
      </div>
    </div>
  );
}
