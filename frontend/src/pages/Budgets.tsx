import { useEffect, useState } from "react";
import { api, type Budget, type Category, fmtVND } from "../lib/api";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

interface Props { toast: (msg: string, t?: "success" | "error" | "warning") => void; }

const months = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];

export default function Budgets({ toast }: Props) {
  const [list, setList] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Budget | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ categoryId: "", category: "", icon: "🍜", amount: "", month: new Date().getMonth() + 1, year: new Date().getFullYear() });

  useEffect(() => {
    Promise.all([api.budgets(), api.categories()]).then(([budgets, loadedCategories]) => {
      setList(budgets); setCategories(loadedCategories);
    }).catch(error => toast(error.message, "error"));
  }, []);

  const expenseCats = categories.filter(c => c.type === "Expense");

  const openAdd = () => { const category = expenseCats[0]; setEditItem(null); setForm({ categoryId: String(category?.id ?? ""), category: category?.name ?? "", icon: category?.icon ?? "💰", amount: "", month: new Date().getMonth() + 1, year: new Date().getFullYear() }); setShowModal(true); };
  const openEdit = (b: Budget) => { setEditItem(b); setForm({ categoryId: String(b.categoryId), category: b.category, icon: b.icon, amount: String(b.amount), month: b.month, year: b.year }); setShowModal(true); };

  const save = async () => {
    if (!form.amount) { toast("Vui lòng nhập số tiền!", "error"); return; }
    const dup = list.find(b => b.categoryId === Number(form.categoryId) && b.month === form.month && b.year === form.year && b.id !== editItem?.id);
    if (dup) { toast("Đã có ngân sách cho danh mục này tháng này!", "error"); return; }
    try {
      if (editItem) {
        await api.updateBudget(editItem.id, {
          amount: Number(form.amount),
          month: form.month,
          year: form.year,
        });
      }
      else await api.createBudget({ categoryId: Number(form.categoryId), amount: Number(form.amount), month: form.month, year: form.year });
      setList(await api.budgets());
      toast(editItem ? "Cập nhật ngân sách thành công!" : "Đã tạo ngân sách mới! 📊");
      setShowModal(false);
    } catch (error) { toast(error instanceof Error ? error.message : "Không thể lưu ngân sách!", "error"); }
  };

  const totalBudget = list.reduce((s, b) => s + b.amount, 0);
  const totalSpent = list.reduce((s, b) => s + b.spent, 0);
  const overBudget = list.filter(b => b.spent > b.amount);

  return (
    <div className="space-y-5 pb-20 lg:pb-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Tổng ngân sách", value: totalBudget, color: "bg-[#ede9fb] text-[#7c6fcd]" },
          { label: "Đã chi tiêu", value: totalSpent, color: "bg-[#fee2e2] text-[#f87171]" },
          { label: "Còn lại", value: totalBudget - totalSpent, color: "bg-[#d1fae5] text-[#10b981]" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 ${s.color}`}>
            <p className="text-xs font-600 opacity-70 mb-1">{s.label}</p>
            <p className="font-display font-900 text-base">{fmtVND(s.value)}</p>
          </div>
        ))}
      </div>

      {overBudget.length > 0 && (
        <div className="bg-[#fff7ed] border border-[#fdba74] rounded-2xl p-4 flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-700 text-sm text-[#9a3412]">Một số danh mục đã vượt ngân sách!</p>
            <p className="text-xs text-[#9a3412]/80 mt-0.5">Ôi! Bạn đã chi hơi quá tay ở: {overBudget.map(b => b.category).join(", ")}. Cố lên nhé! 💪</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="font-display font-800 text-base text-[#1e1b4b]">Ngân sách</h3>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7c6fcd] to-[#5a4fb5] text-white text-sm font-700 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all">
          + Thêm ngân sách
        </button>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">📊</div>
          <h3 className="font-display font-800 text-base text-[#1e1b4b] mb-1">Chưa có ngân sách nào</h3>
          <p className="text-[#6b7280] text-sm">Lập ngân sách để kiểm soát chi tiêu tốt hơn</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(b => {
            const pct = (b.spent / b.amount) * 100;
            const over = b.spent > b.amount;
            const remaining = b.amount - b.spent;
            return (
              <div key={b.id} className={`bg-white rounded-2xl p-5 shadow-sm border transition-all hover:shadow-md ${over ? "border-[#fdba74]" : "border-[#e8e4f5]"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${over ? "bg-[#ffedd5]" : "bg-[#faf8ff]"}`}>{b.icon}</div>
                    <div>
                      <p className="font-700 text-sm text-[#1e1b4b]">{b.category}</p>
                      <p className="text-xs text-[#6b7280]">{months[b.month - 1]}, {b.year}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(b)} className="w-7 h-7 rounded-lg bg-[#ede9fb] text-[#7c6fcd] text-xs hover:bg-[#7c6fcd] hover:text-white transition-all flex items-center justify-center">✎</button>
                    <button onClick={() => setDeleteId(b.id)} className="w-7 h-7 rounded-lg bg-[#fee2e2] text-[#f87171] text-xs hover:bg-[#f87171] hover:text-white transition-all flex items-center justify-center">✕</button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#6b7280] mb-3">
                  <div className="flex justify-between"><span>Đã chi:</span><span className="font-700 text-[#1e1b4b]">{fmtVND(b.spent)}</span></div>
                  <div className="flex justify-between"><span>Ngân sách:</span><span className="font-700 text-[#1e1b4b]">{fmtVND(b.amount)}</span></div>
                  <div className="flex justify-between">
                    <span>{over ? "Vượt quá:" : "Còn lại:"}</span>
                    <span className={`font-700 ${over ? "text-[#fb923c]" : "text-[#10b981]"}`}>{over ? `+${fmtVND(-remaining)}` : fmtVND(remaining)}</span>
                  </div>
                </div>

                <div className="h-2 bg-[#e8e4f5] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${over ? "bg-gradient-to-r from-[#fb923c] to-[#f97316]" : pct > 75 ? "bg-gradient-to-r from-[#fbbf24] to-[#f59e0b]" : "bg-gradient-to-r from-[#7c6fcd] to-[#5a4fb5]"}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <p className={`text-xs font-700 mt-1.5 ${over ? "text-[#fb923c]" : "text-[#6b7280]"}`}>{Math.round(pct)}% {over && "— Vượt ngân sách! 😬"}</p>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <Modal title={editItem ? "Sửa ngân sách" : "Thêm ngân sách mới"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Danh mục</label>
              <select value={form.categoryId} onChange={e => { const cat = expenseCats.find(c => c.id === Number(e.target.value)); setForm(f => ({ ...f, categoryId: e.target.value, category: cat?.name ?? "", icon: cat?.icon ?? "💰" })); }} className="w-full px-4 py-3 rounded-xl border border-[#e8e4f5] bg-[#faf8ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 transition-all">
                {expenseCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Số tiền ngân sách (₫)</label>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0" className="w-full px-4 py-3 rounded-xl border border-[#e8e4f5] bg-[#faf8ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Tháng</label>
                <select value={form.month} onChange={e => setForm(f => ({ ...f, month: Number(e.target.value) }))} className="w-full px-4 py-3 rounded-xl border border-[#e8e4f5] bg-[#faf8ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 transition-all">
                  {months.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Năm</label>
                <input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))} className="w-full px-4 py-3 rounded-xl border border-[#e8e4f5] bg-[#faf8ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 transition-all" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-[#e8e4f5] text-sm font-600 text-[#6b7280] hover:bg-[#faf8ff] transition-colors">Huỷ</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7c6fcd] to-[#5a4fb5] text-white text-sm font-700 hover:shadow-md transition-all">Lưu</button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId !== null && (
        <ConfirmDialog message="Bạn có chắc muốn xoá ngân sách này không?" onConfirm={async () => { try { await api.deleteBudget(deleteId); setList(await api.budgets()); setDeleteId(null); toast("Đã xoá ngân sách!", "warning"); } catch (error) { toast(error instanceof Error ? error.message : "Không thể xoá ngân sách!", "error"); } }} onCancel={() => setDeleteId(null)} />
      )}
    </div>
  );
}
