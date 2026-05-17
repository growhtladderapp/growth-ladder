import React, { useState, useRef } from 'react';
import { ViewState, UserProfile } from '../types';
import { Moon, Sun, Palette, AppWindow, AlignJustify, MoreHorizontal, Bell, Clock, Globe, Calendar, CalendarClock, Volume2, CheckCircle2, ChevronRight, Settings, MessageCircle, Crown, Upload, Edit2, LogOut, Check, X, Trophy, Flame, Flag, ListFilter, ChevronLeft, CalendarRange, Folder, Umbrella, Archive, RefreshCw, Trash2, Star, Gift, HelpCircle, Share, Zap } from 'lucide-react';

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

   const [soundFinalizado, setSoundFinalizado] = useState(() => localStorage.getItem('gl_sound_finalizado') || 'Predeterminado');
   const [soundNotificaciones, setSoundNotificaciones] = useState(() => localStorage.getItem('gl_sound_notificaciones') || 'Predeterminado');
   const [vacationMode, setVacationMode] = useState(() => localStorage.getItem('gl_vacation_mode') === 'true');
   const [appIcon, setAppIcon] = useState(() => localStorage.getItem('gl_app_icon') || 'Oscuro Moderno');
   
   // Custom modals states
   const [showGroupsModal, setShowGroupsModal] = useState(false);
   const [showArchiveModal, setShowArchiveModal] = useState(false);
   const [showMoreModal, setShowMoreModal] = useState(false);
   const [showPromoModal, setShowPromoModal] = useState(false);
   const [showShareModal, setShowShareModal] = useState(false);
   
   const [groups, setGroups] = useState<string[]>(() => {
     const saved = localStorage.getItem('twh_habit_groups');
     return saved ? JSON.parse(saved) : ['Salud', 'Malos', 'Tareas'];
   });
   const [newGroupName, setNewGroupName] = useState('');
   const [promoCode, setPromoCode] = useState('');
   const [promoError, setPromoError] = useState('');
   const [promoSuccess, setPromoSuccess] = useState(false);

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
         setAppIcon(val);
          localStorage.setItem('gl_app_icon', val);
       } else if (activeModal.id === 'sound_finalizado') {
          setSoundFinalizado(val);
          localStorage.setItem('gl_sound_finalizado', val);
       } else if (activeModal.id === 'sound_notificaciones') {
          setSoundNotificaciones(val);
          localStorage.setItem('gl_sound_notificaciones', val);
      } else if (activeModal.id === 'appearance') {
         if (val === 'Modo Oscuro' && !isDarkMode) toggleDarkMode();
         if (val === 'Modo Claro' && isDarkMode) toggleDarkMode();
      }
      setActiveModal(null);
   };

   const SettingCellWithIcon = ({ 
     icon: Icon, iconBg, iconColor, title, valueText, trailingElement, onClick, isSelect, fillIcon = false
   }: any) => (
     <div 
       onClick={onClick}
       className={`flex items-center justify-between p-4 border-b border-[#2c2c2e] last:border-0 bg-[#1c1c1e] transition-colors ${onClick ? 'cursor-pointer active:bg-[#2c2c2e]' : ''}`}
     >
       <div className="flex items-center gap-4">
         {iconBg ? (
           <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${iconBg}`}>
             <Icon size={20} />
           </div>
         ) : (
           <div className={`w-9 h-9 flex items-center justify-center ${iconColor || 'text-white'}`}>
             <Icon size={24} className={fillIcon ? "fill-current" : ""} />
           </div>
         )}
         <span className="text-white font-semibold">{title}</span>
       </div>
       <div className="flex items-center gap-3">
         {valueText && <span className="text-zinc-400 text-sm">{valueText}</span>}
         {trailingElement && <div>{trailingElement}</div>}
         {onClick && !isSelect && <ChevronRight size={18} className="text-zinc-500" />}
         {onClick && isSelect && (
            <div className="flex flex-col -space-y-1 text-zinc-500">
               <ChevronLeft size={14} className="rotate-90" />
               <ChevronRight size={14} className="rotate-90" />
            </div>
         )}
       </div>
     </div>
   );

   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      // Handle file upload UI
      if (userProfile) onUpdateProfile({...userProfile, profilePicture: 'uploaded'});
   };

   const [showNameEditModal, setShowNameEditModal] = useState(false);
   const [newName, setNewName] = useState('');
   const [showSortModal, setShowSortModal] = useState(false);
   const [showLogrosModal, setShowLogrosModal] = useState(false);

   const [sortPreferences, setSortPreferences] = useState(() => {
     const saved = localStorage.getItem('twh_habit_sort_prefs');
     return saved ? JSON.parse(saved) : { 
       sortBy: 'default',
       hideCompleted: false,
       hideFailed: false,
       hideSkipped: false
     };
   });

   const updateSortPref = (key: string, value: any) => {
      const next = { ...sortPreferences, [key]: value };
      setSortPreferences(next);
      localStorage.setItem('twh_habit_sort_prefs', JSON.stringify(next));
   };

   const handleEditNameClick = () => {
      // nameChangeHistory is an array of ISO date strings
      const history = (userProfile as any)?.nameChangeHistory || [];
      const now = new Date();
      
      let validHistory = history.filter((d: string) => {
         const date = new Date(d);
         const daysDiff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
         return isPro ? daysDiff <= 15 : daysDiff <= 30;
      });

      const maxChanges = isPro ? 3 : 1;

      if (validHistory.length >= maxChanges) {
         validHistory.sort((a: string, b: string) => new Date(a).getTime() - new Date(b).getTime());
         const oldestDate = new Date(validHistory[0]);
         const waitDays = isPro ? 15 : 30;
         oldestDate.setDate(oldestDate.getDate() + waitDays);
         
         const daysLeft = Math.ceil((oldestDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
         alert(`Límite alcanzado. Podrás cambiar tu nombre en ${daysLeft} días.\n\n${isPro ? '(PRO: 3 cambios cada 15 días)' : '(Estándar: 1 cambio cada 30 días, obtén PRO para más flexibilidad)'}`);
         return;
      }

      setNewName(userProfile?.name || '');
      setShowNameEditModal(true);
   };

   const saveNewName = () => {
      if (!newName.trim()) return;
      const history = (userProfile as any)?.nameChangeHistory || [];
      const nowStr = new Date().toISOString();
      const newHistory = [...history, nowStr];
      
      if (userProfile) {
         onUpdateProfile({ ...userProfile, name: newName.trim(), nameChangeHistory: newHistory } as any);
      }
      setShowNameEditModal(false);
   };

   return (
      <div className="flex flex-col h-full bg-black text-white px-5 pt-8 pb-32 font-sans overflow-y-auto relative">
         
         <div className="flex justify-center items-center mb-8">
            <h1 className="text-xl font-bold tracking-wider text-white">Configuración</h1>
         </div>

         {/* --- TWH Premium Card (Arriba del Todo) --- */}
         {!isPro && (
            <div className="bg-[#1c1c1e] rounded-[2rem] p-8 mb-8 border border-[#2c2c2e] shadow-xl flex flex-col items-center text-center relative overflow-hidden w-full">
               <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
               <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

               <h2 className="text-3xl font-black mb-3 bg-gradient-to-r from-red-500 via-rose-400 to-[#fca5a5] bg-clip-text text-transparent italic tracking-tighter uppercase">
                  TWH Premium
               </h2>

               <p className="text-zinc-300 text-sm font-bold max-w-xs leading-relaxed mb-6">
                  Desbloquea hábitos y análisis ilimitados.<br />
                  Recibe recordatorios personalizados. 100% sin anuncios
               </p>

               <button
                  onClick={onRequestPro}
                  className="w-full max-w-[280px] py-4 bg-[#ff3b30] hover:bg-[#e03126] active:scale-95 text-white font-black rounded-2xl shadow-xl shadow-red-950/20 transition-all uppercase tracking-widest text-[13.5px]"
               >
                  Accede completamente
               </button>
            </div>
         )}

         {/* --- Perfil Antiguo Restaurado --- */}
         <div className="flex items-center gap-4 mb-8 bg-[#1c1c1e] p-5 rounded-[2rem] border border-[#2c2c2e] shadow-lg w-full">
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
            <button onClick={handleEditNameClick} className="w-10 h-10 rounded-full bg-[#2c2c2e] flex items-center justify-center text-white hover:bg-zinc-700 transition-colors">
               <Edit2 size={16} />
            </button>
         </div>

         {/* Apariencia Section */}
         <h3 className="text-white font-bold ml-4 mb-3 text-lg">Apariencia</h3>
         <div className="rounded-[2rem] overflow-hidden mb-10 border border-[#2c2c2e] shadow-lg">
            <SettingCellWithIcon 
              icon={isDarkMode ? Moon : Sun} iconBg={isDarkMode ? "bg-zinc-700" : "bg-amber-500"} 
              title="Apariencia" 
              valueText={isDarkMode ? "Modo Oscuro" : "Modo Claro"} 
              onClick={() => setActiveModal({ id: 'appearance', title: 'Apariencia', options: ['Modo Claro', 'Modo Oscuro'], current: isDarkMode ? 'Modo Oscuro' : 'Modo Claro' })}
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
              trailingElement={<span className="text-zinc-400 text-sm">{appIcon}</span>} 
              onClick={() => setActiveModal({ id: 'icon', title: 'Icono del Sistema', options: ['Oscuro Moderno', 'Clásico TWH', 'Neón', 'Minimalista'], current: appIcon })}
            />
         </div>

         {/* Fechas Futuras */}
         <div className="rounded-[2rem] overflow-hidden mb-10 border border-[#2c2c2e] shadow-lg bg-[#1c1c1e]">
            <div className="flex items-center justify-between p-4 pb-2">
               <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white bg-teal-500 relative">
                     <CalendarRange size={20} />
                     <div className="absolute -bottom-1 -right-1 bg-red-500 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#1c1c1e]">!</div>
                  </div>
                  <span className="text-white font-semibold">Activar fechas futuras</span>
               </div>
               <button onClick={() => setActivarFechas(!activarFechas)} className={`w-14 h-7 rounded-full relative transition-colors ${activarFechas ? 'bg-brand-500' : 'bg-zinc-600'}`}>
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${activarFechas ? 'left-8' : 'left-1'}`} />
               </button>
            </div>
            <p className="px-4 pb-4 text-sm text-zinc-400">Activar el registro de hábitos para fechas futuras</p>
         </div>

         {/* Sonidos */}
         <h3 className="text-white font-bold ml-4 mb-3 text-lg">Sonidos</h3>
         <div className="rounded-[2rem] overflow-hidden mb-10 border border-[#2c2c2e] shadow-lg bg-[#1c1c1e]">
            <div className="flex items-center justify-between p-4 border-b border-[#2c2c2e]">
               <div className="flex items-center gap-4">
                  <div className="w-9 h-9 flex items-center justify-center text-cyan-500"><Volume2 size={24} className="fill-current" /></div>
                  <span className="text-white font-semibold">Sonidos</span>
               </div>
               <button onClick={() => setSonidos(!sonidos)} className={`w-14 h-7 rounded-full relative transition-colors ${sonidos ? 'bg-red-500' : 'bg-zinc-600'}`}>
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${sonidos ? 'left-8' : 'left-1'}`} />
               </button>
            </div>
            <SettingCellWithIcon 
                icon={CheckCircle2} iconColor="text-green-500" fillIcon={true}
                title="Finalizado" valueText={soundFinalizado} 
                isSelect={true}
                onClick={() => setActiveModal({ id: 'sound_finalizado', title: 'Sonido de Finalización', options: ['Predeterminado', 'Éxito Corto', 'Campana Zen', 'Energético', 'Silencio'], current: soundFinalizado })}
             />
            <SettingCellWithIcon 
                icon={Bell} iconColor="text-orange-500" fillIcon={true}
                title="Notificaciones" valueText={soundNotificaciones} 
                isSelect={true}
                onClick={() => setActiveModal({ id: 'sound_notificaciones', title: 'Sonido de Notificaciones', options: ['Predeterminado', 'Gong Suave', 'Pop Clásico', 'Aviso Digital', 'Silencio'], current: soundNotificaciones })}
             />
         </div>

         {/* Datos Section */}
         <h3 className="text-white font-bold ml-4 mb-3 text-lg">Datos</h3>
         <div className="rounded-[2rem] overflow-hidden mb-10 border border-[#2c2c2e] shadow-lg bg-[#1c1c1e]">
            <SettingCellWithIcon 
               icon={Folder} iconColor="text-blue-500" fillIcon={true}
                title="Grupos" valueText={groups.length + ' grupos'}
                onClick={() => setShowGroupsModal(true)}
            />
            <div className="flex items-center justify-between p-4 border-b border-[#2c2c2e] bg-[#1c1c1e]">
                <div className="flex items-center gap-4">
                   <div className="w-9 h-9 flex items-center justify-center text-green-500"><Umbrella size={24} className="fill-current" /></div>
                   <div className="flex flex-col">
                      <span className="text-white font-semibold">Modo Vacaciones</span>
                      <span className="text-xs text-zinc-400">Congela tus rachas mientras descansas</span>
                   </div>
                </div>
                <button 
                   onClick={() => {
                      const val = !vacationMode;
                      setVacationMode(val);
                      localStorage.setItem('gl_vacation_mode', String(val));
                   }} 
                   className={`w-14 h-7 rounded-full relative transition-colors ${vacationMode ? 'bg-brand-500' : 'bg-zinc-600'}`}
                >
                   <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${vacationMode ? 'left-8' : 'left-1'}`} />
                </button>
             </div>
            <SettingCellWithIcon 
               icon={Trophy} iconColor="text-yellow-500" fillIcon={true}
               title="Logros" 
               onClick={() => setShowLogrosModal(true)}
            />
            <SettingCellWithIcon 
               icon={Archive} iconColor="text-purple-500" fillIcon={true}
                title="Hábitos archivados"
                onClick={() => setShowArchiveModal(true)}
            />
         </div>

         {/* General Section */}
         <h3 className="text-white font-bold ml-4 mb-3 text-lg">General</h3>
         <div className="rounded-[2rem] overflow-hidden mb-10 border border-[#2c2c2e] shadow-lg bg-[#1c1c1e]">
            <SettingCellWithIcon 
               icon={ListFilter} iconBg="bg-brand-500 text-black" 
               title="Ordenar" valueText="Completados al final" 
               onClick={() => setShowSortModal(true)}
            />
            <SettingCellWithIcon 
               icon={MoreHorizontal} iconBg="bg-purple-600"
                title="Más"
                onClick={() => setShowMoreModal(true)}
            />
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

         {/* Ayuda y Asistencia */}
         <h3 className="text-white font-bold ml-4 mb-3 text-lg">Ayuda y asistencia</h3>
         <div className="rounded-[2rem] overflow-hidden mb-10 border border-[#2c2c2e] shadow-lg bg-[#1c1c1e]">
            <SettingCellWithIcon 
               icon={Gift} iconBg="bg-red-500"
                title="Canjear código de oferta"
                onClick={() => setShowPromoModal(true)}
            />
            <SettingCellWithIcon 
               icon={MessageCircle} iconBg="bg-indigo-600" 
               title="Contactar Asistente IA" 
               onClick={() => setView(ViewState.SUPPORT)}
            />
            <SettingCellWithIcon 
               icon={HelpCircle} iconBg="bg-blue-500"
                title="Obtener ayuda"
                onClick={() => setView(ViewState.SUPPORT)}
            />
            <SettingCellWithIcon 
               icon={Share} iconBg="bg-green-500"
                title="Comparte la aplicación"
                onClick={() => {
                   if (navigator.share) {
                      navigator.share({ title: 'TWH', text: 'Mejora tus hábitos con TWH!', url: 'https://trainingwithhabits.com' }).catch(() => setShowShareModal(true));
                   } else {
                      setShowShareModal(true);
                   }
                }}
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

         {/* --- Name Edit Modal --- */}
         {showNameEditModal && (
            <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200">
               <div className="w-full max-w-md bg-[#1c1c1e] sm:rounded-3xl rounded-t-3xl border border-[#2c2c2e] shadow-2xl overflow-hidden animate-in sm:zoom-in-95 slide-in-from-bottom-10">
                  <div className="px-6 py-4 flex justify-between items-center border-b border-[#2c2c2e] bg-[#2c2c2e]/50">
                     <h3 className="font-bold text-white text-lg">Cambiar Nombre</h3>
                     <button onClick={() => setShowNameEditModal(false)} className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40 text-zinc-400 hover:text-white transition-colors">
                        <X size={16} />
                     </button>
                  </div>
                  <div className="p-6">
                     <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Escribe tu nuevo nombre"
                        className="w-full bg-black/50 border border-[#2c2c2e] text-white p-4 rounded-xl outline-none focus:border-brand-500 transition-colors mb-6"
                        autoFocus
                        maxLength={20}
                     />
                     <button 
                        onClick={saveNewName}
                        disabled={!newName.trim() || newName.trim() === userProfile?.name}
                        className="w-full bg-brand-500 text-black font-bold py-4 rounded-xl hover:bg-brand-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        Guardar Cambios
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* --- Ordenar Modal --- */}
         {showSortModal && (
            <div className="fixed inset-0 z-[300] bg-black text-white overflow-y-auto animate-in slide-in-from-right-full pb-10">
               <div className="px-5 py-4 flex items-center border-b border-[#2c2c2e] sticky top-0 bg-black/80 backdrop-blur-md z-10">
                  <button onClick={() => setShowSortModal(false)} className="w-10 h-10 bg-[#1c1c1e] rounded-full flex items-center justify-center hover:bg-[#2c2c2e] transition-colors">
                     <ChevronLeft size={20} />
                  </button>
                  <h2 className="text-xl font-bold ml-4">Ordenar hábitos</h2>
               </div>
               <div className="p-5 space-y-4">
                  <p className="text-zinc-500 text-sm mb-4">Ordenar los hábitos según el orden definido por el usuario</p>
                  
                  <div 
                     onClick={() => updateSortPref('sortBy', 'default')}
                     className="bg-[#1c1c1e] rounded-2xl p-4 flex items-center gap-4 border border-[#2c2c2e] cursor-pointer"
                  >
                     <AlignJustify className={sortPreferences.sortBy === 'default' ? 'text-red-500' : 'text-zinc-500'} />
                     <div className="flex-1">
                        <h4 className="font-bold">Predeterminado</h4>
                     </div>
                     {sortPreferences.sortBy === 'default' && <Check size={20} className="text-red-500" />}
                  </div>
                  <p className="text-zinc-500 text-sm ml-2 mb-4">Ordenar los hábitos según el orden definido por el usuario</p>

                  <div 
                     onClick={() => updateSortPref('sortBy', 'progress')}
                     className="bg-[#1c1c1e] rounded-2xl p-4 flex items-center gap-4 border border-[#2c2c2e] cursor-pointer"
                  >
                     <AlignJustify className={sortPreferences.sortBy === 'progress' ? 'text-red-500' : 'text-zinc-500'} />
                     <div className="flex-1">
                        <h4 className="font-bold">Por progreso</h4>
                     </div>
                     {sortPreferences.sortBy === 'progress' && <Check size={20} className="text-red-500" />}
                  </div>
                  <p className="text-zinc-500 text-sm ml-2 mb-4">Ordenar hábitos por progreso actual</p>

                  <div 
                     onClick={() => updateSortPref('sortBy', 'completed_last')}
                     className="bg-[#1c1c1e] rounded-2xl p-4 flex items-center gap-4 border border-[#2c2c2e] cursor-pointer"
                  >
                     <AlignJustify className={sortPreferences.sortBy === 'completed_last' ? 'text-red-500' : 'text-zinc-500'} />
                     <div className="flex-1">
                        <h4 className="font-bold">Completados al final</h4>
                     </div>
                     {sortPreferences.sortBy === 'completed_last' && <Check size={20} className="text-red-500" />}
                  </div>
                  <p className="text-zinc-500 text-sm ml-2 mb-4">Mantener los hábitos no completados por encima de los completados</p>

                  <div 
                     onClick={() => updateSortPref('hideCompleted', !sortPreferences.hideCompleted)}
                     className="bg-[#1c1c1e] rounded-2xl p-4 flex items-center justify-between border border-[#2c2c2e] mt-6 cursor-pointer"
                  >
                     <div className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center"><Check size={14} className="text-white"/></div>
                        <h4 className="font-bold text-[15px]">Ocultar completadas</h4>
                     </div>
                     <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${sortPreferences.hideCompleted ? 'bg-red-500' : 'bg-zinc-600'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 ${sortPreferences.hideCompleted ? 'left-[26px]' : 'left-0.5'}`}></div>
                     </div>
                  </div>
                  <p className="text-zinc-500 text-sm ml-2">Ocultar hábitos completados de la lista del día</p>

                  <div 
                     onClick={() => updateSortPref('hideFailed', !sortPreferences.hideFailed)}
                     className="bg-[#1c1c1e] rounded-2xl p-4 flex items-center justify-between border border-[#2c2c2e] mt-4 cursor-pointer"
                  >
                     <div className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center"><X size={14} className="text-white"/></div>
                        <h4 className="font-bold text-[15px]">Ocultar hábitos fallidos</h4>
                     </div>
                     <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${sortPreferences.hideFailed ? 'bg-red-500' : 'bg-zinc-600'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 ${sortPreferences.hideFailed ? 'left-[26px]' : 'left-0.5'}`}></div>
                     </div>
                  </div>
                  <p className="text-zinc-500 text-sm ml-2">Ocultar hábitos fallidos de la lista del día</p>
                  
                  <div 
                     onClick={() => updateSortPref('hideSkipped', !sortPreferences.hideSkipped)}
                     className="bg-[#1c1c1e] rounded-2xl p-4 flex items-center justify-between border border-[#2c2c2e] mt-4 cursor-pointer"
                  >
                     <div className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center"><ChevronRight size={14} className="text-white"/></div>
                        <h4 className="font-bold text-[15px]">Ocultar saltados</h4>
                     </div>
                     <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${sortPreferences.hideSkipped ? 'bg-red-500' : 'bg-zinc-600'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 ${sortPreferences.hideSkipped ? 'left-[26px]' : 'left-0.5'}`}></div>
                     </div>
                  </div>
                  <p className="text-zinc-500 text-sm ml-2">Ocultar los hábitos saltados de la lista del día</p>
               </div>
            </div>
         )}

         {/* --- Logros Modal --- */}
         {showLogrosModal && (
            <div className="fixed inset-0 z-[300] bg-black text-white overflow-y-auto animate-in slide-in-from-right-full pb-20">
               <div className="px-5 py-4 flex items-center mb-6 sticky top-0 bg-black/80 backdrop-blur-md z-10">
                  <button onClick={() => setShowLogrosModal(false)} className="w-10 h-10 bg-[#1c1c1e] rounded-full flex items-center justify-center hover:bg-[#2c2c2e] transition-colors">
                     <ChevronLeft size={20} />
                  </button>
                  <h2 className="text-xl font-bold ml-4 mx-auto -translate-x-5">Logros</h2>
               </div>
               
               <div className="px-5">
                  <h3 className="text-center font-bold text-lg mb-8 tracking-wide">Racha más larga</h3>
                  <div className="grid grid-cols-3 gap-y-10 gap-x-4 mb-16">
                     {[2,5,7,14,30,60,90,180,365].map((d, i) => (
                        <div key={d} className="flex flex-col items-center gap-3">
                           <div className={`w-[80px] h-[90px] flex items-center justify-center [clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)] ${i === 0 ? 'bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-110' : 'bg-zinc-800'} transition-transform`}>
                              <Flame size={32} className="text-white" />
                           </div>
                           <span className={`text-sm font-black ${i === 0 ? 'text-white' : 'text-zinc-500'}`}>{d} días</span>
                        </div>
                     ))}
                  </div>

                  <h3 className="text-center font-bold text-lg mb-8 tracking-wide">Objetivos</h3>
                  <div className="grid grid-cols-3 gap-y-10 gap-x-4">
                     {[100,200,300,400,500,600].map((d, i) => (
                        <div key={d} className="flex flex-col items-center gap-3">
                           <div className={`w-[80px] h-[90px] flex items-center justify-center [clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)] ${i < 3 ? 'bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-110' : 'bg-zinc-800'} transition-transform`}>
                              <Flag size={32} className="text-white" />
                           </div>
                           <span className={`text-sm font-black ${i < 3 ? 'text-white' : 'text-zinc-500'}`}>{d}%</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {/* --- MODAL: GRUPOS --- */}
         {showGroupsModal && (
            <div className="fixed inset-0 z-[300] bg-black text-white overflow-y-auto animate-in slide-in-from-right-full pb-20">
               <div className="px-5 py-4 flex items-center mb-6 sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-[#2c2c2e]">
                  <button onClick={() => setShowGroupsModal(false)} className="w-10 h-10 bg-[#1c1c1e] rounded-full flex items-center justify-center hover:bg-[#2c2c2e] transition-colors">
                     <ChevronLeft size={20} />
                  </button>
                  <h2 className="text-xl font-bold ml-4">Grupos de Hábitos</h2>
               </div>
               
               <div className="px-5 space-y-6">
                  <p className="text-zinc-400 text-sm">Organiza tus hábitos creando categorías personalizadas.</p>
                  
                  <div className="bg-[#1c1c1e] rounded-[2rem] border border-[#2c2c2e] p-6 space-y-4">
                     <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Tus Grupos</h3>
                     <div className="space-y-2">
                        {groups.map(group => {
                           const isSystem = ['Salud', 'Malos', 'Tareas'].includes(group);
                           return (
                              <div key={group} className="flex justify-between items-center bg-black/40 border border-[#2c2c2e] p-4 rounded-2xl">
                                 <span className="font-semibold text-white">{group}</span>
                                 {isSystem ? (
                                    <span className="text-[10px] bg-zinc-800 text-zinc-500 px-3 py-1 rounded-full font-bold uppercase">Sistema</span>
                                 ) : (
                                    <button 
                                       onClick={() => {
                                          const next = groups.filter(g => g !== group);
                                          setGroups(next);
                                          localStorage.setItem('twh_habit_groups', JSON.stringify(next));
                                       }}
                                       className="w-8 h-8 rounded-full bg-red-950/40 flex items-center justify-center text-red-500 hover:bg-red-900/40 hover:text-red-400 transition-colors"
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 )}
                              </div>
                           );
                        })}
                     </div>
                  </div>

                  <div className="bg-[#1c1c1e] rounded-[2rem] border border-[#2c2c2e] p-6 space-y-4">
                     <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Crear Nuevo Grupo</h3>
                     <div className="flex gap-2">
                        <input 
                           type="text" 
                           placeholder="Ej. Estudio, Negocios..." 
                           value={newGroupName}
                           onChange={e => setNewGroupName(e.target.value)}
                           className="flex-1 bg-black/50 border border-[#2c2c2e] rounded-2xl p-4 outline-none focus:border-brand-500 transition-colors text-white"
                           maxLength={15}
                        />
                        <button 
                           onClick={() => {
                              const trimmed = newGroupName.trim();
                              if (!trimmed) return;
                              if (groups.includes(trimmed)) {
                                 alert('Este grupo ya existe.');
                                 return;
                              }
                              const next = [...groups, trimmed];
                              setGroups(next);
                              localStorage.setItem('twh_habit_groups', JSON.stringify(next));
                              setNewGroupName('');
                           }}
                           className="bg-brand-500 text-black px-6 rounded-2xl font-bold hover:bg-brand-400 transition-all active:scale-95"
                        >
                           Añadir
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* --- MODAL: HÁBITOS ARCHIVADOS --- */}
         {showArchiveModal && (
            <div className="fixed inset-0 z-[300] bg-black text-white overflow-y-auto animate-in slide-in-from-right-full pb-20">
               <div className="px-5 py-4 flex items-center mb-6 sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-[#2c2c2e]">
                  <button onClick={() => setShowArchiveModal(false)} className="w-10 h-10 bg-[#1c1c1e] rounded-full flex items-center justify-center hover:bg-[#2c2c2e] transition-colors">
                     <ChevronLeft size={20} />
                  </button>
                  <h2 className="text-xl font-bold ml-4">Hábitos Archivados</h2>
               </div>
               
               <div className="px-5 flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-purple-950/30 rounded-[2rem] flex items-center justify-center text-purple-500 border border-purple-900/50 mb-6 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
                     <Archive size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No hay hábitos archivados</h3>
                  <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
                     Puedes archivar hábitos completados o temporales desde la pantalla de detalles de cada hábito para mantener tu panel principal despejado.
                  </p>
               </div>
            </div>
         )}

         {/* --- MODAL: MÁS OPCIONES --- */}
         {showMoreModal && (
            <div className="fixed inset-0 z-[300] bg-black text-white overflow-y-auto animate-in slide-in-from-right-full pb-20">
               <div className="px-5 py-4 flex items-center mb-6 sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-[#2c2c2e]">
                  <button onClick={() => setShowMoreModal(false)} className="w-10 h-10 bg-[#1c1c1e] rounded-full flex items-center justify-center hover:bg-[#2c2c2e] transition-colors">
                     <ChevronLeft size={20} />
                  </button>
                  <h2 className="text-xl font-bold ml-4">Más Opciones</h2>
               </div>
               
               <div className="px-5 space-y-6">
                  <div className="bg-[#1c1c1e] rounded-[2rem] border border-[#2c2c2e] overflow-hidden shadow-lg">
                     <button 
                        onClick={() => {
                           const data = { ...localStorage };
                           const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                           const url = URL.createObjectURL(blob);
                           const a = document.createElement('a');
                           a.href = url;
                           a.download = 'TWH_Backup_' + new Date().toISOString().split('T')[0] + '.json';
                           a.click();
                           URL.revokeObjectURL(url);
                        }}
                        className="w-full text-left p-5 hover:bg-[#2c2c2e] transition-colors border-b border-[#2c2c2e] flex items-center justify-between"
                     >
                        <div className="flex items-center gap-3">
                           <Upload size={20} className="text-zinc-400" />
                           <span className="font-semibold text-white">Exportar copia de seguridad (JSON)</span>
                        </div>
                        <ChevronRight size={18} className="text-zinc-500" />
                     </button>

                     <button 
                        onClick={() => {
                           if (confirm('¿Estás seguro de que quieres restablecer la aplicación? Esto borrará todos tus hábitos, registros e historial permanentemente.')) {
                              localStorage.clear();
                              window.location.reload();
                           }
                        }}
                        className="w-full text-left p-5 hover:bg-red-950/20 transition-colors flex items-center justify-between"
                     >
                        <div className="flex items-center gap-3">
                           <Trash2 size={20} className="text-red-500" />
                           <span className="font-semibold text-red-500">Restablecer datos de la aplicación</span>
                        </div>
                        <ChevronRight size={18} className="text-zinc-500" />
                     </button>
                  </div>

                  <div className="bg-[#1c1c1e] rounded-[2rem] border border-[#2c2c2e] p-6 space-y-3 shadow-lg">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                           <Crown size={18} className="text-brand-500" />
                        </div>
                        <span className="font-bold text-white">Acerca de TWH</span>
                     </div>
                     <p className="text-zinc-400 text-sm leading-relaxed">
                        TWH (TrainingWithHabits) es el ecosistema de autodisciplina definitiva del 1%. Diseñado de manera minimalista para acelerar tu desarrollo en salud, mentalidad y rutinas físicas diarias.
                     </p>
                     <p className="text-zinc-600 text-xs font-semibold uppercase tracking-wider pt-2">Versión 2.4.1 (Stable - Premium Edition)</p>
                  </div>
               </div>
            </div>
         )}

         {/* --- MODAL: CÓDIGO PROMOCIONAL --- */}
         {showPromoModal && (
            <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
               <div className="w-full max-w-md bg-[#1c1c1e] rounded-3xl border border-[#2c2c2e] shadow-2xl overflow-hidden animate-in zoom-in-95">
                  <div className="px-6 py-4 flex justify-between items-center border-b border-[#2c2c2e] bg-[#2c2c2e]/50">
                     <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <Gift size={20} className="text-red-500 animate-pulse" />
                        Canjear Código de Oferta
                     </h3>
                     <button onClick={() => { setShowPromoModal(false); setPromoError(''); setPromoSuccess(false); setPromoCode(''); }} className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40 text-zinc-400 hover:text-white transition-colors">
                        <X size={16} />
                     </button>
                  </div>
                  
                  <div className="p-6">
                     {promoSuccess ? (
                        <div className="text-center py-6 space-y-4">
                           <div className="w-16 h-16 rounded-full bg-brand-500/10 border-2 border-brand-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                              <Crown size={32} className="text-brand-500" />
                           </div>
                           <h4 className="text-2xl font-black italic tracking-tighter text-white uppercase animate-bounce">¡TWH Premium Desbloqueado!</h4>
                           <p className="text-zinc-400 text-sm max-w-xs mx-auto">
                              Has canjeado el código correctamente. TWH Premium ha sido activado de por vida de forma gratuita. 🎉
                           </p>
                           <button 
                              onClick={() => {
                                 setShowPromoModal(false);
                                 setPromoSuccess(false);
                                 setPromoCode('');
                                 window.location.reload();
                              }}
                              className="w-full bg-brand-500 text-black font-black py-4 rounded-2xl hover:bg-brand-400 transition-colors uppercase tracking-wider text-sm mt-4 shadow-[0_4px_20px_rgba(16,185,129,0.4)]"
                           >
                              Empezar Ahora
                           </button>
                        </div>
                     ) : (
                        <div className="space-y-4">
                           <p className="text-zinc-400 text-sm leading-relaxed">
                              Introduce un código promocional o de oferta especial para activar las características premium de TWH de forma instantánea.
                           </p>
                           <input 
                              type="text" 
                              placeholder="Ej. TWHPRO, PREMIUM..." 
                              value={promoCode}
                              onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
                              className="w-full bg-black/50 border border-[#2c2c2e] rounded-2xl p-4 outline-none focus:border-brand-500 transition-colors text-white font-bold uppercase tracking-wider placeholder:normal-case placeholder:font-normal"
                              autoFocus
                           />
                           
                           {promoError && (
                              <p className="text-red-500 text-xs font-semibold flex items-center gap-1.5 bg-red-950/20 border border-red-900/30 px-3 py-2 rounded-xl">
                                 <X size={14} />
                                 {promoError}
                              </p>
                           )}

                           <button 
                              onClick={() => {
                                 const cleaned = promoCode.trim().toUpperCase();
                                 if (!cleaned) return;
                                 if (['TWHPRO', 'PREMIUM', 'TWH100'].includes(cleaned)) {
                                    localStorage.setItem('gl_is_pro', 'true');
                                    localStorage.setItem('gl_free_trial_used', 'true');
                                    setPromoSuccess(true);
                                 } else {
                                    setPromoError('El código de oferta no es válido o ha expirado.');
                                 }
                              }}
                              className="w-full bg-brand-500 text-black font-bold py-4 rounded-2xl hover:bg-brand-400 transition-all active:scale-98 shadow-md"
                           >
                              Validar y Canjear
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         )}

         {/* --- MODAL: COMPARTIR ENLACE --- */}
         {showShareModal && (
            <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
               <div className="w-full max-w-md bg-[#1c1c1e] rounded-3xl border border-[#2c2c2e] shadow-2xl overflow-hidden animate-in zoom-in-95">
                  <div className="px-6 py-4 flex justify-between items-center border-b border-[#2c2c2e] bg-[#2c2c2e]/50">
                     <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <Share size={20} className="text-green-500" />
                        Compartir TWH
                     </h3>
                     <button onClick={() => setShowShareModal(false)} className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40 text-zinc-400 hover:text-white transition-colors">
                        <X size={16} />
                     </button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                     <p className="text-zinc-400 text-sm leading-relaxed">
                        Comparte la aplicación con tus amigos o en redes sociales para expandir la mentalidad de crecimiento del 1%.
                     </p>
                     
                     <div className="flex items-center gap-2 bg-black/50 border border-[#2c2c2e] p-4 rounded-2xl">
                        <span className="text-zinc-300 font-semibold text-sm flex-1 truncate select-all font-mono">https://trainingwithhabits.com</span>
                        <button 
                           onClick={() => {
                              navigator.clipboard.writeText('https://trainingwithhabits.com');
                              alert('¡Enlace copiado al portapapeles! 📋');
                              setShowShareModal(false);
                           }}
                           className="bg-brand-500 text-black px-4 py-2 rounded-xl font-bold hover:bg-brand-400 text-xs transition-colors"
                        >
                           Copiar
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
