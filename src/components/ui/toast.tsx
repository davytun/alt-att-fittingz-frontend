"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, newToast.duration);
    }
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            p-4 rounded-lg shadow-lg border border-gray-200 bg-white
            transform transition-all duration-300 ease-in-out
            ${getToastStyles(toast.type)}
          `}
          role="alert"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-gray-900">
                {toast.title}
              </h4>
              {toast.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors text-lg font-bold"
              aria-label="Dismiss toast"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function getToastStyles(type: Toast["type"]): string {
  switch (type) {
    case "success":
      return "border-green-200";
    case "error":
      return "border-red-200";
    case "warning":
      return "border-yellow-200";
    case "info":
      return "border-blue-200";
    default:
      return "border-gray-200";
  }
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);

  if (context === undefined) {
    // Return a mock implementation in case ToastProvider is missing
    return {
      toasts: [],
      showToast: () => {},
      dismissToast: () => {},
    };
  }

  return context;
}
