
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DailyLogEntry, UserProfile, Routine, CalendarEvent } from '../types';
import { useToast } from '../components/ToastContext';
import { Ruler, Scale, HeartPulse, ChevronLeft, ChevronRight, TrendingUp, Calendar as CalendarIcon, Clock, Dumbbell, User, Flame, Footprints, Camera, Edit2, Save, X, Activity, Plus, Trash2, Bell, CheckCircle2, BarChart3, LineChart, Target, Zap } from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis, LineChart as ReLineChart, Line, CartesianGrid } from 'recharts';

interface TrackerProps {
  onSave: (entry: DailyLogEntry) => void;
  userProfile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile) => void;
  logs: DailyLogEntry[];
  calendarEvents: CalendarEvent[];
  onUpdateEvents: (events: CalendarEvent[]) => void;
  isPro?: boolean;
  onNavigateToWorkout?: () => void;
}

export const Tracker: React.FC<TrackerProps> = ({ userProfile, onUpdateProfile, logs, calendarEvents, onUpdateEvents, isPro = false, onNavigateToWorkout, onSave }) => {
  const [viewState, setViewState] = useState<'PROFILE' | 'CALENDAR' | 'STATS' | 'FORM'>('PROFILE');
  const { toast } = useToast();
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const [showEventForm, setShowEventForm] = useState(false);

  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('08:00');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formWeight, setFormWeight] = useState(userProfile?.weight?.toString() || '');
  const [formCalories, setFormCalories] = useState('');
  const [formKm, setFormKm] = useState('');

  const accentColor = isPro ? 'text-emerald-500' : 'text-brand-500';
  const hexAccent = isPro ? '#10b981' : '#f97316';
  const bgAccent = isPro ? 'bg-emerald-500' : 'bg-brand-500';
  const cardClass = isPro ? 'bg-zinc-900 border-zinc-800' : 'bg-brand-card border-slate-700';

  // --- CALCULAR ESTADÍSTICAS SEMANALES ---
  const weeklyStats = useMemo(() => {
    const last7Days = [];
    let totalCals = 0;
    let totalKm = 0;
    let weightData = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const dayLogs = logs.filter(l => new Date(l.date).toDateString() === dateStr);

      const dayCals = dayLogs.reduce((acc, curr) => acc + curr.calories, 0);
      const dayKm = dayLogs.reduce((acc, curr) => acc + curr.distanceKm, 0);
      // Tomamos el último peso registrado del día
      const dayWeight = dayLogs.length > 0 ? dayLogs[dayLogs.length - 1].weight : (weightData.length > 0 ? weightData[weightData.length - 1].weight : userProfile?.weight || 0);

      totalCals += dayCals;
      totalKm += dayKm;

      const dataPoint = {
        name: d.toLocaleDateString('es-ES', { weekday: 'short' }),
        cals: dayCals,
        km: dayKm,
        weight: dayWeight,
        fullDate: dateStr
      };

      last7Days.push(dataPoint);
      weightData.push({ name: dataPoint.name, weight: dayWeight });
    }

    const avgCals = Math.round(totalCals / 7);
    const weightChange = weightData[weightData.length - 1].weight - weightData[0].weight;

    return { last7Days, totalCals, totalKm, avgCals, weightData, weightChange };
  }, [logs, userProfile]);

  // --- CALENDAR LOGIC ---
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const changeMonth = (offset: number) => {
    const nextDate = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + offset, 1);
    setCurrentCalendarDate(nextDate);
    setSelectedDay(null);
  };

  const calendarDays = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const daysCount = getDaysInMonth(year, month);
    const startDay = getFirstDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, hasLog: false, hasEvent: false });
    }
    for (let i = 1; i <= daysCount; i++) {
      const dateStr = new Date(year, month, i).toDateString();
      const hasLog = logs.some(log => new Date(log.date).toDateString() === dateStr);
      const hasEvent = calendarEvents.some(ev => new Date(ev.date).toDateString() === dateStr);
      days.push({ day: i, hasLog, hasEvent });
    }
    return days;
  }, [currentCalendarDate, logs, calendarEvents]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) return [];
    const dateStr = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), selectedDay).toDateString();
    return calendarEvents
      .filter(ev => new Date(ev.date).toDateString() === dateStr)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDay, calendarEvents, currentCalendarDate]);

  const handleAddEvent = () => {
    if (!newEventTitle || !selectedDay) return;
    const eventDate = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), selectedDay);
    const event: CalendarEvent = {
      id: Date.now().toString(),
      date: eventDate.toISOString(),
      time: newEventTime,
      title: newEventTitle,
      completed: false
    };
    onUpdateEvents([...calendarEvents, event]);
    setNewEventTitle('');
    setShowEventForm(false);
  };

  const handleDeleteEvent = (id: string) => onUpdateEvents(calendarEvents.filter(e => e.id !== id));

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && userProfile) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdateProfile({ ...userProfile, profilePicture: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProgress = () => {
    if (!formWeight) return toast("Ingresa tu peso actual", 'warning');
    onSave({
      date: new Date().toISOString(),
      calories: parseInt(formCalories) || 0,
      distanceKm: parseFloat(formKm) || 0,
      mood: 3,
      weight: parseFloat(formWeight)
    });
    setViewState('PROFILE');
    setFormCalories('');
    setFormKm('');
  };

  // --- RENDERS ---

  if (viewState === 'STATS') {
    return (
      <div className="pb-24 pt-4 animate-fade-in space-y-6">
        <button onClick={() => setViewState('PROFILE')} className="flex items-center gap-2 text-slate-400 font-bold uppercase text-xs tracking-widest transition-colors hover:text-white"><ChevronLeft size={16} /> Volver al Perfil</button>

        <header>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
            <BarChart3 className={accentColor} size={28} /> Estadísticas <span className={accentColor}>Semanales</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Análisis de rendimiento de los últimos 7 días</p>
        </header>

        {/* Totals Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`${cardClass} p-4 rounded-2xl border flex flex-col items-center justify-center text-center shadow-lg`}>
            <Flame size={20} className="text-orange-500 mb-2" />
            <p className="text-2xl font-black text-white">{weeklyStats.totalCals.toLocaleString()}</p>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Kcal Totales</p>
          </div>
          <div className={`${cardClass} p-4 rounded-2xl border flex flex-col items-center justify-center text-center shadow-lg`}>
            <Footprints size={20} className="text-blue-500 mb-2" />
            <p className="text-2xl font-black text-white">{weeklyStats.totalKm.toFixed(1)}</p>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Km Totales</p>
          </div>
        </div>

        {/* Calories Chart */}
        <div className={`${cardClass} p-5 rounded-2xl border shadow-xl`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} className="text-yellow-500" /> Quema Diaria (Kcal)
            </h3>
            <span className="text-[10px] text-slate-500 font-bold">Promedio: {weeklyStats.avgCals} kcal/día</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyStats.last7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="statColorCals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={hexAccent} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={hexAccent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="cals" stroke={hexAccent} strokeWidth={3} fillOpacity={1} fill="url(#statColorCals)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight Trend Chart */}
        <div className={`${cardClass} p-5 rounded-2xl border shadow-xl`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <Scale size={14} className="text-blue-400" /> Tendencia de Peso (kg)
            </h3>
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${weeklyStats.weightChange > 0 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              {weeklyStats.weightChange > 0 ? '+' : ''}{weeklyStats.weightChange.toFixed(1)} kg esta semana
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={weeklyStats.weightData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '10px' }}
                />
                <Line type="stepAfter" dataKey="weight" stroke="#60a5fa" strokeWidth={3} dot={{ fill: '#60a5fa', r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[9px] text-slate-500 font-bold uppercase mt-4 text-center tracking-widest">
            Objetivo actual: {userProfile?.focus === 'Muscle Gain' ? 'Fase de Volumen' : 'Fase de Definición'}
          </p>
        </div>
      </div>
    );
  }

  if (viewState === 'CALENDAR') {
    const monthName = currentCalendarDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    return (
      <div className="pb-24 pt-4 animate-fade-in space-y-6">
        <button onClick={() => setViewState('PROFILE')} className="flex items-center gap-2 text-slate-400 font-bold uppercase text-xs tracking-widest"><ChevronLeft size={16} /> Volver</button>
        <div className={`${cardClass} p-5 rounded-2xl border shadow-xl`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter capitalize">{monthName}</h2>
            <div className="flex gap-2">
              <button onClick={() => changeMonth(-1)} className="p-2 bg-slate-800 rounded-lg text-white"><ChevronLeft size={18} /></button>
              <button onClick={() => changeMonth(1)} className="p-2 bg-slate-800 rounded-lg text-white"><ChevronRight size={18} /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
              <div key={d} className="text-center text-[10px] font-black text-slate-500 uppercase">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((d, i) => (
              <button key={i} disabled={!d.day} onClick={() => setSelectedDay(d.day)} className={`aspect-square rounded-xl flex flex-col items-center justify-center relative border transition-all ${!d.day ? 'border-transparent' : selectedDay === d.day ? `${bgAccent} border-white/20 text-white shadow-lg` : 'bg-slate-900/50 border-slate-800 text-slate-400'}`}>
                {d.day && (
                  <>
                    <span className="text-xs font-black">{d.day}</span>
                    <div className="flex gap-0.5 mt-0.5">
                      {d.hasLog && <div className={`w-1 h-1 rounded-full bg-blue-400`}></div>}
                      {d.hasEvent && <div className={`w-1 h-1 rounded-full ${bgAccent}`}></div>}
                    </div>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
        {selectedDay && (
          <div className={`${cardClass} p-5 rounded-2xl border shadow-xl animate-in slide-in-from-bottom-4`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-black text-sm uppercase italic tracking-widest flex items-center gap-2">
                <CalendarIcon size={16} className={accentColor} /> Agenda: {selectedDay} de {monthName.split(' ')[0]}
              </h3>
              <button onClick={() => setShowEventForm(true)} className={`p-1.5 rounded-lg ${bgAccent} text-white shadow-lg active:scale-95 transition-transform`}><Plus size={18} /></button>
            </div>
            {showEventForm && (
              <div className="mb-4 p-4 bg-black/40 border border-slate-700 rounded-xl space-y-3 animate-in zoom-in-95">
                <input type="text" placeholder="¿Qué tienes planeado?" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-brand-500 outline-none" />
                <div className="flex gap-2">
                  <input type="time" value={newEventTime} onChange={e => setNewEventTime(e.target.value)} className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-brand-500 outline-none" />
                  <button onClick={handleAddEvent} className={`px-6 rounded-lg ${bgAccent} text-white font-bold text-xs uppercase tracking-widest`}>Guardar</button>
                  <button onClick={() => setShowEventForm(false)} className="p-3 bg-slate-800 text-slate-400 rounded-lg"><X size={18} /></button>
                </div>
              </div>
            )}
            <div className="space-y-2">
              {selectedDayEvents.length > 0 ? selectedDayEvents.map(ev => (
                <div key={ev.id} className="flex items-center gap-4 p-3 bg-black/20 rounded-xl border border-slate-800 group">
                  <div className={`p-2 rounded-lg bg-slate-800 ${accentColor}`}><Clock size={16} /></div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm">{ev.title}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{ev.time}</p>
                  </div>
                  <button onClick={() => handleDeleteEvent(ev.id)} className="opacity-0 group-hover:opacity-100 p-2 text-red-500 transition-opacity"><Trash2 size={16} /></button>
                </div>
              )) : (
                <div className="py-8 text-center border-2 border-dashed border-slate-800 rounded-xl">
                  <Bell size={24} className="mx-auto text-slate-700 mb-2 opacity-30" />
                  <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">No hay nada para este día</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (viewState === 'FORM') {
    return (
      <div className="pb-24 pt-4 animate-fade-in">
        <button onClick={() => setViewState('PROFILE')} className="mb-4 flex items-center gap-2 text-slate-400 font-bold uppercase text-xs"><ChevronLeft size={16} /> Cancelar</button>
        <div className={`${cardClass} p-6 rounded-2xl border shadow-2xl`}>
          <h2 className="text-xl font-black text-white mb-6 uppercase italic tracking-tighter flex items-center gap-2">
            <Activity className={accentColor} /> Registrar Progreso
          </h2>
          <div className="space-y-5">
            <div>
              <label className="text-[10px] text-slate-500 font-black uppercase mb-1 block">Peso Actual (kg)</label>
              <div className="relative">
                <Scale className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="number" value={formWeight} onChange={e => setFormWeight(e.target.value)} className="w-full bg-black border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-500 outline-none" placeholder="75.0" />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-black uppercase mb-1 block">Calorías Consumidas</label>
              <div className="relative">
                <Flame className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="number" value={formCalories} onChange={e => setFormCalories(e.target.value)} className="w-full bg-black border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-500 outline-none" placeholder="2500" />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-black uppercase mb-1 block">Actividad Extra (km)</label>
              <div className="relative">
                <Footprints className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="number" value={formKm} onChange={e => setFormKm(e.target.value)} className="w-full bg-black border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-500 outline-none" placeholder="5.0" />
              </div>
            </div>
            <button onClick={handleSaveProgress} className={`w-full py-4 mt-4 rounded-xl font-black text-white shadow-lg ${bgAccent} uppercase tracking-widest active:scale-95 transition-transform`}>Guardar Registro</button>
          </div>
        </div>
      </div>
    );
  }

  // Profile Dashboard View
  return (
    <div className="space-y-6 pb-24 animate-fade-in pt-4">
      <div className={`${cardClass} p-6 rounded-2xl border shadow-lg relative overflow-hidden`}>
        <div className="flex items-center gap-5 relative z-10">
          <div className="relative group">
            <div className={`w-20 h-20 rounded-2xl ${bgAccent} flex items-center justify-center border-4 border-slate-800 shadow-xl shrink-0 rotate-3 overflow-hidden transition-transform duration-500 group-hover:rotate-0`}>
              {userProfile?.profilePicture ? (
                <img src={userProfile.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="text-white" size={40} />
              )}
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 bg-white text-black p-1.5 rounded-full shadow-lg border border-slate-300 z-20"><Camera size={14} /></button>
            <input type="file" ref={fileInputRef} onChange={handleLogoChange} accept="image/*" className="hidden" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter italic">Atleta <span className={accentColor}>Nivel 1</span></h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-slate-800 text-[9px] font-black text-slate-400 px-2 py-0.5 rounded uppercase tracking-widest">{userProfile?.experience || 'Novato'}</span>
              <span className="bg-slate-800 text-[9px] font-black text-slate-400 px-2 py-0.5 rounded uppercase tracking-widest">{userProfile?.focus || 'Fitness'}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-6 relative z-10">
          <div className="bg-black/40 p-3 rounded-xl border border-slate-800 text-center">
            <p className="text-[9px] text-slate-500 uppercase font-black">Edad</p>
            <p className="text-lg font-black text-white">{userProfile?.age || '--'}</p>
          </div>
          <div className="bg-black/40 p-3 rounded-xl border border-slate-800 text-center">
            <p className="text-[9px] text-slate-500 uppercase font-black">Peso</p>
            <p className="text-lg font-black text-white">{userProfile?.weight || '--'}</p>
          </div>
          <div className="bg-black/40 p-3 rounded-xl border border-slate-800 text-center">
            <p className="text-[9px] text-slate-500 uppercase font-black">Altura</p>
            <p className="text-lg font-black text-white">{userProfile?.height || '--'}</p>
          </div>
        </div>
      </div>

      <div className={`${cardClass} p-5 rounded-2xl border`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-white uppercase text-sm italic tracking-tighter flex items-center gap-2">
            <TrendingUp size={18} className={accentColor} /> Escalada Semanal
          </h3>
          <button onClick={() => setViewState('STATS')} className="text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-800 px-2 py-1 rounded-lg hover:bg-slate-800">Ver Detalles</button>
        </div>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyStats.last7Days} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={hexAccent} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={hexAccent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
              <YAxis hide />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="cals" stroke={hexAccent} strokeWidth={3} fillOpacity={1} fill="url(#colorCals)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setViewState('CALENDAR')} className="bg-zinc-900 h-24 rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg group">
          <CalendarIcon size={24} className="text-slate-500 group-hover:text-brand-500 transition-colors" />
          <span className="text-[10px] font-black uppercase text-slate-500">Mi Agenda</span>
        </button>
        <button onClick={() => setViewState('STATS')} className="bg-zinc-900 h-24 rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg group">
          <TrendingUp size={24} className="text-slate-500 group-hover:text-emerald-500 transition-colors" />
          <span className="text-[10px] font-black uppercase text-slate-500">Estadísticas</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <button onClick={onNavigateToWorkout} className={`w-full py-5 text-white font-black rounded-2xl shadow-xl ${bgAccent} uppercase tracking-widest text-sm italic active:scale-95 transition-transform`}>Entrenar Ahora</button>
        <button onClick={() => setViewState('FORM')} className="w-full py-4 bg-slate-800 text-white font-black rounded-2xl border border-slate-700 uppercase tracking-widest text-xs italic">Registrar Progreso</button>
      </div>
    </div>
  );
};
