import React, { useState, useRef } from 'react';
import { ViewState, UserProfile } from '../types';
import { Moon, Palette, AppWindow, AlignJustify, MoreHorizontal, Bell, Clock, Globe, Calendar, CalendarClock, Volume2, CheckCircle2, ChevronRight, Settings, MessageCircle, Crown, Upload, Edit2, LogOut, Check, X } from 'lucide-react';

interface SettingsViewProps {
   userProfile: UserProfile | null;
   onUpdateProfile: (profile: UserProfile) => void;
   setView: (view: ViewState) => void;
   isPro: boolean;
   isDarkMode: boolean;
   toggleDarkMode: () => void;
   onChangeThemeColor: (color: string) => void;
   onLanguageChange: (langName: string) => void;
   currentLangName: string;
   uiText: Record<string, string>;
   onLogout?: () => void;
   userId?: string | null;
   onRequestPro?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  userProfile, onUpdateProfile, setView, isPro, isDarkMode, toggleDarkMode, onChangeThemeColor, onLanguageChange, currentLangName, uiText, onLogout, userId, onRequestPro
}) => {
   const [globos, setGlobos] = useState(true);
   const [activarFechas, setActivarFechas] = useState(false);
   const [sonidos, setSonidos] = useState(true);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const LANGUAGES = [
     'Español', 'English', 'Français', 'Deutsch', 'Italiano', 'Português',
     '中文 (Chinese)', '日本語 (Japanese)', '한국어 (Korean)', 'Русский (Russian)',
     'हिन्दी (Hindi)', 'العربية (Arabic)', 'Türkçe', 'Nederlands', 'Polski',
     'Svenska', 'Dansk', 'Suomi', 'Norsk', 'Ελληνικά'
   ];

   const HOURS = Array.from({ length: 24 }, (_, i) => {
     const ampm = i < 12 ? 'a.m.' : 'p.m.';
     const hour = i % 12 === 0 ? 12 : i % 12;
     return `${hour}:00 ${ampm}`;
   });

   const DAYS_OF_WEEK = [
     'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
   ];

   const THEMES = [
     { name: 'Verde Esmeralda (Predeterminado)', hex: '#10b981' },
     { name: 'Azul Hielo', hex: '#0ea5e9' },
     { name: 'Rojo Carmesí', hex: '#e11d48' },
     { name: 'Violeta Neón', hex: '#8b5cf6' },
     { name: 'Naranja Atardecer', hex: '#f97316' },
     { name: 'Rosa Chicle', hex: '#ec4899' },
     { name: 'Amarillo Solar', hex: '#eab308' },
     { name: 'Cian Cibernético', hex: '#06b6d4' },
     { name: 'Índigo Profundo', hex: '#4f46e5' },
     { name: 'Blanco/Negro Monocromático', hex: '#71717a' },
   ];

   const [dayStart, setDayStart] = useState(() => localStorage.getItem('gl_day_start') || '4:00 a.m.');
   const [weekStart, setWeekStart] = useState(() => localStorage.getItem('gl_week_start') || 'Lunes');
   const [currentThemeName, setCurrentThemeName] = useState(() => {
     const currentHex = localStorage.getItem('gl_theme_color') || '#10b981';
     const theme = THEMES.find(t => t.hex === currentHex);
     return theme ? theme.name : 'Verde Esmeralda (Predeterminado)';
   });

   // Generic Modal State
   const [activeModal, setActiveModal] = useState<{ id: string, title: string, options: string[], current: string } | null>(null);

   const handleOptionSelect = (val: string) => {
      if(!activeModal) return;
      if (activeModal.id === 'idioma') {
         onLanguageChange(val);
      } else if (activeModal.id === 'tema') {
         setCurrentThemeName(val);
         const theme = THEMES.find(t => t.name === val);
         if (theme) onChangeThemeColor(theme.hex);
      } else if (activeModal.id === 'time') {
         setDayStart(val);
         localStorage.setItem('gl_day_start', val);
      } else if (activeModal.id === 'week') {
         setWeekStart(val);
         localStorage.setItem('gl_week_start', val);
      } else if (activeModal.id === 'icon') {
         // Placeholder
      }
      setActiveModal(null);
   };

   const SettingCellWithIcon = ({ 
     icon: Icon, iconBg, title, valueText, trailingElement, onClick 
   }: any) => (
     <div 
       onClick={onClick}
       className={`flex items-center justify-between p-4 border-b border-[#2c2c2e] last:border-0 bg-[#1c1c1e] transition-colors ${onClick ? 'cursor-pointer active:bg-[#2c2c2e]' : ''}`}
     >
       <div className="flex items-center gap-4">
         <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${iconBg}`}>
           <Icon size={20} />
         </div>
         <span className="text-white font-semibold">{title}</span>
       </div>
       <div className="flex items-center gap-3">
         {valueText && <span className="text-zinc-400 text-sm">{valueText}</span>}
         {trailingElement && <div>{trailingElement}</div>}
         {onClick && <ChevronRight size={18} className="text-zinc-500" />}
       </div>
     </div>
   );

   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      // Handle file upload UI
      if (userProfile) onUpdateProfile({...userProfile, profilePicture: 'uploaded'});
   };

   return (
      <div className="flex flex-col h-full bg-black text-white px-5 pt-8 pb-32 font-sans overflow-y-auto relative">
         
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Ajustes</h1>
         </div>

         {/* --- Perfil Antiguo Restaurado --- */}
         <div className="flex items-center gap-4 mb-8 bg-[#1c1c1e] p-5 rounded-[2rem] border border-[#2c2c2e] shadow-lg">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
               <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#2c2c2e] bg-[#2c2c2e]">
                  {userProfile?.profilePicture && userProfile.profilePicture !== 'uploaded' ? (
                     <img src={userProfile.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-zinc-500">
                     {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                     </div>
                  )}
               </div>
               <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload size={20} className="text-white" />
               </div>
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
               {isPro && (
                  <div className="absolute -bottom-1 -right-1 bg-brand-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-[#1c1c1e]">
                     PRO
                  </div>
               )}
            </div>
            
            <div className="flex-1">
               <h2 className="text-xl font-bold text-white mb-1">
                  {userProfile?.name || 'Comunidad TWH'}
               </h2>
               <p className="text-brand-500 font-semibold text-xs flex items-center gap-1 uppercase tracking-wider">
                  Nivel {userProfile?.level || 1} • {userProfile?.xp || 0} XP
               </p>
            </div>
            <button className="w-10 h-10 rounded-full bg-[#2c2c2e] flex items-center justify-center text-white hover:bg-zinc-700 transition-colors">
               <Edit2 size={16} />
            </button>
         </div>

         {/* --- TWH Premium Banner Restaurado --- */}
         {!isPro && (
            <div className="bg-gradient-to-r from-brand-600 to-[#022c22] rounded-[2rem] p-6 mb-10 relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.3)]">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
               
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                     <div className="w-10 h-10 bg-black/30 rounded-xl flex items-center justify-center backdrop-blur-md">
                     <Crown size={24} className="text-brand-400" />
                     </div>
                     <span className="font-black italic text-2xl tracking-tighter text-white">TWH Premium</span>
                  </div>
                  
                  <p className="text-white/90 text-sm mb-4 pr-8 leading-relaxed font-medium">
                     Desbloquea rutinas IA, historial infinito y análisis avanzado. Únete al 1% hoy.
                  </p>
                  
                  <div className="space-y-2 mb-2">
                     <button onClick={onRequestPro} className="w-full flex justify-between items-center bg-black/20 hover:bg-black/40 p-3 rounded-xl border border-white/10 transition-colors">
                        <span className="text-white font-bold text-sm">Plan Estándar</span>
                        <span className="text-white font-black">$3.99<span className="text-[10px] text-white/50">/mo</span></span>
                     </button>
                     <button onClick={onRequestPro} className="w-full flex justify-between items-center bg-black/20 hover:bg-black/40 p-3 rounded-xl border border-white/10 transition-colors">
                        <span className="text-white font-bold text-sm">Plan PRO</span>
                        <span className="text-white font-black">$9.99<span className="text-[10px] text-white/50">/mo</span></span>
                     </button>
                     <button onClick={onRequestPro} className="w-full flex justify-between items-center bg-brand-500/20 hover:bg-brand-500/30 p-3 rounded-xl border border-brand-500/50 transition-colors relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-brand-500 text-black text-[8px] font-black px-2 py-0.5 rounded-bl-lg">50% DTO</div>
                        <span className="text-white font-bold text-sm">Plan Personalizado</span>
                        <span className="text-brand-400 font-black">$29.90<span className="text-[10px] text-brand-400/50">/año</span></span>
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Apariencia Section */}
         <h3 className="text-white font-bold ml-4 mb-3 text-lg">Apariencia</h3>
         <div className="rounded-[2rem] overflow-hidden mb-10 border border-[#2c2c2e] shadow-lg">
            <SettingCellWithIcon 
              icon={Moon} iconBg="bg-zinc-700" 
              title="Modo Oscuro" 
              trailingElement={<Moon size={16}/>} 
              onClick={toggleDarkMode}
            />
            <SettingCellWithIcon 
              icon={AppWindow} iconBg="bg-purple-500" 
              title="Tema" 
              trailingElement={<div className="text-zinc-400 text-sm max-w-[120px] truncate">{currentThemeName}</div>} 
              onClick={() => setActiveModal({ id: 'tema', title: 'Color del Tema', options: THEMES.map(t => t.name), current: currentThemeName })}
            />
            <SettingCellWithIcon 
              icon={Palette} iconBg="bg-red-500" 
              title="Icono" 
              trailingElement={<div className="w-6 h-6 bg-gradient-to-tr from-brand-500 to-blue-500 rounded-md" />} 
              onClick={() => setActiveModal({ id: 'icon', title: 'Icono del Sistema', options: ['Oscuro Moderno', 'Clásico TWH', 'Neón', 'Minimalista'], current: 'Oscuro Moderno' })}
            />
         </div>

         {/* General Section */}
         <h3 className="text-white font-bold ml-4 mb-3 text-lg">General</h3>
         <div className="rounded-[2rem] overflow-hidden mb-10 border border-[#2c2c2e] shadow-lg bg-[#1c1c1e]">
            <div className="flex items-center justify-between p-4 border-b border-[#2c2c2e]">
               <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white bg-yellow-500">
                     <Bell size={20} />
                  </div>
                  <span className="text-white font-semibold">Globos de notificación</span>
               </div>
               <button 
                  onClick={() => setGlobos(!globos)}
                  className={`w-14 h-7 rounded-full relative transition-colors ${globos ? 'bg-brand-500' : 'bg-zinc-600'}`}
               >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${globos ? 'left-8' : 'left-1'}`} />
               </button>
            </div>
            
            <SettingCellWithIcon 
              icon={Clock} iconBg="bg-blue-500" 
              title="El día comienza a las" 
              trailingElement={<div className="bg-[#2c2c2e] text-white px-3 py-1 rounded-lg text-sm">{dayStart}</div>} 
              onClick={() => setActiveModal({ id: 'time', title: 'Horario del día', options: HOURS, current: dayStart })}
            />
            <SettingCellWithIcon 
              icon={Globe} iconBg="bg-green-600" 
              title="Idioma" valueText={currentLangName} 
              onClick={() => setActiveModal({ id: 'idioma', title: 'Idioma', options: LANGUAGES, current: currentLangName })}
            />
            <SettingCellWithIcon 
              icon={Calendar} iconBg="bg-indigo-600" 
              title="La semana comienza el" valueText={weekStart} 
              onClick={() => setActiveModal({ id: 'week', title: 'Inicio de Semana', options: DAYS_OF_WEEK, current: weekStart })}
            />
         </div>

         {/* Sonidos y Otros */}
         <h3 className="text-white font-bold ml-4 mb-3 text-lg">Experiencia</h3>
         <div className="rounded-[2rem] overflow-hidden mb-10 border border-[#2c2c2e] shadow-lg bg-[#1c1c1e]">
            <div className="flex items-center justify-between p-4 border-b border-[#2c2c2e]">
               <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white bg-cyan-500"><Volume2 size={20} /></div>
                  <span className="text-white font-semibold">Efectos de sonido</span>
               </div>
               <button onClick={() => setSonidos(!sonidos)} className={`w-14 h-7 rounded-full relative transition-colors ${sonidos ? 'bg-brand-500' : 'bg-zinc-600'}`}>
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${sonidos ? 'left-8' : 'left-1'}`} />
               </button>
            </div>

            <SettingCellWithIcon 
              icon={MessageCircle} iconBg="bg-indigo-600" 
              title="Contactar Asistente IA" 
              onClick={() => setView(ViewState.SUPPORT)}
            />
            <button onClick={onLogout} className="w-full text-left p-5 bg-[#1c1c1e] hover:bg-[#2c2c2e] transition-colors border-t border-[#2c2c2e] flex items-center gap-3 active:scale-95">
               <LogOut size={20} className="text-red-500" />
               <span className="font-bold text-red-500">Cerrar sesión</span>
            </button>
         </div>

         {/* --- Generic Action Sheet Modal --- */}
         {activeModal && (
            <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200">
               <div className="w-full max-w-md bg-[#1c1c1e] sm:rounded-3xl rounded-t-3xl border border-[#2c2c2e] shadow-2xl overflow-hidden animate-in sm:zoom-in-95 slide-in-from-bottom-10">
                  <div className="px-6 py-4 flex justify-between items-center border-b border-[#2c2c2e] bg-[#2c2c2e]/50">
                     <h3 className="font-bold text-white text-lg">{activeModal.title}</h3>
                     <button onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40 text-zinc-400 hover:text-white transition-colors">
                        <X size={16} />
                     </button>
                  </div>
                  <div className="p-2 max-h-[50vh] overflow-y-auto">
                     {activeModal.options.map(opt => (
                        <button 
                           key={opt}
                           onClick={() => handleOptionSelect(opt)}
                           className={`w-full text-left p-4 rounded-xl mb-1 flex items-center justify-between transition-colors ${opt === activeModal.current ? 'bg-brand-500/10 text-brand-500' : 'text-white hover:bg-[#2c2c2e]'}`}
                        >
                           <span className="font-medium">{opt}</span>
                           {opt === activeModal.current && <Check size={18} className="text-brand-500" />}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
