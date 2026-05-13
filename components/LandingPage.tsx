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
    { name: "Mateo Arismendi", country: "España", flag: "🇪🇸", text: "TWH literalmente transformó mi físico. El Coach IA adaptó mi dieta cuando me estanqué bajando de peso y logré mi mejor versión. Nunca más vuelvo a entrenar a ciegas." },
    { name: "Valentina Rojas", country: "Colombia", flag: "🇨🇴", text: "Simplemente espectacular. Escaneo mi almuerzo, me dice los macros exactos, y la gamificación hace que no pierda mi racha de hábitos. Súper recomendada." },
    { name: "Lucas Torres", country: "Argentina", flag: "🇦🇷", text: "Como atleta híbrido siempre batallé para equilibrar correr con hipertrofia de alto volumen. Esta aplicación estructuró mis semanas de forma perfecta." },
    { name: "Sofía Morales", country: "México", flag: "🇲🇽", text: "He probado docenas de apps de fitness, pero ninguna tiene este nivel de inteligencia. El Chef IA me ahorra horas planificando la nutrición los domingos." },
    { name: "Alejandro Silva", country: "Chile", flag: "🇨🇱", text: "Toda mi vida sentí que las dietas eran aburridas. Aquí soy completamente flexible sin perder el rendimiento. Excelente comunidad Élite de apoyo." },
    { name: "Diego Fuentes", country: "Perú", flag: "🇵🇪", text: "La app es rapidísima, las gráficas biométricas me motivan a nivel extremo y las notificaciones te hacen responsable y estoico ante todo. Le doy 5 estrellas." },
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
        launch: isEn ? 'Launch App' : 'Launch App',
        heroTitle: isEn ? 'Build Good Habits Break Bad Ones' : 'Build Good Habits Break Bad Ones',
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
        appleTitle: isEn ? 'Available on All Apple Devices' : 'Disponible en todos los dispositivos Apple',
        appleDesc: isEn ? "Whether you're using your Phone, iPad, or Watch, TWH is available on all devices, ensuring you have access to your habits wherever you are. Sync your habits seamlessly across all your Apple devices with support, ensuring you never miss a beat no matter where you are." : 'Ya sea que uses tu iPhone, iPad o Apple Watch, TWH está disponible en todos los dispositivos, asegurando que tengas acceso a tus hábitos dondequiera que estés. Sincroniza tus hábitos sin problemas en todos tus dispositivos Apple.'
    };

    const [showCookies, setShowCookies] = useState(() => {
        return localStorage.getItem('gl_cookies_accepted') !== 'true';
    });
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [activeMockScreen, setActiveMockScreen] = useState(0);

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

    return (
        <div className="min-h-screen bg-brand-dark text-white font-sans selection:bg-brand-500/30 selection:text-brand-200 overflow-x-hidden">

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-zinc-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity active:scale-95 group focus:outline-none"
                    >
                        <Logo className="w-10 h-10 text-black group-hover:scale-110 transition-transform" />
                        <span className="font-extrabold tracking-tight text-xl text-black hidden sm:block font-display">TWH</span>
                    </button>
                    <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-800">
                        {/* Soluciones Menu */}
                        <div className="relative group py-6">
                            <button className="hover:text-brand-600 transition-colors uppercase tracking-widest text-xs flex items-center gap-1 focus:outline-none">
                                Soluciones <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                            </button>
                            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-2xl shadow-2xl border border-zinc-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-6 grid grid-cols-2 gap-x-6 gap-y-2 z-[60]">
                                <MenuItem icon={<Activity size={20} />} title="Atleta Híbrido" desc="Combina fuerza e hipertrofia con resistencia aeróbica" color="text-orange-600 bg-orange-100" />
                                <MenuItem icon={<Flame size={20} />} title="Recomposición Corporal" desc="Quema grasa mientras mantienes tu masa muscular" color="text-red-500 bg-red-100" />
                                <MenuItem icon={<Dumbbell size={20} />} title="Hipertrofia Pura" desc="Gana tamaño y fuerza con rutinas especializadas" color="text-zinc-700 bg-zinc-100" />
                                <MenuItem icon={<Zap size={20} />} title="Rendimiento Deportivo" desc="Optimiza tu capacidad y bate tus propios récords" color="text-yellow-500 bg-yellow-100" />
                            </div>
                        </div>

                        {/* Funciones Menu */}
                        <div className="relative group py-6">
                            <button className="hover:text-brand-600 transition-colors uppercase tracking-widest text-xs flex items-center gap-1 focus:outline-none">
                                Funciones <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                            </button>
                            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[650px] bg-white rounded-2xl shadow-2xl border border-zinc-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-6 grid grid-cols-2 gap-x-6 gap-y-2 z-[60]">
                                <MenuItem icon={<Camera size={20} />} title="Chef IA" desc="Análisis visual de alimentos y creación de recetas" color="text-green-600 bg-green-100" />
                                <MenuItem icon={<Brain size={20} />} title="Coach IA Estoico" desc="Entrenador 24/7 que planifica tu progreso" color="text-blue-600 bg-blue-100" />
                                <MenuItem icon={<Trophy size={20} />} title="Gamificación" desc="Convierte tu sudor en XP y desbloquea niveles" color="text-yellow-600 bg-yellow-100" />
                                <MenuItem icon={<TrendingUp size={20} />} title="Tracking Biométrico" desc="Seguimiento de macros, peso y medidas" color="text-purple-600 bg-purple-100" />
                                <MenuItem icon={<Watch size={20} />} title="Sincronización Total" desc="Conecta con Strava, Garmin y wearables" color="text-brand-600 bg-brand-100" />
                            </div>
                        </div>

                        {/* Recursos Menu */}
                        <div className="relative group py-6">
                            <button className="hover:text-brand-600 transition-colors uppercase tracking-widest text-xs flex items-center gap-1 focus:outline-none">
                                Recursos <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                            </button>
                            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-2xl shadow-2xl border border-zinc-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-6 grid grid-cols-2 gap-x-6 gap-y-2 z-[60]">
                                <MenuItem icon={<PlaySquare size={20} />} title="Biblioteca de Ejercicios" desc="Guías técnicas de más de 300 movimientos" color="text-red-600 bg-red-100" />
                                <MenuItem icon={<BookOpen size={20} />} title="Blog del Atleta" desc="Ciencia del entrenamiento y filosofía estoica" color="text-zinc-700 bg-zinc-100" />
                                <MenuItem icon={<Users size={20} />} title="Comunidad Élite" desc="Fórums, grupos y soporte entre atletas" color="text-emerald-600 bg-emerald-100" />
                                <MenuItem icon={<HelpCircle size={20} />} title="Centro de Ayuda" desc="Tutoriales, configuraciones y asistencia" color="text-blue-500 bg-blue-100" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-6">
                        {/* Language Switcher */}
                        <div className="flex items-center bg-zinc-100 rounded-full p-1 mr-2">
                            <button 
                                onClick={() => onLanguageChange?.('es')}
                                className={`px-2 py-1 rounded-full text-[10px] font-black transition-all ${!isEn ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                ES
                            </button>
                            <button 
                                onClick={() => onLanguageChange?.('en')}
                                className={`px-2 py-1 rounded-full text-[10px] font-black transition-all ${isEn ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                EN
                            </button>
                        </div>

                        <button onClick={onTerms} className="hidden lg:block text-slate-500 hover:text-black text-[10px] font-bold uppercase tracking-wider transition-colors">{t.terms}</button>
                        <button onClick={onPrivacy} className="hidden lg:block text-slate-500 hover:text-black text-[10px] font-bold uppercase tracking-wider transition-colors">{t.privacy}</button>
                        <button onClick={onSupport} className="hidden lg:block text-slate-500 hover:text-black text-[10px] font-bold uppercase tracking-wider transition-colors">{t.help}</button>
                        <button
                            onClick={onLogin}
                            className="px-3 sm:px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm text-slate-700 hover:text-black hover:bg-zinc-100 transition-all active:scale-95"
                        >
                            {t.login}
                        </button>
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
                        Build <span className="text-emerald-500">Good Habits</span> Break <span className="text-orange-500">Bad Ones</span> everyday with app good habits
                    </h1>
                    <p className="text-lg text-slate-600 mb-8 font-medium leading-relaxed">
                        {t.heroSubtitle}
                    </p>
                    <div className="w-full flex justify-center lg:justify-start mt-8 z-20">
                        <button
                            onClick={onGetStarted}
                            className="px-10 py-4 w-full sm:w-auto rounded-full bg-white text-black font-bold text-lg border-2 border-zinc-100 shadow-xl hover:bg-zinc-50 hover:scale-105 active:bg-emerald-500 active:text-white active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Zap size={20} className="fill-current" /> {t.launch}
                        </button>
                    </div>
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

                            {/* Screen Content - Real App Iframe */}
                            <div className="rounded-[2.2rem] overflow-hidden w-full h-full bg-black relative border border-zinc-800/50">
                                <iframe 
                                    src={`${window.location.origin}/?preview=true`}
                                    className="w-full h-full border-none pointer-events-none select-none"
                                    title="App Preview"
                                />
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

            {/* Trust Section - LeafLeaf */}
            <section className="py-24 px-6 bg-zinc-50 relative overflow-hidden border-y border-zinc-100">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-2 mb-4">
                            <Crown className="text-yellow-500 fill-yellow-500" size={24} />
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">The #1 Habit Tracker</span>
                        </div>
                        <h2 className="text-5xl font-black text-black tracking-tighter mb-4 flex items-center gap-4">
                            LeafLeaf
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />)}
                            </div>
                        </h2>
                        <div className="flex items-center gap-6 mt-4">
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-black">4.9</span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.qualified}</span>
                            </div>
                            <div className="w-px h-10 bg-zinc-200"></div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-black">1M+</span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Users</span>
                            </div>
                            <div className="w-px h-10 bg-zinc-200"></div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-black">10k+</span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ratings</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        {/* Laurels Effect - Corona y Laureles */}
                        <div className="absolute -inset-16 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="w-80 h-80 border-[2px] border-emerald-500 rounded-full border-dashed animate-[spin_30s_linear_infinite]"></div>
                        </div>
                        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-zinc-100 flex flex-col items-center relative z-20">
                            <div className="w-24 h-24 bg-brand-500 rounded-3xl flex items-center justify-center shadow-xl shadow-brand-500/30 mb-6 rotate-3 group-hover:rotate-0 transition-transform">
                                <Logo className="w-14 h-14 text-white" />
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 mb-2">
                                <Check size={14} className="text-emerald-500 stroke-[3]" />
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">App Store Editor's Choice</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Background Decor */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 blur-[120px] rounded-full"></div>
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
                        <div className="px-6 py-2 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-400 text-xs font-bold uppercase tracking-widest">iPhone</div>
                        <div className="px-6 py-2 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-400 text-xs font-bold uppercase tracking-widest">iPad</div>
                        <div className="px-6 py-2 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-400 text-xs font-bold uppercase tracking-widest">Apple Watch</div>
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
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc, color, delay }: { icon: any, title: string, desc: string, color: string, delay: string }) => (
    <div
        className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-white/10 hover:bg-zinc-800/50 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={28} />
        </div>
        <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tight">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
);

const Stat = ({ number, label, icon }: { number: string, label: string, icon?: React.ReactNode }) => (
    <div>
        <h4 className="text-3xl sm:text-4xl font-black text-white italic tracking-tighter mb-1 flex justify-center items-center gap-1">
            {number} {icon}
        </h4>
        <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">{label}</p>
    </div>
);

const ExtraFeatureCard = ({ emoji, title }: { emoji: string, title: string }) => (
    <div className="p-8 pb-10 rounded-[2rem] bg-white border border-zinc-100 hover:border-zinc-200 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col items-center justify-center gap-6 group cursor-pointer">
        <div className="text-[4rem] leading-none group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 drop-shadow-sm filter">
            {emoji}
        </div>
        <h4 className="text-slate-800 font-bold text-base tracking-tight">{title}</h4>
    </div>
);

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
