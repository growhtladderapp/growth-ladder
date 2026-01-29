import React from 'react';
import { Logo } from './Logo';
import { Trophy, Zap, Activity, Users, ArrowRight, ShieldCheck, Star } from 'lucide-react';

interface LandingPageProps {
    onGetStarted: () => void;
    onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
    return (
        <div className="min-h-screen bg-brand-dark text-white font-sans selection:bg-brand-500/30 selection:text-brand-200 overflow-x-hidden">

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/80 backdrop-blur-lg border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Logo className="w-10 h-10" />
                        <span className="font-black italic tracking-tighter text-xl uppercase hidden sm:block">Growth Ladder</span>
                    </div>
                    <button
                        onClick={onLogin}
                        className="px-6 py-2.5 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-slate-300 hover:text-white backdrop-blur-md"
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 px-6 overflow-hidden">
                {/* Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/20 blur-[120px] rounded-full animate-pulse-slow pointer-events-none"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-in zoom-in duration-700 delay-200">
                        <ShieldCheck size={14} /> Sistema de Alto Rendimiento
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-black italic tracking-tighter uppercase leading-[0.9] mb-6 drop-shadow-2xl">
                        Escala <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">Sin Límites</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                        La plataforma definitiva para atletas que buscan superar sus marcas.
                        Entrena, mide y evoluciona con inteligencia artificial y gamificación avanzada.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={onGetStarted}
                            className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-[0_0_40px_rgba(249,115,22,0.3)] group"
                        >
                            Empezar Ahora <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={onGetStarted} // Also goes to auth/signup
                            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/10 hover:bg-white/5 text-white rounded-2xl font-bold uppercase tracking-widest text-sm transition-all"
                        >
                            Explorar Demo
                        </button>
                    </div>

                    <p className="mt-8 text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
                        Created by TrainingWithHabits
                    </p>
                </div>
            </header>

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
                    <Stat number="10k+" label="Atletas Activos" />
                    <Stat number="500+" label="Rutinas Pro" />
                    <Stat number="1M+" label="Kilos Levantados" />
                    <Stat number="4.9" label="Calificación App" icon={<Star size={12} className="text-yellow-400 fill-yellow-400 inline mb-1" />} />
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 text-center border-t border-white/5 bg-black/40">
                <div className="flex justify-center mb-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <Logo className="w-12 h-12" />
                </div>
                <p className="text-slate-500 text-xs mb-4">
                    &copy; {new Date().getFullYear()} Growth Ladder. Todos los derechos reservados.
                </p>
                <div className="flex justify-center gap-6 text-[10px] uppercase font-bold text-slate-600 tracking-widest">
                    <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                    <a href="#" className="hover:text-white transition-colors">Términos</a>
                    <a href="#" className="hover:text-white transition-colors">Soporte</a>
                </div>
            </footer>
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
