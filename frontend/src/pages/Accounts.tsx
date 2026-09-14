import { useState } from "react";
import { accounts as initAccounts, fmtVND } from "../data/mockData";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

interface Props { toast: (msg: string, t?: "success" | "error" | "warning") => void; }

const typeOptions = ["Tiền mặt", "Ngân hàng", "Ví điện tử"];
const iconMap: Record<string, string> = { "Tiền mặt": "💵", "Ngân hàng": "🏦", "Ví điện tử": "📱" };
const colorMap: Record<string, string> = { "Tiền mặt": "#fbbf24", "Ngân hàng": "#7c6fcd", "Ví điện tử": "#ff9a8b" };

export default function Accounts({ toast }: Props) {
  const [list, setList] = useState(initAccounts);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<typeof initAccounts[0] | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", type: "Tiền mặt", balance: "" });

  const openAdd = () => { setEditItem(null); setForm({ name: "", type: "Tiền mặt", balance: "" }); setShowModal(true); };
  const openEdit = (a: typeof initAccounts[0]) => { setEditItem(a); setForm({ name: a.name, type: a.type, balance: String(a.balance) }); setShowModal(true); };

  const save = () => {
    if (!form.name || !form.balance) { toast("Vui lòng nhập đầy đủ!", "error"); return; }
    if (editItem) {
      setList(l => l.map(a => a.id === editItem.id ? { ...a, name: form.name, type: form.type, balance: Number(form.balance), icon: iconMap[form.type], color: colorMap[form.type] } : a));
      toast("Cập nhật tài khoản thành công!");
    } else {
      setList(l => [...l, { id: Date.now(), name: form.name, type: form.type, balance: Number(form.balance), transactions: 0, icon: iconMap[form.type], color: colorMap[form.type] }]);
      toast("Thêm tài khoản thành công! 🎉");
    }
    setShowModal(false);
  };

  const confirmDelete = () => {
    setList(l => l.filter(a => a.id !== deleteId));
    setDeleteId(null);
    toast("Đã xoá tài khoản!", "warning");
  };

  const total = list.reduce((s, a) => s + a.balance, 0);

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#6b7280]">Tổng số dư tất cả tài khoản</p>
          <p className="font-display font-900 text-2xl text-[#1e1b4b]">{fmtVND(total)}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7c6fcd] to-[#5a4fb5] text-white text-sm font-700 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all">
          <span>+</span> Thêm tài khoản
        </button>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏦</div>
          <h3 className="font-display font-800 text-lg text-[#1e1b4b] mb-1">Chưa có tài khoản nào</h3>
          <p className="text-[#6b7280] text-sm">Hành trình tài chính của bạn bắt đầu từ đây ✨</p>
          <button onClick={openAdd} className="mt-4 px-5 py-2.5 rounded-xl bg-[#ede9fb] text-[#7c6fcd] font-700 text-sm hover:bg-[#7c6fcd] hover:text-white transition-all">Thêm ngay</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8e4f5] hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: a.color + "20" }}>
                  {a.icon}
                </div>
                <span className="text-xs font-600 px-2.5 py-1 rounded-full" style={{ background: a.color + "20", color: a.color }}>{a.type}</span>
              </div>
              <h3 className="font-display font-800 text-base text-[#1e1b4b] mb-1">{a.name}</h3>
              <p className="font-display font-900 text-xl text-[#1e1b4b] mb-3">{fmtVND(a.balance)}</p>
              <p className="text-xs text-[#6b7280] mb-4">{a.transactions} giao dịch</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(a)} className="flex-1 py-2 rounded-lg bg-[#ede9fb] text-[#7c6fcd] text-xs font-700 hover:bg-[#7c6fcd] hover:text-white transition-all">Sửa</button>
                <button onClick={() => setDeleteId(a.id)} className="flex-1 py-2 rounded-lg bg-[#fee2e2] text-[#f87171] text-xs font-700 hover:bg-[#f87171] hover:text-white transition-all">Xoá</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editItem ? "Sửa tài khoản" : "Thêm tài khoản mới"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Tên tài khoản</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Vietcombank" className="w-full px-4 py-3 rounded-xl border border-[#e8e4f5] bg-[#faf8ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 focus:border-[#7c6fcd] transition-all" />
            </div>
            <div>
              <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Loại tài khoản</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-[#e8e4f5] bg-[#faf8ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 focus:border-[#7c6fcd] transition-all">
                {typeOptions.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Số dư ban đầu (₫)</label>
              <input type="number" value={form.balance} onChange={e => setForm(f => ({ ...f, balance: e.target.value }))} placeholder="0" className="w-full px-4 py-3 rounded-xl border border-[#e8e4f5] bg-[#faf8ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 focus:border-[#7c6fcd] transition-all" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-[#e8e4f5] text-sm font-600 text-[#6b7280] hover:bg-[#faf8ff] transition-colors">Huỷ</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7c6fcd] to-[#5a4fb5] text-white text-sm font-700 hover:shadow-md transition-all">Lưu</button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId !== null && (
        <ConfirmDialog
          message="Bạn có chắc muốn xoá tài khoản này không?"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
