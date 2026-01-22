
import React, { useState, useEffect } from 'react';
import { Users, Zap, Trophy, ChevronLeft, MessageSquare, Heart, Award, Flame, Target, Sparkles, TrendingUp, Globe } from 'lucide-react';
import { ViewState } from '../types';

interface CommunityViewProps {
  setView: (view: ViewState) => void;
  isPro: boolean;
  uiText: Record<string, string>;
}

const GLOBAL_FEED = [
  { id: 1, user: "Atleta #882", action: "completó rutina", detail: "Tren Superior Pro", time: "hace 2m", points: 150 },
  { id: 2, user: "Maria G.", action: "alcanzó meta", detail: "5km Running", time: "hace 5m", points: 200 },
  { id: 3, user: "Carlos K.", action: "nuevo récord", detail: "Quema de 800kcal", time: "hace 12m", points: 350 },
  { id: 4, user: "Atleta #102", action: "completó desafío", detail: "7 días seguidos", time: "hace 20m", points: 500 },
];

const LEADERBOARD = [
  { rank: 1, name: "Killer Instinct", level: 42, points: "12,400", avatar: "KI" },
  { rank: 2, name: "Iron Maiden", level: 39, points: "11,850", avatar: "IM" },
  { rank: 3, name: "Zenith Flow", level: 38, points: "11,200", avatar: "ZF" },
  { rank: 4, name: "Atleta #009", level: 35, points: "9,800", avatar: "A9" },
];

export const CommunityView: React.FC<CommunityViewProps> = ({ setView, isPro, uiText }) => {
  const [activeTab, setActiveTab] = useState<'FEED' | 'CHALLENGES' | 'RANKING'>('FEED');
  const [communityProgress, setCommunityProgress] = useState(68);

  const accentColor = isPro ? 'text-emerald-500' : 'text-brand-500';
  const bgAccent = isPro ? 'bg-emerald-600' : 'bg-brand-600';
  const cardClass = isPro ? 'bg-zinc-900 border-zinc-800' : 'bg-brand-card border-slate-700';

  return (
    <div className="pb-24 pt-4 animate-fade-in space-y-6">
      <button 
        onClick={() => setView(ViewState.DASHBOARD)} 
        className="flex items-center gap-2 text-slate-400 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors"
      >
        <ChevronLeft size={16}/> Volver
      </button>

      <header>
         <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
            <Users className={accentColor} size={28} /> {uiText.comunidad}
         </h1>
         <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Sincronización global de atletas de élite</p>
      </header>

      {/* Tabs */}
      <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700">
         {(['FEED', 'CHALLENGES', 'RANKING'] as const).map(tab => (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === tab ? `${bgAccent} text-white shadow-lg` : 'text-slate-500 hover:text-slate-300'}`}
           >
             {tab === 'FEED' ? 'Muro' : tab === 'CHALLENGES' ? 'Desafíos' : 'Ranking'}
           </button>
         ))}
      </div>

      {activeTab === 'FEED' && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
           <div className={`${cardClass} p-4 rounded-2xl border flex items-center gap-3 bg-gradient-to-r from-brand-500/5 to-transparent`}>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Atletas activos ahora: <span className="text-white">1,204</span></p>
           </div>
           
           <div className="space-y-3">
              {GLOBAL_FEED.map(post => (
                <div key={post.id} className={`${cardClass} p-4 rounded-2xl border shadow-lg group hover:border-brand-500/30 transition-all`}>
                   <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                            {post.user.substring(0, 2).toUpperCase()}
                         </div>
                         <div>
                            <p className="text-white font-bold text-xs">{post.user}</p>
                            <p className="text-[9px] text-slate-500 uppercase font-black">{post.time}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-1 text-brand-500 font-mono text-[10px] font-bold">
                         <TrendingUp size={12} /> +{post.points}
                      </div>
                   </div>
                   <p className="text-sm text-slate-300 mb-4">
                      <span className="text-brand-500 font-bold">{post.action}</span>: {post.detail}
                   </p>
                   <div className="flex gap-4 border-t border-white/5 pt-3">
                      <button className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors">
                         <Flame size={14} /> <span className="text-[10px] font-bold">RESPETO</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-slate-500 hover:text-brand-500 transition-colors">
                         <MessageSquare size={14} /> <span className="text-[10px] font-bold">COMENTAR</span>
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'CHALLENGES' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
           <div className={`${cardClass} p-6 rounded-2xl border shadow-2xl relative overflow-hidden`}>
              <div className="absolute -right-8 -top-8 opacity-10">
                 <Globe size={120} className={accentColor} />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="text-yellow-500" size={16} />
                    <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Meta de la Comunidad</span>
                 </div>
                 <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1">CUMBRE DE ACERO</h2>
                 <p className="text-xs text-slate-400 mb-6">Meta global: 1,000,000 kcal quemadas colectivamente esta semana.</p>
                 
                 <div className="space-y-2">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] font-bold text-slate-500 uppercase">Progreso Global</span>
                       <span className="text-xl font-black text-white">{communityProgress}%</span>
                    </div>
                    <div className="w-full h-3 bg-black rounded-full overflow-hidden border border-white/5">
                       <div className={`h-full ${bgAccent} transition-all duration-1000`} style={{ width: `${communityProgress}%` }}></div>
                    </div>
                 </div>
                 <p className="text-[9px] text-slate-600 font-bold uppercase mt-4 text-center">Faltan 320,000 kcal • Finaliza en 2 días</p>
              </div>
           </div>

           <div className="space-y-3">
              <h3 className="text-white font-black text-xs uppercase tracking-widest px-1">Tus Desafíos Activos</h3>
              <div className={`${cardClass} p-4 rounded-xl border flex items-center justify-between`}>
                 <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500"><Flame size={20} /></div>
                    <div>
                       <p className="text-white font-bold text-sm">Escalador Diario</p>
                       <p className="text-[10px] text-slate-500">3/7 días completados</p>
                    </div>
                 </div>
                 <div className="w-10 h-10 rounded-full border-2 border-slate-800 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-500">42%</span>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'RANKING' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
           <div className="bg-zinc-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4 bg-black/40 border-b border-white/5 flex items-center gap-3">
                 <Trophy className="text-yellow-500" size={20} />
                 <h3 className="text-white font-bold text-xs uppercase tracking-widest">Salón de la Fama Semanal</h3>
              </div>
              <div className="divide-y divide-white/5">
                 {LEADERBOARD.map((item) => (
                   <div key={item.rank} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                         <span className={`w-5 font-black text-sm ${item.rank === 1 ? 'text-yellow-500' : item.rank === 2 ? 'text-slate-400' : item.rank === 3 ? 'text-orange-500' : 'text-slate-600'}`}>{item.rank}</span>
                         <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white border border-white/5">
                            {item.avatar}
                         </div>
                         <div>
                            <p className="text-white font-bold text-sm">{item.name}</p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase">Nivel {item.level} • Atleta Pro</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className={`text-sm font-black ${accentColor}`}>{item.points}</p>
                         <p className="text-[8px] text-slate-600 font-bold uppercase">PTS</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Award className="text-brand-500" size={20} />
                 <div>
                    <p className="text-white font-bold text-xs">Tu Posición Actual</p>
                    <p className="text-[10px] text-slate-500 uppercase">#1,402 en el mundo</p>
                 </div>
              </div>
              <button className="text-[9px] font-black text-brand-500 uppercase tracking-widest border border-brand-500/30 px-3 py-1 rounded-full">Ver Más</button>
           </div>
        </div>
      )}
    </div>
  );
};
