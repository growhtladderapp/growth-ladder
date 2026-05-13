import React, { useState } from 'react';
import { Logo } from './Logo';
import { Trophy, Zap, Activity, Users, ArrowRight, ShieldCheck, Star, X, Map, Compass, Heart, ActivitySquare, Circle, Link2, CircleDashed, ChevronDown, Brain, Camera, TrendingUp, Flame, Dumbbell, PlaySquare, BookOpen, HelpCircle, Watch, Smartphone, Tablet, Crown, Check, ChefHat } from 'lucide-react';

const integrations = [
    { name: "STRAVA", icon: <Map size={24} /> },
    { name: "GARMIN", icon: <Compass size={24} /> },
    { name: "APPLE HEALTH", icon: <Heart size={24} /> },
    { name: "FITBIT", icon: <ActivitySquare size={24} /> },
    { name: "WHOOP", icon: <Circle size={24} /> },
    { name: "HEALTH CONNECT", icon: <Link2 size={24} /> },
    { name: "OURA", icon: <CircleDashed size={24} /> }
];

const testimonials = [
    { name: "James Wilson", country: "USA", flag: "🇺🇸", text: "TrainingWithHabits literalmente transformó mi físico. El Coach IA adaptó mi dieta cuando me estanqué bajando de peso y logré mi mejor versión.", stars: 5 },
    { name: "Sarah Parker", country: "USA", flag: "🇺🇸", text: "Simplemente espectacular. Escaneo mi almuerzo, me dice los macros exactos, y la gamificación hace que no pierda mi racha de hábitos.", stars: 4.5 },
    { name: "Michael Thompson", country: "USA", flag: "🇺🇸", text: "Como atleta híbrido siempre batallé para equilibrar correr con hipertrofia. Esta aplicación estructuró mis semanas de forma perfecta.", stars: 5 },
    { name: "Emily Davis", country: "USA", flag: "🇺🇸", text: "He probado docenas de apps de fitness, pero ninguna tiene este nivel de inteligencia. El Chef IA me ahorra horas cada semana.", stars: 4.5 },
    { name: "Robert Miller", country: "USA", flag: "🇺🇸", text: "Toda mi vida sentí que las dietas eran aburridas. Aquí soy completamente flexible sin perder el rendimiento. Excelente comunidad.", stars: 5 },
    { name: "Jennifer Brown", country: "USA", flag: "🇺🇸", text: "La app es rapidísima, las gráficas me motivan a nivel extremo y las notificaciones te hacen responsable de tus metas.", stars: 4.5 },
];

interface LandingPageProps {
    onGetStarted: () => void;
    onLogin: () => void;
    onPrivacy: () => void;
    onTerms: () => void;
    onSupport: () => void;
    currentLangCode?: string;
    onLanguageChange?: (lang: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
    onGetStarted, 
    onLogin, 
    onPrivacy, 
    onTerms, 
    onSupport,
    currentLangCode = 'es',
    onLanguageChange
}) => {
    const isEn = currentLangCode === 'en';
    const t = {
        login: isEn ? 'Login' : 'Iniciar Sesión',
        launch: isEn ? 'Launch App' : 'Entrar a la App',
        heroTitle: isEn ? 'Build Good Habits, Break Bad Ones' : 'Crea Buenos Hábitos, Rompe los Malos',
        heroSubtitle: isEn ? 'Train smart with adaptive routines, nutrition tracking and a 24/7 coach.' : 'Entrena inteligente con rutinas adaptativas, seguimiento de nutrición y un coach disponible 24/7.',
        terms: isEn ? 'Terms of use' : 'Términos de uso',
        privacy: isEn ? 'Privacy policy' : 'Privacidad',
        help: isEn ? 'Help Center' : 'Centro de Ayuda',
        features: isEn ? 'Features' : 'Funciones',
        solutions: isEn ? 'Solutions' : 'Soluciones',
        resources: isEn ? 'Resources' : 'Recursos',
        sync: isEn ? 'Sync with your favorite apps' : 'Sincroniza con tus aplicaciones favoritas',
        qualified: isEn ? 'Qualified' : 'Cualificado',
        moreFeatures: isEn ? 'More features to enjoy' : 'Más funcionalidades por disfrutar',
        appleTitle: isEn ? 'Available on All Devices' : 'Disponible para todos los dispositivos',
        appleDesc: isEn ? "Whether you're using your Phone, Tablet, or Watch, TWH is available on all devices, ensuring you have access to your habits wherever you are. Sync your habits seamlessly across all your devices, ensuring you never miss a beat no matter where you are." : 'Ya sea que uses tu celular, tablet o smartwatch, TWH está disponible en todos los dispositivos, asegurando que tengas acceso a tus hábitos dondequiera que estés. Sincroniza tus hábitos sin problemas en todos tus dispositivos.'
    };

    const [showCookies, setShowCookies] = useState(() => {
        return localStorage.getItem('gl_cookies_accepted') !== 'true';
    });
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [showTranslatePrompt, setShowTranslatePrompt] = useState(false);
    const [activeMockScreen, setActiveMockScreen] = useState(0);
    const [showInstallBanner, setShowInstallBanner] = useState(() => {
        return localStorage.getItem('twh_install_banner_dismissed') !== 'true';
    });

    React.useEffect(() => {
        const browserLang = navigator.language.split('-')[0];
        const hasDismissed = localStorage.getItem('twh_translate_prompt_dismissed');
        if (browserLang === 'en' && currentLangCode === 'es' && !hasDismissed) {
            setShowTranslatePrompt(true);
        }
    }, [currentLangCode]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveMockScreen((prev) => (prev + 1) % 3);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleAcceptCookies = () => {
        localStorage.setItem('gl_cookies_accepted', 'true');
        setShowCookies(false);
    };

    const handleDismissInstallBanner = () => {
        localStorage.setItem('twh_install_banner_dismissed', 'true');
        setShowInstallBanner(false);
    };

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

    return (
        <div className="min-h-screen bg-brand-dark text-white font-sans selection:bg-brand-500/30 selection:text-brand-200 overflow-x-hidden">

            {/* PWA Install Banner */}
            {showInstallBanner && (
                <div className="fixed bottom-6 left-4 right-4 z-[200] animate-in slide-in-from-bottom-8 duration-500">
                    <div className="bg-zinc-950 border border-white/10 rounded-3xl p-5 shadow-2xl shadow-black/60 backdrop-blur-xl max-w-md mx-auto">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <img src="/twh-logo-v2.png" alt="TWH" className="w-12 h-12 rounded-2xl object-contain border border-white/10" />
                                <div>
                                    <p className="text-white font-black text-sm">Instala TrainingWithHabits</p>
                                    <p className="text-zinc-500 text-xs">Acceso rápido desde tu pantalla de inicio</p>
                                </div>
                            </div>
                            <button onClick={handleDismissInstallBanner} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors shrink-0">
                                <X size={14} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {isIOS ? (
                                <>
                                    <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3">
                                        <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center shrink-0 text-black font-black text-xs">1</div>
                                        <p className="text-zinc-300 text-xs">Toca el botón <span className="text-white font-bold">Compartir</span> <span className="text-brand-400">⎙</span> en la barra de Safari</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3">
                                        <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center shrink-0 text-black font-black text-xs">2</div>
                                        <p className="text-zinc-300 text-xs">Desplázate y selecciona <span className="text-white font-bold">"Añadir a pantalla de inicio"</span> <span>＋</span></p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3">
                                        <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center shrink-0 text-black font-black text-xs">3</div>
                                        <p className="text-zinc-300 text-xs">Toca <span className="text-white font-bold">"Agregar"</span> y listo — el icono aparecerá en tu inicio</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3">
                                        <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center shrink-0 text-black font-black text-xs">1</div>
                                        <p className="text-zinc-300 text-xs">Toca el menú <span className="text-white font-bold">⋮</span> en la esquina superior derecha de Chrome</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3">
                                        <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center shrink-0 text-black font-black text-xs">2</div>
                                        <p className="text-zinc-300 text-xs">Selecciona <span className="text-white font-bold">"Añadir a pantalla de inicio"</span> o <span className="text-white font-bold">"Instalar app"</span></p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3">
                                        <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center shrink-0 text-black font-black text-xs">3</div>
                                        <p className="text-zinc-300 text-xs">Confirma tocando <span className="text-white font-bold">"Instalar"</span> — aparecerá en tu pantalla de inicio</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-zinc-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity active:scale-95 group focus:outline-none"
                    >
                        <Logo className="w-10 h-10 text-black group-hover:scale-110 transition-transform" />
                    </button>
                    <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-800">
                    </div>
                    <div className="flex items-center gap-3 sm:gap-6">

                        <button onClick={onTerms} className="hidden lg:block text-slate-500 hover:text-black text-[10px] font-bold uppercase tracking-wider transition-colors">{t.terms}</button>
                        <button onClick={onPrivacy} className="hidden lg:block text-slate-500 hover:text-black text-[10px] font-bold uppercase tracking-wider transition-colors">{t.privacy}</button>
                        <button onClick={onSupport} className="hidden lg:block text-slate-500 hover:text-black text-[10px] font-bold uppercase tracking-wider transition-colors">{t.help}</button>
                        <button
                            onClick={onGetStarted}
                            className="px-4 sm:px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-white text-black border border-zinc-200 hover:bg-zinc-50 transition-all shadow-sm active:bg-emerald-500 active:text-white active:scale-95"
                        >
                            {t.launch}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            {/* Hero Section */}
            {/* Hero Section */}
            <header className="relative pt-20 pb-10 sm:pt-24 sm:pb-16 px-6 overflow-hidden flex flex-col-reverse lg:flex-row justify-center items-center gap-10 lg:gap-20 bg-white">
                <div className="max-w-xl text-center lg:text-left z-10">
                    <h1 className="text-4xl sm:text-6xl font-black text-black tracking-tighter mb-6 leading-[1.1]">
                        Crea <span className="text-emerald-500">Buenos Hábitos</span> Rompe <span className="text-orange-500">los Malos</span> cada día con TrainingWithHabits
                    </h1>
                </div>
                <div className="w-full max-w-md lg:max-w-lg flex flex-col items-center relative z-10">
                    <div className="w-full relative flex justify-center perspective-1000">
                        {/* Glow Behind Phone */}
                        <div className={`absolute inset-0 bg-brand-500/20 blur-3xl rounded-full transition-all duration-[2000ms] ${activeMockScreen === 0 ? 'scale-110 opacity-40' : 'scale-75 opacity-20'}`}></div>
                        
                        {/* iPhone 15 Pro Frame */}
                        <div className="relative border-[#1c1c1e] bg-black border-[12px] rounded-[3rem] h-[550px] w-[260px] sm:h-[600px] sm:w-[280px] shadow-2xl ring-1 ring-white/10 rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700">
                            {/* Dynamic Island */}
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[85px] h-[24px] bg-black rounded-full z-20 shadow-[inset_0_0_2px_rgba(255,255,255,0.1)]"></div>
                            
                            {/* Hardware Buttons */}
                            <div className="absolute -left-[14px] top-[100px] w-[2px] h-[26px] bg-[#2c2c2e] rounded-l-md"></div>
                            <div className="absolute -left-[14px] top-[140px] w-[2px] h-[50px] bg-[#2c2c2e] rounded-l-md"></div>
                            <div className="absolute -left-[14px] top-[200px] w-[2px] h-[50px] bg-[#2c2c2e] rounded-l-md"></div>
                            <div className="absolute -right-[14px] top-[160px] w-[2px] h-[70px] bg-[#2c2c2e] rounded-r-md"></div>

                            {/* Screen Content - Sliding Mockups */}
                            <div className="rounded-[2.2rem] overflow-hidden w-full h-full bg-black relative border border-zinc-800/50">
                                <div 
                                    className="flex h-full w-full transition-transform duration-700 ease-in-out" 
                                    style={{ transform: `translateX(-${activeMockScreen * 100}%)` }}
                                >
                                    <div className="w-full h-full shrink-0">
                                        <img src="/mock-1.png" className="w-full h-full object-cover" alt="Habits Dashboard" />
                                    </div>
                                    <div className="w-full h-full shrink-0">
                                        <img src="/mock-2.png" className="w-full h-full object-cover" alt="Statistics View" />
                                    </div>
                                    <div className="w-full h-full shrink-0">
                                        <img src="/mock-3.png" className="w-full h-full object-cover" alt="AI Coach Chat" />
                                    </div>
                                </div>
                                
                                {/* Overlay Gradient for Premium Look */}
                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Integrations Carousel */}
            <section className="w-full py-12 relative overflow-hidden bg-white border-y border-zinc-100">
                <div className="text-center mb-8 relative z-20">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                        {t.sync}
                    </h3>
                </div>

                {/* Left/Right Overlays for gradient fade */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>

                <div className="flex w-full overflow-hidden">
                    <div className="flex items-center gap-16 whitespace-nowrap animate-scroll w-max pr-16">
                        {[...integrations, ...integrations].map((app, i) => (
                            <div key={i} className="flex items-center gap-3 text-slate-400 grayscale hover:grayscale-0 hover:text-black transition-colors duration-300">
                                {app.icon}
                                <span className="font-extrabold text-xl tracking-tight">{app.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-24 px-6 bg-zinc-50 relative overflow-hidden border-y border-zinc-100">
                <div className="max-w-5xl mx-auto flex flex-col items-center justify-center gap-12 relative z-10 text-center">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex items-center gap-2 mb-4">
                            <Crown className="text-yellow-500 fill-yellow-500" size={24} />
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">{isEn ? 'The #1 Habit Tracker' : 'El Rastreador de Hábitos #1'}</span>
                        </div>
                        <div className="flex gap-1 mb-6">
                            {[...Array(5)].map((_, i) => <Star key={i} size={24} className="fill-yellow-400 text-yellow-400" />)}
                        </div>
                        <div className="flex items-center gap-8 sm:gap-12 mt-4">
                            <div className="flex flex-col">
                                <span className="text-3xl sm:text-4xl font-black text-black">4.9</span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.qualified}</span>
                            </div>
                            <div className="w-px h-12 bg-zinc-200"></div>
                            <div className="flex flex-col">
                                <span className="text-3xl sm:text-4xl font-black text-black">1M+</span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{isEn ? 'Users' : 'Usuarios'}</span>
                            </div>
                            <div className="w-px h-12 bg-zinc-200"></div>
                            <div className="flex flex-col">
                                <span className="text-3xl sm:text-4xl font-black text-black">10k+</span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{isEn ? 'Ratings' : 'Reseñas'}</span>
                            </div>
                        </div>
                    </div>


                </div>
                
                {/* Background Decor */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 blur-[120px] rounded-full"></div>
            </section>

            {/* Testimonials Sliding Section */}
            <section className="py-20 bg-white overflow-hidden border-b border-zinc-100">
                <div className="flex w-full overflow-hidden">
                    <div className="flex items-center gap-6 whitespace-nowrap animate-scroll-slow w-max pr-6">
                        {[...testimonials, ...testimonials].map((t, i) => (
                            <div key={i} className="w-[300px] sm:w-[400px] p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col gap-4 whitespace-normal shadow-xl">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <h4 className="font-bold text-white">{t.name}</h4>
                                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{t.country} {t.flag}</p>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={14} 
                                                className={`${i < Math.floor(t.stars) ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-800'} ${i === 4 && t.stars === 4.5 ? 'fill-yellow-400/50 text-yellow-400' : ''}`} 
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-zinc-400 leading-relaxed italic">"{t.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Apple Ecosystem Section */}
            <section className="py-24 px-6 bg-white overflow-hidden">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex justify-center gap-8 mb-10 opacity-20 grayscale">
                        <Smartphone size={40} />
                        <Tablet size={40} />
                        <Watch size={40} />
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tighter mb-6 leading-tight">
                        {t.appleTitle}
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto">
                        {t.appleDesc}
                    </p>
                    <div className="mt-12 flex flex-wrap justify-center gap-4">
                        <div className="px-6 py-2 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-400 text-xs font-bold uppercase tracking-widest">{isEn ? 'Mobile' : 'Celular'}</div>
                        <div className="px-6 py-2 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-400 text-xs font-bold uppercase tracking-widest">Tablet</div>
                        <div className="px-6 py-2 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-400 text-xs font-bold uppercase tracking-widest">{isEn ? 'Smartwatch' : 'Reloj Inteligente'}</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 text-center border-t border-white/5 bg-black/40">
                <div className="flex justify-center mb-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <Logo className="w-12 h-12" />
                </div>
                <p className="text-slate-500 text-xs mb-4">
                    &copy; {new Date().getFullYear()} TWH. Todos los derechos reservados.
                </p>
                <div className="flex justify-center gap-6 text-[10px] uppercase font-bold text-slate-600 tracking-widest">
                    <button onClick={onPrivacy} className="hover:text-white transition-colors">Privacidad</button>
                    <button onClick={onTerms} className="hover:text-white transition-colors">Términos y Condiciones</button>
                    <button onClick={onSupport} className="hover:text-white transition-colors">Soporte</button>
                </div>
            </footer>

            {/* Download Modal */}
            {showDownloadModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] w-full max-w-md p-8 relative shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                        <button
                            onClick={() => setShowDownloadModal(false)}
                            className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-black transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-black text-black mb-2 mt-2">Instalar App</h2>
                        <p className="text-slate-500 text-xs font-medium mb-6 px-4">
                            TWH es una aplicación PWA de última generación. Sigue estos 3 rápidos pasos para instalarla en tu celular sin consumir memoria:
                        </p>

                        <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-5 mb-6 text-left space-y-4 shadow-inner">
                            <div className="flex gap-3 items-start">
                                <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
                                <p className="text-sm text-slate-700 font-medium leading-snug">Abre <strong>trainingwithhabits.app</strong> en el navegador principal de tu celular (Safari en iPhone o Chrome en Android).</p>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
                                <p className="text-sm text-slate-700 font-medium leading-snug">Toca el botón de <strong>Compartir</strong> (📱 iOS) o los <strong>3 puntos</strong> (🤖 Android) en el menú de tu navegador.</p>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
                                <p className="text-sm text-slate-700 font-medium leading-snug">Selecciona la opción <strong>"Agregar a inicio"</strong> ➕ y verás el ícono de TWH junto a tus otras apps.</p>
                            </div>
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-2xl p-3 w-fit mx-auto flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                            <img
                                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://trainingwithhabits.app/?login=true"
                                alt="QR Code"
                                className="w-16 h-16 rounded-lg"
                            />
                            <div className="text-left pr-2">
                                <p className="text-[10px] uppercase font-bold text-brand-500 tracking-wider mb-0.5">Escanea para Iniciar Sesión</p>
                                <p className="font-bold text-sm text-slate-800">Acceso Directo TWH</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cookie Banner */}
            {showCookies && (
                <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 bg-white border-t border-zinc-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full duration-500">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-left flex-1">
                            <h4 className="text-black font-bold text-base mb-1">Usamos Cookies 🍪</h4>
                            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                                Utilizamos cookies propias y de terceros para mejorar tu experiencia, mostrarte contenido personalizado y analizar nuestro tráfico. Al hacer clic en "Aceptar", aceptas el uso de todas las cookies.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button 
                                onClick={onPrivacy}
                                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-sm text-slate-600 bg-zinc-100 hover:bg-zinc-200 transition-colors text-center"
                            >
                                Preferencias
                            </button>
                            <button 
                                onClick={handleAcceptCookies}
                                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/30 text-center"
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Translation Prompt */}
            {showTranslatePrompt && (
                <div className="fixed bottom-24 left-6 right-6 z-[110] max-w-sm mx-auto sm:mx-0 sm:left-6 animate-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-white rounded-3xl p-6 shadow-2xl border border-zinc-100 flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h4 className="text-black font-bold text-sm">Switch to English?</h4>
                                <p className="text-slate-500 text-xs">We noticed your browser is in English.</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => {
                                    onLanguageChange?.('en');
                                    setShowTranslatePrompt(false);
                                }}
                                className="flex-1 bg-black text-white font-bold py-3 rounded-xl text-xs hover:bg-zinc-800 transition-colors"
                            >
                                Yes, translate
                            </button>
                            <button 
                                onClick={() => {
                                    setShowTranslatePrompt(false);
                                    localStorage.setItem('twh_translate_prompt_dismissed', 'true');
                                }}
                                className="px-4 py-3 text-slate-400 font-bold text-xs hover:text-black transition-colors"
                            >
                                No thanks
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const MenuItem = ({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) => (
    <div className="flex gap-4 items-start hover:bg-zinc-50 p-3 rounded-xl transition-colors cursor-pointer group/item">
        <div className={`p-3 rounded-xl flex-shrink-0 transition-transform group-hover/item:scale-105 ${color}`}>
            {icon}
        </div>
        <div className="flex flex-col gap-1 text-left">
            <h4 className="font-bold text-[13px] text-slate-900 leading-none">{title}</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-[1.3]">{desc}</p>
        </div>
    </div>
);
