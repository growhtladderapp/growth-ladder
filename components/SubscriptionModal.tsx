import React, { useState } from 'react';
import { X, CreditCard, Loader2, Star } from 'lucide-react';

interface SubscriptionModalProps {
  onClose: () => void;
  onSubscribe: (isPro: boolean) => void;
  isDarkMode: boolean;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps & { userName?: string }> = ({ onClose, onSubscribe, isDarkMode, userName }) => {
  const [step, setStep] = useState<'plans' | 'checkout' | 'processing'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly' | 'lifetime'>('annual');
  const [freeTrialActive, setFreeTrialActive] = useState(false);

  const reviews = [
    {
      id: 1,
      title: "¡Un cambio total!",
      text: "La acabo de descargar y ya me encanta. Es elegante, simple y súper fácil de usar. Encontré todos mis hábitos ya preestablecidos, pero los personalizados son muy fáciles de agregar.",
      stars: 5
    },
    {
      id: 2,
      title: "El Coach de Voz es increíble",
      text: "El coach IA disponible por voz 24/7 es de otro planeta. Me responde al instante con consejos reales de nutrición y me motiva a no romper mi racha.",
      stars: 5
    },
    {
      id: 3,
      title: "Recomendado 100%",
      text: "Llevaba meses intentando ir al gimnasio de forma constante y por fin lo he conseguido con TWH. El Modo Vacaciones me salvó de perder mi racha de 40 días.",
      stars: 5
    }
  ];

  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveReviewIdx((prev) => (prev + 1) % reviews.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

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
    if (selectedPlan === 'lifetime') return 'USD 24.99';
    if (selectedPlan === 'monthly') return 'USD 2.99';
    return freeTrialActive ? 'Prueba gratis (luego USD 12.99)' : 'USD 12.99';
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* Tap outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className={`relative w-full max-w-md h-[94vh] md:h-auto md:max-h-[90vh] rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl flex flex-col bg-black text-white z-10 animate-in slide-in-from-bottom duration-300`}>
        {/* Header bar / Drag handle */}
        <div className="mx-auto my-3 w-12 h-1 bg-zinc-800 rounded-full md:hidden" />

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 p-2 bg-zinc-900/80 hover:bg-zinc-800 text-white rounded-full transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4 no-scrollbar">
          {step === 'plans' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              {/* Header Title */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-black text-white tracking-tight leading-tight uppercase italic">
                  Acceso Total Premium
                </h2>
                <p className="text-zinc-400 text-xs mt-1.5 font-bold uppercase tracking-wider">
                  Desbloquea estadísticas y coach IA ilimitados
                </p>
              </div>

              {/* Free Trial Toggle */}
              <div className={`w-full p-4 rounded-[1.5rem] bg-zinc-900 border transition-all mb-5 flex justify-between items-center ${freeTrialActive ? 'border-brand-500/40 bg-brand-500/5' : 'border-zinc-800'}`}>
                <span className="text-white font-bold text-[14px] leading-snug">
                  ¿No estás seguro? Activa la prueba gratuita
                </span>
                <button 
                  onClick={() => setFreeTrialActive(!freeTrialActive)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex items-center ${freeTrialActive ? 'bg-brand-500' : 'bg-zinc-700'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${freeTrialActive ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Plans List */}
              <div className="space-y-3.5">
                {/* Plan Anual */}
                <div className="relative group">
                  <div 
                    className={`w-full text-center text-[10px] font-black uppercase py-1.5 rounded-t-[1.2rem] tracking-widest transition-all duration-300 relative overflow-hidden ${selectedPlan === 'annual' ? 'bg-gradient-to-r from-brand-500 to-[#f43f5e] text-white border-b border-white/10' : 'bg-[#1c1c1e] text-zinc-400'}`}
                    style={selectedPlan === 'annual' ? { boxShadow: 'inset 0 1.5px 0px rgba(255,255,255,0.4)' } : undefined}
                  >
                    {/* Shiny sheen for header */}
                    {selectedPlan === 'annual' && <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 mix-blend-overlay" />}
                    Más populares
                  </div>
                  <button
                    onClick={() => setSelectedPlan('annual')}
                    className={`w-full p-5 rounded-b-[1.2rem] border-x border-b transition-all text-left flex justify-between items-center active:scale-[0.98] relative overflow-hidden focus:outline-none ${selectedPlan === 'annual' ? 'border-brand-500 text-white' : 'bg-[#1c1c1e]/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                    style={selectedPlan === 'annual' ? {
                      background: 'linear-gradient(135deg, #dc2626 0%, #f43f5e 50%, #9f1239 100%)',
                      boxShadow: 'inset 0 1.5px 0px rgba(255,255,255,0.4), inset 0 -1.5px 0px rgba(0,0,0,0.2), 0 12px 30px rgba(220,38,38,0.35)'
                    } : {
                      boxShadow: 'inset 0 1px 0px rgba(255,255,255,0.05)'
                    }}
                  >
                    {/* Gloss sheen overlay */}
                    {selectedPlan === 'annual' && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/5 pointer-events-none rounded-b-[1.2rem] mix-blend-overlay z-10" />
                    )}
                    <div className="flex flex-col gap-1 max-w-[65%] z-20">
                      <h3 className={`text-base font-black tracking-tight leading-none ${selectedPlan === 'annual' ? 'text-white' : 'text-brand-500'}`}>Anual</h3>
                      <p className={`text-[12px] font-bold leading-snug mt-0.5 ${selectedPlan === 'annual' ? 'text-white/85' : 'text-zinc-500'}`}>
                        {freeTrialActive ? 'Prueba gratuita de 7 días, luego USD 12.99' : 'Empieza tu viaje por USD 12.99'}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end shrink-0 z-20">
                      <p className="text-base font-black leading-none text-white">US$ 1,08 / mes</p>
                      <p className={`text-[11px] font-bold line-through mt-0.5 ${selectedPlan === 'annual' ? 'text-white/60' : 'text-zinc-600'}`}>US$ 2,99 / mes</p>
                    </div>
                  </button>
                </div>

                {/* Plan Mensual */}
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`w-full p-5 rounded-[1.2rem] border transition-all text-left flex justify-between items-center active:scale-[0.98] relative overflow-hidden focus:outline-none ${selectedPlan === 'monthly' ? 'border-brand-500 text-white shadow-lg' : 'bg-[#1c1c1e]/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                  style={selectedPlan === 'monthly' ? {
                    background: 'linear-gradient(135deg, #dc2626 0%, #f43f5e 50%, #9f1239 100%)',
                    boxShadow: 'inset 0 1.5px 0px rgba(255,255,255,0.4), inset 0 -1.5px 0px rgba(0,0,0,0.2), 0 12px 30px rgba(220,38,38,0.35)'
                  } : {
                    boxShadow: 'inset 0 1px 0px rgba(255,255,255,0.05)'
                  }}
                >
                  {/* Gloss sheen overlay */}
                  {selectedPlan === 'monthly' && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/5 pointer-events-none rounded-[1.2rem] mix-blend-overlay z-10" />
                  )}
                  <h3 className={`text-base font-black tracking-tight leading-none z-20 ${selectedPlan === 'monthly' ? 'text-white' : 'text-brand-500'}`}>Mensual</h3>
                  <p className="text-base font-black leading-none text-white z-20">US$ 2,99 / mes</p>
                </button>

                {/* Plan De Por Vida */}
                <button
                  onClick={() => setSelectedPlan('lifetime')}
                  className={`w-full p-5 rounded-[1.2rem] border transition-all text-left flex justify-between items-center active:scale-[0.98] relative overflow-hidden focus:outline-none ${selectedPlan === 'lifetime' ? 'border-brand-500 text-white shadow-lg' : 'bg-[#1c1c1e]/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                  style={selectedPlan === 'lifetime' ? {
                    background: 'linear-gradient(135deg, #dc2626 0%, #f43f5e 50%, #9f1239 100%)',
                    boxShadow: 'inset 0 1.5px 0px rgba(255,255,255,0.4), inset 0 -1.5px 0px rgba(0,0,0,0.2), 0 12px 30px rgba(220,38,38,0.35)'
                  } : {
                    boxShadow: 'inset 0 1px 0px rgba(255,255,255,0.05)'
                  }}
                >
                  {/* Gloss sheen overlay */}
                  {selectedPlan === 'lifetime' && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/5 pointer-events-none rounded-[1.2rem] mix-blend-overlay z-10" />
                  )}
                  <h3 className={`text-base font-black tracking-tight leading-none z-20 ${selectedPlan === 'lifetime' ? 'text-white' : 'text-brand-500'}`}>De por vida</h3>
                  <p className="text-base font-black leading-none text-white z-20">USD 24.99</p>
                </button>
              </div>

              {/* Trust Badge Section (laurels) */}
              <div className="flex flex-col items-center justify-center mt-7 mb-5 text-center">
                <div className="flex items-center gap-3">
                  {/* Left Laurel leaf representation */}
                  <span className="text-zinc-600 text-3xl font-light">🌿</span>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-0.5 mb-1 text-brand-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={13} fill="currentColor" stroke="none" />
                      ))}
                    </div>
                    <p className="text-white font-black text-base leading-none">Calificación de 5.0</p>
                  </div>
                  {/* Right Laurel leaf representation */}
                  <span className="text-zinc-600 text-3xl font-light scale-x-[-1]">🌿</span>
                </div>
                <p className="text-zinc-500 text-[11px] font-bold mt-1.5 uppercase tracking-wide">
                  Confiado por más de 1 millón de usuarios
                </p>
              </div>

              {/* Review card Carousel */}
              <div className="w-full bg-[#1c1c1e]/60 border border-zinc-800/80 rounded-3xl p-5 mb-4 relative overflow-hidden min-h-[142px] flex flex-col justify-between">
                <div 
                  className="transition-all duration-500 ease-out flex-1"
                  key={activeReviewIdx}
                >
                  <div className="flex justify-between items-center mb-2 animate-in fade-in duration-300">
                    <h4 className="text-white font-black text-[14px]">{reviews[activeReviewIdx].title}</h4>
                    <div className="flex text-orange-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={11} fill="currentColor" stroke="none" />
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-400 text-[12.5px] leading-relaxed font-medium animate-in fade-in slide-in-from-right-4 duration-500">
                    "{reviews[activeReviewIdx].text}"
                  </p>
                </div>
                
                {/* Carousel Dots */}
                <div className="flex justify-center gap-1.5 mt-3.5 relative z-20">
                  {reviews.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveReviewIdx(idx)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                        activeReviewIdx === idx ? 'bg-brand-500 w-3' : 'bg-zinc-800 hover:bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'checkout' && (
            <div className="animate-in slide-in-from-right-4 duration-300 py-4">
              <h2 className="text-lg font-black text-white uppercase italic tracking-tighter mb-5 flex items-center gap-2">
                <CreditCard className="text-brand-500" size={22} /> Pago Seguro
              </h2>

              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Detalles de Tarjeta</label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-white font-mono placeholder:text-zinc-600 focus:border-brand-500 outline-none transition-colors"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-white font-mono placeholder:text-zinc-600 focus:border-brand-500 outline-none transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-white font-mono placeholder:text-zinc-600 focus:border-brand-500 outline-none transition-colors"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Nombre del Titular"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-white placeholder:text-zinc-600 focus:border-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 pt-4 border-t border-zinc-800">
                <span className="text-white font-black uppercase text-xs tracking-widest">Total a pagar</span>
                <span className="text-brand-500 font-black text-lg">{getPriceDisplay()}</span>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-20 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-brand-500 blur-3xl opacity-20 animate-pulse"></div>
                <Loader2 className="text-brand-500 animate-spin relative z-10" size={64} strokeWidth={3} />
              </div>
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Procesando Pago...</h2>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">Cifrado de grado militar activo</p>
            </div>
          )}
        </div>

        {/* Sticky Footer CTA */}
        {step !== 'processing' && (
          <div className="border-t border-zinc-800/80 p-5 bg-zinc-950/90 backdrop-blur-md flex flex-col items-center gap-3 mt-auto">
            {step === 'plans' && (
              <>
                <p className="text-orange-500/90 font-bold text-xs uppercase tracking-wider">
                  Cancelar en cualquier momento
                </p>
                <button 
                  onClick={handleAction} 
                  className="w-full py-4 bg-brand-500 hover:bg-brand-600 active:opacity-75 text-black font-black rounded-full shadow-xl transition-all uppercase tracking-widest text-[13.5px] flex items-center justify-center gap-2"
                >
                  Accede completamente
                </button>
              </>
            )}
            
            {step === 'checkout' && (
              <button 
                onClick={handleAction} 
                className="w-full py-4 bg-white hover:bg-zinc-200 active:opacity-75 text-black font-black rounded-full shadow-xl transition-all uppercase tracking-widest text-[13.5px] flex items-center justify-center gap-2"
              >
                Pagar y Suscribirse
              </button>
            )}

            {/* Terms and links */}
            {step === 'plans' && (
              <div className="flex flex-col items-center gap-1.5 text-[10.5px] font-bold text-zinc-500 mt-1">
                <button className="hover:text-zinc-300 transition-colors uppercase tracking-wider">Restaurar compra</button>
                <div className="flex items-center gap-2 text-zinc-600">
                  <button className="hover:text-zinc-300 transition-colors">Política de privacidad</button>
                  <span>•</span>
                  <button className="hover:text-zinc-300 transition-colors">Condiciones de uso</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
