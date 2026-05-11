import React, { useState, useMemo } from 'react';
import { Menu, Plus, Check, CloudMoon, ListTodo, X, Dumbbell, ScanLine, Brain, MessageSquare, ChefHat, Users } from 'lucide-react';
import { ViewState, Habit, HabitLog } from '../types';

interface Props {
  setView: (view: ViewState) => void;
  uiText: Record<string, string>;
  habits: Habit[];
  habitLogs: HabitLog[];
  onToggleHabit: (habitId: string, date: string) => void;
  onAddHabit: (habit: Habit) => void;
  onToolClick: (view: ViewState) => void;
}

export const DashHabitsView: React.FC<Props> = ({ setView, uiText, habits, habitLogs, onToggleHabit, onAddHabit, onToolClick }) => {
  const [showBottomAction, setShowBottomAction] = useState(true);
  const [showNewHabitModal, setShowNewHabitModal] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  
  // Date logic
  const todayDateObj = new Date();
  const [selectedDateObj, setSelectedDateObj] = useState(todayDateObj);

  const selectedDateStr = selectedDateObj.toISOString().split('T')[0];
  const todayStr = todayDateObj.toISOString().split('T')[0];

  // Generate 7 days (3 days before, today, 3 days after)
  const days = useMemo(() => {
    const list = [];
    for (let i = -3; i <= 3; i++) {
        const d = new Date(selectedDateObj);
        d.setDate(d.getDate() + i);
        list.push({
            date: d.toISOString().split('T')[0],
            dayName: d.toLocaleDateString('es-ES', { weekday: 'short' }),
            dayNumber: d.getDate(),
            isToday: d.toISOString().split('T')[0] === todayStr,
            fullDate: d
        });
    }
    return list;
  }, [selectedDateObj, todayStr]);

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    
    onAddHabit({
      id: Date.now().toString(),
      title: newHabitTitle.trim(),
      frequency: 'daily',
      color: '#10b981', // brand green
      icon: '🔥',
      createdAt: new Date().toISOString()
    });
    setNewHabitTitle('');
    setShowNewHabitModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-black text-white relative font-sans">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 pt-10">
        <button onClick={() => setView(ViewState.SETTINGS)} className="w-10 h-10 bg-[#1c1c1e] rounded-full flex items-center justify-center hover:bg-[#2c2c2e] transition-colors active:scale-95">
          <Menu size={20} className="text-white" />
        </button>
        <h1 className="text-xl font-bold">{selectedDateStr === todayStr ? 'Hoy' : selectedDateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short'})}</h1>
        <button onClick={() => setShowNewHabitModal(true)} className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors active:scale-95 shadow-lg shadow-brand-500/20">
          <Plus size={24} className="text-white" />
        </button>
      </div>

      {/* Horizontal Calendar */}
      <div className="flex justify-between items-center px-4 mt-2 mb-6">
        {days.map((d, i) => {
          const isActive = d.date === selectedDateStr;
          return (
            <button 
              key={i} 
              onClick={() => setSelectedDateObj(d.fullDate)}
              className="flex flex-col items-center group transition-transform active:scale-90"
            >
              <span className={`text-xs mb-2 capitalize transition-colors ${isActive ? 'text-white font-semibold' : 'text-zinc-500 group-hover:text-zinc-300'}`}>{d.dayName}</span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${isActive ? 'bg-brand-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-[#121212] border border-[#1c1c1e] text-zinc-400 group-hover:bg-[#1c1c1e] group-hover:text-white'}`}>
                {d.dayNumber}
              </div>
            </button>
          )
        })}
      </div>

      {/* Habit Cards */}
      <div className="px-5 flex-1 overflow-y-auto pb-72">
        {habits.length === 0 ? (
          <div className="text-center mt-10 p-6 bg-[#1c1c1e] rounded-3xl border border-dashed border-zinc-700">
            <p className="text-zinc-400 mb-4">No tienes ningún hábito todavía.</p>
            <button onClick={() => setShowNewHabitModal(true)} className="text-brand-500 font-bold border border-brand-500/30 px-6 py-2 rounded-full hover:bg-brand-500/10">
              Crear mi primer hábito
            </button>
          </div>
        ) : (
          habits.map(habit => {
            const isCompleted = habitLogs.some(log => log.habitId === habit.id && log.date === selectedDateStr);
            return (
              <button 
                key={habit.id}
                onClick={() => onToggleHabit(habit.id, selectedDateStr)}
                className={`w-full text-left border rounded-3xl p-4 flex items-center justify-between mb-4 transition-all duration-300 active:scale-95 ${isCompleted ? 'bg-[#1c1c1e] border-brand-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-[#1c1c1e] border-[#2c2c2e] opacity-80'}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{habit.icon}</span>
                  <div>
                    <h3 className={`font-semibold transition-colors ${isCompleted ? 'text-brand-400' : 'text-white'}`}>{habit.title}</h3>
                    <p className="text-xs text-zinc-400">Cada día</p>
                  </div>
                </div>
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isCompleted ? 'bg-brand-500 text-black' : 'bg-[#121212] border border-[#2c2c2e]'}`}>
                    {isCompleted ? <Check size={20} className="stroke-[3]" /> : <Plus size={20} className="text-brand-500/50" />}
                  </div>
                </div>
              </button>
            )
          })
        )}

        <div className="text-center mt-6">
          <p className="text-xs text-zinc-600">Sincronizado con base local</p>
        </div>

        {/* Hub de Herramientas */}
        <div className="mt-8 mb-6 px-1">
          <h2 className="text-lg font-bold text-white mb-4">Herramientas PRO</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => onToolClick(ViewState.GUIDE)} className="bg-[#1c1c1e] p-3 rounded-2xl border border-[#2c2c2e] flex flex-row items-center gap-3 hover:bg-[#2c2c2e] transition-colors active:scale-95 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-2 -top-2 w-12 h-12 bg-white/5 rounded-full blur-xl group-hover:bg-brand-500/10 transition-colors"></div>
              <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center shrink-0">
                <Dumbbell size={16} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-xs leading-none">Musculación</h3>
              </div>
            </button>
            
            <button onClick={() => onToolClick(ViewState.SCANNER)} className="bg-[#1c1c1e] p-3 rounded-2xl border border-[#2c2c2e] flex flex-row items-center gap-3 hover:bg-[#2c2c2e] transition-colors active:scale-95 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-2 -top-2 w-12 h-12 bg-white/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors"></div>
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                <ScanLine size={16} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-xs leading-none">Escáner IA</h3>
              </div>
            </button>

            <button onClick={() => onToolClick(ViewState.WORKOUT)} className="bg-[#1c1c1e] p-3 rounded-2xl border border-[#2c2c2e] flex flex-row items-center gap-3 hover:bg-[#2c2c2e] transition-colors active:scale-95 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-2 -top-2 w-12 h-12 bg-white/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-colors"></div>
              <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center shrink-0">
                <Brain size={16} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-xs leading-none">Rutinas IA</h3>
              </div>
            </button>

            <button onClick={() => onToolClick(ViewState.CHAT)} className="bg-[#1c1c1e] p-3 rounded-2xl border border-[#2c2c2e] flex flex-row items-center gap-3 hover:bg-[#2c2c2e] transition-colors active:scale-95 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-2 -top-2 w-12 h-12 bg-white/5 rounded-full blur-xl group-hover:bg-orange-500/10 transition-colors"></div>
              <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">
                <MessageSquare size={16} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-xs leading-none">Coach AI</h3>
              </div>
            </button>

            <button onClick={() => onToolClick(ViewState.RECIPES)} className="bg-[#1c1c1e] p-3 rounded-2xl border border-[#2c2c2e] flex flex-row items-center gap-3 hover:bg-[#2c2c2e] transition-colors active:scale-95 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-2 -top-2 w-12 h-12 bg-white/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors"></div>
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                <ChefHat size={16} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-xs leading-none">Chef AI</h3>
              </div>
            </button>

            <button onClick={() => onToolClick(ViewState.COMMUNITY)} className="bg-[#1c1c1e] p-3 rounded-2xl border border-[#2c2c2e] flex flex-row items-center gap-3 hover:bg-[#2c2c2e] transition-colors active:scale-95 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-2 -top-2 w-12 h-12 bg-white/5 rounded-full blur-xl group-hover:bg-pink-500/10 transition-colors"></div>
              <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center shrink-0">
                <Users size={16} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-xs leading-none">Trainers</h3>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* New Habit Flow */}
      {showNewHabitModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-5 animate-in fade-in duration-200">
           <form onSubmit={handleCreateHabit} className="w-full bg-[#1c1c1e] p-6 rounded-3xl border border-zinc-700 shadow-2xl">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-white text-lg">Nuevo Hábito</h3>
               <button type="button" onClick={() => setShowNewHabitModal(false)} className="text-zinc-400 hover:text-white p-2 bg-black/20 rounded-full">
                 <X size={16} />
               </button>
             </div>
             <input 
                type="text"
                autoFocus
                placeholder="Ej. Leer 10 páginas..."
                value={newHabitTitle}
                onChange={e => setNewHabitTitle(e.target.value)}
                className="w-full bg-black border border-[#2c2c2e] text-white p-4 rounded-2xl mb-6 focus:outline-none focus:border-brand-500 transition-colors"
                maxLength={40}
             />
             <button type="submit" disabled={!newHabitTitle.trim()} className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-black font-bold py-4 rounded-xl transition-all">
               Crear hábito
             </button>
           </form>
        </div>
      )}

      {/* Bottom Sheet Action */}
      {showBottomAction && (
        <div className="absolute bottom-28 left-4 right-4 bg-brand-500 rounded-3xl overflow-hidden shadow-2xl z-40 animate-in slide-in-from-bottom-10">
          <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setShowBottomAction(false)}>
            <div>
              <h3 className="font-bold text-black text-lg flex items-center gap-2">Prepárate para TWH 🔥</h3>
              <p className="text-sm text-black/70">Asistente</p>
            </div>
            <button className="w-8 h-8 flex items-center justify-center bg-black/20 rounded-full text-black hover:bg-black/30 transition-colors">
              <X size={16} />
            </button>
          </div>
          <div className="bg-[#121214] p-4 rounded-b-3xl">
            <p className="text-sm font-semibold mb-4 text-white">Configúrate en minutos y sé constante</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => { setShowNewHabitModal(true); setShowBottomAction(false); }} 
                className="w-full flex items-center gap-4 text-left group transition-all active:scale-95 bg-[#1c1c1e] p-3 rounded-2xl hover:bg-[#2c2c2e] border border-[#2c2c2e]"
              >
                <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors border border-brand-500/20 shadow-lg shadow-brand-500/10">
                  <Check size={20} className="text-brand-500 stroke-[3]" />
                </div>
                <div>
                  <p className="font-semibold text-white group-hover:text-brand-500 transition-colors">Agrega un hábito positivo</p>
                  <p className="text-xs text-zinc-500 mt-1">Construye constancia diaria</p>
                </div>
              </button>
              
              <button 
                onClick={() => { setNewHabitTitle('Dejar de '); setShowNewHabitModal(true); setShowBottomAction(false); }} 
                className="w-full flex items-center gap-4 text-left group transition-all active:scale-95 bg-[#1c1c1e] p-3 rounded-2xl hover:bg-[#2c2c2e] border border-[#2c2c2e]"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center border border-zinc-700 bg-black shadow-lg">
                  <CloudMoon size={20} className="text-brand-500" />
                </div>
                <div>
                  <p className="font-semibold text-white">Agrega un mal hábito</p>
                  <p className="text-xs text-zinc-500 mt-1">Rompe un hábito no deseado</p>
                </div>
              </button>
              
              <button 
                onClick={() => { setNewHabitTitle('Tarea: '); setShowNewHabitModal(true); setShowBottomAction(false); }} 
                className="w-full flex items-center gap-4 text-left group transition-all active:scale-95 bg-[#1c1c1e] p-3 rounded-2xl hover:bg-[#2c2c2e] border border-[#2c2c2e]"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center border border-zinc-700 bg-black shadow-lg">
                  <ListTodo size={20} className="text-brand-500" />
                </div>
                <div>
                  <p className="font-semibold text-white">Agregar un hábito de tarea</p>
                  <p className="text-xs text-zinc-500 mt-1">Rastrea una tarea única</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
