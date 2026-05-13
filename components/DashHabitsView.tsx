import React, { useState, useMemo } from 'react';
import { Menu, Plus, Check, CloudMoon, ListTodo, X, Dumbbell, ScanLine, Brain, MessageSquare, ChefHat, Users, Lock, ListFilter, ArrowDownWideNarrow, EyeOff, XCircle, CornerUpRight } from 'lucide-react';
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
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [menuTab, setMenuTab] = useState<'sort' | 'groups'>('sort');
  const [filters, setFilters] = useState({
    hideCompleted: false,
    hideFailed: false,
    hideSkipped: false,
    sortBy: 'custom' as 'custom' | 'name'
  });
  const [showNewHabitModal, setShowNewHabitModal] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [modalCategory, setModalCategory] = useState<'buenos' | 'salud' | 'malos' | 'tareas'>('buenos');

  const popularHabits = {
    buenos: [
      { title: 'Leer', icon: '📚' },
      { title: 'Meditar', icon: '🧘' },
      { title: 'Estirar', icon: '🤸' },
      { title: 'Agradecer', icon: '🙏' }
    ],
    salud: [
      { title: 'Beber agua', icon: '💧' },
      { title: 'Dormir 8h', icon: '😴' },
      { title: 'Comer fruta', icon: '🍎' },
      { title: 'Caminar', icon: '🚶' }
    ],
    malos: [
      { title: 'No fumar', icon: '🚭' },
      { title: 'No azúcar', icon: '🚫' },
      { title: 'No alcohol', icon: '🍺' },
      { title: 'Sin redes', icon: '📵' }
    ],
    tareas: [
      { title: 'Hacer la cama', icon: '🛏️' },
      { title: 'Limpiar', icon: '🧹' },
      { title: 'Estudiar', icon: '📖' },
      { title: 'Planear día', icon: '📝' }
    ]
  };

  const getEmojiForTitle = (title: string): string => {
    const map: Record<string, string> = {
      'leer': '📚', 'libro': '📖', 'meditar': '🧘', 'paz': '☮️', 'estirar': '🤸',
      'agua': '💧', 'dormir': '😴', 'sueño': '🌙', 'fruta': '🍎', 'comer': '🥗',
      'caminar': '🚶', 'pasos': '👣', 'fumar': '🚭', 'tabaco': '🚬', 'azucar': '🚫',
      'dulce': '🍩', 'alcohol': '🍺', 'beber': '🍸', 'redes': '📵', 'movil': '📱',
      'cama': '🛏️', 'limpiar': '🧹', 'casa': '🏠', 'estudiar': '📖', 'examen': '📝',
      'entrenar': '🏋️', 'gym': '💪', 'correr': '🏃', 'bici': '🚲', 'nadar': '🏊'
    };
    const words = title.toLowerCase().split(' ');
    for (const word of words) {
      if (map[word]) return map[word];
    }
    return '🔥';
  };

  const handleQuickAdd = (h: { title: string, icon: string }) => {
    onAddHabit({
      id: Date.now().toString(),
      title: h.title,
      frequency: 'daily',
      color: '#10b981',
      icon: h.icon,
      createdAt: new Date().toISOString()
    });
    setShowNewHabitModal(false);
  };
  
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
      icon: getEmojiForTitle(newHabitTitle.trim()),
      createdAt: new Date().toISOString()
    });
    setNewHabitTitle('');
    setShowNewHabitModal(false);
  };

  // Filtered and Sorted Habits
  const filteredHabits = useMemo(() => {
    let result = [...habits];
    
    if (filters.sortBy === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    return result.filter(habit => {
      const isCompleted = habitLogs.some(log => log.habitId === habit.id && log.date === selectedDateStr);
      if (filters.hideCompleted && isCompleted) return false;
      return true;
    });
  }, [habits, filters, habitLogs, selectedDateStr]);

  return (
    <div className="flex flex-col h-full bg-black text-white relative font-sans">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 pt-10 relative">
        <div className="flex items-center gap-3">
          <button onClick={() => setView(ViewState.SETTINGS)} className="w-10 h-10 bg-[#1c1c1e] rounded-full flex items-center justify-center hover:bg-[#2c2c2e] transition-colors active:scale-95">
            <Menu size={20} className="text-white" />
          </button>
          <button 
            onClick={() => setShowFilterMenu(!showFilterMenu)} 
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors active:scale-95 ${showFilterMenu ? 'bg-brand-500 text-black' : 'bg-[#1c1c1e] text-white hover:bg-[#2c2c2e]'}`}
          >
            <ListFilter size={20} />
          </button>
        </div>
        <h1 className="text-xl font-bold">{selectedDateStr === todayStr ? 'Hoy' : selectedDateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short'})}</h1>
        <button onClick={() => setShowNewHabitModal(true)} className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors active:scale-95 shadow-lg shadow-brand-500/20">
          <Plus size={24} className="text-white" />
        </button>

        {/* Filter Dropdown */}
        {showFilterMenu && (
          <div className="absolute top-24 left-5 z-[100] w-72 bg-[#1c1c1e] border border-zinc-800 rounded-[2.5rem] p-5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
            {/* Tabs */}
            <div className="flex bg-black/40 rounded-2xl p-1 mb-6">
              <button 
                onClick={() => setMenuTab('sort')}
                className={`flex-1 py-2 text-[10px] font-black rounded-xl transition-all ${menuTab === 'sort' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                ORDENAR HÁBITOS
              </button>
              <button 
                onClick={() => setMenuTab('groups')}
                className={`flex-1 py-2 text-[10px] font-black rounded-xl transition-all ${menuTab === 'groups' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                GRUPOS
              </button>
            </div>

            {menuTab === 'sort' ? (
              <div className="space-y-2">
                <button 
                  onClick={() => { setFilters({...filters, sortBy: filters.sortBy === 'name' ? 'custom' : 'name'}); setShowFilterMenu(false); }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <ArrowDownWideNarrow size={16} />
                    </div>
                    <span className="text-sm font-semibold text-zinc-200">Ordenar por nombre</span>
                  </div>
                  {filters.sortBy === 'name' && <div className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />}
                </button>

                <div className="h-px bg-zinc-800/50 my-2 mx-2"></div>

                <button 
                  onClick={() => { setFilters({...filters, hideCompleted: !filters.hideCompleted}); setShowFilterMenu(false); }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <EyeOff size={16} />
                    </div>
                    <span className="text-sm font-semibold text-zinc-400">Ocultar completados</span>
                  </div>
                  {filters.hideCompleted && <div className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />}
                </button>

                <button 
                  onClick={() => { setFilters({...filters, hideFailed: !filters.hideFailed}); setShowFilterMenu(false); }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                      <XCircle size={16} />
                    </div>
                    <span className="text-sm font-semibold text-zinc-400">Ocultar fallidos</span>
                  </div>
                  {filters.hideFailed && <div className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />}
                </button>

                <button 
                  onClick={() => { setFilters({...filters, hideSkipped: !filters.hideSkipped}); setShowFilterMenu(false); }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                      <CornerUpRight size={16} />
                    </div>
                    <span className="text-sm font-semibold text-zinc-400">Ocultar saltados</span>
                  </div>
                  {filters.hideSkipped && <div className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />}
                </button>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-600">
                  <Users size={20} />
                </div>
                <p className="text-xs text-zinc-500 font-medium">No tienes grupos creados</p>
                <button className="mt-4 text-[10px] font-black text-brand-500 uppercase tracking-widest border border-brand-500/20 px-4 py-2 rounded-full hover:bg-brand-500/10 transition-colors">CREAR GRUPO</button>
              </div>
            )}
          </div>
        )}
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
        {filteredHabits.length === 0 ? (
          <div className="text-center mt-10 p-10 flex flex-col items-center">
            <span className="text-5xl mb-6 opacity-40">😔</span>
            <p className="text-zinc-400 mb-6 font-medium">Aun no hay hábitos</p>
            <button onClick={() => setShowNewHabitModal(true)} className="w-full sm:w-auto bg-brand-500 text-black font-bold px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
              <Plus size={20} /> Crear un nuevo hábito
            </button>
          </div>
        ) : (
          filteredHabits.map(habit => {
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
              <div className="absolute top-2 right-2 text-zinc-600">
                <Lock size={10} />
              </div>
              <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center shrink-0">
                <Dumbbell size={16} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-xs leading-none">Musculación</h3>
              </div>
            </button>
            
            <button onClick={() => onToolClick(ViewState.SCANNER)} className="bg-[#1c1c1e] p-3 rounded-2xl border border-[#2c2c2e] flex flex-row items-center gap-3 hover:bg-[#2c2c2e] transition-colors active:scale-95 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-2 -top-2 w-12 h-12 bg-white/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors"></div>
              <div className="absolute top-2 right-2 text-zinc-600">
                <Lock size={10} />
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                <ScanLine size={16} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-xs leading-none">Escáner IA</h3>
              </div>
            </button>

            <button onClick={() => onToolClick(ViewState.WORKOUT)} className="bg-[#1c1c1e] p-3 rounded-2xl border border-[#2c2c2e] flex flex-row items-center gap-3 hover:bg-[#2c2c2e] transition-colors active:scale-95 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-2 -top-2 w-12 h-12 bg-white/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-colors"></div>
              <div className="absolute top-2 right-2 text-zinc-600">
                <Lock size={10} />
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center shrink-0">
                <Brain size={16} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-xs leading-none">Rutinas IA</h3>
              </div>
            </button>

            <button onClick={() => onToolClick(ViewState.CHAT)} className="bg-[#1c1c1e] p-3 rounded-2xl border border-[#2c2c2e] flex flex-row items-center gap-3 hover:bg-[#2c2c2e] transition-colors active:scale-95 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-2 -top-2 w-12 h-12 bg-white/5 rounded-full blur-xl group-hover:bg-orange-500/10 transition-colors"></div>
              <div className="absolute top-2 right-2 text-zinc-600">
                <Lock size={10} />
              </div>
              <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">
                <MessageSquare size={16} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-xs leading-none">Coach AI</h3>
              </div>
            </button>

            <button onClick={() => onToolClick(ViewState.RECIPES)} className="bg-[#1c1c1e] p-3 rounded-2xl border border-[#2c2c2e] flex flex-row items-center gap-3 hover:bg-[#2c2c2e] transition-colors active:scale-95 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-2 -top-2 w-12 h-12 bg-white/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors"></div>
              <div className="absolute top-2 right-2 text-zinc-600">
                <Lock size={10} />
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                <ChefHat size={16} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-xs leading-none">Chef AI</h3>
              </div>
            </button>

            <button onClick={() => onToolClick(ViewState.COMMUNITY)} className="bg-[#1c1c1e] p-3 rounded-2xl border border-[#2c2c2e] flex flex-row items-center gap-3 hover:bg-[#2c2c2e] transition-colors active:scale-95 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-2 -top-2 w-12 h-12 bg-white/5 rounded-full blur-xl group-hover:bg-pink-500/10 transition-colors"></div>
              <div className="absolute top-2 right-2 text-zinc-600">
                <Lock size={10} />
              </div>
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
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
          <div className="flex-1 overflow-y-auto px-6 pt-16 pb-10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-white text-3xl tracking-tighter">Nuevo Hábito</h3>
              <button onClick={() => { setShowNewHabitModal(false); setNewHabitTitle(''); }} className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-white">
                <X size={20} />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
              {(['buenos', 'salud', 'malos', 'tareas'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setModalCategory(cat)}
                  className={`px-6 py-3 rounded-2xl font-bold text-sm capitalize transition-all shrink-0 ${modalCategory === cat ? 'bg-brand-500 text-black scale-105' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Popular Habits Grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {popularHabits[modalCategory].map((h, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAdd(h)}
                  className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl flex flex-col items-center gap-2 hover:bg-zinc-800 transition-all active:scale-95"
                >
                  <span className="text-3xl mb-1">{h.icon}</span>
                  <span className="font-bold text-white text-xs">{h.title}</span>
                </button>
              ))}
            </div>

            <div className="h-px bg-zinc-800 w-full mb-10"></div>

            {/* Custom Habit Creation */}
            <div className="space-y-6">
              <h4 className="font-black text-zinc-500 text-xs uppercase tracking-widest text-center">O crea uno personalizado</h4>
              
              <form onSubmit={handleCreateHabit} className="space-y-4">
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl opacity-50">
                    {getEmojiForTitle(newHabitTitle)}
                  </div>
                  <input 
                    type="text"
                    autoFocus
                    placeholder="Ponle nombre a tu hábito..."
                    value={newHabitTitle}
                    onChange={e => setNewHabitTitle(e.target.value)}
                    className="w-full bg-zinc-900 border-2 border-zinc-800 text-white p-5 pl-16 rounded-[2rem] focus:outline-none focus:border-brand-500 transition-all font-bold text-lg"
                    maxLength={40}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={!newHabitTitle.trim()} 
                  className="w-full bg-white text-black font-black py-5 rounded-[2rem] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2 text-lg disabled:opacity-30"
                >
                  <Plus size={24} className="stroke-[3]" /> CREAR HÁBITO
                </button>
              </form>
            </div>
          </div>
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
