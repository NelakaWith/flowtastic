import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { ToastContext } from "../contexts/ToastContext";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "info") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-80
              animate-slide-in-right
              ${
                toast.type === "success"
                  ? "bg-green-600 text-white"
                  : toast.type === "error"
                  ? "bg-red-600 text-white"
                  : toast.type === "warning"
                  ? "bg-yellow-600 text-white"
                  : "bg-blue-600 text-white"
              }
            `}
          >
            <span className="text-lg">
              {toast.type === "success"
                ? "✓"
                : toast.type === "error"
                ? "✗"
                : toast.type === "warning"
                ? "⚠"
                : "ℹ"}
            </span>
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white hover:opacity-75 font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
