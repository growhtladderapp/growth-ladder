
import React, { useMemo } from 'react';
// Added CheckCircle2 to the imports
import { Trophy, Star, Target, Zap, ChevronLeft, Award, Medal, Crown, CheckCircle2 } from 'lucide-react';
import { DailyLogEntry, ViewState } from '../types';

interface AchievementsProps {
  logs: DailyLogEntry[];
  setView: (view: ViewState) => void;
  isPro: boolean;
}

export const Achievements: React.FC<AchievementsProps> = ({ logs, setView, isPro }) => {
  const accentColor = isPro ? 'text-emerald-500' : 'text-brand-500';
  const bgAccent = isPro ? 'bg-emerald-500' : 'bg-brand-500';
  const cardClass = isPro ? 'bg-zinc-900 border-zinc-800' : 'bg-brand-card border-slate-700';

  const stats = useMemo(() => {
    const todayStr = new Date().toDateString();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const todayLogs = logs.filter(l => new Date(l.date).toDateString() === todayStr);
    const weekLogs = logs.filter(l => new Date(l.date) >= weekAgo);
    const monthLogs = logs.filter(l => new Date(l.date) >= monthAgo);

    return {
      dailyDone: todayLogs.length > 0,
      weeklyCount: new Set(weekLogs.map(l => new Date(l.date).toDateString())).size,
      monthlyCount: new Set(monthLogs.map(l => new Date(l.date).toDateString())).size,
      totalWeightLost: logs.length > 1 ? logs[0].weight - logs[logs.length-1].weight : 0
    };
  }, [logs]);

  const achievementsList = [
    { 
      title: "Logros Diarios", 
      icon: Star, 
      items: [
        { label: "Primer Paso", desc: "Registra tu actividad de hoy", completed: stats.dailyDone },
        { label: "Hidratación", desc: "Cumpliste tu meta de agua", completed: true },
      ]
    },
    { 
      title: "Metas Semanales", 
      icon: Award, 
      items: [
        { label: "Constancia", desc: "3 días activos esta semana", completed: stats.weeklyCount >= 3 },
        { label: "Atleta Guerrero", desc: "5 días activos esta semana", completed: stats.weeklyCount >= 5 },
      ]
    },
    { 
      title: "Hitos Mensuales", 
      icon: Crown, 
      items: [
        { label: "Master de Escalera", desc: "20 días activos el último mes", completed: stats.monthlyCount >= 20 },
        { label: "Evolución Física", desc: "Baja o sube 1kg según tu meta", completed: Math.abs(stats.totalWeightLost) >= 1 },
      ]
    }
  ];

  return (
    <div className="pb-24 pt-4 animate-fade-in space-y-6">
      <button onClick={() => setView(ViewState.DASHBOARD)} className="flex items-center gap-2 text-slate-400 font-bold uppercase text-xs tracking-widest"><ChevronLeft size={16}/> Volver</button>
      
      <header className="text-center">
         <div className={`w-16 h-16 mx-auto rounded-3xl ${bgAccent} flex items-center justify-center text-white shadow-2xl mb-4 rotate-3`}>
            <Trophy size={32} />
         </div>
         <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Tus <span className={accentColor}>Logros</span></h1>
         <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Cada escalón cuenta para tu meta final</p>
      </header>

      <div className="space-y-6">
         {achievementsList.map((section, idx) => (
           <div key={idx} className="space-y-3">
              <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 px-1">
                 <section.icon size={14} className={accentColor} /> {section.title}
              </h3>
              <div className="space-y-2">
                 {section.items.map((item, i) => (
                   <div key={i} className={`${cardClass} p-4 rounded-xl border flex items-center justify-between ${item.completed ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.completed ? 'bg-yellow-500/20 text-yellow-500' : 'bg-slate-800 text-slate-600'}`}>
                            <Medal size={20} />
                         </div>
                         <div>
                            <p className="text-white font-bold text-sm leading-tight">{item.label}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">{item.desc}</p>
                         </div>
                      </div>
                      {/* Fixed: CheckCircle2 icon was missing import */}
                      {item.completed && <CheckCircle2 size={20} className="text-emerald-500" />}
                   </div>
                 ))}
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};
