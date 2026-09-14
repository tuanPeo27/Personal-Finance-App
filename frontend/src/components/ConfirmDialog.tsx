interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-[#fee2e2] flex items-center justify-center text-2xl mx-auto mb-4">🗑️</div>
        <p className="font-600 text-[#1e1b4b] mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-[#e8e4f5] text-sm font-600 text-[#6b7280] hover:bg-[#faf8ff] transition-colors">Huỷ</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-[#f87171] text-white text-sm font-700 hover:bg-[#ef4444] transition-colors">Xoá</button>
        </div>
      </div>
    </div>
  );
}
