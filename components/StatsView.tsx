import React, { useMemo, useState } from 'react';
import { Flame, Medal, Target, Flag, TrendingUp, Calendar, CheckCircle2, ChevronLeft, ChevronRight, Unlock } from 'lucide-react';
import { ViewState, Habit, HabitLog } from '../types';

interface Props {
  setView: (view: ViewState) => void;
  uiText: Record<string, string>;
  habits: Habit[];
  habitLogs: HabitLog[];
  isPro?: boolean;
  onRequestPro?: () => void;
  onActivateTrial?: () => void;
}

// Mini bar chart component - pure SVG, no deps
const BarChart: React.FC<{ data: { label: string; value: number; max: number }[] }> = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.max), 1);
  return (
    <div className="flex items-end gap-1 h-20 w-full">
      {data.map((d, i) => {
        const pct = d.max === 0 ? 0 : Math.round((d.value / d.max) * 100);
        const heightPct = Math.min(pct, 100);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full relative flex items-end justify-center" style={{ height: '64px' }}>
              <div
                className="w-full rounded-t-lg transition-all duration-700"
                style={{
                  height: `${Math.max(heightPct, 4)}%`,
                  background: pct >= 100
                    ? 'linear-gradient(to top, #059669, #10b981)'
                    : pct >= 50
                      ? 'linear-gradient(to top, #0369a1, #38bdf8)'
                      : 'linear-gradient(to top, #3f3f46, #52525b)',
                }}
              />
            </div>
            <span className="text-[8px] text-zinc-500 font-bold truncate w-full text-center">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// Donut chart component
const DonutChart: React.FC<{ pct: number; color: string; label: string; value: string }> = ({ pct, color, label, value }) => {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const stroke = circ * (pct / 100);
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#27272a" strokeWidth="7" />
        <circle
          cx="36" cy="36" r={r} fill="none"
          stroke={color} strokeWidth="7"
          strokeDasharray={`${stroke} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        <text x="36" y="40" textAnchor="middle" fill="white" fontSize="13" fontWeight="800">{value}</text>
      </svg>
      <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest text-center leading-tight">{label}</span>
    </div>
  );
};

export const StatsView: React.FC<Props> = ({ setView, uiText, habits, habitLogs, isPro, onRequestPro, onActivateTrial }) => {
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

  const trialUsed = localStorage.getItem('gl_free_trial_used') === 'true';

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // ─── Core Calculations ────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (habitLogs.length === 0) return {
      currentStreak: 0, bestStreak: 0, totalCompleted: 0,
      successRate: 0, last14: [], perHabit: [], completedToday: 0,
    };

    const datesCompleted = [...new Set(habitLogs.map(l => l.date))].sort();

    // Streaks
    let cur = 0, best = 0, temp = 0;
    for (let i = 0; i < datesCompleted.length; i++) {
      if (i === 0) { temp = 1; }
      else {
        // Parse dates correctly assuming local timezone YYYY-MM-DD
        const d1 = new Date(datesCompleted[i] + 'T00:00:00');
        const d2 = new Date(datesCompleted[i - 1] + 'T00:00:00');
        const diff = (d1.getTime() - d2.getTime()) / 86400000;
        temp = diff === 1 ? temp + 1 : 1;
      }
      if (temp > best) best = temp;
    }
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    const last = datesCompleted[datesCompleted.length - 1];
    cur = (last === todayStr || last === yStr) ? temp : 0;

    // Success rate
    const firstDate = new Date(datesCompleted[0] + 'T00:00:00');
    const daysSinceStart = Math.max(1, Math.floor((new Date().setHours(0, 0, 0, 0) - firstDate.getTime()) / 86400000) + 1);
    const rate = Math.min(100, Math.round((datesCompleted.length / daysSinceStart) * 100));

    // Last 14 days bar chart data
    const last14: { label: string; value: number; max: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const label = d.toLocaleDateString('es-ES', { weekday: 'short' }).slice(0, 2).toUpperCase();
      const value = habitLogs.filter(l => l.date === ds).length;
      last14.push({ label, value, max: Math.max(habits.length, 1) });
    }

    // Per-habit completion
    const perHabit = habits.map(h => {
      const done = habitLogs.filter(l => l.habitId === h.id).length;
      const pct = Math.min(100, Math.round((done / Math.max(daysSinceStart, 1)) * 100));
      return { id: h.id, title: h.title, icon: h.icon, done, pct };
    }).sort((a, b) => b.pct - a.pct);

    const completedToday = habitLogs.filter(l => l.date === todayStr).length;

    return { currentStreak: cur, bestStreak: best, totalCompleted: habitLogs.length, successRate: rate, last14, perHabit, completedToday };
  }, [habitLogs, habits, todayStr]);

  // ─── Calendar ────────────────────────────────────────────────────────────
  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1; // Make Monday first
    const cells: (number | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [calendarMonth]);

  const hasLogOnDay = (day: number) => {
    const ds = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return habitLogs.some(l => l.date === ds);
  };
  const isToday = (day: number) => {
    const ds = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return ds === todayStr;
  };

  const prevMonth = () => setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const nextMonth = () => setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-black text-white px-4 pt-10 pb-32 font-sans overflow-y-auto">

      {/* Header */}
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-xl font-bold">Estadísticas</h1>
      </div>

      {/* Empty State */}
      {habitLogs.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-20 gap-4">
          <div className="text-5xl">📊</div>
          <p className="text-zinc-500 font-medium text-sm">Completa hábitos para ver tus estadísticas</p>
        </div>
      )}

      {habitLogs.length > 0 && (
        <div className="relative flex-1">
          <div className={!isPro ? "pointer-events-none select-none opacity-20 transition-all duration-500" : ""}>
            {/* Donut Row — key metrics */}
            <div className="flex justify-around bg-[#1c1c1e] rounded-3xl p-5 mb-4">
              <DonutChart pct={stats.successRate} color="#10b981" label="Tasa de Éxito" value={`${stats.successRate}%`} />
              <DonutChart pct={habits.length > 0 ? Math.round((stats.completedToday / habits.length) * 100) : 0} color="#f97316" label="Hoy" value={`${stats.completedToday}/${habits.length}`} />
              <DonutChart pct={Math.min(100, stats.currentStreak * 10)} color="#a855f7" label="Racha" value={`${stats.currentStreak}d`} />
            </div>

            {/* 4 KPI cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { icon: <Flame size={18} className="text-orange-500" />, val: stats.currentStreak, label: 'Racha Actual', unit: 'días' },
                { icon: <Medal size={18} className="text-purple-400" />, val: stats.bestStreak, label: 'Mejor Racha', unit: 'días' },
                { icon: <Target size={18} className="text-pink-500" />, val: stats.totalCompleted, label: 'Total Completados', unit: '' },
                { icon: <Flag size={18} className="text-brand-500" />, val: `${stats.successRate}%`, label: 'Consistencia', unit: '' },
              ].map((kpi, i) => (
                <div key={i} className="bg-[#1c1c1e] rounded-2xl p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">{kpi.icon}<span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{kpi.label}</span></div>
                  <span className="text-2xl font-black text-white">{kpi.val}<span className="text-sm text-zinc-500 font-normal ml-1">{kpi.unit}</span></span>
                </div>
              ))}
            </div>

            {/* Bar chart — last 14 days */}
            <div className="bg-[#1c1c1e] rounded-3xl p-5 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-brand-500" />
                <h3 className="text-sm font-bold text-white">Últimos 14 días</h3>
              </div>
              <BarChart data={stats.last14} />
              <div className="flex justify-between mt-2 text-[9px] text-zinc-600 font-bold">
                <span>Hace 2 semanas</span>
                <span>Hoy</span>
              </div>
            </div>

            {/* Per-habit breakdown */}
            {stats.perHabit.length > 0 && (
              <div className="bg-[#1c1c1e] rounded-3xl p-5 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 size={16} className="text-brand-500" />
                  <h3 className="text-sm font-bold text-white">Por Hábito</h3>
                </div>
                <div className="space-y-3">
                  {stats.perHabit.slice(0, 8).map(h => (
                    <div key={h.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-zinc-300 font-semibold flex items-center gap-2">
                          <span>{h.icon}</span>{h.title}
                        </span>
                        <span className="text-xs font-black text-brand-500">{h.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${h.pct}%`,
                            background: h.pct >= 80 ? '#10b981' : h.pct >= 50 ? '#38bdf8' : '#6366f1'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar heatmap */}
            <div className="bg-[#1c1c1e] rounded-3xl p-5 mb-4">
              <div className="flex justify-between items-center mb-4">
                <button onClick={prevMonth} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center active:scale-90">
                  <ChevronLeft size={16} className="text-white" />
                </button>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-brand-500" />
                  <h3 className="text-sm font-bold text-white capitalize">
                    {calendarMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                  </h3>
                </div>
                <button onClick={nextMonth} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center active:scale-90">
                  <ChevronRight size={16} className="text-white" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-black text-zinc-600 mb-2">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => (
                  <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all
                  ${day === null ? '' :
                      isToday(day) ? 'ring-2 ring-brand-500 text-brand-500 bg-brand-500/10' :
                        hasLogOnDay(day) ? 'bg-brand-500 text-black' :
                          'text-zinc-700'}`}>
                    {day ?? ''}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!isPro && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
              <button
                onClick={onRequestPro}
                className="bg-red-500 text-white font-bold py-3.5 px-6 rounded-full hover:bg-red-400 active:scale-95 transition-all flex items-center gap-2.5 shadow-lg shadow-red-500/20"
              >
                <Unlock size={18} strokeWidth={2.5} className="text-white" />
                <span className="text-[15px] tracking-wide">Desbloquear estadísticas</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
