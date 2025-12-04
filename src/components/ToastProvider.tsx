"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "./ui/toast";

interface ToastMessage {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
}

interface ToastContextType {
  addToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (message: string, type?: "success" | "error" | "info") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 3000); // 3초 후 자동 제거
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-60 right-4 z-50">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
