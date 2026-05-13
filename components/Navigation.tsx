import React, { useState, useEffect, useRef } from 'react';
import { AlignJustify, BarChart2, Users, Settings, Sparkles } from 'lucide-react';
import { ViewState } from '../types';
import { Logo } from './Logo';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  uiText: Record<string, string>;
  isPro?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const [isHolding, setIsHolding] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [hoveredId, setHoveredId] = useState<ViewState | null>(null);
  const holdTimer = useRef<any>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: ViewState.HABITS, icon: AlignJustify, label: 'Hábitos', pos: -1.5 },
    { id: ViewState.STATS, icon: BarChart2, label: 'Estadísticas', pos: -0.5 },
    { id: ViewState.SHARE, icon: Users, label: 'Compartir', pos: 0.5 },
    { id: ViewState.SETTINGS, icon: Settings, label: 'Ajustes', pos: 1.5 },
  ];

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsHolding(true);
    setDragX(0);
    setHoveredId(currentView);
  };

  const handleMove = (e: any) => {
    if (!isHolding) return;
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const rect = navRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const diff = (clientX - centerX) / (rect.width / 2);
    const clampedDiff = Math.max(-2, Math.min(2, diff));
    setDragX(clampedDiff);

    // Find closest item
    let closest = navItems[0];
    let minDistance = Math.abs(clampedDiff - navItems[0].pos);
    
    navItems.forEach(item => {
      const dist = Math.abs(clampedDiff - item.pos);
      if (dist < minDistance) {
        minDistance = dist;
        closest = item;
      }
    });

    if (minDistance < 0.4) {
      setHoveredId(closest.id);
    } else {
      setHoveredId(null);
    }
  };

  const handleEnd = () => {
    if (isHolding && hoveredId) {
      setView(hoveredId);
    }
    setIsHolding(false);
    setDragX(0);
    setHoveredId(null);
  };

  useEffect(() => {
    if (isHolding) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isHolding, hoveredId]);

  return (
    <div 
      ref={navRef}
      className={`fixed bottom-8 left-6 right-6 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md h-20 rounded-[2.5rem] bg-black/40 backdrop-blur-3xl shadow-2xl z-50 transition-all duration-500 border border-white/10 ${isHolding ? 'scale-105 bg-black/60 ring-2 ring-brand-500/20' : ''}`}
    >
      <div className="relative flex justify-between items-center h-full px-6">
        
        {/* Left Items */}
        <div className={`flex gap-8 transition-all duration-500 ${isHolding ? 'opacity-40 scale-90 blur-[1px]' : 'opacity-100'}`}>
          {navItems.slice(0, 2).map(item => (
            <button key={item.id} onClick={() => setView(item.id)} className={`flex flex-col items-center gap-1 transition-all ${currentView === item.id ? 'text-brand-400' : 'text-zinc-500'}`}>
              <item.icon size={22} className={currentView === item.id ? 'scale-110' : ''} />
            </button>
          ))}
        </div>

        {/* Central Radial Button */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <button
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${isHolding ? 'scale-125' : 'hover:scale-105 active:scale-95'}`}
          >
            {/* Pulsing Rings when holding */}
            {isHolding && (
              <>
                <div className="absolute inset-0 rounded-full bg-brand-500/20 animate-ping"></div>
                <div className="absolute -inset-4 rounded-full border border-brand-500/10 animate-[spin_10s_linear_infinite]"></div>
              </>
            )}
            
            <div className={`w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center shadow-2xl shadow-brand-500/40 border-2 border-white/20 relative z-10 transition-transform ${isHolding ? 'rotate-12' : ''}`}>
              <Logo className="w-10 h-10 text-white" />
            </div>

            {/* Radial Indicators */}
            {isHolding && (
              <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 flex gap-4 animate-in zoom-in-50 duration-300">
                {navItems.map((item, i) => {
                  const isHovered = hoveredId === item.id;
                  const Icon = item.icon;
                  return (
                    <div 
                      key={item.id}
                      className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border ${isHovered ? 'bg-brand-500 text-white scale-125 -translate-y-4 shadow-xl shadow-brand-500/40 border-white/20' : 'bg-black/60 text-zinc-400 scale-90 border-white/10 blur-[0.5px]'}`}
                    >
                      <Icon size={20} />
                      <span className="text-[7px] font-bold uppercase mt-1 tracking-widest">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </button>
        </div>

        {/* Right Items */}
        <div className={`flex gap-8 transition-all duration-500 ${isHolding ? 'opacity-40 scale-90 blur-[1px]' : 'opacity-100'}`}>
          {navItems.slice(2).map(item => (
            <button key={item.id} onClick={() => setView(item.id)} className={`flex flex-col items-center gap-1 transition-all ${currentView === item.id ? 'text-brand-400' : 'text-zinc-500'}`}>
              <item.icon size={22} className={currentView === item.id ? 'scale-110' : ''} />
            </button>
          ))}
        </div>

      </div>

      {/* Helper Text when holding */}
      {isHolding && (
        <div className="absolute -top-32 left-0 right-0 text-center animate-pulse">
          <p className="text-brand-400 text-[10px] font-black uppercase tracking-[0.3em]">Desliza para navegar</p>
          <div className="flex justify-center mt-2">
            <div className="w-32 h-1 bg-zinc-800 rounded-full relative overflow-hidden">
              <div 
                className="absolute top-0 bottom-0 w-8 bg-brand-500 transition-all duration-300 rounded-full"
                style={{ left: `${(dragX + 2) * 25}%`, transform: 'translateX(-50%)' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
