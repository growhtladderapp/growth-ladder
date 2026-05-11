import React, { useState } from 'react';
import { Logo } from './Logo';
import { Trophy, Zap, Activity, Users, ArrowRight, ShieldCheck, Star, X, Map, Compass, Heart, ActivitySquare, Circle, Link2, CircleDashed, ChevronDown, Brain, Camera, TrendingUp, Flame, Dumbbell, PlaySquare, BookOpen, HelpCircle, Watch } from 'lucide-react';

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
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onPrivacy, onTerms, onSupport }) => {
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [showCookies, setShowCookies] = useState(() => {
        return localStorage.getItem('gl_cookies_accepted') !== 'true';
    });
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
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={onLogin}
                            className="px-4 sm:px-6 py-2.5 rounded-full font-bold text-sm text-slate-700 hover:text-black hover:bg-zinc-100 transition-all active:scale-95 hidden sm:block"
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => setShowDownloadModal(true)}
                            className="px-4 sm:px-6 py-2.5 rounded-full font-bold text-sm bg-black text-white hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                        >
                            Descargar
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            {/* Hero Section */}
            {/* Hero Section */}
            <header className="relative pt-20 pb-10 sm:pt-24 sm:pb-16 px-6 overflow-hidden flex flex-col-reverse lg:flex-row justify-center items-center gap-10 lg:gap-20 bg-white">
                <div className="max-w-xl text-center lg:text-left z-10">
                    <h1 className="text-4xl sm:text-6xl font-black text-black tracking-tighter mb-6 leading-[0.9]">
                        TU ENTRENADOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">PERSONAL IA</span>
                    </h1>
                    <p className="text-lg text-slate-600 mb-8 font-medium leading-relaxed">
                        Entrena inteligente con rutinas adaptativas, seguimiento de nutrición y un coach disponible 24/7.
                    </p>
                </div>
                <div className="w-full max-w-md lg:max-w-lg flex flex-col items-center relative z-10">
                    <div className="w-full relative flex justify-center perspective-1000">
                        {/* Glow Behind Phone */}
                        <div className="absolute inset-0 bg-brand-500/20 blur-3xl rounded-full scale-75"></div>
                        
                        {/* iPhone 15 Pro Frame */}
                        <div className="relative border-[#1c1c1e] bg-black border-[12px] rounded-[3rem] h-[550px] w-[260px] sm:h-[600px] sm:w-[280px] shadow-2xl ring-1 ring-white/10 rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700">
                            {/* Dynamic Island */}
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[85px] h-[24px] bg-black rounded-full z-20 shadow-[inset_0_0_2px_rgba(255,255,255,0.1)]"></div>
                            
                            {/* Hardware Buttons */}
                            <div className="absolute -left-[14px] top-[100px] w-[2px] h-[26px] bg-[#2c2c2e] rounded-l-md"></div>
                            <div className="absolute -left-[14px] top-[140px] w-[2px] h-[50px] bg-[#2c2c2e] rounded-l-md"></div>
                            <div className="absolute -left-[14px] top-[200px] w-[2px] h-[50px] bg-[#2c2c2e] rounded-l-md"></div>
                            <div className="absolute -right-[14px] top-[160px] w-[2px] h-[70px] bg-[#2c2c2e] rounded-r-md"></div>

                            {/* Screen Content */}
                            <div className="rounded-[2.2rem] overflow-hidden w-full h-full bg-[#0a0a0a] relative flex flex-col p-4 pt-12 pb-6 border border-zinc-800/50">
                                
                                {activeMockScreen === 0 && (
                                    <div className="flex flex-col h-full animate-fade-in">
                                        {/* Header */}
                                        <div className="flex justify-between items-center mb-5">
                                            <div>
                                                <h2 className="text-white font-black text-xl leading-none">Hola, Atleta</h2>
                                                <p className="text-zinc-500 text-[10px] font-bold">Listos para hoy?</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center">
                                                <Flame size={16} />
                                            </div>
                                        </div>
                                        
                                        {/* Progress Ring */}
                                        <div className="bg-[#1c1c1e] rounded-3xl p-3 mb-4 flex items-center gap-3 border border-[#2c2c2e] shadow-lg">
                                            <div className="relative w-14 h-14 shrink-0">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="5" fill="none" className="text-[#2c2c2e]" />
                                                    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="5" fill="none" strokeDasharray="150" strokeDashoffset="40" className="text-brand-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-brand-500 font-black text-xs">75%</span>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold text-xs">Progreso Diario</h3>
                                                <p className="text-zinc-500 text-[9px]">3 de 4 completados</p>
                                            </div>
                                        </div>

                                        {/* Habits */}
                                        <div className="space-y-2 mb-4">
                                            {[
                                                { n: 'Agua', i: '💧', d: true },
                                                { n: 'Entrenamiento', i: '🏋️', d: true },
                                                { n: 'Lectura', i: '📚', d: false }
                                            ].map((h, idx) => (
                                                <div key={idx} className="bg-[#1c1c1e] rounded-2xl p-2.5 flex items-center justify-between border border-[#2c2c2e]">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-xl bg-black flex items-center justify-center text-xs">{h.i}</div>
                                                        <span className="text-white font-bold text-[11px]">{h.n}</span>
                                                    </div>
                                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${h.d ? 'bg-brand-500 text-black shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-[#2c2c2e]'}`}>
                                                        {h.d && <span className="text-[8px] font-black leading-none">✓</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Tools Grid */}
                                        <div className="grid grid-cols-2 gap-2 mt-auto pb-12">
                                            <div className="bg-[#1c1c1e] p-3 rounded-2xl border border-[#2c2c2e]">
                                                <Dumbbell size={14} className="text-brand-500 mb-2" />
                                                <div className="h-1.5 w-12 bg-zinc-700 rounded-full"></div>
                                            </div>
                                            <div className="bg-[#1c1c1e] p-3 rounded-2xl border border-[#2c2c2e]">
                                                <Brain size={14} className="text-purple-500 mb-2" />
                                                <div className="h-1.5 w-12 bg-zinc-700 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeMockScreen === 1 && (
                                    <div className="flex flex-col h-full animate-fade-in">
                                        {/* Coach Chat Mock */}
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center">
                                                <Brain size={20} />
                                            </div>
                                            <div>
                                                <h2 className="text-white font-black text-lg leading-none">Coach IA</h2>
                                                <p className="text-brand-500 text-[10px] font-bold">En línea</p>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col gap-4 pb-12">
                                            <div className="bg-[#1c1c1e] p-3 rounded-2xl rounded-tl-sm self-start border border-[#2c2c2e] max-w-[85%]">
                                                <p className="text-xs text-white">¡Hola! He analizado tu progreso. ¿Listo para la rutina de empuje (pecho/tríceps) de hoy?</p>
                                            </div>
                                            <div className="bg-brand-600 p-3 rounded-2xl rounded-tr-sm self-end max-w-[85%] shadow-[0_4px_20px_rgba(16,185,129,0.3)]">
                                                <p className="text-xs text-white">¡Vamos con todo! ¿Qué recomiendas para empezar?</p>
                                            </div>
                                            <div className="bg-[#1c1c1e] p-3 rounded-2xl rounded-tl-sm self-start border border-[#2c2c2e] max-w-[85%]">
                                                <p className="text-xs text-white">Empecemos con Press de Banca. 4 series de 8-10 reps. Recuerda la retracción escapular.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeMockScreen === 2 && (
                                    <div className="flex flex-col h-full animate-fade-in">
                                        {/* Stats/Scanner Mock */}
                                        <div className="mb-6">
                                            <h2 className="text-white font-black text-lg leading-none">Estadísticas</h2>
                                            <p className="text-zinc-500 text-[10px] font-bold">Últimos 7 días</p>
                                        </div>

                                        <div className="bg-[#1c1c1e] p-4 rounded-3xl border border-[#2c2c2e] mb-4">
                                            <div className="flex items-end gap-2 h-24 mb-2">
                                                {[40, 60, 30, 80, 100, 70, 90].map((h, i) => (
                                                    <div key={i} className="flex-1 bg-[#2c2c2e] rounded-t-sm relative group overflow-hidden">
                                                        <div className="absolute bottom-0 w-full bg-brand-500 rounded-t-sm transition-all" style={{ height: `${h}%` }}></div>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs text-white font-bold text-center mt-2">Tendencia Semanal</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 pb-12">
                                            <div className="bg-[#1c1c1e] p-3 rounded-2xl border border-[#2c2c2e] text-center">
                                                <Flame size={16} className="text-orange-500 mx-auto mb-1" />
                                                <p className="text-white font-black text-sm">2.4k</p>
                                                <p className="text-zinc-500 text-[9px]">Kcal</p>
                                            </div>
                                            <div className="bg-[#1c1c1e] p-3 rounded-2xl border border-[#2c2c2e] text-center">
                                                <Trophy size={16} className="text-yellow-500 mx-auto mb-1" />
                                                <p className="text-white font-black text-sm">5</p>
                                                <p className="text-zinc-500 text-[9px]">Racha</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Bottom Nav Mock */}
                                <div className="absolute bottom-4 left-4 right-4 h-12 bg-[#1c1c1e] rounded-full border border-[#2c2c2e] flex justify-around items-center px-2 z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeMockScreen === 0 ? 'bg-brand-500/20 text-brand-500' : 'text-zinc-500'}`}><ActivitySquare size={14} /></div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeMockScreen === 2 ? 'bg-brand-500/20 text-brand-500' : 'text-zinc-500'}`}><TrendingUp size={14} /></div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeMockScreen === 1 ? 'bg-brand-500/20 text-brand-500' : 'text-zinc-500'}`}><Brain size={14} /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex justify-center mt-8 z-20">
                        <button
                            onClick={() => setShowDownloadModal(true)}
                            className="px-10 py-4 w-full sm:w-auto rounded-full bg-brand-600 text-white font-bold text-lg shadow-xl shadow-brand-500/30 hover:bg-brand-500 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Zap size={20} className="fill-white" /> Empezar Gratis
                        </button>
                    </div>
                </div>
            </header>

            {/* Integrations Carousel */}
            <section className="w-full py-12 relative overflow-hidden bg-white border-y border-zinc-100">
                <div className="text-center mb-8 relative z-20">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                        Sincroniza con tus aplicaciones favoritas
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

            {/* More Features Grid */}
            <section className="py-20 px-6 bg-[#faf9f6] relative z-10 border-b border-zinc-100">
                <div className="max-w-6xl mx-auto text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Más funcionalidades por disfrutar
                    </h2>
                </div>

                <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <ExtraFeatureCard emoji="📈" title="Gráficos de Progreso" />
                    <ExtraFeatureCard emoji="📸" title="Fotos de Progreso" />
                    <ExtraFeatureCard emoji="🥗" title="Lector IA de Alimentos" />
                    <ExtraFeatureCard emoji="🏋️‍♂️" title="Base de Datos Verificada" />
                    <ExtraFeatureCard emoji="⌚" title="App para Smartwatch" />
                    <ExtraFeatureCard emoji="🔄" title="Sincronizar con otras Apps" />
                    <ExtraFeatureCard emoji="💧" title="Registro de Agua" />
                    <ExtraFeatureCard emoji="🔥" title="Medidor de Rachas" />
                    <ExtraFeatureCard emoji="👥" title="Comunidad TWH" />
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard
                        icon={Trophy}
                        title="Gamificación Pro"
                        desc="Convierte cada gota de sudor en XP. Desbloquea niveles, logros y compite en el ranking global."
                        color="from-yellow-400 to-orange-500"
                        delay="0"
                    />
                    <FeatureCard
                        icon={Zap}
                        title="AI Coach"
                        desc="Un asistente inteligente que analiza tu rendimiento y optimiza tus rutinas en tiempo real."
                        color="from-brand-400 to-red-500"
                        delay="100"
                    />
                    <FeatureCard
                        icon={Activity}
                        title="DataVista"
                        desc="Visualiza tu progreso con métricas avanzadas de biometría, cargas y recuperación."
                        color="from-blue-400 to-indigo-500"
                        delay="200"
                    />
                    <FeatureCard
                        icon={Users}
                        title="Comunidad Élite"
                        desc="Conecta con atletas de tu nivel. Comparte récords y motívate con el éxito de otros."
                        color="from-emerald-400 to-teal-500"
                        delay="300"
                    />
                </div>
            </section>

            {/* Testimonials Marquee */}
            <section className="py-24 bg-brand-dark relative z-10 overflow-hidden">
                <div className="max-w-6xl mx-auto text-center mb-16 px-6">
                    <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter mb-4">
                        Únete a millones como tú <br className="hidden sm:block" />y transforma tu vida
                    </h2>
                    <p className="text-brand-500 font-bold uppercase tracking-widest text-xs">No confíes en nosotros. Confía en ellos.</p>
                </div>

                {/* Left/Right Overlays for gradient fade (dark mode) */}
                <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-r from-brand-dark to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-brand-dark to-transparent z-10 pointer-events-none"></div>

                <div className="flex w-full overflow-hidden group">
                    <div className="flex gap-6 whitespace-nowrap animate-scroll w-max pr-6 group-hover:[animation-play-state:paused] transition-all">
                        {[...testimonials, ...testimonials].map((t, i) => (
                            <div key={i} className="w-[300px] sm:w-[400px] whitespace-normal bg-zinc-900/40 border border-white/5 hover:border-white/10 hover:bg-zinc-800/40 transition-colors p-8 rounded-[2rem] shrink-0 flex flex-col gap-6 select-none">
                                <div className="flex gap-1.5">
                                    {[...Array(5)].map((_, j) => <Star key={j} size={16} className="fill-brand-500 text-brand-500" />)}
                                </div>
                                <p className="text-slate-300 italic text-sm leading-relaxed flex-grow">"{t.text}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-orange-400 flex items-center justify-center font-bold text-white shadow-lg text-lg">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold text-sm leading-none">{t.name}</span>
                                        <span className="text-slate-500 text-xs font-semibold mt-1.5">{t.flag} {t.country}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof / Stats */}
            <section className="py-20 border-y border-white/5 bg-black/20 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-12 text-center">
                    <Stat number="+10k" label="Atletas Activos" />
                    <Stat number="+150" label="Modos Deportivos" />
                    <Stat number="+50k" label="Sesiones Finalizadas" />
                    <Stat number="4.9/5" label="Valoración" icon={<Star size={12} className="text-yellow-400 fill-yellow-400 inline mb-1" />} />
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
                                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://trainingwithhabits.app"
                                alt="QR Code"
                                className="w-16 h-16 rounded-lg"
                            />
                            <div className="text-left pr-2">
                                <p className="text-[10px] uppercase font-bold text-brand-500 tracking-wider mb-0.5">Escanea para ir directo</p>
                                <p className="font-bold text-sm text-slate-800">Abre la cámara web</p>
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
