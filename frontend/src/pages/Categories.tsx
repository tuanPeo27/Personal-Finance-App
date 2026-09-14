import { useEffect, useState } from "react";
import { api, type Category } from "../lib/api";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

interface Props { toast: (msg: string, t?: "success" | "error" | "warning") => void; }

const icons = ["🍜","🚗","🛍","🎮","📄","📚","🔖","💼","🎁","💻","📈","💰","🏠","💊","🐶","✈️","🎵","⚽","☕","🎂"];

export default function Categories({ toast }: Props) {
  const [list, setList] = useState<Category[]>([]);
  const [tab, setTab] = useState<"Income" | "Expense">("Expense");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", type: "expense" as "income" | "expense", icon: "💰" });

  useEffect(() => { api.categories().then(setList).catch(error => toast(error.message, "error")); }, []);

  const openAdd = () => { setEditItem(null); setForm({ name: "", type: tab === "Income" ? "income" : "expense", icon: "💰" }); setShowModal(true); };
  const openEdit = (c: Category) => { setEditItem(c); setForm({ name: c.name, type: c.type === "Income" ? "income" : "expense", icon: c.icon }); setShowModal(true); };

  const save = async () => {
    if (!form.name) { toast("Vui lòng nhập tên danh mục!", "error"); return; }
    try {
      const type = form.type === "income" ? "Income" : "Expense";
      if (editItem) await api.updateCategory(editItem.id, form.name, type, form.icon);
      else await api.createCategory(form.name, type, form.icon);
      setList(await api.categories());
      toast(editItem ? "Cập nhật danh mục thành công!" : "Thêm danh mục thành công! 🏷");
      setShowModal(false);
    } catch (error) { toast(error instanceof Error ? error.message : "Không thể lưu danh mục!", "error"); }
  };

  const shown = list.filter(c => c.type === tab);

  return (
    <div className="space-y-5 pb-20 lg:pb-6">
      <div className="flex items-center justify-between">
        <div className="flex bg-[#faf8ff] border border-[#e8e4f5] rounded-xl p-1 gap-1">
          {(["Expense", "Income"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-700 transition-all ${tab === t ? "bg-white shadow-sm text-[#1e1b4b]" : "text-[#6b7280] hover:text-[#1e1b4b]"}`}
            >
              {t === "Expense" ? "🔴 Chi tiêu" : "💚 Thu nhập"}
            </button>
          ))}
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7c6fcd] to-[#5a4fb5] text-white text-sm font-700 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all">
          + Thêm danh mục
        </button>
      </div>

      {shown.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🏷️</div>
          <h3 className="font-display font-800 text-base text-[#1e1b4b] mb-1">Chưa có danh mục nào</h3>
          <p className="text-[#6b7280] text-sm">Tạo danh mục để phân loại giao dịch của bạn</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shown.map(c => (
            <div key={c.id} className="bg-white rounded-2xl p-4 shadow-sm border border-[#e8e4f5] hover:shadow-md transition-all flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${tab === "Expense" ? "bg-[#fee2e2]" : "bg-[#d1fae5]"}`}>
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-700 text-sm text-[#1e1b4b]">{c.name}</p>
                <p className="text-xs text-[#6b7280]">{c.transactions} giao dịch</p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => openEdit(c)} className="w-8 h-8 rounded-lg bg-[#ede9fb] text-[#7c6fcd] text-xs hover:bg-[#7c6fcd] hover:text-white transition-all flex items-center justify-center">✎</button>
                <button onClick={() => setDeleteId(c.id)} className="w-8 h-8 rounded-lg bg-[#fee2e2] text-[#f87171] text-xs hover:bg-[#f87171] hover:text-white transition-all flex items-center justify-center">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editItem ? "Sửa danh mục" : "Thêm danh mục mới"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Tên danh mục</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Ăn uống" className="w-full px-4 py-3 rounded-xl border border-[#e8e4f5] bg-[#faf8ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 focus:border-[#7c6fcd] transition-all" />
            </div>
            <div>
              <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Loại</label>
              <div className="grid grid-cols-2 gap-2">
                {(["expense", "income"] as const).map(t => (
                  <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))} className={`py-2.5 rounded-xl text-sm font-700 border-2 transition-all ${form.type === t ? "border-[#7c6fcd] bg-[#ede9fb] text-[#7c6fcd]" : "border-[#e8e4f5] text-[#6b7280]"}`}>
                    {t === "income" ? "💚 Thu nhập" : "🔴 Chi tiêu"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Biểu tượng</label>
              <div className="grid grid-cols-10 gap-1.5">
                {icons.map(ic => (
                  <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))} className={`w-8 h-8 rounded-lg text-lg transition-all ${form.icon === ic ? "bg-[#ede9fb] ring-2 ring-[#7c6fcd]" : "bg-[#faf8ff] hover:bg-[#ede9fb]"}`}>
                    {ic}
                  </button>
                ))}
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
        <ConfirmDialog message="Xoá danh mục này sẽ không ảnh hưởng tới giao dịch cũ." onConfirm={async () => { try { await api.deleteCategory(deleteId); setList(await api.categories()); setDeleteId(null); toast("Đã xoá danh mục!", "warning"); } catch (error) { toast(error instanceof Error ? error.message : "Không thể xoá danh mục!", "error"); } }} onCancel={() => setDeleteId(null)} />
      )}
    </div>
  );
}
