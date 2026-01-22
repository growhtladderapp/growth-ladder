
import React, { useState } from 'react';
import { X, Check, Sparkles, Crown, ShieldCheck, CreditCard, Loader2, Zap } from 'lucide-react';

interface SubscriptionModalProps {
  onClose: () => void;
  onSubscribe: (isPro: boolean) => void;
  isDarkMode: boolean;
}


export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose, onSubscribe, isDarkMode }) => {
  const [step, setStep] = useState<'plans' | 'checkout' | 'processing'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  const handleAction = () => {
    if (step === 'plans') {
      setStep('checkout');
    } else if (step === 'checkout') {
      setStep('processing');
      setTimeout(() => {
        onSubscribe(true);
        onClose();
      }, 2500);
    }
  };

  const getPriceDisplay = () => {
    if (selectedPlan === 'monthly') return '$3.99';
    return '$29.90';
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`relative w-full max-w-sm rounded-[32px] overflow-hidden border border-white/10 shadow-2xl ${isDarkMode ? 'bg-zinc-950' : 'bg-white'}`}>

        {/* Header Decor */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-brand-500/20 to-transparent pointer-events-none"></div>

        <button onClick={onClose} className="absolute top-5 right-5 z-50 p-2 text-slate-500 hover:text-white transition-colors cursor-pointer">
          <X size={20} />
        </button>

        <div className="p-8 pt-10 relative z-10">
          {step === 'plans' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-4">
                  <Crown className="text-brand-500" size={32} />
                </div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter italic">Desbloquea el <span className="text-brand-500">Máximo Nivel</span></h2>
                <p className="text-slate-400 text-xs mt-2">Elige tu plan y comienza tu transformación.</p>
              </div>

              <div className="space-y-4">
                {/* Plan Mensual */}
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`w-full p-4 rounded-2xl border transition-all text-left relative overflow-hidden group ${selectedPlan === 'monthly' ? 'border-zinc-500 bg-zinc-800/40' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                >
                  <div className="absolute top-0 right-0 bg-white text-black text-[8px] font-black px-2 py-1 uppercase tracking-tighter rounded-bl-lg">1 Mes Gratis</div>
                  <div className="flex justify-between items-center mb-1 mt-1">
                    <div>
                      <h3 className="text-sm font-bold text-white">Plan Mensual</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-white">$3.99</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Facturación cada mes</p>
                  {selectedPlan === 'monthly' && <div className="absolute bottom-3 right-3"><div className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" /></div>}
                </button>

                {/* Plan Anual - MEJOR OPCION */}
                <button
                  onClick={() => setSelectedPlan('annual')}
                  className={`w-full p-5 rounded-2xl border-2 transition-all text-left relative overflow-hidden group ${selectedPlan === 'annual' ? 'border-brand-500 bg-brand-500/10' : 'border-brand-500/30 bg-white/5 hover:bg-white/10'}`}
                >
                  <div className="absolute top-0 right-0 bg-brand-500 text-white text-[8px] font-black px-3 py-1 uppercase tracking-tighter rounded-bl-xl">Ahorra 50%</div>

                  <div className="flex justify-between items-start mb-2 mt-1">
                    <div>
                      <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-1">Recomendado</p>
                      <h3 className="text-lg font-bold text-white">Plan Anual</h3>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 line-through decoration-red-500 decoration-2">$50.00</span>
                        <p className="text-xl font-black text-white">$29.90</p>
                      </div>
                      <p className="text-[8px] text-brand-500 font-bold uppercase">Pago Único Anual</p>
                    </div>
                  </div>

                  <ul className="space-y-1 mt-3 pt-3 border-t border-white/5">
                    {['Todo lo del mensual', 'Coach IA Ilimitado', 'Acceso anticipado a funciones'].map(f => (
                      <li key={f} className="flex items-center gap-2 text-[9px] text-slate-300 font-bold uppercase tracking-wider">
                        <Zap size={10} className="text-brand-500" /> {f}
                      </li>
                    ))}
                  </ul>
                </button>
              </div>

              <button
                onClick={handleAction}
                className="w-full mt-8 py-4 bg-brand-500 text-white font-black rounded-2xl shadow-xl shadow-brand-500/20 active:scale-95 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2"
              >
                Continuar con {selectedPlan === 'annual' ? 'Anual' : 'Prueba Gratis'} <Sparkles size={18} />
              </button>
            </div>
          )}

          {step === 'checkout' && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-6 flex items-center gap-2">
                <CreditCard className="text-brand-500" size={24} /> Resumen
              </h2>

              <div className="bg-white/5 rounded-2xl p-5 border border-white/5 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-400 text-sm font-bold">{selectedPlan === 'annual' ? 'Suscripción Anual' : 'Plan Mensual (1 Mes Gratis)'}</span>
                  <span className="text-white font-black">{selectedPlan === 'monthly' ? '$0.00' : '$29.90'}</span>
                </div>
                {selectedPlan === 'monthly' && (
                  <div className="text-right mb-2 -mt-2">
                    <span className="text-[10px] text-brand-500 font-bold uppercase">Luego $3.99/mes</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-white font-black uppercase text-xs tracking-widest">Total a pagar hoy</span>
                  <span className="text-brand-500 font-black text-xl">{selectedPlan === 'monthly' ? '$0.00' : '$29.90'}</span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Método de Pago Seguro</p>
                <div className="p-4 rounded-xl border border-brand-500 bg-brand-500/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-800 p-1.5 rounded-lg text-white">
                      <ShieldCheck size={18} />
                    </div>
                    <span className="text-white text-xs font-bold uppercase tracking-widest">Cuenta Vinculada</span>
                  </div>
                  <div className="text-[10px] text-brand-500 font-black">ACTIVA</div>
                </div>
              </div>

              <button
                onClick={handleAction}
                className="w-full py-4 bg-white text-black font-black rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-widest text-sm"
              >
                Confirmar Suscripción
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-brand-500 blur-3xl opacity-20 animate-pulse"></div>
                <Loader2 className="text-brand-500 animate-spin relative z-10" size={64} strokeWidth={3} />
              </div>
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Procesando Escalada...</h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">Cifrado de grado militar activo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
