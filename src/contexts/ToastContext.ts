import { createContext } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export interface ToastContextType {
  showToast: (message: string, type?: Toast["type"]) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);
