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

         <header className="px-1 text-center mt-4">
            <div className="inline-flex p-4 rounded-full bg-slate-800/50 mb-4 border border-slate-700">
               <Users size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">
               Comunidad Elite
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto mb-8">
               Conecta con profesionales. Entrena con los mejores.
            </p>
         </header>

         <div className="space-y-4 px-2">
            {/* ESTADO: REVISIÓN PENDIENTE */}
            {trainerStep === 'review' ? (
               <div className="bg-zinc-900 border border-yellow-500/20 p-6 rounded-2xl text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                     <ShieldCheck size={32} className="text-yellow-500" />
                  </div>
                  <div>
                     <h3 className="text-white font-bold text-lg mb-1">Verificación en Proceso</h3>
                     <p className="text-slate-400 text-xs">
                        Hemos recibido tu título habilitante. Nuestro equipo validará tus credenciales en las próximas 24-48 horas.
                     </p>
                  </div>
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center gap-3 text-left">
                     <FileText size={20} className="text-slate-500" />
                     <div>
                        <p className="text-white text-xs font-bold">titulo_entrenador.pdf</p>
                        <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">Pendiente</p>
                     </div>
                  </div>
               </div>
            ) : (
               <>
                  {/* Opción 1: Buscar Entrenador */}
                  <button
                     onClick={handleFindTrainer}
                     className="w-full bg-zinc-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between group hover:border-slate-600 transition-all active:scale-95"
                  >
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                           <Filter size={24} />
                        </div>
                        <div className="text-left">
                           <h3 className="text-white font-bold text-lg">Buscar Entrenador</h3>
                           <p className="text-slate-500 text-xs text-left">Encuentra tu guía ideal</p>
                        </div>
                     </div>
                     <div className="px-3 py-1 rounded bg-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        0 Disp.
                     </div>
                  </button>

                  {/* Opción 2: Ser Entrenador (Upload) */}
                  <div className="relative">
                     <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*,.pdf"
                     />
                     <button
                        onClick={handleBecomeTrainerClick}
                        disabled={uploading}
                        className="w-full bg-gradient-to-r from-brand-900/40 to-black border border-brand-500/20 p-6 rounded-2xl flex items-center justify-between group hover:border-brand-500/50 transition-all active:scale-95 relative overflow-hidden"
                     >
                        <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center gap-4 relative z-10">
                           <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-500">
                              {uploading ? <Loader2 size={24} className="animate-spin" /> : <Star size={24} fill="currentColor" />}
                           </div>
                           <div className="text-left">
                              <h3 className="text-white font-bold text-lg">
                                 {uploading ? "Subiendo..." : "¿Eres Entrenador?"}
                              </h3>
                              <p className="text-slate-400 text-xs text-brand-200">
                                 {uploading ? "Procesando documento" : "Únete al equipo oficial"}
                              </p>
                           </div>
                        </div>
                        {!uploading && <Upload className="text-brand-500 relative z-10" size={20} />}
                     </button>
                  </div>
               </>
            )}
         </div>

         {/* Info Box */}
         <div className="mt-8 mx-4 p-4 rounded-xl bg-blue-900/20 border border-blue-500/30 flex gap-3">
            <CheckCircle2 className="text-blue-400 shrink-0" size={20} />
            <div>
               <h4 className="text-blue-200 font-bold text-xs uppercase mb-1">Verificación Estricta</h4>
               <p className="text-blue-200/70 text-[10px] leading-relaxed">
                  Para garantizar la calidad, todos los entrenadores deben presentar documentación oficial habilitante (Título/Certificado) antes de aparecer en la plataforma.
               </p>
            </div>
         </div>
      </div>
   );
};
