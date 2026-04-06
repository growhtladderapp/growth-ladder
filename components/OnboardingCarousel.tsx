import React, { useState } from 'react';
import { ChefHat, Activity, Watch, ShieldCheck, Dumbbell, ChevronRight, Check } from 'lucide-react';

interface OnboardingCarouselProps {
    onComplete: () => void;
}

export const OnboardingCarousel: React.FC<OnboardingCarouselProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const slides = [
        {
            title: "Bienvenido a TWH",
            description: "Tu plataforma de rendimiento y bienestar integral de élite. Eleva tus estándares todos los días.",
            icon: <Activity className="w-16 h-16 text-orange-500 mb-6" />
        },
        {
            title: "Entrenador IA 24/7",
            description: "Planes de entrenamiento hiper-personalizados y motivación constante con filosofía estoica para no rendirte jamás.",
            icon: <Dumbbell className="w-16 h-16 text-blue-500 mb-6" />
        },
        {
            title: "Chef Estrella Michelin",
            description: "Una IA experta en nutrición. Sube fotos de tus comidas para un análisis profundo de macronutrientes al instante.",
            icon: <ChefHat className="w-16 h-16 text-red-500 mb-6" />
        },
        {
            title: "Conecta tu Smartwatch",
            description: "Compatible nativamente con todos tus dispositivos Android e iOS para llevar tu seguimiento al máximo nivel.",
            icon: <Watch className="w-16 h-16 text-emerald-500 mb-6" />
        },
        {
            title: "Privacidad y Progreso",
            description: "Acumula experiencia, cumple objetivos semanales y asegura tu progreso con cifrado de grado militar.",
            icon: <ShieldCheck className="w-16 h-16 text-purple-500 mb-6" />
        }
    ];

    const handleNext = () => {
        if (currentStep < slides.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="fixed inset-0 z-[500] bg-black/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            {/* BG ambient effect */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-sm animate-in fade-in zoom-in duration-500 origin-center" key={currentStep}>
                <div className="flex justify-center h-28 items-end animate-in slide-in-from-bottom-2 duration-500">
                    {slides[currentStep].icon}
                </div>

                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4 mt-6 animate-in slide-in-from-bottom-4 duration-500 delay-100">
                    {slides[currentStep].title}
                </h2>

                <p className="text-slate-400 text-sm leading-relaxed mb-12 min-h-[80px] px-2 animate-in slide-in-from-bottom-6 duration-700 delay-200">
                    {slides[currentStep].description}
                </p>

                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mb-10">
                    {slides.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-brand-500' : 'w-2 bg-white/20'}`} />
                    ))}
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={handleNext}
                        className="w-full bg-brand-600 hover:bg-brand-500 text-white h-14 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all shadow-xl shadow-brand-900/20 active:scale-95"
                    >
                        {currentStep === slides.length - 1 ? (
                            <>Comenzar Ahora <Check size={20} /></>
                        ) : (
                            <>Siguiente <ChevronRight size={20} /></>
                        )}
                    </button>

                    {currentStep < slides.length - 1 && (
                        <button
                            onClick={onComplete}
                            className="w-full h-12 text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                            Omitir
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
