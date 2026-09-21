import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  itemName = '',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${isDestructive ? 'bg-rose-950/60 text-rose-400 border border-rose-900/50' : 'bg-amber-950/60 text-amber-400'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 text-xs text-zinc-400">
          <p>{message}</p>
          {itemName && (
            <div className="p-3 bg-zinc-900 rounded-xl font-medium text-zinc-200 border border-zinc-800 truncate">
              "{itemName}"
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-900">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl transition-all cursor-pointer shadow-sm ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-zinc-100 hover:bg-white text-black'
            } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isDestructive ? (
              <Trash2 className="w-3.5 h-3.5" />
            ) : null}
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
