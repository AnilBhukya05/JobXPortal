import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X, Info, AlertCircle } from "lucide-react";

const ToastContext = createContext(null);

const icons = {
  success: CheckCircle2,
  info: Info,
  error: AlertCircle,
};

const colors = {
  success: "border-[#10B981]/40 text-[#10B981]",
  info: "border-[#2DD4BF]/40 text-[#2DD4BF]",
  error: "border-[#fb7185]/40 text-[#fb7185]",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  function dismiss(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* TOAST CONTAINER */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.type] || CheckCircle2;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={"pointer-events-auto flex items-center gap-3 bg-[#12151D] border rounded-xl px-4 py-3 shadow-2xl " + colors[t.type]}
              >
                <Icon size={16} />
                <span className="text-[#F5F3EE] text-sm font-medium">
                  {t.message}
                </span>
                <button
                  onClick={() => dismiss(t.id)}
                  className="text-[#8A8F9C] hover:text-[#F5F3EE] ml-1"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}