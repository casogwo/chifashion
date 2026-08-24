'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

interface Toast {
  id: number;
  message: string;
  image?: string;
  type: 'success' | 'error';
  actions?: { label: string; href?: string; onClick?: () => void }[];
}

interface ToastContextType {
  showToast: (message: string, image?: string, type?: 'success' | 'error', actions?: { label: string; href?: string; onClick?: () => void }[]) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let counter = 0;

  const showToast = useCallback((message: string, image?: string, type: 'success' | 'error' = 'success', actions?: { label: string; href?: string; onClick?: () => void }[]) => {
    const id = ++counter;
    setToasts((prev) => [...prev, { id, message, image, type, actions }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {typeof window !== 'undefined' &&
        createPortal(
          <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className="pointer-events-auto bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 min-w-[280px] max-w-[360px] animate-slide-up"
              >
                <div className="flex items-center gap-3">
                  {toast.image && (
                    <img
                      src={toast.image}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {toast.type === 'success' ? (
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      <p className="text-sm font-medium text-gray-900 truncate">{toast.message}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismiss(toast.id)}
                    className="text-gray-400 hover:text-gray-600 p-1 -mr-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {toast.actions && toast.actions.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {toast.actions.map((action, i) =>
                      action.href ? (
                        <Link
                          key={i}
                          href={action.href}
                          onClick={() => dismiss(toast.id)}
                          className={`flex-1 text-center py-2 rounded-full text-xs font-medium transition-colors ${
                            i === toast.actions!.length - 1
                              ? 'bg-brand-500 hover:bg-brand-600 text-white'
                              : 'border border-gray-200 text-gray-600 hover:border-brand-400'
                          }`}
                        >
                          {action.label}
                        </Link>
                      ) : (
                        <button
                          key={i}
                          onClick={() => {
                            action.onClick?.();
                            dismiss(toast.id);
                          }}
                          className={`flex-1 text-center py-2 rounded-full text-xs font-medium transition-colors ${
                            i === toast.actions!.length - 1
                              ? 'bg-brand-500 hover:bg-brand-600 text-white'
                              : 'border border-gray-200 text-gray-600 hover:border-brand-400'
                          }`}
                        >
                          {action.label}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
