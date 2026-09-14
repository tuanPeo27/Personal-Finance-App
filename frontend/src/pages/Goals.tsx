import { useEffect, useState } from "react";
import { api, type Goal, fmtVND } from "../lib/api";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

interface Props { toast: (msg: string, t?: "success" | "error" | "warning") => void; }

type Status = "active" | "completed" | "cancelled";
const statusConfig: Record<Status, { label: string; color: string; bg: string }> = {
  active: { label: "Đang thực hiện", color: "text-[#10b981]", bg: "bg-[#d1fae5]" },
  completed: { label: "Hoàn thành", color: "text-[#7c6fcd]", bg: "bg-[#ede9fb]" },
  cancelled: { label: "Đã huỷ", color: "text-[#6b7280]", bg: "bg-[#f3f4f6]" },
};

const goalIcons = ["💻","📱","🛡","✈️","🚲","🏠","🚗","📚","💍","🎓","🏊","🎸","🏋️","🌍","🎉"];

export default function Goals({ toast }: Props) {
  const [list, setList] = useState<Goal[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Goal | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | Status>("all");
  const [form, setForm] = useState({ name: "", icon: "💻", target: "", current: "", deadline: "" });

  useEffect(() => { api.goals().then(setList).catch(error => toast(error.message, "error")); }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const openAdd = () => { setEditItem(null); setForm({ name: "", icon: "💻", target: "", current: "", deadline: "" }); setShowModal(true); };
  const openEdit = (g: Goal) => { setEditItem(g); setForm({ name: g.name, icon: g.icon, target: String(g.target), current: String(g.current), deadline: g.deadline }); setShowModal(true); };

  const save = async () => {
    if (!form.name || !form.target || !form.deadline) { toast("Vui lòng nhập đầy đủ!", "error"); return; }
    try {
      if (editItem) {
        await api.updateGoal(editItem.id, form.name, Number(form.target), form.deadline);
        await api.updateGoalProgress(editItem.id, Number(form.current) || 0);
      } else {
        const goal = await api.createGoal(form.name, Number(form.target), form.deadline);
        if (Number(form.current) > 0) await api.updateGoalProgress(goal.id, Number(form.current));
      }
      setList(await api.goals());
      toast(editItem ? "Cập nhật mục tiêu thành công!" : "Đã tạo mục tiêu mới! 🎯"); setShowModal(false);
    } catch (error) { toast(error instanceof Error ? error.message : "Không thể lưu mục tiêu!", "error"); }
  };

  const shown = list.filter(g => filterStatus === "all" || g.status === filterStatus);

  return (
    <div className="space-y-5 pb-20 lg:pb-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {([
          { label: "Đang thực hiện", count: list.filter(g => g.status === "active").length, color: "bg-[#d1fae5] text-[#10b981]" },
          { label: "Hoàn thành", count: list.filter(g => g.status === "completed").length, color: "bg-[#ede9fb] text-[#7c6fcd]" },
          { label: "Đã huỷ", count: list.filter(g => g.status === "cancelled").length, color: "bg-[#f3f4f6] text-[#6b7280]" },
        ]).map(s => (
          <div key={s.label} className={`rounded-2xl p-4 ${s.color}`}>
            <p className="font-display font-900 text-2xl">{s.count}</p>
            <p className="text-xs font-600 opacity-80 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex bg-[#faf8ff] border border-[#e8e4f5] rounded-xl p-1 gap-1 flex-wrap">
          {(["all", "active", "completed", "cancelled"] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-700 transition-all ${filterStatus === s ? "bg-white shadow-sm text-[#1e1b4b]" : "text-[#6b7280]"}`}>
              {s === "all" ? "Tất cả" : statusConfig[s === "active" ? "active" : s === "completed" ? "completed" : "cancelled"].label}
            </button>
          ))}
        </div>
        <button onClick={openAdd} className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7c6fcd] to-[#5a4fb5] text-white text-sm font-700 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all">
          + Thêm mục tiêu
        </button>
      </div>

      {shown.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="font-display font-800 text-lg text-[#1e1b4b] mb-1">Chưa có mục tiêu nào</h3>
          <p className="text-[#6b7280] text-sm">Hãy cho khoản tiết kiệm của bạn một giấc mơ nhỏ!</p>
          <button onClick={openAdd} className="mt-4 px-5 py-2.5 rounded-xl bg-[#ede9fb] text-[#7c6fcd] font-700 text-sm hover:bg-[#7c6fcd] hover:text-white transition-all">Đặt mục tiêu ngay</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shown.map(g => {
            const pct = Math.min(Math.round((g.current / g.target) * 100), 100);
            const cfg = statusConfig[g.status];
            const remaining = g.target - g.current;
            const circumference = 2 * Math.PI * 36;
            const dashoffset = circumference - (pct / 100) * circumference;

            return (
              <div key={g.id} className={`bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition-all ${g.status === "cancelled" ? "opacity-60 border-[#e8e4f5]" : "border-[#e8e4f5]"}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className={`text-xs font-700 px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                    <h3 className="font-display font-800 text-base text-[#1e1b4b] mt-2 flex items-center gap-1.5">{g.icon} {g.name}</h3>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(g)} className="w-7 h-7 rounded-lg bg-[#ede9fb] text-[#7c6fcd] text-xs hover:bg-[#7c6fcd] hover:text-white transition-all flex items-center justify-center">✎</button>
                    <button onClick={() => setDeleteId(g.id)} className="w-7 h-7 rounded-lg bg-[#fee2e2] text-[#f87171] text-xs hover:bg-[#f87171] hover:text-white transition-all flex items-center justify-center">✕</button>
                  </div>
                </div>

                {/* Circular progress */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                      <circle cx="40" cy="40" r="36" fill="none" stroke="#e8e4f5" strokeWidth="6" />
                      <circle cx="40" cy="40" r="36" fill="none"
                        stroke={g.status === "completed" ? "#10b981" : "#7c6fcd"}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashoffset}
                        className="transition-all duration-700"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display font-900 text-base text-[#1e1b4b]">{pct}%</span>
                    </div>
                  </div>
                  <div className="text-xs space-y-1 text-[#6b7280]">
                    <div><span>Mục tiêu: </span><span className="font-700 text-[#1e1b4b]">{fmtVND(g.target)}</span></div>
                    <div><span>Đã tiết kiệm: </span><span className="font-700 text-[#10b981]">{fmtVND(g.current)}</span></div>
                    {g.status === "active" && <div><span>Còn thiếu: </span><span className="font-700 text-[#f87171]">{fmtVND(remaining)}</span></div>}
                    <div><span>Hạn: </span><span className="font-700 text-[#7c6fcd]">{new Date(g.deadline).toLocaleDateString("vi-VN")}</span></div>
                  </div>
                </div>

                <div className="h-1.5 bg-[#e8e4f5] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${g.status === "completed" ? "bg-gradient-to-r from-[#10b981] to-[#059669]" : "bg-gradient-to-r from-[#818cf8] to-[#7c6fcd]"}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <Modal title={editItem ? "Sửa mục tiêu" : "Thêm mục tiêu mới"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Biểu tượng</label>
              <div className="grid grid-cols-10 gap-1.5">
                {goalIcons.map(ic => (
                  <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))} className={`w-8 h-8 rounded-lg text-lg transition-all ${form.icon === ic ? "bg-[#ede9fb] ring-2 ring-[#7c6fcd]" : "bg-[#faf8ff] hover:bg-[#ede9fb]"}`}>{ic}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Tên mục tiêu</label>
              <input value={form.name} onChange={set("name")} placeholder="VD: Mua laptop mới" className="w-full px-4 py-3 rounded-xl border border-[#e8e4f5] bg-[#faf8ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Số tiền mục tiêu (₫)</label>
                <input type="number" value={form.target} onChange={set("target")} placeholder="0" className="w-full px-4 py-3 rounded-xl border border-[#e8e4f5] bg-[#faf8ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 transition-all" />
              </div>
              <div>
                <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Đã tiết kiệm (₫)</label>
                <input type="number" value={form.current} onChange={set("current")} placeholder="0" className="w-full px-4 py-3 rounded-xl border border-[#e8e4f5] bg-[#faf8ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Hạn hoàn thành</label>
              <input type="date" value={form.deadline} onChange={set("deadline")} className="w-full px-4 py-3 rounded-xl border border-[#e8e4f5] bg-[#faf8ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 transition-all" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-[#e8e4f5] text-sm font-600 text-[#6b7280] hover:bg-[#faf8ff] transition-colors">Huỷ</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7c6fcd] to-[#5a4fb5] text-white text-sm font-700 hover:shadow-md transition-all">Lưu</button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId !== null && (
        <ConfirmDialog message="Bạn có chắc muốn xoá mục tiêu này không?" onConfirm={async () => { try { await api.deleteGoal(deleteId); setList(await api.goals()); setDeleteId(null); toast("Đã xoá mục tiêu!", "warning"); } catch (error) { toast(error instanceof Error ? error.message : "Không thể xoá mục tiêu!", "error"); } }} onCancel={() => setDeleteId(null)} />
      )}
    </div>
  );
}
