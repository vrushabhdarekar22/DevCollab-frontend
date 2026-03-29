import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`max-w-sm px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md border-white/20 text-sm text-white flex items-center justify-between gap-3 transition-all duration-200 ${
              toast.type === "error"
                ? "bg-red-500/90"
                : toast.type === "warning"
                ? "bg-amber-500/90"
                : "bg-emerald-500/90"
            }`}
          >
            <span className="truncate">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white opacity-80 hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
