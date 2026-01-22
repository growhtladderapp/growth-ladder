
import React, { useState, useMemo, useRef } from 'react';
import { Settings, User, Bell, Palette, ChevronLeft, Shield, LogOut, ChevronRight, Globe, Moon, Sun, Check, Sparkles, Search, X, Plus } from 'lucide-react';
import { ViewState, UserProfile } from '../types';

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

export const SettingsView: React.FC<SettingsViewProps> = ({ setView, isPro, isDarkMode, toggleDarkMode, onChangeThemeColor, onLanguageChange, currentLangName, uiText, onLogout }) => {
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

  return (
    <div className="pb-24 pt-4 animate-fade-in space-y-6">
      {/* Modal de Idiomas */}
      {showLangModal && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-brand-card w-full max-w-sm rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col h-[70vh]">
              <div className="p-5 border-b border-white/5 flex justify-between items-center bg-black/20">
                 <h3 className="text-white font-black uppercase tracking-tighter italic">Seleccionar Idioma</h3>
                 <button onClick={() => setShowLangModal(false)} className="text-slate-500"><X size={20}/></button>
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
        <ChevronLeft size={16}/> Volver
      </button>
      
      <header>
         <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
            <Settings className={accentColor} size={28} /> {uiText.ajustes}
         </h1>
      </header>

      <div className="space-y-8">
         <div className="space-y-3">
            <h3 className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] px-1">App y {uiText.apariencia}</h3>
            <div className="space-y-1 overflow-hidden rounded-2xl border border-slate-800">
               
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
    </div>
  );
};
