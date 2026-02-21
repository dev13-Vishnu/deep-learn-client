import { useEffect } from 'react';
import type { NotifyType } from './notification.context';

export interface ToastMessage {
  id: number;
  type: NotifyType;
  text: string;
}

const TYPE_STYLES: Record<NotifyType, string> = {
  success: 'bg-green-600',
  error:   'bg-red-600',
  warning: 'bg-amber-500',
  info:    'bg-blue-600',
};

const TYPE_ICONS: Record<NotifyType, string> = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
};

interface Props {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

export function ToastStack({ toasts, onDismiss }: Props) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
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
    const timer = setTimeout(() => onDismiss(toast.id), 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-md px-4 py-3 text-white shadow-lg min-w-[280px] max-w-sm text-sm ${TYPE_STYLES[toast.type]}`}
    >
      <span className="mt-px font-bold shrink-0">{TYPE_ICONS[toast.type]}</span>
      <span className="flex-1 leading-snug">{toast.text}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-1 shrink-0 text-white/70 hover:text-white text-base leading-none"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}