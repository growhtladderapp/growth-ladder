
import React, { useState, useMemo, useRef } from 'react';
import { DailyLogEntry, ViewState, WeeklyGoalOption, GoalType, DurationType, UserProfile } from '../types';
import { useToast } from '../components/ToastContext';
import { Utensils } from 'lucide-react';
// ... existing imports ...
import { TrendingUp, Activity, Flame, Edit2, Target, Check, Lock, Watch, Calendar, ChevronRight, CheckCircle2, Trash2, Heart, Smartphone, Bluetooth, Footprints, MapPin, Crown, Sparkles, Archive, Save, LineChart, Briefcase, Loader2, Lightbulb, ChevronDown, Zap, Sun, Map, Flag, CalendarCheck, Route, Bell, X, Menu, Settings, User, LogOut, HelpCircle, Users, Trophy, Palette, MoreHorizontal, Plus } from 'lucide-react';

// ... 


import { Logo } from './Logo';
import { GOAL_OPTIONS } from '../App'; // Import shared constants

interface DashboardProps {
  logs: DailyLogEntry[];
  isPro: boolean;
  togglePro: () => void;
  onDeleteDate: (date: string) => void;
  onChangeThemeColor?: (color: string) => void;
  setView: (view: ViewState) => void;
  uiText: Record<string, string>;
  selectedGoalId: number;
  onSelectGoal: (id: number) => void;
  customTargets: Record<number, number>;
  onUpdateTarget: (id: number, target: number) => void;
  userProfile: UserProfile | null;
}

const PRESET_COLORS = [
  { hex: '#f97316', name: 'Naranja' },
  { hex: '#06b6d4', name: 'Cian' },
  { hex: '#ec4899', name: 'Rosa' },
  { hex: '#8b5cf6', name: 'Violeta' },
  { hex: '#10b981', name: 'Esmeralda' },
  { hex: '#ef4444', name: 'Rojo' },
];

interface SwipeableItemProps {
  dayData: { date: string, km: number, kcal: number, count: number };
  onDelete: () => void;
  onSave: () => void;
  isPro: boolean;
}

const SwipeableLogItem: React.FC<SwipeableItemProps> = ({ dayData, onDelete, onSave, isPro }) => {
  // ... (keep SwipeableLogItem implementation same)
  const [offsetX, setOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);
  const itemRef = useRef<HTMLDivElement>(null);

  const dateObj = new Date(dayData.date);
  const isToday = dateObj.toDateString() === new Date().toDateString();
  const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'short' });
  const dayNum = dateObj.getDate();

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    if (diff > 150) setOffsetX(150);
    else if (diff < -150) setOffsetX(-150);
    else setOffsetX(diff);
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    if (offsetX < -80) onDelete();
    else if (offsetX > 80) onSave();
    setOffsetX(0);
  };

  const cardBg = isPro ? 'bg-zinc-900 border-zinc-800' : 'bg-brand-card border-slate-700';
  const accentColor = isPro ? 'text-emerald-500' : 'text-brand-500';
  const highlightBg = isPro ? 'bg-emerald-900/30 text-emerald-400' : 'bg-brand-500 text-white';

  return (
    <div className="relative rounded-lg overflow-hidden h-20 mb-3 select-none touch-pan-y">
      <div className="absolute inset-0 flex justify-between">
        <div className={`w-1/2 flex items-center justify-start pl-6 text-white font-bold gap-2 ${isPro ? 'bg-emerald-700' : 'bg-emerald-500'}`}>
          <Save size={20} /> Guardar
        </div>
        <div className="bg-red-500 w-1/2 flex items-center justify-end pr-6 text-white font-bold gap-2">
          Eliminar <Trash2 size={20} />
        </div>
      </div>
      <div
        ref={itemRef}
        className={`${cardBg} p-3 rounded-lg border h-full relative z-10 flex items-center justify-between transition-transform duration-200 ease-out shadow-sm`}
        style={{ transform: `translateX(${offsetX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center font-bold text-xs ${isToday
            ? highlightBg
            : isPro ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
            <span className="uppercase text-[8px] opacity-80">{dayName}</span>
            <span className="text-sm">{dayNum}</span>
          </div>
          <div>
            <p className={`font-semibold text-sm ${isToday ? accentColor : 'text-slate-200'}`}>
              {isToday ? 'Hoy' : dateObj.toLocaleDateString('es-ES', { month: 'long', day: 'numeric' })}
            </p>
            <p className="text-[10px] text-slate-500">
              {dayData.count} sesión{dayData.count > 1 ? 'es' : ''} registrada{dayData.count > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-right pointer-events-none">
          <div>
            <div className="text-white font-mono font-bold text-sm">{dayData.km.toFixed(1)} <span className="text-[10px] text-slate-500">km</span></div>
            <div className="text-slate-400 font-mono text-xs">{dayData.kcal} <span className="text-[8px]">kcal</span></div>
          </div>
        </div>
        {offsetX === 0 && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-20 text-slate-500">
            <ChevronRight size={16} />
          </div>
        )}
      </div>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ logs, isPro, togglePro, onDeleteDate, onChangeThemeColor, setView, uiText, selectedGoalId, onSelectGoal, customTargets, onUpdateTarget, userProfile }) => {
  const [goalDuration, setGoalDuration] = useState<DurationType>('WEEK');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Target Editing State
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState<string>("");

  const [isSyncing, setIsSyncing] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const { toast } = useToast();

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const cardClass = isPro ? 'bg-zinc-900 border-zinc-800' : 'bg-brand-card border-slate-700';
  const textAccentClass = isPro ? 'text-emerald-500' : 'text-brand-500';
  const bgAccent = isPro ? 'bg-emerald-600' : 'bg-brand-600';

  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [logs]);

  const { todayKm, todayCalories } = useMemo(() => {
    const todayStr = new Date().toDateString();
    const todaysLogs = logs.filter(log => new Date(log.date).toDateString() === todayStr);
    return {
      todayKm: todaysLogs.reduce((acc, curr) => acc + curr.distanceKm, 0),
      todayCalories: todaysLogs.reduce((acc, curr) => acc + curr.calories, 0)
    };
  }, [logs]);

  const historyData = useMemo(() => {
    const grouped: Record<string, { date: string, km: number, kcal: number, count: number }> = {};
    logs.forEach(log => {
      const dateKey = new Date(log.date).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = { date: log.date, km: 0, kcal: 0, count: 0 };
      }
      grouped[dateKey].km += log.distanceKm;
      grouped[dateKey].kcal += log.calories;
      grouped[dateKey].count += 1;
    });
    return Object.values(grouped).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [logs]);

  const currentGoal = GOAL_OPTIONS.find(g => g.id === selectedGoalId) || GOAL_OPTIONS[0];

  // Calculate Target based on duration and custom value
  const baseTarget = customTargets[currentGoal.id] || currentGoal.target;

  const currentTargetValue = useMemo(() => {
    let multiplier = 1;
    if (goalDuration === 'MONTH') multiplier = 4;
    if (goalDuration === 'YEAR') multiplier = 52;
    return Math.round(baseTarget * multiplier);
  }, [baseTarget, goalDuration]);

  const progress = useMemo(() => {
    let currentVal = 0;
    const now = new Date();
    const pastDate = new Date();
    // ... (logic for date range same as before)
    if (goalDuration === 'WEEK') pastDate.setDate(now.getDate() - 7);
    else if (goalDuration === 'MONTH') pastDate.setDate(now.getDate() - 30);
    else if (goalDuration === 'YEAR') pastDate.setFullYear(now.getFullYear() - 1);

    const relevantLogs = sortedLogs.filter(log => new Date(log.date) >= pastDate);

    switch (currentGoal.type) {
      case 'COUNT':
        const uniqueDays = new Set(relevantLogs.map(l => new Date(l.date).toDateString()));
        currentVal = uniqueDays.size;
        break;
      case 'CALORIES':
        currentVal = relevantLogs.reduce((acc, curr) => acc + curr.calories, 0);
        break;
      case 'DISTANCE':
        currentVal = relevantLogs.reduce((acc, curr) => acc + curr.distanceKm, 0);
        break;
    }

    return {
      current: Number(currentVal.toFixed(1)),
      target: currentTargetValue,
      percentage: Math.min(100, Math.round((currentVal / currentTargetValue) * 100))
    };
  }, [sortedLogs, currentGoal, goalDuration, currentTargetValue]);

  const handleEditTargetClick = () => {
    setTempTarget(currentTargetValue.toString());
    setIsEditingTarget(true);
  };

  const handleSaveTarget = () => {
    const val = parseInt(tempTarget);
    if (!isNaN(val) && val > 0) {
      // Convert back to weekly base
      let multiplier = 1;
      if (goalDuration === 'MONTH') multiplier = 4;
      if (goalDuration === 'YEAR') multiplier = 52;

      const newBase = Math.round(val / multiplier);
      onUpdateTarget(currentGoal.id, newBase);
    }
    setIsEditingTarget(false);
  };

  const runBluetoothSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setIsSynced(true);
      toast("Dispositivo Sincronizado");
    }, 2500);
  };

  const handleSyncClick = () => {
    if (isSyncing || isSynced) return;
    if (!hasPermission) setShowPermissionModal(true);
    else runBluetoothSync();
  };

  const handleGrantPermission = () => {
    setShowPermissionModal(false);
    setHasPermission(true);
    setTimeout(() => runBluetoothSync(), 500);
  };

  const handleDeleteAction = (date: string) => {
    onDeleteDate(date);
    toast("Registro Eliminado", 'info');
  };

  const sidebarLinks = [
    { icon: Utensils, label: "Chef IA", view: ViewState.RECIPES },
    { icon: User, label: uiText.perfil, view: ViewState.LOG },
    { icon: Trophy, label: uiText.logros, view: ViewState.ACHIEVEMENTS },
    { icon: Users, label: uiText.comunidad, view: ViewState.COMMUNITY },
    { icon: Settings, label: uiText.ajustes, view: ViewState.SETTINGS },
    { icon: HelpCircle, label: uiText.ayuda, view: ViewState.SUPPORT },
  ];

  const handleSidebarClick = (view: ViewState | null) => {
    if (view) {
      setView(view);
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative">

      {isSidebarOpen && (
        <div className="fixed inset-0 z-[120] animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsSidebarOpen(false)}></div>
          <div className={`absolute top-0 left-0 h-full w-[280px] bg-[#0a0a0a] shadow-2xl border-r border-white/5 p-6 animate-in slide-in-from-left duration-300 flex flex-col`}>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <Logo className="w-8 h-8" />
                <span className="text-white font-black italic tracking-tighter text-lg uppercase">Growth Ladder</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="text-slate-500 p-2"><X size={24} /></button>
            </div>

            <div className="mb-8 p-4 bg-zinc-900 rounded-2xl border border-white/5 flex items-center gap-4 cursor-pointer active:scale-95 transition-transform" onClick={() => handleSidebarClick(ViewState.LOG)}>
              <div className={`w-12 h-12 rounded-xl overflow-hidden ${bgAccent} flex items-center justify-center text-white shadow-lg shrink-0`}>
                {userProfile?.profilePicture ? (
                  <img src={userProfile.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={24} />
                )}
              </div>
              <div>
                <p className="text-white font-bold text-sm truncate max-w-[150px]">{userProfile?.name || 'Atleta'}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Crown size={10} className="text-brand-500" /> Nivel {userProfile?.level || 1}
                </p>
              </div>
            </div>

            <nav className="flex-1 space-y-2">
              {sidebarLinks.map((link, idx) => (
                <React.Fragment key={idx}>
                  <button
                    onClick={() => handleSidebarClick(link.view as ViewState)}
                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all group"
                  >
                    <link.icon size={20} className="text-slate-500 group-hover:text-brand-500 transition-colors" />
                    <span className="text-sm font-bold uppercase tracking-widest text-[11px]">{link.label}</span>
                  </button>
                  {link.label === uiText.comunidad && (
                    <div className="px-3 pt-1 pb-4 flex flex-col items-start gap-4">
                      {/* Botón circular pequeño debajo de comunidad con icono de paleta */}
                      <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all active:scale-90 shadow-lg ${showColorPicker
                          ? 'bg-brand-500 text-white border-transparent'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                      >
                        <Palette size={14} />
                      </button>
                      {showColorPicker && (
                        <div className="bg-zinc-900/50 p-3 rounded-2xl border border-white/5 animate-in slide-in-from-top-2 w-full">
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Palette size={10} className="text-brand-500" /> Temas
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {PRESET_COLORS.map(color => (
                              <button
                                key={color.hex}
                                onClick={() => onChangeThemeColor?.(color.hex)}
                                className="w-7 h-7 rounded-full border-2 border-slate-800 shadow-md active:scale-90 transition-transform relative group"
                                style={{ backgroundColor: color.hex }}
                              >
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/90 text-[7px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 uppercase font-bold">
                                  {color.name}
                                </div>
                              </button>
                            ))}
                            {/* Plus button for custom color */}
                            <button
                              onClick={() => colorInputRef.current?.click()}
                              className="w-7 h-7 rounded-full border-2 border-dashed border-slate-700 bg-slate-800/50 flex items-center justify-center active:scale-90 transition-transform group/custom"
                            >
                              <Plus size={12} className="text-slate-500 group-hover/custom:text-white" />
                            </button>
                            <input
                              type="color"
                              ref={colorInputRef}
                              onChange={(e) => onChangeThemeColor?.(e.target.value)}
                              className="hidden"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </nav>
            <button onClick={() => { setIsSidebarOpen(false); toast('Cerrando Sesión...', 'info'); }} className="flex items-center gap-4 p-4 mt-auto border-t border-white/5 text-red-500 font-bold uppercase text-[11px] tracking-widest w-full">
              <LogOut size={20} /> {uiText.cerrar_sesion}
            </button>
          </div>
        </div>
      )}

      {showPermissionModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-800/90 backdrop-blur-xl w-full max-w-[280px] rounded-[14px] overflow-hidden shadow-2xl text-center animate-in zoom-in-95 duration-200 border border-white/10">
            <div className="p-6 pb-5">
              <div className="flex justify-center mb-3 relative">
                <div className="bg-red-500 rounded-lg p-1.5 shadow-lg relative z-10">
                  <Heart fill="white" className="text-white w-8 h-8" />
                </div>
                <div className="bg-blue-500 rounded-lg p-1.5 shadow-lg absolute left-1/2 ml-1 top-2 z-0">
                  <Bluetooth className="text-white w-8 h-8" />
                </div>
              </div>
              <h3 className="text-white font-semibold text-[17px] leading-tight mb-2">
                "Growth Ladder" desea acceder a Apple Health
              </h3>
              <p className="text-zinc-300 text-[13px] leading-snug">
                Permite el acceso para sincronizar tus datos de frecuencia cardíaca, calorías y distancia vía Bluetooth.
              </p>
            </div>
            <div className="grid grid-cols-2 border-t border-zinc-600/50 divide-x divide-zinc-600/50">
              <button onClick={() => setShowPermissionModal(false)} className="py-3 text-[17px] text-blue-400">No permitir</button>
              <button onClick={handleGrantPermission} className="py-3 text-[17px] font-semibold text-blue-400">Permitir</button>
            </div>
          </div>
        </div>
      )}

      {showNotifications && (
        <div className="fixed inset-0 z-[110] animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowNotifications(false)}></div>
          <div className="absolute top-4 right-4 w-[280px] bg-zinc-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-white font-bold text-sm uppercase tracking-widest">{uiText.notificaciones}</h3>
              <button onClick={() => setShowNotifications(false)} className="text-slate-500"><X size={18} /></button>
            </div>
            <div className="max-h-[350px] overflow-y-auto">
              {[
                { id: 1, title: "Nuevo Récord", desc: "Superaste tu meta de calorías ayer.", time: "hace 2h", type: "success" },
                { id: 2, title: "Coach AI", desc: "Recuerda hidratarte después del entreno.", time: "hace 4h", type: "info" },
                { id: 3, title: "Recordatorio", desc: "No has registrado peso hoy.", time: "hace 6h", type: "alert" }
              ].map(n => (
                <div key={n.id} className="p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] font-bold uppercase ${n.type === 'success' ? 'text-emerald-500' : n.type === 'alert' ? 'text-orange-500' : 'text-blue-500'}`}>{n.title}</span>
                    <span className="text-[9px] text-slate-500">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-300">{n.desc}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowNotifications(true)} className="w-full py-3 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest border-t border-slate-800 bg-black/20">Cerrar</button>
          </div>
        </div>
      )}



      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 -ml-2 rounded-full text-slate-300 hover:text-white active:scale-95 transition-all relative"
          >
            {userProfile?.profilePicture ? (
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-500 shadow-md">
                <img src={userProfile.profilePicture} alt="Menu" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="p-2 hover:bg-white/5 rounded-xl">
                <Menu size={28} strokeWidth={2.5} />
              </div>
            )}
          </button>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight uppercase italic leading-none">Growth Ladder</h1>
            <p className="text-slate-400 text-[10px] flex items-center gap-1 mt-1 transition-all uppercase tracking-widest font-black">
              <span className={`w-1.5 h-1.5 rounded-full ${isSyncing
                ? 'bg-yellow-500 animate-ping'
                : isSynced
                  ? (isPro ? 'bg-emerald-500 animate-pulse' : 'bg-green-500 animate-pulse')
                  : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                }`}></span>
              {isSyncing ? 'Sincronizando...' : isSynced ? uiText.status_online : uiText.status_offline}
            </p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={togglePro}
            className={`px-2.5 py-1.5 rounded-lg font-black italic tracking-tighter text-[10px] transition-all border ${isPro
              ? 'bg-emerald-500 text-white border-transparent shadow-[0_0_10px_rgba(16,185,129,0.5)]'
              : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-white'
              }`}
          >
            PRO
          </button>
          <button onClick={() => setShowNotifications(true)} className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 relative hover:text-white">
            <Bell size={18} />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-800 animate-pulse"></div>
          </button>
          <button
            onClick={handleSyncClick}
            disabled={isSyncing}
            className={`p-2 rounded-lg border transition-all duration-300 relative group overflow-hidden flex items-center justify-center w-9 h-9 ${isSyncing
              ? 'bg-green-500/20 border-green-500 text-green-500 shadow-[0_0_15px_rgba(74,222,128,0.5)]'
              : isSynced
                ? (isPro ? 'bg-zinc-800 border-zinc-700 text-emerald-500 shadow-emerald-500/20 shadow-lg' : 'bg-slate-800 border-slate-700 text-green-500')
                : 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500/20'
              }`}
          >
            {isSyncing ? <Loader2 className="animate-spin" size={16} /> : <Watch size={18} />}
          </button>
        </div>
      </header>

      {/* AI Insight */}
      {isPro && (
        <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl mb-6 relative overflow-hidden animate-fade-in shadow-xl">
          <div className="absolute top-0 right-0 p-3 opacity-20">
            <Zap size={60} className="text-emerald-500" />
          </div>
          <div className="flex items-start gap-3 relative z-10">
            <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
              <Briefcase size={20} />
            </div>
            <div>
              <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wide mb-1">{uiText.coach_ia}</h3>
              <p className="text-zinc-300 text-xs leading-relaxed">
                Tu recuperación ha mejorado un 15% esta semana. Recomendación: Aumenta la intensidad en el entrenamiento de piernas mañana.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-2">
        <div className={`relative overflow-hidden rounded-2xl p-4 border ${isPro ? 'bg-zinc-900 border-zinc-800' : 'bg-brand-card border-slate-800'} shadow-lg group`}>
          <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${isPro ? 'from-emerald-500/20' : 'from-blue-500/20'} to-transparent blur-2xl rounded-full -mr-10 -mt-10 transition-all group-hover:scale-150`}></div>
          <div className="relative z-10 flex flex-col justify-between h-full min-h-[100px]">
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-xl ${isPro ? 'bg-emerald-900/20 text-emerald-400' : 'bg-blue-500/10 text-blue-500'} shadow-inner border border-white/5`}>
                <Footprints size={20} fill="currentColor" />
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">{uiText.distancia}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white tracking-tight">{todayKm.toFixed(1)}</span>
                <span className="text-xs text-slate-400 font-bold">km</span>
              </div>
            </div>
          </div>
        </div>
        <div className={`relative overflow-hidden rounded-2xl p-4 border ${isPro ? 'bg-zinc-900 border-zinc-800' : 'bg-brand-card border-slate-800'} shadow-lg group`}>
          <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-transparent blur-2xl rounded-full -mr-10 -mt-10 transition-all group-hover:scale-150`}></div>
          <div className="relative z-10 flex flex-col justify-between h-full min-h-[100px]">
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-xl ${isPro ? 'bg-orange-900/20 text-orange-400' : 'bg-orange-500/10 text-orange-500'} shadow-inner border border-white/5`}>
                <Flame size={20} fill="currentColor" className={isPro ? "" : "animate-pulse"} />
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">{uiText.calorias}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white tracking-tight">{todayCalories}</span>
                <span className="text-xs text-slate-400 font-bold">kcal</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* MACRO NUTRIENTS BAR */}
      <div className={`rounded-2xl p-5 border mb-6 ${isPro ? 'bg-zinc-900 border-zinc-800' : 'bg-brand-card border-slate-800'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <span className="w-1.5 h-4 bg-brand-500 rounded-full"></span>
            Macronutrientes
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">HOY</span>
        </div>

        {(() => {
          // Calculate macros from today's logs
          const todayStr = new Date().toDateString();
          const todaysLogs = logs.filter(log => new Date(log.date).toDateString() === todayStr);

          const protein = todaysLogs.reduce((acc, curr) => acc + (curr.protein || 0), 0);
          const carbs = todaysLogs.reduce((acc, curr) => acc + (curr.carbs || 0), 0);
          const fat = todaysLogs.reduce((acc, curr) => acc + (curr.fat || 0), 0);

          const totalMacros = protein + carbs + fat;
          const pP = totalMacros > 0 ? (protein / totalMacros) * 100 : 0;
          const pC = totalMacros > 0 ? (carbs / totalMacros) * 100 : 0;
          const pF = totalMacros > 0 ? (fat / totalMacros) * 100 : 0;

          return (
            <>
              {/* Stacked Bar */}
              <div className="h-4 bg-slate-800 rounded-full flex overflow-hidden mb-3 border border-slate-700/50">
                {totalMacros > 0 ? (
                  <>
                    <div style={{ width: `${pP}%` }} className="bg-emerald-500 h-full transition-all duration-1000 relative group/bar">
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                    </div>
                    <div style={{ width: `${pC}%` }} className="bg-orange-500 h-full transition-all duration-1000 relative group/bar">
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                    </div>
                    <div style={{ width: `${pF}%` }} className="bg-yellow-500 h-full transition-all duration-1000 relative group/bar">
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-slate-800/50 flex items-center justify-center text-[9px] text-slate-600 font-medium uppercase tracking-wider">
                    Sin registros hoy
                  </div>
                )}
              </div>

              {/* Legend / Values */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-emerald-500/10 rounded-lg p-2 border border-emerald-500/20">
                  <p className="text-[9px] text-emerald-400 font-bold uppercase mb-0.5">Proteínas</p>
                  <p className="text-lg font-black text-white leading-none">{protein.toFixed(0)}<span className="text-[10px] text-slate-500 ml-0.5">g</span></p>
                </div>
                <div className="bg-orange-500/10 rounded-lg p-2 border border-orange-500/20">
                  <p className="text-[9px] text-orange-400 font-bold uppercase mb-0.5">Carbs</p>
                  <p className="text-lg font-black text-white leading-none">{carbs.toFixed(0)}<span className="text-[10px] text-slate-500 ml-0.5">g</span></p>
                </div>
                <div className="bg-yellow-500/10 rounded-lg p-2 border border-yellow-500/20">
                  <p className="text-[9px] text-yellow-400 font-bold uppercase mb-0.5">Grasas</p>
                  <p className="text-lg font-black text-white leading-none">{fat.toFixed(0)}<span className="text-[10px] text-slate-500 ml-0.5">g</span></p>
                </div>
              </div>

              {/* Chef IA Promo Button */}
              <button
                onClick={() => setView(ViewState.RECIPES)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform mt-3"
              >
                <Utensils size={18} /> ¿Qué comemos hoy, Chef?
              </button>
            </>
          );
        })()}
      </div>

      <div className="space-y-3 pt-2">
        {goalDuration === 'WEEK' && !isPro && (
          <div className="bg-brand-500/10 border border-brand-500/20 p-3 rounded-lg flex gap-3 items-start animate-fade-in">
            <Lightbulb size={16} className="text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-xs text-brand-100">
              <span className="font-bold text-white">Sugerencia:</span> Empieza probándolo por una semana para crear el hábito sin presión.
            </p>
          </div>
        )}
        <div className="flex justify-between items-end px-1">
          <h3 className="text-white font-bold text-lg flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">{uiText.meta_semanal}</span>
            {goalDuration === 'WEEK' ? 'Semanal' : goalDuration === 'MONTH' ? 'Mensual' : 'Anual'}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
              {(['WEEK', 'MONTH', 'YEAR'] as DurationType[]).map((d) => (
                <button key={d} onClick={() => setGoalDuration(d)} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${goalDuration === d ? (isPro ? 'bg-emerald-600 text-white shadow' : 'bg-brand-600 text-white shadow') : 'text-slate-400 hover:text-white'}`}>
                  {d === 'WEEK' ? '7D' : d === 'MONTH' ? '30D' : '365D'}
                </button>
              ))}
            </div>
            {isEditingGoal ? (
              <button onClick={() => setIsEditingGoal(false)} className="text-xs text-slate-400 hover:text-white px-2">Hecho</button>
            ) : (
              <button onClick={() => setIsEditingGoal(true)} className="bg-slate-800 p-1.5 rounded-lg border border-slate-700 text-brand-500">
                <Edit2 size={14} />
              </button>
            )}
          </div>
        </div>
        {isEditingGoal ? (
          <div className="grid grid-cols-1 gap-2 animate-fade-in">
            {GOAL_OPTIONS.map((goal) => (
              <button key={goal.id} disabled={goal.isPro && !isPro} onClick={() => { onSelectGoal(goal.id); setIsEditingGoal(false); }} className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${selectedGoalId === goal.id ? (isPro ? 'bg-emerald-900/20 border-emerald-500' : 'bg-brand-900/20 border-brand-500') : 'bg-slate-800 border-slate-700'} ${goal.isPro && !isPro ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${goal.gradient} flex items-center justify-center text-white shadow-lg ${goal.shadow}`}>
                    <goal.icon size={20} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${selectedGoalId === goal.id ? 'text-white' : 'text-slate-300'}`}>{goal.title}</p>
                    <p className="text-[10px] text-slate-500">{goal.description}</p>
                  </div>
                </div>
                {goal.isPro && !isPro && <Lock size={14} className="text-slate-600" />}
                {selectedGoalId === goal.id && <Check size={16} className={textAccentClass} />}
              </button>
            ))}
          </div>
        ) : (
          <div className={`${cardClass} p-5 rounded-xl border`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentGoal.gradient} flex items-center justify-center text-white shadow-xl ${currentGoal.shadow} transform rotate-3`}>
                  <currentGoal.icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{currentGoal.title}</p>
                  <div className="flex items-center gap-2">
                    {isEditingTarget ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={tempTarget}
                          onChange={(e) => setTempTarget(e.target.value)}
                          className="w-20 bg-black/40 border border-slate-600 rounded px-2 py-0.5 text-base text-white focus:outline-none focus:border-brand-500 text-center"
                          autoFocus
                        />
                        <button onClick={handleSaveTarget} className="text-emerald-500"><Check size={14} /></button>
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        Meta: {progress.target} {currentGoal.unit}
                        <button onClick={handleEditTargetClick} className="opacity-50 hover:opacity-100"><Edit2 size={10} /></button>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${textAccentClass}`}>{progress.percentage}%</p>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${isPro ? 'bg-emerald-500' : 'bg-brand-500'}`} style={{ width: `${progress.percentage}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-right">{progress.current} / {progress.target} {currentGoal.unit} acumulados</p>
          </div>
        )}
      </div>
      <div className="space-y-3">
        <h3 className="text-white font-bold text-lg px-1">{uiText.historial}</h3>
        <div className="space-y-2">
          {historyData.map((day, idx) => (
            <SwipeableLogItem key={day.date + idx} dayData={day} isPro={isPro} onDelete={() => handleDeleteAction(day.date)} onSave={() => toast("Registro Guardado")} />
          ))}
        </div>
      </div>
    </div >
  );
};
