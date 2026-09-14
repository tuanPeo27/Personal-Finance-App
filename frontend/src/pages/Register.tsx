import { useState } from "react";
import type { Page } from "../App";
import { api } from "../lib/api";

interface Props {
  goTo: (p: Page) => void;
  toast: (msg: string, t?: "success" | "error" | "warning") => void;
}

export default function Register({ goTo, toast }: Props) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pwStrength = (pw: string) => {
    if (pw.length === 0) return 0;
    if (pw.length < 6) return 1;
    if (pw.length < 10) return 2;
    return 3;
  };

  const strength = pwStrength(form.password);
  const strengthLabels = ["", "Yếu", "Trung bình", "Mạnh"];
  const strengthColors = ["", "bg-[#f87171]", "bg-[#fbbf24]", "bg-[#10b981]"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast("Vui lòng nhập đầy đủ thông tin!", "error"); return; }
    if (form.password !== form.confirm) { toast("Mật khẩu không khớp!", "error"); return; }
    if (form.password.length < 6) { toast("Mật khẩu phải ít nhất 6 ký tự!", "error"); return; }
    setLoading(true);
    try {
      await api.register(form.name, form.email, form.password);
      setLoading(false);
      toast("Đăng ký thành công! Chào mừng bạn 🎉");
      goTo("login");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Đăng ký thất bại!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ede9fb] via-[#faf8ff] to-[#e0f7f5] p-8">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7c6fcd] to-[#4ecdc4] flex items-center justify-center shadow-md">
            <span className="text-white font-display font-900">F</span>
          </div>
          <span className="font-display font-800 text-xl text-[#1e1b4b]">Personal Finance</span>
        </div>

        <h1 className="font-display font-800 text-2xl text-[#1e1b4b] mb-1">Tạo tài khoản mới ✨</h1>
        <p className="text-[#6b7280] text-sm mb-6">Bắt đầu hành trình quản lý tài chính của bạn</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: "name", label: "Họ và tên", type: "text", placeholder: "Nguyễn Văn A" },
            { key: "email", label: "Email", type: "email", placeholder: "email@example.com" },
            { key: "password", label: "Mật khẩu", type: "password", placeholder: "••••••••" },
            { key: "confirm", label: "Xác nhận mật khẩu", type: "password", placeholder: "••••••••" },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={set(key)}
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-xl border border-[#e8e4f5] bg-[#faf8ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 focus:border-[#7c6fcd] transition-all"
              />
              {key === "password" && form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= strength ? strengthColors[strength] : "bg-[#e8e4f5]"} transition-all`} />
                    ))}
                  </div>
                  <p className="text-xs text-[#6b7280]">Độ mạnh: <span className="font-600">{strengthLabels[strength]}</span></p>
                </div>
              )}
              {key === "confirm" && form.confirm && (
                <p className={`text-xs mt-1 font-600 ${form.password === form.confirm ? "text-[#10b981]" : "text-[#f87171]"}`}>
                  {form.password === form.confirm ? "✓ Mật khẩu khớp" : "✕ Mật khẩu không khớp"}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7c6fcd] to-[#5a4fb5] text-white font-700 text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 mt-2"
          >
            {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </button>
        </form>

        <p className="text-center text-sm text-[#6b7280] mt-5">
          Đã có tài khoản?{" "}
          <button onClick={() => goTo("login")} className="font-700 text-[#7c6fcd] hover:underline">Đăng nhập</button>
        </p>
      </div>
    </div>
  );
}
