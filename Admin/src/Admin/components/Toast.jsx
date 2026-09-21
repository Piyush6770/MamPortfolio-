import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useAdminData();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let colorClass = 'bg-emerald-600 text-white border-emerald-500';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          colorClass = 'bg-rose-600 text-white border-rose-500';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          colorClass = 'bg-amber-600 text-white border-amber-500';
        } else if (toast.type === 'info') {
          Icon = CheckCircle2;
          colorClass = 'bg-blue-600 text-white border-blue-500';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all transform animate-in slide-in-from-bottom-5 duration-200 ${colorClass}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm font-medium flex-1 leading-snug">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-black/20 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
