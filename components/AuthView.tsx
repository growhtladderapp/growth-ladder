import { supabase } from '../services/supabase';
import React, { useState } from 'react';
import { Logo } from './Logo';
import { Mail, ChevronRight, Chrome, Apple, Loader2, ShieldCheck, Sparkles, Phone } from 'lucide-react';
import { useToast } from '../components/ToastContext';

interface AuthViewProps {
  onLogin: () => void;
  uiText: Record<string, string>;
  onBack?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, uiText, onBack }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const getRedirectUrl = () => {
    let url = window.location.origin;
    // Fix specific issue where users access the site with trailing punctuation (e.g. from a link)
    // which causes the redirect URL to be malformed (e.g. ends with ").")
    return url.replace(/[).]+$/, '');
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Signup
  const [showPassword, setShowPassword] = useState(false);

  const [phone, setPhone] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSocialLogin = async (provider: string) => {
    setLoading(provider);
    setMessage(null);
    try {
      if (provider === 'google' || provider === 'apple') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: provider as any,
          options: {
            redirectTo: getRedirectUrl(),
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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('email');
    setMessage(null);

    try {
      if (isSignUp) {
        // Sign Up Flow
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: getRedirectUrl(),
          },
        });

        if (error) throw error;

        if (data.user && data.session) {
          // User registered and auto-logged in (Supabase default if confirm email is off)
          toast('¡Bienvenido! Tu cuenta ha sido creada.', 'success');
        } else {
          // User registered but needs to confirm email
          setMessage('¡Solicitud enviada! Si no recibes el correo en unos minutos, revisa tu carpeta de Spam. Si ya tienes cuenta, intenta Iniciar Sesión.');
        }

      } else {
        // Sign In Flow (Email + Password)
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        // Login is handled by onAuthStateChange in App.tsx
      }
    } catch (error: any) {
      let errorMessage = error.message;
      if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'Correo o contraseña incorrectos.';
      } else if (errorMessage.includes('User already registered')) {
        errorMessage = 'Ya existe una cuenta con este correo.';
      } else if (errorMessage.includes('rate limit')) {
        errorMessage = 'Demasiados intentos. Espera unos minutos.';
      }
      toast(errorMessage, 'error');
    } finally {
      setLoading(null);
    }
  };

  const handleMagicLink = async () => {
    // Legacy / Alternative: Send Magic Link instead of password
    setLoading('magic');
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: getRedirectUrl() }
      });
      if (error) throw error;
      setMessage('¡Enlace mágico enviado! Revisa tu correo.');
    } catch (error: any) {
      toast(error.message, 'error');
    } finally {
      setLoading(null);
    }
  }

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('phone');
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });
      if (error) throw error;
      setMessage('¡Código enviado! Ingresa el código recibido.');
      setShowPhoneInput(false);
      setShowOtpInput(true);
      toast('SMS enviado. Por favor verifica tu código.', 'success');
    } catch (error: any) {
      let errorMessage = error.message;
      toast(errorMessage, 'error');
    } finally {
      setLoading(null);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('otp');
    setMessage(null);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: otpToken,
        type: 'sms',
      });
      if (error) throw error;
      toast('¡Verificación exitosa!', 'success');
      // Login is handled by onAuthStateChange in App.tsx
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

      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-50 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
        >
          <ChevronRight className="rotate-180" size={16} /> Volver
        </button>
      )}

      {/* Top Section */}
      <div className="relative z-10 flex flex-col items-center mt-10 animate-in fade-in slide-in-from-top-10 duration-1000">
        <div className="mb-6 p-1 bg-white/5 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm scale-110">
          <Logo className="w-20 h-20" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white italic tracking-tighter uppercase text-center leading-none">
          Growth <span className="text-brand-500">Ladder</span>
        </h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-3">Elite Performance System<br /><span className="text-[8px] opacity-70">created by trainingwithhabits</span></p>
      </div>

      {/* Buttons Section */}
      <div className="relative z-10 w-full max-w-sm space-y-3 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">

        {!showEmailInput && !showPhoneInput && !showOtpInput && (
          <>
            {/* Social Login Buttons */}
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

            {/* Separator */}
            <div className="flex items-center gap-4 py-4">
              <div className="flex-1 h-[1px] bg-white/5"></div>
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">o bien</span>
              <div className="flex-1 h-[1px] bg-white/5"></div>
            </div>
          </>
        )}

        {/* Email Login Form */}
        {showEmailInput ? (
          <form onSubmit={handleEmailAuth} className="w-full space-y-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="space-y-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <span className="text-[10px] font-bold uppercase">{showPassword ? 'Ocultar' : 'Ver'}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={!!loading}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50 shadow-lg shadow-brand-900/20"
            >
              {loading === 'email' ? <Loader2 className="animate-spin" size={20} /> : (isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión')}
            </button>

            {/* Toggle Sign Up / Login */}
            <div className="flex items-center justify-between text-xs mt-2 px-1">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-slate-400 hover:text-brand-500 transition-colors"
              >
                {isSignUp ? '¿Ya tienes cuenta? Entra aquí' : '¿No tienes cuenta? Regístrate'}
              </button>

              {!isSignUp && (
                <button
                  type="button"
                  onClick={handleMagicLink}
                  className="text-slate-500 hover:text-slate-300"
                  disabled={!email || loading === 'magic'}
                >
                  {loading === 'magic' ? 'Enviando...' : 'Olvidé mi contraseña'}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => { setShowEmailInput(false); setMessage(null); }}
              className="w-full text-xs text-slate-500 hover:text-slate-300 py-3 mt-2"
            >
              Volver atrás
            </button>

            {message && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"><p className="text-emerald-400 text-xs text-center font-medium">{message}</p></div>}
          </form>
        ) : (
          !showPhoneInput && !showOtpInput && (
            <button
              onClick={() => { setShowEmailInput(true); setShowPhoneInput(false); }}
              disabled={!!loading}
              className={`w-full bg-white/5 border border-white/5 text-slate-300 h-14 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all hover:bg-white/10`}
            >
              <Mail size={20} />
              <span className="text-sm">Usar correo y contraseña</span>
            </button>
          )
        )}

        {/* Phone Login - Only show if not in email mode */}
        {showPhoneInput ? (
          <form onSubmit={handlePhoneLogin} className="w-full space-y-2 animate-in fade-in slide-in-from-bottom-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+54 9 11 ..."
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
              required
            />
            <button
              type="submit"
              disabled={!!loading}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50"
            >
              {loading === 'phone' ? <Loader2 className="animate-spin" size={20} /> : 'Enviar SMS'}
            </button>
            <button
              type="button"
              onClick={() => setShowPhoneInput(false)}
              className="w-full text-xs text-slate-500 hover:text-slate-300 py-1"
            >
              Cancelar
            </button>
            {message && !showEmailInput && <p className="text-emerald-400 text-xs text-center font-medium mt-2">{message}</p>}
          </form>
        ) : (
          /* OTP Input Form */
          showOtpInput ? (
            <form onSubmit={handleOtpVerify} className="w-full space-y-2 animate-in fade-in slide-in-from-bottom-2">
              <div className="text-center mb-2">
                <p className="text-xs text-slate-400">Ingresa el código enviado a</p>
                <p className="text-sm text-white font-bold">{phone}</p>
              </div>
              <input
                type="text"
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value)}
                placeholder="123456"
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-500 transition-colors text-center tracking-widest text-lg"
                required
                maxLength={6}
              />
              <button
                type="submit"
                disabled={!!loading}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50"
              >
                {loading === 'otp' ? <Loader2 className="animate-spin" size={20} /> : 'Verificar Código'}
              </button>
              <button
                type="button"
                onClick={() => { setShowOtpInput(false); setShowPhoneInput(true); setMessage(null); }}
                className="w-full text-xs text-slate-500 hover:text-slate-300 py-1"
              >
                Volver / Reenviar
              </button>
              {message && <p className="text-emerald-400 text-xs text-center font-medium mt-2">{message}</p>}
            </form>
          ) : (
            /* Show phone button only if email input is NOT shown */
            !showEmailInput && (
              <button
                onClick={() => { setShowPhoneInput(true); setShowEmailInput(false); }}
                disabled={!!loading}
                className={`w-full bg-white/5 border border-white/5 text-slate-300 h-14 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all hover:bg-white/10`}
              >
                <Phone size={20} />
                <span className="text-sm">Usar número de teléfono</span>
              </button>
            )
          )
        )}

        <p className="text-center text-[9px] text-slate-600 mt-6 px-8 leading-normal font-medium">
          Al continuar, aceptas nuestros <span className="text-slate-400 underline">Términos de Servicio</span> y <span className="text-slate-400 underline">Política de Privacidad</span>.
        </p>
      </div>

      {/* Security Badge */}
      <div className="relative z-10 flex flex-col items-center gap-2 animate-in fade-in duration-1000 delay-700">
        <div className="flex items-center gap-2 text-slate-700 font-black uppercase text-[8px] tracking-[0.2em]">
          <ShieldCheck size={12} /> Cifrado de grado militar activo
        </div>
        <p className="text-[8px] text-slate-600 font-mono">v1.3 - Phone Auth & Mobile Zoom</p>
      </div>
    </div>
  );
};
