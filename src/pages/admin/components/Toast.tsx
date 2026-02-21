import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error';

export interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

export function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const colors =
    toast.type === 'success'
      ? 'bg-green-600 text-white'
      : 'bg-red-600 text-white';

  return (
    <div
      className={`flex items-center gap-3 rounded-md px-4 py-3 shadow-lg text-sm min-w-[280px] max-w-sm ${colors}`}
    >
      <span className="flex-1">{toast.text}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="opacity-70 hover:opacity-100 font-bold text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}

// ── Hook ────────────────────────────────────────────────────────────────────
let _nextId = 1;

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  function addToast(text: string, type: ToastType) {
    const id = _nextId++;
    setToasts((prev) => [...prev, { id, type, text }]);
  }

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return { toasts, toast: addToast, dismiss };
}