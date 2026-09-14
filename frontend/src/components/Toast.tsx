interface Props {
  message: string;
  type: "success" | "error" | "warning";
}

const config = {
  success: { icon: "✓", bg: "bg-[#d1fae5]", text: "text-[#065f46]", border: "border-[#6ee7b7]" },
  error: { icon: "✕", bg: "bg-[#fee2e2]", text: "text-[#991b1b]", border: "border-[#fca5a5]" },
  warning: { icon: "!", bg: "bg-[#ffedd5]", text: "text-[#9a3412]", border: "border-[#fdba74]" },
};

export default function Toast({ message, type }: Props) {
  const c = config[type];
  return (
    <div className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl border ${c.bg} ${c.text} ${c.border} shadow-lg text-sm font-600 animate-[fadeIn_0.3s_ease] max-w-xs`}>
      <span className="w-5 h-5 rounded-full bg-white/60 flex items-center justify-center text-xs font-800">{c.icon}</span>
      {message}
    </div>
  );
}
