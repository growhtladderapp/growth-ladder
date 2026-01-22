
import React, { useState } from 'react';
import { Home, Dumbbell, BookOpen, Book, User, ScanBarcode } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isPro?: boolean;
  uiText: Record<string, string>;
}

// Extracted for individual state handling (hover animations)
const NavItem = ({
  item,
  isActive,
  setView,
  activeColorClass,
  isPro
}: {
  item: any,
  isActive: boolean,
  setView: (id: ViewState) => void,
  activeColorClass: string,
  isPro: boolean
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isGuide = item.id === ViewState.GUIDE;

  // Determine Icon for Guide: Closed by default, Open on hover/active
  let Icon = item.icon;
  if (isGuide) {
    Icon = isHovered ? BookOpen : Book;
  }

  // Scanner button has a simpler structure in the original, but assuming we can keep the logic here or separate in parent.
  // Actually, the parent map handled Scanner specially. Let's keep that simple. 
  // We'll standard rendering here, but the specific "Scanner" different look was in the loop. 
  // Let's assume this component is only for the standard buttons for now?
  // No, the instruction implies "cuando te pongas sobre el boton guia". 

  return (
    <button
      onClick={() => setView(item.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 group ${isActive ? '-translate-y-2' : 'hover:-translate-y-1'}`}
    >
      {/* Crystal Active Background */}
      {isActive && (
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in duration-300`}>
          <div className="absolute inset-0 bg-white/5 rounded-2xl animate-pulse" />
        </div>
      )}

      <div className={`relative z-10 transition-all duration-300 ${isActive ? activeColorClass : 'text-slate-400 group-hover:text-slate-200'}`}>
        <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} className={`transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : ''}`} />
      </div>

      {isActive && (
        <span className="absolute -bottom-5 text-[10px] font-bold animate-in slide-in-from-bottom-2 fade-in duration-300 whitespace-nowrap">
          {item.label}
        </span>
      )}
    </button>
  );
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView, isPro = false, uiText }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, icon: Home, label: uiText.inicio },
    { id: ViewState.WORKOUT, icon: Dumbbell, label: uiText.entreno },
    { id: ViewState.SCANNER, icon: ScanBarcode, label: 'Escanear' },
    { id: ViewState.GUIDE, icon: BookOpen, label: uiText.guia }, // Default icon, but NavItem will override logic
    { id: ViewState.LOG, icon: User, label: uiText.perfil },
  ];

  const activeColorClass = isPro ? 'text-emerald-400' : 'text-brand-400';
  const containerClass = isPro
    ? 'bg-zinc-900/60 border-zinc-700/50 shadow-emerald-900/20'
    : 'bg-slate-900/80 border-slate-700/50 shadow-brand-900/20';

  return (
    <div className={`fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md h-20 rounded-[2.5rem] border backdrop-blur-xl shadow-2xl z-50 transition-all duration-300 ${containerClass}`}>
      <div className="flex justify-around items-center h-full px-2 relative">
        {navItems.map((item) => {
          const isScanner = item.id === ViewState.SCANNER;
          const isActive = currentView === item.id;

          if (isScanner) {
            return (
              <button key={item.id} onClick={() => setView(item.id)} className="relative -top-8 group">
                <div className={`relative p-5 rounded-full border-4 transition-all duration-500 shadow-xl ${isActive
                  ? (isPro ? 'bg-emerald-600 border-zinc-900 shadow-emerald-500/50 scale-110' : 'bg-brand-600 border-slate-900 shadow-brand-500/50 scale-110')
                  : (isPro ? 'bg-zinc-800 border-zinc-900 text-slate-400 hover:scale-105' : 'bg-slate-800 border-slate-900 text-slate-400 hover:scale-105')
                  }`}>
                  {/* Inner crystal shine */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <item.icon size={28} className={isActive ? 'text-white' : ''} />
                </div>
                <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold transition-all ${isActive ? activeColorClass : 'text-slate-500 opacity-0 group-hover:opacity-100'}`}>Escanear</span>
              </button>
            )
          }

          return (
            <NavItem
              key={item.id}
              item={item}
              isActive={isActive}
              setView={setView}
              activeColorClass={activeColorClass}
              isPro={isPro}
            />
          );
        })}
      </div>
    </div>
  );
};
