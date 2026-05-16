import React, { useState, useMemo } from 'react';
import { Menu, Plus, Check, CloudMoon, ListTodo, X, Dumbbell, ScanLine, Brain, MessageSquare, ChefHat, Users, Lock, ListFilter, ArrowDownWideNarrow, EyeOff, XCircle, CornerUpRight, Trash2, Search, Crown, ChevronRight } from 'lucide-react';
import { ViewState, Habit, HabitLog } from '../types';

interface Props {
  setView: (view: ViewState) => void;
  uiText: Record<string, string>;
  habits: Habit[];
  habitLogs: HabitLog[];
  onToggleHabit: (habitId: string, date: string) => void;
  onAddHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  onToolClick: (view: ViewState) => void;
  isPro: boolean;
}

const HabitItem = ({ habit, isCompleted, onToggle, onDelete }: { habit: Habit, isCompleted: boolean, onToggle: () => void, onDelete: () => void }) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX;
    if (diff < 0) {
      setSwipeOffset(Math.max(-80, diff));
    } else if (diff > 0 && swipeOffset < 0) {
      setSwipeOffset(Math.min(0, swipeOffset + diff));
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset < -40) {
      setSwipeOffset(-80);
    } else {
      setSwipeOffset(0);
    }
    setTouchStartX(null);
  };

  return (
    <div className="relative w-full mb-4 rounded-3xl bg-red-500 overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 w-[80px] flex items-center justify-center text-white">
        <button onClick={onDelete} className="w-full h-full flex flex-col items-center justify-center opacity-80 hover:opacity-100 transition-opacity bg-red-500">
          <Trash2 size={24} />
          <span className="text-[10px] font-bold mt-1">Borrar</span>
        </button>
      </div>
      
      <button 
        onClick={() => {
          if (swipeOffset < 0) setSwipeOffset(0);
          else onToggle();
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        className={`w-full h-full relative z-10 text-left border rounded-3xl p-4 flex items-center justify-between transition-transform ${isCompleted ? 'bg-[#1c1c1e] border-brand-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-[#1c1c1e] border-[#2c2c2e]'}`}
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
    </div>
  );
};

const ProToolButton = ({ title, icon, colorName, isPro, onClick }: { title: string, icon: React.ReactNode, colorName: 'brand' | 'blue' | 'purple' | 'orange' | 'emerald' | 'pink', isPro: boolean, onClick: () => void }) => {
  const colors = {
    brand: { hoverBg: 'group-hover:bg-brand-500/10', iconBg: 'bg-brand-500/20', iconText: 'text-brand-500' },
    blue: { hoverBg: 'group-hover:bg-blue-500/10', iconBg: 'bg-blue-500/20', iconText: 'text-blue-500' },
    purple: { hoverBg: 'group-hover:bg-purple-500/10', iconBg: 'bg-purple-500/20', iconText: 'text-purple-500' },
    orange: { hoverBg: 'group-hover:bg-orange-500/10', iconBg: 'bg-orange-500/20', iconText: 'text-orange-500' },
    emerald: { hoverBg: 'group-hover:bg-emerald-500/10', iconBg: 'bg-emerald-500/20', iconText: 'text-emerald-500' },
    pink: { hoverBg: 'group-hover:bg-pink-500/10', iconBg: 'bg-pink-500/20', iconText: 'text-pink-500' },
  }[colorName];

  if (isPro) {
    return (
      <button onClick={onClick} className="bg-[#1c1c1e] p-3 rounded-2xl border border-[#2c2c2e] flex flex-row items-center gap-3 hover:bg-[#2c2c2e] transition-colors active:scale-95 shadow-sm relative overflow-hidden group">
        <div className={`absolute -right-2 -top-2 w-12 h-12 bg-white/5 rounded-full blur-xl ${colors.hoverBg} transition-colors`}></div>
        <div className={`w-8 h-8 rounded-full ${colors.iconBg} ${colors.iconText} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div className="text-left">
          <h3 className="font-bold text-white text-xs leading-none">{title}</h3>
        </div>
      </button>
    );
  }

  // Locked State
  return (
    <button onClick={onClick} className="bg-gradient-to-br from-[#1c1c1e] to-black p-3 rounded-2xl border border-yellow-500/20 flex flex-row items-center gap-3 hover:border-yellow-500/40 transition-all active:scale-95 shadow-lg shadow-yellow-500/5 relative overflow-hidden group">
      <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors"></div>
      <div className="absolute -right-2 -top-2 w-12 h-12 bg-yellow-500/10 rounded-full blur-xl group-hover:bg-yellow-500/20 transition-colors"></div>
      
      <div className="absolute top-2 right-2 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)] animate-pulse">
        <Lock size={12} className="fill-yellow-500/20" />
      </div>

      <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center shrink-0 relative z-10 border border-yellow-500/30">
        {icon}
      </div>
      <div className="text-left relative z-10">
        <h3 className="font-bold text-yellow-50 text-xs leading-none">{title}</h3>
      </div>
    </button>
  );
};

export const DashHabitsView: React.FC<Props> = ({ setView, uiText, habits, habitLogs, onToggleHabit, onAddHabit, onDeleteHabit, onToolClick, isPro }) => {
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
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
  
  const todayStr = todayDateObj.toISOString().split('T')[0];
  const [selectedDates, setSelectedDates] = useState<string[]>([todayStr]);

  const selectedDateStr = selectedDateObj.toISOString().split('T')[0];

  // Generate 7 days (3 days before, today, 3 days after) based on the center selectedDateObj
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

  const handleDayClick = (fullDate: Date, dateStr: string) => {
    setSelectedDateObj(fullDate);
    
    // Logic for multiple adjacent selection
    if (selectedDates.includes(dateStr)) {
      if (selectedDates.length > 1) {
        setSelectedDates(selectedDates.filter(d => d !== dateStr));
      }
    } else {
      // Check if it's adjacent to any already selected date
      const isAdjacent = selectedDates.some(selDate => {
        const diff = Math.abs(new Date(selDate).getTime() - new Date(dateStr).getTime());
        return diff <= 86400000 * 1.5; // Account for daylight saving time
      });
      if (isAdjacent) {
        setSelectedDates([...selectedDates, dateStr].sort());
      } else {
        setSelectedDates([dateStr]);
      }
    }
  };

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

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(habit => habit.title.toLowerCase().includes(term));
    }
    
    return result.filter(habit => {
      // Check if the habit is completed on ALL selected dates
      const isCompleted = selectedDates.every(date => 
        habitLogs.some(log => log.habitId === habit.id && log.date === date)
      );
      if (filters.hideCompleted && isCompleted) return false;
      return true;
    });
  }, [habits, filters, habitLogs, selectedDates]);

  return (
    <div className="flex flex-col h-full bg-black text-white relative font-sans">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 pt-10 relative">
        {!isSearchVisible ? (
          <>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowNewHabitModal(true)} className="w-10 h-10 bg-[#1c1c1e] rounded-full flex items-center justify-center hover:bg-[#2c2c2e] transition-colors active:scale-95">
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
          </>
        ) : (
          <div className="flex-1 flex items-center gap-3 pr-2 animate-in fade-in slide-in-from-left-4 duration-200">
            <button onClick={() => { setIsSearchVisible(false); setSearchTerm(''); }} className="w-10 h-10 bg-[#1c1c1e] rounded-full flex items-center justify-center">
              <ChevronLeft size={20} className="text-white" />
            </button>
            <input 
              type="text" 
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              className="flex-1 bg-[#1c1c1e] border border-[#2c2c2e] rounded-2xl py-2 px-4 text-white focus:outline-none focus:border-brand-500 transition-all font-semibold"
            />
          </div>
        )}
        
        <div className="flex items-center gap-3">
          {!isSearchVisible && (
            <button onClick={() => setIsSearchVisible(true)} className="w-10 h-10 bg-[#1c1c1e] rounded-full flex items-center justify-center hover:bg-[#2c2c2e] transition-colors active:scale-95">
              <Search size={20} className="text-white" />
            </button>
          )}
          <button onClick={() => setShowNewHabitModal(true)} className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors active:scale-95 shadow-lg shadow-brand-500/20">
            <Plus size={24} className="text-white" />
          </button>
        </div>

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
      <div className="flex justify-between items-center px-2 mt-2 mb-6">
        {days.map((d, i) => {
          const isPrimarySelected = d.date === selectedDateStr;
          const isActive = selectedDates.includes(d.date);
          
          const dayHabits = habits.length;
          const completedDayHabits = habitLogs.filter(log => log.date === d.date).length;
          const progress = dayHabits === 0 ? 0 : completedDayHabits / dayHabits;

          const nextDayCompletedHabits = i < days.length - 1 ? habitLogs.filter(log => log.date === days[i+1].date).length : 0;
          const hasNextStreak = progress > 0 && nextDayCompletedHabits > 0;

          return (
            <div key={i} className="relative flex flex-col items-center justify-start" style={{ width: '14.28%', height: '85px' }}>
              {hasNextStreak && (
                 <div className="absolute top-[52px] left-1/2 w-full h-[3px] bg-brand-500 -translate-y-1/2 z-0" style={{ boxShadow: '0 0 10px rgba(16,185,129,0.3)' }} />
              )}
              
              <button 
                onClick={() => handleDayClick(d.fullDate, d.date)}
                className={`flex flex-col items-center justify-center w-[90%] max-w-[48px] transition-transform active:scale-90 ${isPrimarySelected ? 'bg-brand-500 rounded-full pt-3 pb-3 z-20 shadow-[0_4px_20px_rgba(16,185,129,0.4)] scale-110' : 'group z-10 pt-4 pb-2'}`}
              >
                <span className={`text-[11px] mb-2 capitalize font-bold transition-colors ${isPrimarySelected ? 'text-white' : isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                   {d.dayName}
                </span>

                {isPrimarySelected ? (
                   progress === 1 ? (
                     <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-sm font-black text-brand-500 shadow-inner">
                       {d.dayNumber}
                     </div>
                   ) : progress > 0 ? (
                     <div className="w-9 h-9 rounded-full relative flex items-center justify-center text-white bg-black/20" style={{ backgroundImage: `conic-gradient(white ${progress * 100}%, transparent 0)` }}>
                       <div className="absolute inset-[3px] bg-brand-500 rounded-full flex items-center justify-center">
                         <span className="text-sm font-bold text-white">{d.dayNumber}</span>
                       </div>
                     </div>
                   ) : (
                     <div className="w-9 h-9 rounded-full bg-transparent flex items-center justify-center text-sm font-black text-white">
                       {d.dayNumber}
                     </div>
                   )
                ) : isActive ? (
                   <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-sm font-black text-black shadow-md">
                     {d.dayNumber}
                   </div>
                ) : progress === 1 ? (
                   <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-sm font-black text-black shadow-md">
                     {d.dayNumber}
                   </div>
                ) : progress > 0 ? (
                   <div className="w-9 h-9 rounded-full relative flex items-center justify-center text-brand-500 bg-[#2c2c2e]" style={{ backgroundImage: `conic-gradient(currentColor ${progress * 100}%, transparent 0)` }}>
                     <div className="absolute inset-[3px] bg-[#121212] rounded-full flex items-center justify-center">
                       <span className="text-sm font-bold text-zinc-300">{d.dayNumber}</span>
                     </div>
                   </div>
                ) : (
                   <div className="w-9 h-9 rounded-full bg-transparent flex items-center justify-center text-sm font-bold text-zinc-500 group-hover:bg-[#1c1c1e] group-hover:text-white transition-colors border border-transparent group-hover:border-[#2c2c2e]">
                     {d.dayNumber}
                   </div>
                )}
              </button>
            </div>
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
            const isCompleted = selectedDates.every(date => 
              habitLogs.some(log => log.habitId === habit.id && log.date === date)
            );
            return (
              <HabitItem
                key={habit.id}
                habit={habit}
                isCompleted={isCompleted}
                onToggle={() => {
                  // Toggle for all selected dates
                  selectedDates.forEach((date, idx) => {
                     setTimeout(() => onToggleHabit(habit.id, date), idx * 2);
                  });
                }}
                onDelete={() => onDeleteHabit(habit.id)}
              />
            )
          })
        )}
        
        {!isPro && (
          <button 
            onClick={() => onToolClick(ViewState.SETTINGS)} 
            className="w-full mt-4 mb-4 p-5 rounded-[2rem] bg-[#1c1c1e] border border-zinc-800 flex items-center justify-between group active:scale-95 transition-all shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
                <Crown size={24} className="text-yellow-500 fill-yellow-500/20" />
              </div>
              <div className="text-left">
                <h3 className="font-black text-[#a78bfa] text-lg leading-none mb-1">Desbloquear todo</h3>
                <p className="text-zinc-400 text-sm font-bold">Con TWH Premium</p>
              </div>
            </div>
            <ChevronRight size={24} className="text-white opacity-50 group-hover:opacity-100 transition-opacity" />
          </button>
        )}

        <div className="text-center mt-6">
          <p className="text-xs text-zinc-600">Sincronizado con base local</p>
        </div>

        {/* Hub de Herramientas */}
        <div className="mt-8 mb-6 px-1">
          <h2 className="text-lg font-bold text-white mb-4">Herramientas PRO</h2>
          <div className="grid grid-cols-2 gap-3">
            <ProToolButton title="Musculación" icon={<Dumbbell size={16} />} colorName="brand" isPro={isPro} onClick={() => onToolClick(ViewState.GUIDE)} />
            <ProToolButton title="Escáner IA" icon={<ScanLine size={16} />} colorName="blue" isPro={isPro} onClick={() => onToolClick(ViewState.SCANNER)} />
            <ProToolButton title="Rutinas IA" icon={<Brain size={16} />} colorName="purple" isPro={isPro} onClick={() => onToolClick(ViewState.WORKOUT)} />
            <ProToolButton title="Coach AI" icon={<MessageSquare size={16} />} colorName="orange" isPro={isPro} onClick={() => onToolClick(ViewState.CHAT)} />
            <ProToolButton title="Chef AI" icon={<ChefHat size={16} />} colorName="emerald" isPro={isPro} onClick={() => onToolClick(ViewState.RECIPES)} />
            <ProToolButton title="Trainers" icon={<Users size={16} />} colorName="pink" isPro={isPro} onClick={() => onToolClick(ViewState.COMMUNITY)} />
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
