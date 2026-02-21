import { useCallback, useState, type ReactNode } from "react";
import { ToastStack, type ToastMessage } from "./Toaststack";
import { NotificationContext, type NotifyType } from "./notification.context";

let _nextId = 1;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const notify = useCallback((message: string, type: NotifyType = 'info') => {
    const id = _nextId++;
    setToasts((prev) => [...prev, { id, type, text: message }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </NotificationContext.Provider>
  );
}