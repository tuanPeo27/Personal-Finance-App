import { useState } from "react";
import { transactions as initTx, accounts, categories, fmtVND } from "../data/mockData";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

interface Props { toast: (msg: string, t?: "success" | "error" | "warning") => void; }

const emptyForm = { type: "expense" as "income" | "expense", amount: "", account: "MB Bank", category: "Ăn uống", description: "", date: new Date().toISOString().split("T")[0] };

export default function Transactions({ toast }: Props) {
  const [list, setList] = useState(initTx);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<typeof initTx[0] | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setShowModal(true); };

  const save = () => {
    if (!form.amount || !form.description) { toast("Vui lòng nhập đầy đủ thông tin!", "error"); return; }
    const cat = categories.find(c => c.name === form.category);
    const newTx = {
      id: editItem?.id ?? Date.now(),
      date: form.date,
      description: form.description,
      category: form.category,
      categoryIcon: cat?.icon ?? "💰",
      account: form.account,
      type: form.type,
      amount: Number(form.amount),
    };
    if (editItem) {
      setList(l => l.map(t => t.id === editItem.id ? newTx : t));
      toast("Cập nhật giao dịch thành công!");
    } else {
      setList(l => [newTx, ...l]);
      toast("Thêm giao dịch thành công! ✨");
    }
    setShowModal(false);
  };

  const filtered = list.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || t.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-5 pb-20 lg:pb-6">
      {/* Header filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Tìm kiếm giao dịch..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-[#e8e4f5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 focus:border-[#7c6fcd] transition-all"
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#e8e4f5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 focus:border-[#7c6fcd] transition-all"
        >
          <option value="all">Tất cả</option>
          <option value="income">Thu nhập</option>
          <option value="expense">Chi tiêu</option>
        </select>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7c6fcd] to-[#5a4fb5] text-white text-sm font-700 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all whitespace-nowrap">
          + Thêm giao dịch
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e8e4f5] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📭</div>
            <h3 className="font-display font-800 text-base text-[#1e1b4b] mb-1">Chưa có giao dịch nào</h3>
            <p className="text-[#6b7280] text-sm">Câu chuyện tài chính của bạn bắt đầu từ đây ✨</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#faf8ff] border-b border-[#e8e4f5]">
                  {["Ngày", "Mô tả", "Danh mục", "Tài khoản", "Loại", "Số tiền", ""].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-700 text-[#6b7280] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f3ff]">
                {filtered.map(t => (
                  <tr key={t.id} className="hover:bg-[#faf8ff] transition-colors">
                    <td className="px-4 py-3.5 text-xs text-[#6b7280] whitespace-nowrap">{t.date}</td>
                    <td className="px-4 py-3.5 font-600 text-[#1e1b4b]">{t.description}</td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1.5 text-xs">
                        <span>{t.categoryIcon}</span>
                        <span className="text-[#6b7280]">{t.category}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#6b7280]">{t.account}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-700 px-2.5 py-1 rounded-full ${t.type === "income" ? "bg-[#d1fae5] text-[#065f46]" : "bg-[#fee2e2] text-[#991b1b]"}`}>
                        {t.type === "income" ? "Thu" : "Chi"}
                      </span>
                    </td>
                    <td className={`px-4 py-3.5 font-800 whitespace-nowrap ${t.type === "income" ? "text-[#10b981]" : "text-[#f87171]"}`}>
                      {t.type === "income" ? "+" : "-"}{fmtVND(t.amount)}
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => setDeleteId(t.id)}
                        className="w-7 h-7 rounded-lg bg-[#fee2e2] text-[#f87171] text-xs hover:bg-[#f87171] hover:text-white transition-all flex items-center justify-center"
                      >✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Thêm giao dịch mới" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Loại giao dịch</label>
              <div className="grid grid-cols-2 gap-2">
                {(["expense", "income"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setForm(f => ({ ...f, type: t }))}
                    className={`py-2.5 rounded-xl text-sm font-700 border-2 transition-all ${form.type === t ? (t === "income" ? "border-[#10b981] bg-[#d1fae5] text-[#065f46]" : "border-[#f87171] bg-[#fee2e2] text-[#991b1b]") : "border-[#e8e4f5] text-[#6b7280] hover:border-[#7c6fcd]"}`}
                  >
                    {t === "income" ? "💚 Thu nhập" : "🔴 Chi tiêu"}
                  </button>
                ))}
              </div>
            </div>
            {[
              { key: "amount", label: "Số tiền (₫)", type: "number", placeholder: "0" },
              { key: "description", label: "Mô tả", type: "text", placeholder: "VD: Ăn trưa" },
              { key: "date", label: "Ngày giao dịch", type: "date", placeholder: "" },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">{label}</label>
                <input type={type} value={form[key as keyof typeof form] as string} onChange={set(key)} placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e4f5] bg-[#faf8ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 focus:border-[#7c6fcd] transition-all" />
              </div>
            ))}
            <div>
              <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Tài khoản</label>
              <select value={form.account} onChange={set("account")} className="w-full px-4 py-3 rounded-xl border border-[#e8e4f5] bg-[#faf8ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 focus:border-[#7c6fcd] transition-all">
                {accounts.map(a => <option key={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-700 text-[#6b7280] uppercase tracking-wide mb-1.5 block">Danh mục</label>
              <select value={form.category} onChange={set("category")} className="w-full px-4 py-3 rounded-xl border border-[#e8e4f5] bg-[#faf8ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6fcd]/40 focus:border-[#7c6fcd] transition-all">
                {categories.filter(c => c.type === form.type).map(c => <option key={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-[#e8e4f5] text-sm font-600 text-[#6b7280] hover:bg-[#faf8ff] transition-colors">Huỷ</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7c6fcd] to-[#5a4fb5] text-white text-sm font-700 hover:shadow-md transition-all">Lưu</button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId !== null && (
        <ConfirmDialog message="Bạn có chắc muốn xoá giao dịch này không?" onConfirm={() => { setList(l => l.filter(t => t.id !== deleteId)); setDeleteId(null); toast("Đã xoá giao dịch!", "warning"); }} onCancel={() => setDeleteId(null)} />
      )}
    </div>
  );
}
