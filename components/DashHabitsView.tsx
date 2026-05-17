import React, { useState, useMemo } from 'react';
import { Menu, Plus, Check, CloudMoon, ListTodo, X, Dumbbell, ScanLine, Brain, MessageSquare, ChefHat, Users, Lock, ListFilter, ArrowDownWideNarrow, EyeOff, XCircle, CornerUpRight, Trash2, Search, Crown, ChevronRight, ChevronLeft, Trophy, Sparkles, Star, Frown, BadgeCheck, Activity, Ban, Minus, Flame, Archive } from 'lucide-react';
import { ViewState, Habit, HabitLog } from '../types';
import { sounds } from '../utils/sound';

interface Props {
  setView: (view: ViewState) => void;
  uiText: Record<string, string>;
  habits: Habit[];
  habitLogs: HabitLog[];
  onToggleHabit: (habitId: string, date: string) => void;
  onIncrementHabit: (habitId: string, date: string) => void;
  onDecrementHabit: (habitId: string, date: string) => void;
  onAddHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  onArchiveHabit: (habitId: string) => void;
  onToolClick: (view: ViewState) => void;
  isPro: boolean;
}

const HabitItem = ({ 
  habit, 
  completedCount, 
  onIncrement, 
  onDecrement, 
  onDelete,
  onArchive
}: { 
  habit: Habit, 
  completedCount: number, 
  onIncrement: () => void, 
  onDecrement: () => void, 
  onDelete: () => void,
  onArchive: () => void
}) => {
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
      setSwipeOffset(Math.max(-160, diff));
    } else if (diff > 0 && swipeOffset < 0) {
      setSwipeOffset(Math.min(0, swipeOffset + diff));
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset < -60) {
      setSwipeOffset(-160);
    } else {
      setSwipeOffset(0);
    }
    setTouchStartX(null);
  };

  const isCompleted = completedCount > 0;

  return (
    <div className="relative w-full mb-4 rounded-3xl bg-[#1c1c1e] overflow-hidden select-none">
      {/* Background Buttons */}
      <div className="absolute right-0 top-0 bottom-0 w-[160px] flex text-white">
        {/* Archive Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onArchive();
            setSwipeOffset(0);
          }} 
          className="w-1/2 h-full flex flex-col items-center justify-center opacity-90 hover:opacity-100 transition-opacity bg-amber-600 border-r border-[#1c1c1e]/20"
        >
          <Archive size={20} />
          <span className="text-[10px] font-bold mt-1">{habit.isArchived ? 'Activar' : 'Archivar'}</span>
        </button>
        {/* Delete Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
            setSwipeOffset(0);
          }} 
          className="w-1/2 h-full flex flex-col items-center justify-center opacity-90 hover:opacity-100 transition-opacity bg-red-500"
        >
          <Trash2 size={20} />
          <span className="text-[10px] font-bold mt-1">Borrar</span>
        </button>
      </div>
      
      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        className={`w-full h-full relative z-10 text-left border rounded-3xl p-4 flex items-center justify-between transition-all duration-300 ${isCompleted ? 'bg-[#1c1c1e] border-brand-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-[#1c1c1e] border-[#2c2c2e]'}`}
      >
        <div 
          className="flex items-center gap-4 flex-1 cursor-pointer" 
          onClick={() => {
            if (swipeOffset < 0) {
              setSwipeOffset(0);
            } else if (completedCount === 0) {
              onIncrement();
            }
          }}
        >
          <span className="text-2xl shrink-0">{habit.icon}</span>
          <div>
            <h3 className={`font-semibold transition-colors ${isCompleted ? 'text-brand-400' : 'text-white'}`}>{habit.title}</h3>
            <p className="text-xs text-zinc-400 leading-normal">
              {completedCount > 0 ? `Realizado ${completedCount} ${completedCount === 1 ? 'vez' : 'veces'} hoy` : 'Cada día'}
            </p>
          </div>
        </div>
        
        {/* Counter Controls */}
        <div className="relative z-20 flex items-center gap-2 shrink-0">
          {completedCount > 0 ? (
            <div className="flex items-center bg-[#121212] border border-[#2c2c2e] rounded-full p-1 gap-2 shadow-inner">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDecrement();
                }}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 active:scale-90 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
              >
                <Minus size={12} strokeWidth={2.5} />
              </button>
              <span className="text-xs font-black text-white px-1 shrink-0 select-none">
                {completedCount}x
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (completedCount < 10) onIncrement();
                }}
                disabled={completedCount >= 10}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-all shadow-[0_0_8px_rgba(16,185,129,0.3)] ${completedCount >= 10 ? 'bg-zinc-700 opacity-50 cursor-not-allowed' : 'bg-brand-500 hover:bg-brand-600 active:scale-90'}`}
              >
                <Plus size={12} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onIncrement();
              }}
              className="w-10 h-10 rounded-full bg-[#121212] hover:bg-[#202022] border border-[#2c2c2e] flex items-center justify-center text-brand-500/50 hover:text-brand-500 transition-all active:scale-90"
            >
              <Plus size={20} className="stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
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

export const DashHabitsView: React.FC<Props> = ({ setView, uiText, habits, habitLogs, onToggleHabit, onIncrementHabit, onDecrementHabit, onAddHabit, onDeleteHabit, onArchiveHabit, onToolClick, isPro }) => {
  const [showBottomAction, setShowBottomAction] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [menuTab, setMenuTab] = useState<'sort' | 'groups'>('sort');
  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem('twh_habit_sort_prefs');
    const parsed = saved ? JSON.parse(saved) : null;
    return {
      hideCompleted: parsed?.hideCompleted ?? false,
      hideFailed: parsed?.hideFailed ?? false,
      hideSkipped: parsed?.hideSkipped ?? false,
      sortBy: parsed?.sortBy ?? 'default',
      showArchived: parsed?.showArchived ?? false
    };
  });

  React.useEffect(() => {
    localStorage.setItem('twh_habit_sort_prefs', JSON.stringify(filters));
  }, [filters]);
  const [showNewHabitModal, setShowNewHabitModal] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [modalCategory, setModalCategory] = useState<'buenos' | 'salud' | 'malos' | 'tareas'>('buenos');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalSearchTerm, setModalSearchTerm] = useState('');

  // Estados para el Logro de Día Perfecto
  const [showPerfectDayModal, setShowPerfectDayModal] = useState(false);
  const [hasSeenPerfectDay, setHasSeenPerfectDay] = useState<Record<string, boolean>>({});

  const popularHabits: Record<string, { section: string, items: { title: string, icon: string }[] }[]> = {
    buenos: [
      {
        section: 'Más populares',
        items: [
          { title: 'Haz tu cama', icon: '🛏️' },
          { title: 'Beber agua', icon: '💧' },
          { title: 'Tomar una ducha fría', icon: '❄️' },
          { title: 'Tomar vitaminas', icon: '💊' },
          { title: 'Despertar a tiempo', icon: '🌞' },
          { title: 'Come una comida saludable', icon: '🥕' },
          { title: 'Cepíllate los dientes', icon: '🪥' },
          { title: 'Leer un libro', icon: '📖' },
          { title: 'Darse una ducha', icon: '🚿' }
        ]
      }
    ],
    salud: [
      {
        section: 'Actividad',
        items: [
          { title: 'Pasos', icon: '🚶‍♂️' },
          { title: 'Correr', icon: '🏃‍♂️' },
          { title: 'Bicicleta', icon: '🚲' },
          { title: 'Nadar', icon: '🏊' },
          { title: 'Esquiar', icon: '⛷️' },
          { title: 'Yoga', icon: '🧘‍♂️' },
          { title: 'Baile', icon: '🕺' },
          { title: 'Pilates', icon: '🧘‍♀️' },
          { title: 'Tenis', icon: '🎾' },
          { title: 'Ejercicios de fuerza con máquinas', icon: '🏋️' },
          { title: 'Boxeo', icon: '🥊' },
          { title: 'Subir tramos', icon: '🪜' },
          { title: 'Quemar calorías', icon: '🔥' },
          { title: 'De pie', icon: '🧍' },
          { title: 'Déficit de calorías', icon: '🔥' },
          { title: 'Ejercicio', icon: '🏋️‍♀️' }
        ]
      },
      {
        section: 'Medidas corporales',
        items: [
          { title: 'Registrar el peso', icon: '⚖️' },
          { title: 'Registrar la masa corporal magra', icon: '⚖️' },
          { title: 'Registrar el porcentaje de grasa', icon: '⚖️' },
          { title: 'Registrar la altura', icon: '🧍' },
          { title: 'Registrar la glucosa en sangre', icon: '📈' }
        ]
      },
      {
        section: 'Sueño',
        items: [
          { title: 'Dormir', icon: '😴' }
        ]
      },
      {
        section: 'Corazón',
        items: [
          { title: 'Registrar la presión arterial', icon: '🫀' }
        ]
      },
      {
        section: 'Bienestar mental',
        items: [
          { title: 'Sesión de conciencia', icon: '🧘' }
        ]
      },
      {
        section: 'Nutrición',
        items: [
          { title: 'Beber agua', icon: '💧' },
          { title: 'Limitar el café', icon: '☕' },
          { title: 'Limitar las bebidas alcohólicas', icon: '🍷' }
        ]
      },
      {
        section: 'Otros',
        items: [
          { title: 'Lavar las manos', icon: '👏' },
          { title: 'Cepíllate los dientes', icon: '🪥' },
          { title: 'Tiempo de exposición a la luz diurna', icon: '☀️' },
          { title: 'Tener sexo', icon: '💘' }
        ]
      }
    ],
    malos: [
      {
        section: 'Cuerpo',
        items: [
          { title: 'No comas', icon: '🥡' },
          { title: 'No te muerdas las uñas', icon: '💅' },
          { title: 'No te saques mocos', icon: '👆' },
          { title: 'Sentarse menos', icon: '🪑' }
        ]
      },
      {
        section: 'Bienestar mental',
        items: [
          { title: 'No jures', icon: '🤬' },
          { title: 'No te enfades', icon: '😡' },
          { title: 'No te quejes', icon: '😤' }
        ]
      },
      {
        section: 'Productividad',
        items: [
          { title: 'No te demores', icon: '📺' },
          { title: 'No juegues a videojuegos', icon: '🎮' },
          { title: 'Menos redes sociales', icon: '📱' },
          { title: 'Menos televisión', icon: '📺' }
        ]
      }
    ],
    tareas: [
      {
        section: 'Más populares',
        items: [
          { title: 'Presentar impuestos', icon: '🏛️' },
          { title: 'Renovar pasaporte', icon: '🪪' },
          { title: 'Planear unas vacaciones', icon: '🏖️' },
          { title: 'Actualizar contraseñas', icon: '🔑' },
          { title: 'Imprimir documentos', icon: '🖨️' },
          { title: 'Comprar un regalo', icon: '🎁' },
          { title: 'Inscribirse en un gimnasio', icon: '💪' },
          { title: 'Programar una reunión', icon: '📅' },
          { title: 'Establecer un presupuesto', icon: '💸' },
          { title: 'Actualizar currículum', icon: '🪪' },
          { title: 'Leer un libro', icon: '📖' },
          { title: 'Renovar licencia de conducir', icon: '🪪' },
          { title: 'Verificar seguro', icon: '📄' },
          { title: 'Mantenimiento del coche', icon: '🚗' }
        ]
      }
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
    const yesterdayDateObj = new Date(todayDateObj);
    yesterdayDateObj.setDate(yesterdayDateObj.getDate() - 1);
    const yesterdayStr = yesterdayDateObj.toISOString().split('T')[0];

    const tomorrowDateObj = new Date(todayDateObj);
    tomorrowDateObj.setDate(tomorrowDateObj.getDate() + 1);
    const tomorrowStr = tomorrowDateObj.toISOString().split('T')[0];

    for (let i = -3; i <= 3; i++) {
        const d = new Date(selectedDateObj);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        
        let label = d.toLocaleDateString('es-ES', { weekday: 'short' });
        if (dateStr === todayStr) {
          label = 'Hoy';
        } else if (dateStr === yesterdayStr) {
          label = 'Ayer';
        } else if (dateStr === tomorrowStr) {
          label = 'Mañana';
        }

        list.push({
            date: dateStr,
            dayName: label,
            dayNumber: d.getDate(),
            isToday: dateStr === todayStr,
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
    
    // Filtrado de archivados
    result = result.filter(habit => {
      if (filters.showArchived) {
        return habit.isArchived === true;
      } else {
        return !habit.isArchived;
      }
    });
    
    // Filtrado de estados
    result = result.filter(habit => {
      const isCompleted = selectedDates.every(date => 
        habitLogs.some(log => log.habitId === habit.id && log.date === date)
      );
      if (filters.hideCompleted && isCompleted) return false;
      return true;
    });

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(habit => habit.title.toLowerCase().includes(term));
    }
    
    // Ordenación
    if (filters.sortBy === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (filters.sortBy === 'completed_last') {
      result.sort((a, b) => {
        const aComp = selectedDates.every(date => habitLogs.some(log => log.habitId === a.id && log.date === date));
        const bComp = selectedDates.every(date => habitLogs.some(log => log.habitId === b.id && log.date === date));
        if (aComp === bComp) return 0;
        return aComp ? 1 : -1;
      });
    } else if (filters.sortBy === 'progress') {
      result.sort((a, b) => {
        const aComp = selectedDates.every(date => habitLogs.some(log => log.habitId === a.id && log.date === date));
        const bComp = selectedDates.every(date => habitLogs.some(log => log.habitId === b.id && log.date === date));
        if (aComp === bComp) return 0;
        return aComp ? -1 : 1; // Mayor progreso (completado) arriba
      });
    }

    return result;
  }, [habits, filters, habitLogs, selectedDates, searchTerm]);

  // Lógica para detectar el Día Perfecto
  const currentDayHabitsCount = habits.length;
  const currentDayCompletedCount = habitLogs.filter(log => log.date === selectedDateStr).length;
  const currentDayProgress = currentDayHabitsCount === 0 ? 0 : currentDayCompletedCount / currentDayHabitsCount;

  React.useEffect(() => {
    if (currentDayProgress === 1 && currentDayHabitsCount > 0 && !hasSeenPerfectDay[selectedDateStr]) {
      // Pequeño delay para que el usuario vea la animación de completado (check) primero
      const timer = setTimeout(() => {
        setShowPerfectDayModal(true);
        sounds.playAchievement();
        setHasSeenPerfectDay(prev => ({ ...prev, [selectedDateStr]: true }));
        
        // Auto ocultar después de 4 segundos
        setTimeout(() => {
          setShowPerfectDayModal(false);
        }, 4000);
      }, 500);
      return () => clearTimeout(timer);
    } else if (currentDayProgress < 1 && hasSeenPerfectDay[selectedDateStr]) {
      // Si desmarcan un hábito, reseteamos para que puedan volver a ganar el logro
      setHasSeenPerfectDay(prev => ({ ...prev, [selectedDateStr]: false }));
      setShowPerfectDayModal(false);
    }
  }, [currentDayProgress, currentDayHabitsCount, selectedDateStr, hasSeenPerfectDay]);

  return (
    <div className="flex flex-col h-full bg-black text-white relative font-sans">
      {/* Animación de Logro Desbloqueado Flotante */}
      {showPerfectDayModal && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[150] animate-in slide-in-from-top-12 fade-in zoom-in-95 duration-500 ease-out">
          <div 
            onClick={() => setShowPerfectDayModal(false)}
            className="bg-[#1c1c1e] border border-brand-500/50 rounded-full p-2 pr-6 flex items-center gap-4 shadow-[0_20px_50px_rgba(16,185,129,0.3)] relative overflow-hidden cursor-pointer"
          >
            {/* Glow background */}
            <div className="absolute inset-0 bg-brand-500/5"></div>
            
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shrink-0 relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.6)]">
              <Trophy size={24} className="text-black animate-[bounce_1s_infinite]" />
            </div>
            
            <div className="relative z-10 flex-1 py-1">
              <p className="text-brand-500 text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 animate-pulse">Logro Desbloqueado</p>
              <h3 className="text-white font-bold text-base leading-none italic">Día Perfecto</h3>
            </div>

            <div className="relative z-10 flex gap-1">
              <Star size={14} className="text-yellow-500 fill-yellow-500 animate-pulse" />
              <Sparkles size={18} className="text-brand-400" />
            </div>
          </div>
        </div>
      )}

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

                <button 
                  onClick={() => { setFilters({...filters, showArchived: !filters.showArchived}); setShowFilterMenu(false); }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                      <Archive size={16} />
                    </div>
                    <span className="text-sm font-semibold text-zinc-400">Mostrar archivados</span>
                  </div>
                  {filters.showArchived && <div className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />}
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
      <div className="relative flex justify-between items-center px-2 mt-2 mb-6 h-[85px]">
        {/* Sliding Highlight Background */}
        {(() => {
          const selectedIdx = days.findIndex(d => d.date === selectedDateStr);
          if (selectedIdx === -1) return null;
          return (
            <div 
              className="absolute top-1 h-[78px] bg-brand-500 rounded-3xl z-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_8px_30px_rgba(16,185,129,0.3)]"
              style={{ 
                width: '44px',
                left: `calc(${selectedIdx * 14.28}% + 7.14% - 22px)`,
              }}
            />
          );
        })()}

        {days.map((d, i) => {
          const isPrimarySelected = d.date === selectedDateStr;
          const isActive = selectedDates.includes(d.date);
          
          const dayHabits = habits.length;
          const completedDayHabits = habitLogs.filter(log => log.date === d.date).length;
          const progress = dayHabits === 0 ? 0 : completedDayHabits / dayHabits;

          const nextDayCompletedHabits = i < days.length - 1 ? habitLogs.filter(log => log.date === days[i+1].date).length : 0;
          const hasNextStreak = progress > 0 && nextDayCompletedHabits > 0;

          return (
            <div key={i} className="relative flex flex-col items-center justify-start z-10" style={{ width: '14.28%', height: '85px' }}>
              {hasNextStreak && (
                 <div className="absolute top-[52px] left-1/2 w-full h-[3px] bg-brand-500 -translate-y-1/2 z-0" style={{ boxShadow: '0 0 10px rgba(16,185,129,0.3)' }} />
              )}
              
              <button 
                onClick={() => handleDayClick(d.fullDate, d.date)}
                className={`flex flex-col items-center justify-center w-[90%] max-w-[48px] h-[78px] transition-all duration-300 active:scale-90 rounded-3xl ${isPrimarySelected ? 'z-20 scale-105' : 'group z-10 pt-1 pb-1'}`}
              >
                <span className={`text-[10px] mb-2.5 capitalize font-bold transition-colors duration-300 flex items-center justify-center gap-0.5 ${isPrimarySelected ? 'text-white' : isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                   {d.dayName}
                   {completedDayHabits > 0 && (
                     <Flame size={10} className="fill-orange-500 text-orange-500 animate-pulse shrink-0" />
                   )}
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
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
              <Frown size={40} className="text-red-500 opacity-80 stroke-[1.5]" />
            </div>
            <p className="text-zinc-400 mb-6 font-medium">Aun no hay hábitos</p>
            <button onClick={() => setShowNewHabitModal(true)} className="w-full sm:w-auto bg-brand-500 text-black font-bold px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
              <Plus size={20} /> Crear un nuevo hábito
            </button>
          </div>
        ) : (
          filteredHabits.map(habit => {
            const completedCount = habitLogs.filter(log => log.habitId === habit.id && log.date === selectedDateStr).length;
            return (
              <HabitItem
                key={habit.id}
                habit={habit}
                completedCount={completedCount}
                onIncrement={() => {
                  selectedDates.forEach((date, idx) => {
                    setTimeout(() => onIncrementHabit(habit.id, date), idx * 2);
                  });
                }}
                onDecrement={() => {
                  selectedDates.forEach((date, idx) => {
                    setTimeout(() => onDecrementHabit(habit.id, date), idx * 2);
                  });
                }}
                onDelete={() => onDeleteHabit(habit.id)}
                onArchive={() => onArchiveHabit(habit.id)}
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
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => { setShowNewHabitModal(false); setNewHabitTitle(''); setModalSearchTerm(''); }} 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          />
          {/* Bottom Sheet */}
          <div className="relative w-full h-[92vh] bg-[#121214] rounded-t-[2.5rem] border-t border-zinc-800 flex flex-col overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom duration-300">
            {/* Pill Handle */}
            <div className="mx-auto my-3.5 w-12 h-1.5 bg-zinc-700/60 rounded-full" />
            
            {/* Header */}
            <div className="relative px-4 pb-4 flex items-center justify-center border-b border-zinc-800/50">
              <button 
                onClick={() => { setShowNewHabitModal(false); setNewHabitTitle(''); setModalSearchTerm(''); }} 
                className="absolute left-4 w-9 h-9 bg-[#1c1c1e] rounded-full flex items-center justify-center text-white hover:bg-[#2c2c2e] transition-colors"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
              <h3 className="font-bold text-white text-[17px]">Plantillas</h3>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-32 no-scrollbar">
              {/* Category Tabs */}
              <div className="flex justify-between bg-[#1c1c1e] rounded-full p-1 mb-6">
                {(['buenos', 'salud', 'malos', 'tareas'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setModalCategory(cat)}
                    className={`flex-1 py-2 rounded-full font-semibold text-[13px] capitalize transition-all duration-200 ${modalCategory === cat ? 'bg-[#3a3a3c] text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Crear personalizado */}
              {!modalSearchTerm && (
                <button 
                  onClick={() => {
                    const title = prompt(modalCategory === 'tareas' ? 'Ingresa el nombre de tu nueva tarea:' : 'Ingresa el nombre de tu nuevo hábito:');
                    if (title?.trim()) {
                      onAddHabit({
                        id: Date.now().toString(),
                        title: title.trim(),
                        frequency: 'daily',
                        color: '#10b981',
                        createdAt: new Date().toISOString(),
                        icon: getEmojiForTitle(title)
                      });
                      setShowNewHabitModal(false);
                      setNewHabitTitle('');
                    }
                  }}
                  className="w-full bg-[#1c1c1e] hover:bg-[#2c2c2e] transition-colors rounded-2xl p-4 flex items-center justify-between mb-8 border border-[#2c2c2e]"
                >
                  <div className="flex items-center gap-3">
                    {modalCategory === 'buenos' && <BadgeCheck size={22} className="text-green-500" />}
                    {modalCategory === 'salud' && <Activity size={22} className="text-green-500" />}
                    {modalCategory === 'malos' && <Ban size={22} className="text-red-500" />}
                    {modalCategory === 'tareas' && <BadgeCheck size={22} className="text-blue-500" />}
                    
                    <span className="text-white font-bold text-[15px]">
                      {modalCategory === 'tareas' ? 'Crear una tarea personalizada' : 'Crear un hábito personalizado'}
                    </span>
                  </div>
                  <ChevronRight size={20} className="text-zinc-500" />
                </button>
              )}

              {/* Popular Habits List */}
              {popularHabits[modalCategory].map((sectionData, sIdx) => {
                const filteredItems = sectionData.items.filter(h => h.title.toLowerCase().includes(modalSearchTerm.toLowerCase()));
                if (filteredItems.length === 0) return null;
                
                return (
                  <div key={sIdx} className="mb-6">
                    <h4 className="text-zinc-400 font-bold mb-3 ml-1">{sectionData.section}</h4>
                    <div className="bg-[#1c1c1e] rounded-3xl overflow-hidden">
                      {filteredItems.map((h, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            handleQuickAdd(h);
                            setShowNewHabitModal(false);
                            setModalSearchTerm('');
                          }}
                          className="w-full bg-transparent hover:bg-[#2c2c2e] transition-colors p-4 flex items-center justify-between border-b border-zinc-800/50 last:border-0"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-2xl">{h.icon}</span>
                            <span className="font-bold text-white text-[15px]">{h.title}</span>
                          </div>
                          <ChevronRight size={18} className="text-zinc-500" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Sticky Search */}
            <div className="absolute bottom-6 left-5 right-5">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text"
                  placeholder="Buscar"
                  value={modalSearchTerm}
                  onChange={e => setModalSearchTerm(e.target.value)}
                  className="w-full bg-[#2c2c2e] text-white rounded-full py-3.5 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-all font-medium placeholder:text-zinc-500 shadow-xl"
                />
              </div>
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
