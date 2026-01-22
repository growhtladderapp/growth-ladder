import { supabase } from '../services/supabase';
import React, { useState } from 'react';
import { Logo } from './Logo';
import { Mail, ChevronRight, Chrome, Apple, Loader2, ShieldCheck, Sparkles, Phone } from 'lucide-react';
import { useToast } from '../components/ToastContext';

interface AuthViewProps {
  onLogin: () => void;
  uiText: Record<string, string>;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, uiText }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSocialLogin = async (provider: string) => {
    if (provider === 'phone') {
      toast('Inicio de sesión con teléfono próximamente', 'info');
      return;
    }

    setLoading(provider);
    setMessage(null);
    try {
      if (provider === 'google' || provider === 'apple') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: provider as any,
          options: {
            redirectTo: window.location.origin,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          }
        });
        if (error) throw error;
      }
    } catch (error: any) {
      toast(error.message || 'Error signing in', 'error');
      setLoading(null);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('email');
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      setMessage('¡Enlace mágico enviado! Revisa tu correo.');
    } catch (error: any) {
      toast(error.message, 'error');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-brand-dark flex flex-col items-center justify-between p-8 pb-12 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[50%] bg-brand-500/10 blur-[120px] rounded-full"></div>

      {/* Top Section */}
      <div className="relative z-10 flex flex-col items-center mt-20 animate-in fade-in slide-in-from-top-10 duration-1000">
        <div className="mb-6 p-1 bg-white/5 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm">
          <Logo className="w-24 h-24" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white italic tracking-tighter uppercase text-center leading-none">
          Growth <span className="text-brand-500">Ladder</span>
        </h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-3">Elite Performance System<br /><span className="text-[8px] opacity-70">created by trainingwithhabits</span></p>
      </div>

      {/* Middle Text */}
      <div className="relative z-10 text-center px-4 max-w-xs animate-in fade-in duration-1000 delay-300">
        <h2 className="text-xl font-bold text-white mb-2 italic">Escala sin límites</h2>
        <p className="text-slate-400 text-xs leading-relaxed">Únete a la comunidad de atletas de alto rendimiento potenciados por Inteligencia Artificial.</p>
      </div>

      {/* Buttons Section */}
      <div className="relative z-10 w-full max-w-sm space-y-3 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">

        {/* Google Login */}
        <button
          onClick={() => handleSocialLogin('google')}
          disabled={!!loading}
          className="w-full bg-white text-black h-14 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl"
        >
          {loading === 'google' ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <img src="/google-logo.jpg" alt="Google" className="w-6 h-6 object-contain" />
              <span>Continuar con Google</span>
            </>
          )}
        </button>

        {/* Apple Login */}
        <button
          onClick={() => handleSocialLogin('apple')}
          disabled={!!loading}
          className="w-full bg-black border border-white/10 text-white h-14 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading === 'apple' ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <img src="/apple-logo.jpg" alt="Apple" className="w-6 h-6 object-contain invert" />
              <span>Continuar con Apple</span>
            </>
          )}
        </button>

        {/* Separator - Minimalist */}
        <div className="flex items-center gap-4 py-4">
          <div className="flex-1 h-[1px] bg-white/5"></div>
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">o bien</span>
          <div className="flex-1 h-[1px] bg-white/5"></div>
        </div>

        {/* Email Login - Minimalist */}
        {showEmailInput ? (
          <form onSubmit={handleEmailLogin} className="w-full space-y-2 animate-in fade-in slide-in-from-bottom-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
              required
            />
            <button
              type="submit"
              disabled={!!loading}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50"
            >
              {loading === 'email' ? <Loader2 className="animate-spin" size={20} /> : 'Enviar enlace de acceso'}
            </button>
            <button
              type="button"
              onClick={() => setShowEmailInput(false)}
              className="w-full text-xs text-slate-500 hover:text-slate-300 py-1"
            >
              Cancelar
            </button>
            {message && <p className="text-emerald-400 text-xs text-center font-medium mt-2">{message}</p>}
          </form>
        ) : (
          <button
            onClick={() => setShowEmailInput(true)}
            disabled={!!loading}
            className="w-full bg-white/5 border border-white/5 text-slate-300 h-14 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all hover:bg-white/10"
          >
            <Mail size={20} />
            <span className="text-sm">Usar correo electrónico</span>
          </button>
        )}

        {/* Phone Login - Minimalist */}
        <button
          onClick={() => handleSocialLogin('phone')}
          disabled={!!loading}
          className="w-full bg-white/5 border border-white/5 text-slate-300 h-14 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all hover:bg-white/10"
        >
          <Phone size={20} />
          <span className="text-sm">Usar número de teléfono</span>
        </button>

        <p className="text-center text-[9px] text-slate-600 mt-6 px-8 leading-normal font-medium">
          Al continuar, aceptas nuestros <span className="text-slate-400 underline">Términos de Servicio</span> y <span className="text-slate-400 underline">Política de Privacidad</span>.
        </p>
      </div>

      {/* Security Badge */}
      <div className="relative z-10 flex items-center gap-2 text-slate-700 font-black uppercase text-[8px] tracking-[0.2em] animate-in fade-in duration-1000 delay-700">
        <ShieldCheck size={12} /> Cifrado de grado militar activo
      </div>
    </div>
  );
};
