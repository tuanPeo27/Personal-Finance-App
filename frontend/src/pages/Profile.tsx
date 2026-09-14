import { useState } from "react";
import type { Page } from "../App";
import { getStoredUser } from "../lib/api";

interface Props { toast: (msg: string, t?: "success" | "error" | "warning") => void; setPage: (p: Page) => void; }

export default function Profile({ toast, setPage }: Props) {
  const user = getStoredUser();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.fullName ?? "", email: user?.email ?? "" });
  const [draft, setDraft] = useState(form);

  const save = () => {
    if (!draft.name || !draft.email) { toast("Vui lòng nhập đầy đủ!", "error"); return; }
    setForm(draft);
    setEditing(false);
    toast("Cập nhật hồ sơ thành công! ✨");
  };

  const stats = [
    { label: "Tài khoản", value: "5", icon: "🏦" },
    { label: "Giao dịch", value: "104", icon: "↔" },
    { label: "Ngân sách", value: "5", icon: "📊" },
    { label: "Mục tiêu", value: "5", icon: "🎯" },
  ];

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-20 lg:pb-6">
      {/* Avatar card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e8e4f5] text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#7c6fcd] to-[#4ecdc4] flex items-center justify-center text-white font-display font-900 text-3xl mx-auto mb-4 shadow-lg">
          NT
        </div>
        {editing ? (
          <div className="space-y-3 text-left">
            <div>
              <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Họ và tên</label>
              <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-[#e8e4f5] bg-[#faf8ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 transition-all" />
            </div>
            <div>
              <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Email</label>
              <input type="email" value={draft.email} onChange={e => setDraft(d => ({ ...d, email: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-[#e8e4f5] bg-[#faf8ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 transition-all" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setDraft(form); setEditing(false); }} className="flex-1 py-2.5 rounded-xl border border-[#e8e4f5] text-sm font-600 text-[#6b7280] hover:bg-[#faf8ff] transition-colors">Huỷ</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7c6fcd] to-[#5a4fb5] text-white text-sm font-700 hover:shadow-md transition-all">Lưu thay đổi</button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="font-display font-900 text-xl text-[#1e1b4b] mb-1">{form.name}</h2>
            <p className="text-[#6b7280] text-sm mb-1">{form.email}</p>
            <p className="text-xs text-[#6b7280]">Tham gia từ ngày 01/01/2026</p>
            <button onClick={() => { setDraft(form); setEditing(true); }} className="mt-4 px-6 py-2.5 rounded-xl bg-[#ede9fb] text-[#7c6fcd] font-700 text-sm hover:bg-[#7c6fcd] hover:text-white transition-all">
              Chỉnh sửa hồ sơ
            </button>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8e4f5] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#faf8ff] flex items-center justify-center text-2xl">{s.icon}</div>
            <div>
              <p className="font-display font-900 text-2xl text-[#1e1b4b]">{s.value}</p>
              <p className="text-xs text-[#6b7280]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Settings quick links */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e8e4f5] overflow-hidden">
        {[
          { icon: "🔔", label: "Thông báo", desc: "Quản lý cài đặt thông báo" },
          { icon: "🔒", label: "Bảo mật", desc: "Đổi mật khẩu và bảo mật tài khoản" },
          { icon: "🌙", label: "Giao diện", desc: "Chế độ sáng / tối" },
          { icon: "❓", label: "Hỗ trợ", desc: "Câu hỏi thường gặp và liên hệ" },
        ].map((item, i, arr) => (
          <button
            key={item.label}
            onClick={() => item.label === "Thông báo" ? setPage("notifications") : toast(`Tính năng "${item.label}" sẽ sớm ra mắt! 🚀`, "warning")}
            className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-[#faf8ff] transition-colors text-left ${i < arr.length - 1 ? "border-b border-[#e8e4f5]" : ""}`}
          >
            <span className="text-xl w-7 text-center">{item.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-700 text-[#1e1b4b]">{item.label}</p>
              <p className="text-xs text-[#6b7280]">{item.desc}</p>
            </div>
            <span className="text-[#6b7280] text-xs">›</span>
          </button>
        ))}
      </div>

      <div className="text-center text-xs text-[#6b7280] pb-2">
        Personal Finance v1.0.0 · Được làm với 💜 cho sinh viên Việt Nam
      </div>
    </div>
  );
}
