
import React, { useState, useMemo, useRef } from 'react';
import { Settings, User, Bell, Palette, ChevronLeft, Shield, LogOut, ChevronRight, Globe, Moon, Sun, Check, Sparkles, Search, X, Plus, MessageCircle } from 'lucide-react';
import { ViewState, UserProfile } from '../types';
import { SupportChat } from './SupportChat';

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
}

const COMMON_LANGUAGES = [
   "Español", "English", "Português", "Français", "Deutsch", "Italiano", "日本語", "한국어", "中文", "Русский", "العربية", "हिन्दी"
];

const PRESET_COLORS = [
   { hex: '#f97316', name: 'Naranja' },
   { hex: '#06b6d4', name: 'Cian' },
   { hex: '#ec4899', name: 'Rosa' },
   { hex: '#8b5cf6', name: 'Violeta' },
   { hex: '#10b981', name: 'Esmeralda' },
   { hex: '#ef4444', name: 'Rojo' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({ userProfile, onUpdateProfile, setView, isPro, isDarkMode, toggleDarkMode, onChangeThemeColor, onLanguageChange, currentLangName, uiText, onLogout, userId }) => {
   const [showColorOptions, setShowColorOptions] = useState(false);
   const [showLangModal, setShowLangModal] = useState(false);
   const [langSearch, setLangSearch] = useState('');
   const colorInputRef = useRef<HTMLInputElement>(null);

   const accentColor = isPro ? 'text-emerald-500' : 'text-brand-500';
   const cardClass = "bg-brand-card";

   const filteredLangs = useMemo(() => {
      if (!langSearch) return COMMON_LANGUAGES;
      return COMMON_LANGUAGES.filter(l => l.toLowerCase().includes(langSearch.toLowerCase()));
   }, [langSearch]);

   const handleSelectLanguage = (lang: string) => {
      onLanguageChange(lang);
      setShowLangModal(false);
   };

   const handleCustomColorClick = () => {
      colorInputRef.current?.click();
   };

   // Avatar Upload Logic
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [uploading, setUploading] = useState(false);

   const handleAvatarClick = () => {
      fileInputRef.current?.click();
   };

   const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
         const file = event.target.files?.[0];
         if (!file || !userProfile?.name) return; // Note: using name as fallback ID check, ideally pass ID prop

         setUploading(true);

         // Dynamic import
         const { uploadAvatar } = await import('../services/supabase');

         // We need userId. Assuming it's passed or available. 
         // FALLBACK: If we don't have ID, we can't upload.
         // However, we can update the profile LOCALLY first if we can't upload? No.
         // Let's assume onUpdateProfile handles the backend sync, but for storage we need ID.
         // We will try to get it from supabase.auth.getUser()
         const { supabase } = await import('../services/supabase');
         const { data: { user } } = await supabase.auth.getUser();

         if (!user) {
            alert("Usuario no autenticado");
            return;
         }

         const publicUrl = await uploadAvatar(file, user.id);

         if (userProfile) {
            onUpdateProfile({ ...userProfile, profilePicture: publicUrl });
         }

      } catch (error) {
         console.error(error);
         alert('Error uploading image');
      } finally {
         setUploading(false);
      }
   };


   const [showSupportChat, setShowSupportChat] = useState(false);

   return (
      <div className="pb-24 pt-4 animate-fade-in space-y-6">
         {/* Support Chat Modal */}
         <SupportChat isOpen={showSupportChat} onClose={() => setShowSupportChat(false)} />

         {/* Modal de Idiomas */}
         {showLangModal && (
            <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
               <div className="bg-brand-card w-full max-w-sm rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col h-[70vh]">
                  <div className="p-5 border-b border-white/5 flex justify-between items-center bg-black/20">
                     <h3 className="text-white font-black uppercase tracking-tighter italic">Seleccionar Idioma</h3>
                     <button onClick={() => setShowLangModal(false)} className="text-slate-500"><X size={20} /></button>
                  </div>
                  <div className="p-4 bg-black/40">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                           type="text"
                           placeholder="Busca cualquier idioma..."
                           className="w-full bg-slate-900 border-none rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:ring-1 focus:ring-brand-500 outline-none"
                           value={langSearch}
                           onChange={e => setLangSearch(e.target.value)}
                        />
                     </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                     {(langSearch && !filteredLangs.includes(langSearch)) && (
                        <button
                           onClick={() => handleSelectLanguage(langSearch)}
                           className="w-full p-4 flex items-center justify-between text-white hover:bg-white/5 rounded-2xl border border-dashed border-white/10"
                        >
                           <span className="font-bold">Traducir a "{langSearch}"</span>
                           <Sparkles size={16} className="text-brand-500" />
                        </button>
                     )}
                     {filteredLangs.map(lang => (
                        <button
                           key={lang}
                           onClick={() => handleSelectLanguage(lang)}
                           className={`w-full p-4 flex items-center justify-between rounded-2xl transition-all ${lang === currentLangName ? 'bg-brand-500/10 border border-brand-500/30' : 'hover:bg-white/5'}`}
                        >
                           <span className={`font-bold ${lang === currentLangName ? 'text-brand-500' : 'text-slate-300'}`}>{lang}</span>
                           {lang === currentLangName && <Check size={16} className="text-brand-500" />}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         )}

         <button onClick={() => setView(ViewState.DASHBOARD)} className="flex items-center gap-2 text-slate-400 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors">
            <ChevronLeft size={16} /> Volver
         </button>

         <header>
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
               <Settings className={accentColor} size={28} /> {uiText.ajustes}
            </h1>
         </header>

         <div className="space-y-8">
            {/* Hidden File Input */}
            <input
               type="file"
               ref={fileInputRef}
               onChange={handleFileChange}
               accept="image/*"
               className="hidden"
            />

            <div className="space-y-3">
               <h3 className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] px-1">Perfil del Atleta</h3>
               <div className="space-y-1 overflow-hidden rounded-2xl border border-slate-800">

                  {/* AVATAR & NAME */}
                  <div className={`${cardClass} w-full p-4 flex items-center gap-4 border-b border-white/5`}>
                     <div
                        onClick={handleAvatarClick}
                        className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-brand-500 shadow-lg cursor-pointer group"
                     >
                        {userProfile?.profilePicture ? (
                           <img src={userProfile.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
                              <User size={24} />
                           </div>
                        )}

                        {/* Overlay for Edit */}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           {uploading ? (
                              <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                           ) : (
                              <Plus size={20} className="text-white" />
                           )}
                        </div>
                     </div>

                     <div>
                        <h2 className="text-white font-black italic text-xl uppercase tracking-tighter">{userProfile?.name || 'Atleta'}</h2>
                        <p className="text-brand-500 text-[10px] font-bold uppercase tracking-widest">Editar Foto</p>
                     </div>
                  </div>

                  {/* GENDER SELECTOR */}
                  <div className={`${cardClass} w-full p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5`}>
                     <div className="flex items-center gap-4 text-left">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                           <User size={18} />
                        </div>
                        <div>
                           <p className="text-white font-bold text-sm">Género</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase">{userProfile?.gender || 'No definido'}</p>
                        </div>
                     </div>
                     <div className="flex gap-1">
                        {['Masculino', 'Femenino', 'Otro'].map((g) => (
                           <button
                              key={g}
                              onClick={() => {
                                 if (userProfile) onUpdateProfile({ ...userProfile, gender: g as any });
                              }}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border ${userProfile?.gender === g ? 'bg-brand-500 text-white border-brand-500 shadow-lg' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'}`}
                           >
                              {g}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
            <div className="space-y-3">
               <h3 className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] px-1">App y {uiText.apariencia}</h3>
               <div className="space-y-1 overflow-hidden rounded-2xl border border-slate-800">

                  {/* SUPPORTE TÉCNICO BUTTON - NEW */}
                  <button
                     onClick={() => setShowSupportChat(true)}
                     className={`${cardClass} w-full p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors group`}
                  >
                     <div className="flex items-center gap-4 text-left">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                           <MessageCircle size={18} />
                        </div>
                        <div>
                           <p className="text-white font-bold text-sm">{uiText.ayuda || 'Soporte Técnico'}</p>
                           <p className="text-[10px] text-emerald-500 font-black uppercase">Online</p>
                        </div>
                     </div>
                     <ChevronRight size={16} className="text-slate-700" />
                  </button>

                  {/* BOTÓN IDIOMA */}
                  <button
                     onClick={() => setShowLangModal(true)}
                     className={`${cardClass} w-full p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors group`}
                  >
                     <div className="flex items-center gap-4 text-left">
                        <div className="p-2 rounded-lg bg-slate-800/50 text-slate-400">
                           <Globe size={18} />
                        </div>
                        <div>
                           <p className="text-white font-bold text-sm">{uiText.idioma}</p>
                           <p className="text-[10px] text-brand-500 font-black uppercase">{currentLangName}</p>
                        </div>
                     </div>
                     <ChevronRight size={16} className="text-slate-700" />
                  </button>

                  {/* TEMA VISUAL */}
                  <div className={`${cardClass} border-b border-white/5`}>
                     <button
                        onClick={() => setShowColorOptions(!showColorOptions)}
                        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
                     >
                        <div className="flex items-center gap-4 text-left">
                           <div className="p-2 rounded-lg bg-slate-800/50 text-slate-400">
                              <Palette size={18} />
                           </div>
                           <div>
                              <p className="text-white font-bold text-sm">{uiText.tema}</p>
                           </div>
                        </div>
                        <ChevronRight size={16} className={`text-slate-700 transition-transform ${showColorOptions ? 'rotate-90' : ''}`} />
                     </button>
                     {showColorOptions && (
                        <div className="p-4 pt-0 bg-brand-card grid grid-cols-6 gap-2 animate-in slide-in-from-top-2">
                           {PRESET_COLORS.map(color => (
                              <button
                                 key={color.hex}
                                 onClick={() => onChangeThemeColor(color.hex)}
                                 className="aspect-square rounded-full border-2 border-slate-800 flex items-center justify-center transition-transform active:scale-90"
                                 style={{ backgroundColor: color.hex }}
                              >
                                 <Check size={12} className="text-white drop-shadow-md" />
                              </button>
                           ))}
                           <button
                              onClick={handleCustomColorClick}
                              className="aspect-square rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center transition-transform active:scale-90 bg-slate-800/50 hover:border-slate-500 group/custom"
                           >
                              <Plus size={16} className="text-slate-500 group-hover/custom:text-white" />
                           </button>
                           <input
                              type="color"
                              ref={colorInputRef}
                              onChange={(e) => onChangeThemeColor(e.target.value)}
                              className="hidden"
                           />
                        </div>
                     )}
                  </div>

                  {/* TEMA CLARO/OSCURO TOGGLE */}
                  <button
                     onClick={toggleDarkMode}
                     className={`${cardClass} w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors group`}
                  >
                     <div className="flex items-center gap-4 text-left">
                        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-indigo-500/10 text-indigo-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                           {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                        </div>
                        <div>
                           <p className="text-white font-bold text-sm">{isDarkMode ? uiText.modo_oscuro : uiText.modo_claro}</p>
                        </div>
                     </div>
                     <div className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-indigo-600' : 'bg-yellow-500'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isDarkMode ? 'left-6' : 'left-1'}`}></div>
                     </div>
                  </button>
               </div>
            </div>

            <div className="space-y-3">
               <h3 className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] px-1">Cuenta</h3>
               <button
                  onClick={onLogout}
                  className={`${cardClass} w-full p-4 flex items-center justify-between rounded-2xl border border-slate-800 hover:bg-red-500/5 transition-colors group`}
               >
                  <div className="flex items-center gap-4 text-left">
                     <div className="p-2 rounded-lg bg-red-500/10 text-red-500"><LogOut size={18} /></div>
                     <p className="text-red-500 font-bold text-sm">{uiText.cerrar_sesion}</p>
                  </div>
               </button>
            </div>
         </div>

         {/* GAMIFICATION / LEVEL CARD */}
         <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-5 border border-indigo-500/30 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
               <div>
                  <h4 className="text-white font-black italic uppercase text-lg tracking-tighter">Nivel {userProfile?.level || 1}</h4>
                  <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">{userProfile?.xp || 0} XP Totales</p>
               </div>
               <div className="bg-indigo-500 text-white p-2 rounded-xl shadow-lg shadow-indigo-500/50">
                  <Shield size={24} fill="currentColor" />
               </div>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-1 mb-4 relative z-10">
               <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Progreso</span>
                  <span>{((userProfile?.xp || 0) % 1000) / 10}%</span>
               </div>
               <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                  <div
                     className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
                     style={{ width: `${((userProfile?.xp || 0) % 1000) / 10}%` }}
                  ></div>
               </div>
               <p className="text-right text-[9px] text-slate-500">Siguiente Nivel: {(userProfile?.level || 1) + 1}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10">
               <div className="bg-black/30 p-2 rounded-lg border border-white/5 text-center">
                  <p className="text-white font-bold text-lg leading-none">{userProfile?.goalsCompleted || 0}</p>
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Metas</p>
               </div>
               <div className="bg-black/30 p-2 rounded-lg border border-white/5 text-center">
                  <p className="text-white font-bold text-lg leading-none">
                     {userProfile?.createdAt ? Math.floor((new Date().getTime() - new Date(userProfile.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 1}
                  </p>
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Días Activo</p>
               </div>
            </div>
         </div>
      </div>
   );
};
