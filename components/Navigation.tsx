import React from 'react';
import { AlignJustify, BarChart2, Users, Settings } from 'lucide-react';
import { ViewState } from '../types';
import { sounds } from '../utils/sound';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  uiText: Record<string, string>;
  isPro?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: ViewState.HABITS, icon: AlignJustify, label: 'Hábitos' },
    { id: ViewState.STATS, icon: BarChart2, label: 'Stats' },
    { id: ViewState.SHARE, icon: Users, label: 'Social' },
    { id: ViewState.SETTINGS, icon: Settings, label: 'Ajustes' },
  ];

  const activeIndex = navItems.findIndex(item => item.id === currentView);

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md h-[4.5rem] rounded-full bg-black/40 backdrop-blur-2xl shadow-2xl z-50 transition-all border border-white/10 ring-1 ring-black/5">
      <div className="relative flex justify-around items-center h-full px-2">

        {/* Animated Background Pill */}
        <div
          className="absolute h-14 rounded-full bg-brand-500/20 border border-brand-500/30 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{
            width: 'calc(25% - 1rem)',
            left: `calc(${activeIndex * 25}% + 0.5rem)`
          }}
        />

        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                sounds.playTap();
                setView(item.id);
              }}
              className="relative z-10 flex flex-col items-center justify-center w-full h-full transition-all duration-300"
            >
              <div className={`transition-all duration-300 transform ${isActive ? 'text-brand-400 scale-110 -translate-y-1' : 'text-zinc-500 hover:text-zinc-300'}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`absolute bottom-2 text-[9px] font-bold tracking-wide transition-all duration-300 ${isActive ? 'text-brand-400 opacity-100 translate-y-0' : 'text-zinc-500 opacity-0 translate-y-2'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
