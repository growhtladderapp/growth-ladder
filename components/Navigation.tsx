import React from 'react';
import { AlignJustify, BarChart2, Users, Settings } from 'lucide-react';
import { ViewState } from '../types';
import { Logo } from './Logo';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  uiText: Record<string, string>;
  isPro?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: ViewState.STATS, icon: BarChart2, label: 'Stats' },
    { id: ViewState.SHARE, icon: Users, label: 'Social' },
    { id: ViewState.HABITS, isLogo: true },
    { id: ViewState.SETTINGS, icon: Settings, label: 'Ajustes' },
    { id: ViewState.GUIDE, icon: AlignJustify, label: 'Guía' },
  ];

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md h-24 rounded-[3rem] bg-black/50 backdrop-blur-3xl shadow-2xl z-50 transition-all duration-500 border border-white/10 ring-1 ring-white/5">
      <div className="relative flex justify-around items-center h-full px-2">
        
        {navItems.map((item, index) => {
          if (item.isLogo) {
            return (
              <button
                key="central-logo"
                onClick={() => setView(ViewState.HABITS)}
                className="relative -top-6 transition-all duration-300 transform hover:scale-110 active:scale-90 group"
              >
                <div className="absolute inset-0 bg-brand-500/20 blur-2xl rounded-full group-hover:bg-brand-500/40 transition-all"></div>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-2 transition-all duration-500 ${currentView === ViewState.HABITS ? 'bg-brand-500 border-white/40 scale-110 shadow-brand-500/50' : 'bg-zinc-900 border-white/10 opacity-90'}`}>
                  <Logo className="w-12 h-12 text-white" />
                </div>
              </button>
            );
          }

          const isActive = currentView === item.id;
          const Icon = item.icon as any;

          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className="relative z-10 flex flex-col items-center justify-center w-14 h-full transition-all duration-300 group"
            >
              <div className={`transition-all duration-300 transform ${isActive ? 'text-brand-400 scale-125 -translate-y-2' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              <span className={`absolute bottom-4 text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${isActive ? 'text-brand-400 opacity-100 translate-y-0' : 'text-zinc-500 opacity-0 translate-y-2'}`}>
                {item.label}
              </span>
            </button>
          );
        })}

      </div>
    </div>
  );
};
