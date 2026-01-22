
import React, { useRef, useState, useEffect } from 'react';
import { Camera, Zap, X, CheckCircle2, ScanBarcode, Utensils, Search, AlertCircle, ChevronRight, RefreshCw, Loader2, ShieldCheck, CameraIcon, Sparkles } from 'lucide-react';
import { analyzeFoodImage } from '../services/geminiService';
import { FoodAnalysis, DailyLogEntry } from '../types';

interface FoodScannerProps {
  onSave: (entry: DailyLogEntry) => void;
  isPro?: boolean;
}

export const FoodScanner: React.FC<FoodScannerProps> = ({ onSave, isPro = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scannedResult, setScannedResult] = useState<FoodAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error' | 'denied'>('idle');

  // We no longer start camera on useEffect mount to satisfy the "don't ask on start" requirement.
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      setStatus('loading');
      setError(null);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Tu dispositivo no soporta el acceso a la cámara mediante el navegador.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.error("Play error:", e));
          setStatus('ready');
        };
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
         setStatus('denied');
         setError("Acceso denegado. Por favor, revisa la configuración de tu navegador para permitir el uso de la cámara.");
      } else {
         setStatus('error');
         setError("No se pudo iniciar la cámara. Asegúrate de que no esté siendo usada por otra aplicación.");
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      videoRef.current.srcObject = null;
    }
  };

  const captureAndAnalyze = async () => {
    if (videoRef.current && canvasRef.current && !isAnalyzing) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context && video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
        setIsAnalyzing(true);
        
        try {
          const analysis = await analyzeFoodImage(imageBase64);
          setScannedResult(analysis);
          stopCamera();
        } catch (err) {
          setError("No se pudo analizar la imagen. Inténtalo de nuevo con mejor iluminación.");
        } finally {
          setIsAnalyzing(false);
        }
      }
    }
  };

  const accentColor = isPro ? 'text-emerald-500' : 'text-brand-500';
  const buttonBg = isPro ? 'bg-emerald-600' : 'bg-brand-600';
  const borderAccent = isPro ? 'border-emerald-500' : 'border-brand-500';

  // INITIAL STATE: Intro screen before asking for permissions
  if (status === 'idle' && !scannedResult) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-[#0a0a0a] animate-fade-in text-center">
         <div className="absolute top-0 left-0 w-full z-20 p-4 pt-6 flex justify-end">
            <button onClick={() => onSave({} as any)} className="bg-slate-800/80 p-2 rounded-full text-white">
               <X size={20} />
            </button>
         </div>

         <div className={`w-24 h-24 rounded-3xl ${isPro ? 'bg-emerald-500/10' : 'bg-brand-500/10'} border border-slate-800 flex items-center justify-center mb-6 relative`}>
            <CameraIcon className={accentColor} size={40} />
            <div className={`absolute -top-2 -right-2 ${buttonBg} p-1.5 rounded-lg shadow-lg`}>
               <Sparkles size={16} className="text-white" />
            </div>
         </div>

         <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">Scanner <span className={accentColor}>AI</span></h2>
         <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-xs">
            Apunta a tu comida para obtener un desglose instantáneo de calorías y macros mediante inteligencia artificial visual.
         </p>

         <div className="space-y-4 w-full max-w-xs">
            <button 
              onClick={startCamera}
              className={`w-full py-5 rounded-2xl font-black text-white ${buttonBg} shadow-[0_0_25px_rgba(0,0,0,0.5)] active:scale-95 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3`}
            >
               Activar Escáner <ChevronRight size={18} />
            </button>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
               Se requerirán permisos de cámara
            </p>
         </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] relative animate-fade-in">
      <div className="absolute top-0 left-0 w-full z-20 p-4 pt-6 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center">
         <div className="flex items-center gap-2">
            <ScanBarcode className={accentColor} size={20} />
            <span className="text-white font-bold tracking-wider text-sm uppercase">Scanner Nutricional</span>
         </div>
         <button onClick={() => { stopCamera(); onSave({} as any); }} className="bg-slate-800/80 p-2 rounded-full text-white backdrop-blur-md">
            <X size={20} />
         </button>
      </div>

      {!scannedResult ? (
        <div className="relative flex-1 bg-[#0a0a0a] flex flex-col justify-center overflow-hidden">
           {status === 'loading' && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-white bg-[#0a0a0a]">
                 <Loader2 className={`animate-spin mb-4 ${accentColor}`} size={40} />
                 <p className="text-sm font-bold opacity-70 uppercase tracking-widest">Iniciando Lente...</p>
              </div>
           )}

           {(status === 'error' || status === 'denied') && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 text-center bg-slate-950">
                 <div className={`${status === 'denied' ? 'bg-blue-500/10' : 'bg-red-500/10'} p-6 rounded-full mb-6`}>
                    {status === 'denied' ? <ShieldCheck size={48} className="text-blue-400" /> : <AlertCircle size={48} className="text-red-500" />}
                 </div>
                 <h3 className="text-white font-bold text-xl mb-3 uppercase italic tracking-tighter">
                   {status === 'denied' ? 'Permiso Requerido' : 'Error de Conexión'}
                 </h3>
                 <p className="text-slate-400 mb-8 max-w-xs text-sm leading-relaxed">
                   {error}
                 </p>
                 <div className="space-y-3 w-full max-w-xs">
                    <button 
                      onClick={startCamera} 
                      className={`w-full flex items-center justify-center gap-2 px-8 py-4 ${buttonBg} text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg uppercase tracking-widest text-sm`}
                    >
                      <RefreshCw size={18} /> {status === 'denied' ? 'Solicitar Acceso' : 'Reintentar'}
                    </button>
                 </div>
              </div>
           )}

           <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover transition-opacity duration-500 ${status === 'ready' ? (isAnalyzing ? 'opacity-40 blur-md' : 'opacity-80') : 'opacity-0'}`} 
           />
           <canvas ref={canvasRef} className="hidden" />
           
           {status === 'ready' && (
             <>
               <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className={`w-64 h-64 border-2 ${isPro ? 'border-emerald-500/20' : 'border-brand-500/20'} rounded-[40px] relative`}>
                     <div className={`absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 ${isPro ? 'border-emerald-500' : 'border-brand-500'} rounded-tl-[40px] shadow-[0_0_15px_currentColor]`}></div>
                     <div className={`absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 ${isPro ? 'border-emerald-500' : 'border-brand-500'} rounded-tr-[40px] shadow-[0_0_15px_currentColor]`}></div>
                     <div className={`absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 ${isPro ? 'border-emerald-500' : 'border-brand-500'} rounded-bl-[40px] shadow-[0_0_15px_currentColor]`}></div>
                     <div className={`absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 ${isPro ? 'border-emerald-500' : 'border-brand-500'} rounded-br-[40px] shadow-[0_0_15px_currentColor]`}></div>
                     {!isAnalyzing && <div className={`absolute top-1/2 left-4 right-4 h-0.5 ${isPro ? 'bg-emerald-400' : 'bg-brand-400'} shadow-[0_0_15px_currentColor] animate-pulse`}></div>}
                  </div>
               </div>

               <div className="absolute bottom-32 w-full text-center z-20 px-6">
                  {isAnalyzing ? (
                     <div className="flex flex-col items-center gap-2">
                        <Loader2 className={`animate-spin ${accentColor}`} size={24} />
                        <p className="text-white text-xs font-bold uppercase tracking-widest animate-pulse bg-black/60 px-4 py-2 rounded-full inline-block backdrop-blur-md border border-white/10">Analizando con IA...</p>
                     </div>
                  ) : (
                     <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest bg-black/40 px-4 py-1 rounded-full backdrop-blur-sm border border-white/5">Escaneando Alimento</p>
                  )}
               </div>

               <div className="absolute bottom-0 w-full p-8 pb-12 flex justify-center z-20">
                  <button 
                    onClick={captureAndAnalyze} 
                    disabled={isAnalyzing || status !== 'ready'} 
                    className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-all shadow-2xl ${isAnalyzing ? 'opacity-50' : 'opacity-100'}`}
                  >
                    <div className={`w-16 h-16 rounded-full ${isAnalyzing ? 'bg-slate-600' : 'bg-white shadow-inner'} flex items-center justify-center`}>
                       {isAnalyzing && <Loader2 className="animate-spin text-slate-400" size={32} />}
                    </div>
                  </button>
               </div>
             </>
           )}
        </div>
      ) : (
        <div className="flex-1 bg-slate-900 flex flex-col items-center justify-center p-6 animate-in slide-in-from-bottom-10 duration-300">
           <div className="w-full max-w-sm bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl relative">
              <div className={`absolute top-0 left-0 w-full h-1 ${buttonBg}`}></div>
              <div className="p-8 text-center">
                 <div className={`w-16 h-16 mx-auto rounded-full ${isPro ? 'bg-emerald-500' : 'bg-brand-500'} flex items-center justify-center text-white mb-6 shadow-xl`}>
                    <Utensils size={32} />
                 </div>
                 <h2 className="text-2xl font-black text-white mb-2 leading-tight uppercase italic tracking-tighter">{scannedResult.foodName}</h2>
                 <div className="flex items-baseline justify-center gap-1 mb-8">
                    <span className="text-6xl font-black text-white tracking-tighter drop-shadow-lg">{scannedResult.calories}</span>
                    <span className="text-sm font-bold text-slate-500 uppercase">kcal</span>
                 </div>
                 <div className="grid grid-cols-3 gap-2 mb-8">
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                       <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Proteína</p>
                       <p className="text-sm font-bold text-white">{scannedResult.protein}g</p>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                       <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Carbs</p>
                       <p className="text-sm font-bold text-white">{scannedResult.carbs}g</p>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                       <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Grasa</p>
                       <p className="text-sm font-bold text-white">{scannedResult.fat}g</p>
                    </div>
                 </div>
                 <div className="space-y-3">
                   <button 
                     onClick={() => onSave({ date: new Date().toISOString(), calories: scannedResult.calories, distanceKm: 0, mood: 3, weight: 0 })} 
                     className={`w-full py-4 rounded-xl font-bold text-white shadow-lg ${buttonBg} active:scale-95 transition-all uppercase tracking-widest text-sm italic`}
                   >
                     Registrar Ahora
                   </button>
                   <button 
                     onClick={() => { setScannedResult(null); setStatus('idle'); }} 
                     className="w-full py-3 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors"
                   >
                     Volver
                   </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};