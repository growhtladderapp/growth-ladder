import React, { useMemo } from 'react';
import { ChevronRight, ChevronLeft, Lock, Flame, Medal, Target, Flag } from 'lucide-react';
import { ViewState, Habit, HabitLog } from '../types';

interface Props {
  setView: (view: ViewState) => void;
  uiText: Record<string, string>;
  habits: Habit[];
  habitLogs: HabitLog[];
}

export const StatsView: React.FC<Props> = ({ setView, uiText, habits, habitLogs }) => {
  // Simple stats calculation based on active days
  const { currentStreak, bestStreak, totalCompleted, successRate } = useMemo(() => {
    if (habitLogs.length === 0) return { currentStreak: 0, bestStreak: 0, totalCompleted: 0, successRate: "0%" };
    
    // Get unique dates where at least one habit was completed
    const datesCompleted = [...new Set(habitLogs.map(log => log.date))].sort((a,b) => new Date(a).getTime() - new Date(b).getTime());
    
    let current = 0;
    let best = 0;
    let temp = 0;

    for (let i = 0; i < datesCompleted.length; i++) {
        if (i === 0) {
            temp = 1;
        } else {
            const diff = (new Date(datesCompleted[i]).getTime() - new Date(datesCompleted[i-1]).getTime()) / (1000 * 3600 * 24);
            if (diff === 1) temp++;
            else temp = 1;
        }
        if (temp > best) best = temp;
        current = temp; // Last calculated temp is current if it includes yesterday or today
    }

    // if the last date completed is not today or yesterday, current streak is 0
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const lastDate = datesCompleted[datesCompleted.length - 1];
    if (lastDate !== todayStr && lastDate !== yesterdayStr) {
        current = 0;
    }

    // Mock success rate based on days since first log vs completed days
    const firstDate = new Date(datesCompleted[0]);
    const totalDaysSinceStart = Math.max(1, Math.floor((new Date().getTime() - firstDate.getTime()) / (1000 * 3600 * 24)) + 1);
    const rate = Math.round((datesCompleted.length / totalDaysSinceStart) * 100);

    return {
        currentStreak: current,
        bestStreak: best,
        totalCompleted: habitLogs.length,
        successRate: `${Math.min(100, rate)}%`
    }
  }, [habitLogs]);

  return (
    <div className="flex flex-col h-full bg-black text-white px-5 pt-10 pb-32 font-sans overflow-y-auto">
      {/* Header */}
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-xl font-bold">Estadísticas</h1>
      </div>

      {/* Filter */}
      <h2 className="text-sm font-semibold text-zinc-400 mb-2">Hábitos seleccionados</h2>
      <button className="w-full bg-[#1c1c1e] active:bg-[#2c2c2e] hover:bg-[#2c2c2e] rounded-2xl p-4 flex justify-between items-center mb-6 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
             <div className="w-4 h-4 bg-brand-500 flex items-center justify-center rounded-sm">
               <span className="text-[10px] text-black">✓</span>
             </div>
          </div>
          <span className="font-semibold text-white">Todos</span>
        </div>
        <div className="flex items-center text-zinc-500">
          <span className="text-sm mr-1">{habits.length} hábitos activos</span>
          <ChevronRight size={16} />
        </div>
      </button>

      {/* Calendar Area */}
      <div className="bg-[#1c1c1e] rounded-3xl p-5 mb-6 relative">
        <div className="flex justify-between items-center mb-4">
           {/* Just showing static mock month for now, logic can be expanded */}
           <h3 className="text-lg font-bold text-white uppercase">{new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric'})}</h3>
        </div>
        <div className="grid grid-cols-7 gap-y-4 text-center text-sm font-semibold text-zinc-500 mb-2">
           <div>LUN</div><div>MAR</div><div>MIÉ</div><div>JUE</div><div>VIE</div><div>SÁB</div><div>DOM</div>
        </div>
        <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center text-sm font-bold text-white mb-2">
           {Array.from({length: 30}).map((_, i) => {
              const d = i + 1;
              const isToday = d === new Date().getDate();
              // Mock random completions for visual
              const hasLog = habitLogs.some(log => new Date(log.date).getDate() === d);
              return (
                <div key={i} className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${hasLog ? 'bg-brand-500 text-black' : (isToday ? 'border-2 border-brand-500 text-brand-500' : 'bg-transparent')}`}>
                    {d}
                </div>
              )
           })}
        </div>

        {habits.length === 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                <p className="text-sm font-bold text-white">Completa hábitos</p>
            </div>
        )}
      </div>

      {/* Récords */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-zinc-400">Récords</h2>
        <div className="flex items-center text-brand-500 text-sm font-bold gap-2">
          <span>Toda la historia</span>
        </div>
      </div>

      <div className="bg-[#1c1c1e] rounded-3xl p-6">
        <div className="grid grid-cols-2 gap-y-8 gap-x-4">
           <div className="flex flex-col items-center">
             <Flame size={24} className="text-orange-500 mb-2" />
             <span className="text-2xl font-bold text-white mb-1">{currentStreak}</span>
             <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Racha Actual</span>
           </div>
           <div className="flex flex-col items-center">
             <Medal size={24} className="text-purple-500 mb-2" />
             <span className="text-2xl font-bold text-white mb-1">{bestStreak}</span>
             <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">La Mejor Racha</span>
           </div>
           
           <div className="flex flex-col items-center">
             <Target size={24} className="text-pink-500 mb-2" />
             <span className="text-2xl font-bold text-white mb-1">{totalCompleted}</span>
             <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Completados</span>
           </div>
           <div className="flex flex-col items-center">
             <Flag size={24} className="text-brand-500 mb-2" />
             <span className="text-2xl font-bold text-white mb-1">{successRate}</span>
             <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Tasa de Éxito</span>
           </div>
        </div>
      </div>
    </div>
  );
};
