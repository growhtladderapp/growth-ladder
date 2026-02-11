import React, { useState, useRef } from 'react';
import { Users, ChevronLeft, Star, MapPin, Instagram, CheckCircle2, MessageCircle, ArrowRight, Filter, Upload, FileText, Loader2, ShieldCheck } from 'lucide-react';
import { ViewState } from '../types';
import { useToast } from '../components/ToastContext';

interface CommunityViewProps {
   setView: (view: ViewState) => void;
   isPro: boolean;
   uiText: Record<string, string>;
}

type TrainerStep = 'idle' | 'uploading' | 'review' | 'verified';

export const CommunityView: React.FC<CommunityViewProps> = ({ setView, isPro, uiText }) => {
   const { toast } = useToast();
   const [trainerStep, setTrainerStep] = useState<TrainerStep>('idle');
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [uploading, setUploading] = useState(false);

   const handleBecomeTrainerClick = () => {
      fileInputRef.current?.click();
   };

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
         setUploading(true);
         // Simulate upload delay
         setTimeout(() => {
            setUploading(false);
            setTrainerStep('review');
            toast("Documento enviado con éxito. En revisión.", "success");
         }, 2000);
      }
   };

   const handleFindTrainer = () => {
      toast("Aún no hay entrenadores verificados en tu zona.", "info");
   };

   return (
      <div className="pb-24 pt-4 animate-fade-in space-y-6">
         {/* Header */}
         <div className="flex justify-between items-center">
            <button
               onClick={() => setView(ViewState.DASHBOARD)}
               className="flex items-center gap-2 text-slate-400 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors"
            >
               <ChevronLeft size={16} /> Volver
            </button>
         </div>

         {/* Header Removed for Coming Soon Layout */}

         <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl flex items-center justify-center shadow-2xl border border-white/5 relative overflow-hidden group">
               <div className="absolute inset-0 bg-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <Users size={48} className="text-slate-600 group-hover:text-brand-500 transition-colors duration-500" />
            </div>

            <div className="space-y-2">
               <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                  Entrenadores <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-700">Personales</span>
               </h2>
               <div className="inline-block px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                  <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-[0.2em] animate-pulse">
                     Próximamente
                  </p>
               </div>
            </div>

            <p className="text-slate-500 text-xs max-w-[280px] leading-relaxed mx-auto">
               Estamos reclutando a la élite del fitness. Pronto podrás contratar planes personalizados de profesionales verificados.
            </p>

            <div className="pt-8 w-full max-w-xs opacity-50 pointer-events-none grayscale">
               {/* Mock UI to show what's coming */}
               <div className="bg-zinc-900 border border-white/5 p-4 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                     <div className="h-2 w-2/3 bg-slate-800 rounded"></div>
                     <div className="h-2 w-1/2 bg-slate-800 rounded"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
