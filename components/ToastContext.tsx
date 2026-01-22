import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CheckCircle2, Trash2, Info, AlertTriangle, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'error' | 'warning';

interface ToastMessage {
    id: string;
    msg: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (msg: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const toast = useCallback((msg: string, type: ToastType = 'success') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, msg, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000); // Auto close after 3s
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-16 left-0 right-0 z-[9999] flex flex-col items-center gap-2 pointer-events-none px-4">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 backdrop-blur-md border animate-in slide-in-from-top-2 fade-in duration-300 ${t.type === 'success' ? 'bg-green-600/90 border-green-500/50 text-white' :
                                t.type === 'error' ? 'bg-red-600/90 border-red-500/50 text-white' :
                                    t.type === 'warning' ? 'bg-orange-600/90 border-orange-500/50 text-white' :
                                        'bg-slate-700/90 border-slate-600 text-slate-200'
                            }`}
                    >
                        {t.type === 'success' && <CheckCircle2 size={16} />}
                        {t.type === 'error' && <XCircle size={16} />}
                        {t.type === 'warning' && <AlertTriangle size={16} />}
                        {t.type === 'info' && <Info size={16} />}
                        <span>{t.msg}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
