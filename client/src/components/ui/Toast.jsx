import React, { useEffect } from 'react';

const typeConfig = {
  success: {
    borderColor: 'border-l-green-500',
    bg: 'bg-green-500/10',
    icon: (
      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  error: {
    borderColor: 'border-l-red-500',
    bg: 'bg-red-500/10',
    icon: (
      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  info: {
    borderColor: 'border-l-blue-500',
    bg: 'bg-blue-500/10',
    icon: (
      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
      </svg>
    ),
  },
  warning: {
    borderColor: 'border-l-yellow-500',
    bg: 'bg-yellow-500/10',
    icon: (
      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86l-8.6 14.86A1 1 0 002.56 20h16.88a1 1 0 00.87-1.28l-8.6-14.86a1 1 0 00-1.72 0z" />
      </svg>
    ),
  },
};

const Toast = ({ message, type = 'info', onClose, autoDismiss = 4000 }) => {
  const config = typeConfig[type] || typeConfig.info;

  useEffect(() => {
    if (autoDismiss && onClose) {
      const timer = setTimeout(onClose, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onClose]);

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border-l-4
        bg-white/5 backdrop-blur-md border border-white/10
        ${config.borderColor} ${config.bg}
        shadow-lg min-w-[300px] max-w-md
        animate-slide-in-right
      `.trim()}
    >
      <span className="flex-shrink-0">{config.icon}</span>
      <p className="flex-1 text-sm text-gray-200">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export const ToastContainer = ({ toasts = [], onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onClose?.(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;
