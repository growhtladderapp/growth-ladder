import React, { useState } from 'react';
import { Logo } from './Logo';
import { Trophy, Zap, Activity, Users, ArrowRight, ShieldCheck, Star, X, Map, Compass, Heart, ActivitySquare, Circle, Link2, CircleDashed } from 'lucide-react';

const integrations = [
    { name: "STRAVA", icon: <Map size={24} /> },
    { name: "GARMIN", icon: <Compass size={24} /> },
    { name: "APPLE HEALTH", icon: <Heart size={24} /> },
    { name: "FITBIT", icon: <ActivitySquare size={24} /> },
    { name: "WHOOP", icon: <Circle size={24} /> },
    { name: "HEALTH CONNECT", icon: <Link2 size={24} /> },
    { name: "OURA", icon: <CircleDashed size={24} /> }
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
                    <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-800">
                        <button className="hover:text-brand-600 transition-colors uppercase tracking-widest text-xs">Soluciones</button>
                        <button className="hover:text-brand-600 transition-colors uppercase tracking-widest text-xs">Funciones</button>
                        <button className="hover:text-brand-600 transition-colors uppercase tracking-widest text-xs">Recursos</button>
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
                    <div className="w-full relative">
                        <div className="absolute inset-0 bg-brand-500/20 blur-3xl rounded-full"></div>
                        <img
                            src="/landing-hero-smartwatch.png"
                            alt="Mobile App Interface"
                            className="w-full h-auto object-contain rounded-xl shadow-2xl relative z-10 hover:scale-[1.02] transition-transform duration-500"
                        />
                    </div>
                    <div className="w-full flex justify-center mt-10 z-20">
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

                        <h2 className="text-2xl font-black text-black mb-2 mt-2">Empezar</h2>
                        <p className="text-slate-500 text-sm font-medium mb-8">Escanea este código QR para descargar la app</p>

                        <div className="bg-white border-4 border-zinc-100 rounded-3xl p-4 w-fit mx-auto mb-8 shadow-sm">
                            <img
                                src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://trainingwithhabits.app"
                                alt="QR Code TrainingWithHabits"
                                className="w-48 h-48 mx-auto"
                            />
                        </div>

                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">o encuéntrala en Appstore y Google Play</p>

                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button className="bg-black text-white px-5 py-3 flex items-center justify-center gap-3 rounded-2xl hover:bg-zinc-800 transition-colors shadow-lg w-full">
                                <div className="text-left flex flex-col">
                                    <span className="text-[9px] uppercase tracking-[0.15em] text-slate-400 font-bold leading-none mb-1">Descárgalo en el</span>
                                    <span className="text-base font-bold leading-none">App Store</span>
                                </div>
                            </button>
                            <button className="bg-black text-white px-5 py-3 flex items-center justify-center gap-3 rounded-2xl hover:bg-zinc-800 transition-colors shadow-lg w-full">
                                <div className="text-left flex flex-col">
                                    <span className="text-[9px] uppercase tracking-[0.15em] text-slate-400 font-bold leading-none mb-1">Disponible en</span>
                                    <span className="text-base font-bold leading-none">Google Play</span>
                                </div>
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
