import { useEffect } from "react";

interface Props {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}

export default function Modal({ title, onClose, children, wide }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-xl" : "max-w-md"} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e4f5]">
          <h2 className="font-display font-800 text-base text-[#1e1b4b]">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#faf8ff] hover:bg-[#fee2e2] hover:text-[#f87171] flex items-center justify-center text-[#6b7280] transition-colors text-sm"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
