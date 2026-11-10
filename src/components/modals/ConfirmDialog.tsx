import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ConfirmDialog: React.FC = () => {
  const { confirmState, closeConfirm } = useApp();

  if (!confirmState.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{confirmState.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Konfirmasi Tindakan</p>
            </div>
          </div>

          <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {confirmState.message}
          </p>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={closeConfirm}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              onClick={confirmState.onConfirm}
              className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-xs"
            >
              Ya, Lanjutkan Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
