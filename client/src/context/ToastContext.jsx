import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const typeStyles = {
  success: 'border-l-green-500 bg-green-500/10',
  error: 'border-l-red-500 bg-red-500/10',
  warning: 'border-l-yellow-500 bg-yellow-500/10',
  info: 'border-l-blue-500 bg-blue-500/10',
};

function ToastItem({ toast, onDismiss }) {
  return (
    <div
      className={`border-l-4 ${typeStyles[toast.type] || typeStyles.info} backdrop-blur-md border border-white/10 rounded-lg p-4 shadow-lg animate-slide-in flex items-start gap-3`}
      style={{ animation: 'slideIn 0.3s ease-out' }}
    >
      <p className="text-sm text-gray-200 flex-1">{toast.message}</p>
      <button onClick={onDismiss} className="text-gray-400 hover:text-white text-sm">
        &times;
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
