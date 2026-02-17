
import React, { useState, useEffect, useMemo } from 'react';
import { ViewState, DailyLogEntry, UserProfile, CalendarEvent } from './types';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { WorkoutAI } from './components/WorkoutAI';
import { MuscleWiki } from './components/MuscleWiki';
import { Tracker } from './components/Tracker';
import { FoodScanner } from './components/FoodScanner';
import { AICoachChat, SportyRobotIcon } from './components/AICoachChat';
import { Achievements } from './components/Achievements';
import { SettingsView } from './components/SettingsView';
import { CommunityView } from './components/CommunityView';
import { AuthView } from './components/AuthView';
import { ChefChat } from './components/ChefChat';
import { SupportChat } from './components/SupportChat';
import { Headphones } from 'lucide-react';

import { LandingPage } from './components/LandingPage';
import { TermsAndConditions } from './components/TermsAndConditions';
import { SubscriptionModal } from './components/SubscriptionModal';
import { translateUI } from './services/geminiService';
import { supabase, DatabaseLogEntry } from './services/supabase';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from './components/ToastContext';

const DEFAULT_UI_TEXT = {
  inicio: "Inicio",
  entreno: "Entreno",
  perfil: "Perfil",
  guia: "Guía",
  ajustes: "Ajustes",
  logros: "Logros",
  ayuda: "Ayuda",
  comunidad: "Personal Trainers",
  cerrar_sesion: "Cerrar Sesión",
  pro: "PRO",
  atleta: "Atleta",
  bienvenido: "Bienvenido",
  historial: "Historial",
  distancia: "Distancia",
  calorias: "Calorías",
  meta_semanal: "Meta Semanal",
  idioma: "Idioma",
  modo_oscuro: "Modo Oscuro",
  modo_claro: "Modo Claro",
  apariencia: "Apariencia",
  biometria: "Editar Biometría",
  privacidad: "Privacidad",
  tema: "Tema Visual",
  coach_ia: "Modo Pro Asistente Coach",
  traduciendo: "IA Adaptando Interfaz...",
  status_online: "Watch Online",
  status_offline: "Watch Offline"
};

import { Footprints, Sun, Flame, Zap, Route, Flag, CalendarCheck, Crown } from 'lucide-react';
import { WeeklyGoalOption } from './types';

export const GOAL_OPTIONS: WeeklyGoalOption[] = [
  {
    id: 1,
    title: "Movimiento Base",
    description: "Mantente activo 3 días",
    target: 3,
    type: 'COUNT',
    unit: 'días',
    // We cast to any to avoid strict React type issues in this file/import mix
    icon: Footprints as any,
    gradient: "from-emerald-400 to-teal-600",
    shadow: "shadow-emerald-500/40"
  },
  {
    id: 2,
    title: "Fin de Semana Activo",
    description: "Actívate 2 días",
    target: 2,
    type: 'COUNT',
    unit: 'días',
    icon: Sun as any,
    gradient: "from-yellow-400 to-orange-500",
    shadow: "shadow-orange-500/40"
  },
  {
    id: 3,
    title: "Quema Calórica",
    description: "Quema 2500 kcal totales",
    target: 2500,
    type: 'CALORIES',
    unit: 'kcal',
    icon: Flame as any,
    gradient: "from-orange-500 to-red-600",
    shadow: "shadow-red-500/40"
  },
  {
    id: 4,
    title: "Incinerador de Grasa",
    description: "Quema 4000 kcal",
    target: 4000,
    type: 'CALORIES',
    unit: 'kcal',
    icon: Zap as any,
    gradient: "from-purple-500 to-pink-600",
    shadow: "shadow-purple-500/40",
    isPro: true
  },
  {
    id: 5,
    title: "Modo Runner",
    description: "Acumula 15 km de distancia",
    target: 15,
    type: 'DISTANCE',
    unit: 'km',
    icon: Route as any,
    gradient: "from-blue-400 to-indigo-600",
    shadow: "shadow-blue-500/40"
  },
  {
    id: 6,
    title: "Maratonista",
    description: "Acumula 42 km",
    target: 42,
    type: 'DISTANCE',
    unit: 'km',
    icon: Flag as any,
    gradient: "from-indigo-500 to-violet-700",
    shadow: "shadow-indigo-500/40",
    isPro: true
  },
  {
    id: 7,
    title: "Constancia Pro",
    description: "Entrena 5 días",
    target: 5,
    type: 'COUNT',
    unit: 'días',
    icon: CalendarCheck as any,
    gradient: "from-cyan-400 to-blue-600",
    shadow: "shadow-cyan-500/40"
  },
  {
    id: 8,
    title: "Atleta de Élite",
    description: "Constancia perfecta (7 días)",
    target: 7,
    type: 'COUNT',
    unit: 'días',
    icon: Crown as any,
    gradient: "from-amber-300 to-yellow-600",
    shadow: "shadow-yellow-500/40",
    isPro: true
  },
];

import { PrivacyPolicy } from './components/PrivacyPolicy';

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isPro, setIsPro] = useState(() => {
    return localStorage.getItem('gl_is_pro') === 'true';
  });
  const [showPaywall, setShowPaywall] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  // Custom muscles selected from Guide
  const [customWorkoutMuscles, setCustomWorkoutMuscles] = useState<any[]>([]);
  const { toast } = useToast();

  const [selectedGoalId, setSelectedGoalId] = useState<number>(() => {
    const saved = localStorage.getItem('gl_selected_goal_id');
    return saved ? parseInt(saved) : 1;
  });

  const [goalTargets, setGoalTargets] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('gl_goal_targets');
    return saved ? JSON.parse(saved) : {};
  });

  const handleSetGoal = (id: number) => {
    setSelectedGoalId(id);
    localStorage.setItem('gl_selected_goal_id', id.toString());

    // Sync to Supabase
    if (userId && userId !== 'offline-guest-user') {
      savePreferences({ selectedGoalId: id });
    }
  };

  const handleUpdateGoalTarget = (id: number, target: number) => {
    setGoalTargets(prev => {
      const next = { ...prev, [id]: target };
      localStorage.setItem('gl_goal_targets', JSON.stringify(next));

      // Sync to Supabase
      if (userId && userId !== 'offline-guest-user') {
        savePreferences({ goalTargets: next });
      }
      return next;
    });
  };

  const savePreferences = async (newPrefs: any) => {
    try {
      // We need to merge with existing preferences. Ideally fetch first or just upsert with merge if JSONB
      // Supabase doesn't auto-merge JSONB on simple update unless we use a function or specialized query.
      // Easiest: Read current profile prefs from state if we had them or just fetch-update.
      // However, to be efficient, let's assume we can push the partial update if we had a dedicated column.
      // With JSONB 'preferences', we should fetch current or keep a local 'preferences' state.

      // Quick fix: userProfile could store full preferences object? 
      // Currently userProfile interface is limited.
      // Let's do a direct Supabase raw query or fetch-update.
      const { data: current, error: fetchErr } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', userId)
        .single();

      if (!fetchErr && current) {
        const merged = { ...current.preferences, ...newPrefs };
        await supabase.from('profiles').update({ preferences: merged }).eq('id', userId);
      }
    } catch (e) {
      console.error("Error syncing preferences", e);
    }
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('gl_theme_mode');
    return saved ? saved === 'dark' : true;
  });

  const [logs, setLogs] = useState<DailyLogEntry[]>(() => {
    const saved = localStorage.getItem('gl_daily_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('gl_calendar_events');
    return saved ? JSON.parse(saved) : [];
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('gl_user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [themeColor, setThemeColor] = useState(() => {
    return localStorage.getItem('gl_theme_color') || '#f97316';
  });

  const [uiText, setUiText] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('gl_ui_translations');
    return saved ? JSON.parse(saved) : DEFAULT_UI_TEXT;
  });

  const [currentLangName, setCurrentLangName] = useState(() => {
    return localStorage.getItem('gl_current_lang_name') || 'Español';
  });

  useEffect(() => {
    // Check for errors in the URL (e.g. from Supabase auth redirects)
    const hash = window.location.hash;
    if (hash && hash.includes('error=')) {
      const params = new URLSearchParams(hash.substring(1)); // remove #
      const errorDescription = params.get('error_description');
      const error = params.get('error');
      if (error || errorDescription) {
        toast(`Error de autenticación: ${errorDescription || error}`, 'error');
        // Optionally clear hash to avoid persistent error showing
        window.location.hash = '';
      }
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        fetchUserData(session.user.id);
      }
      setLoadingInitial(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        fetchUserData(session.user.id);
      } else {
        setIsAuthenticated(false);
        setUserId(null);
      }
      setLoadingInitial(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Motivational Notifications Logic
  const MOTIVATIONAL_QUOTES = [
    "No te detengas cuando estés cansado, detente cuando hayas terminado.",
    "La disciplina es hacer lo que tienes que hacer, incluso cuando no quieres.",
    "Tu única competencia es quien eras ayer.",
    "El dolor de hoy es la fuerza de mañana.",
    "No cuentes los días, haz que los días cuenten.",
    "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
    "Si fuera fácil, todo el mundo lo haría.",
    "Asegúrate de que tu peor enemigo no viva entre tus dos orejas.",
    "Cree que puedes y estarás a medio camino.",
    "El cuerpo logra lo que la mente cree."
  ];

  useEffect(() => {
    // Check permission immediately
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const checkMotivation = () => {
      const lastNotification = localStorage.getItem('gl_last_motivation_time');
      const now = new Date().getTime();
      const HOURS_INTERVAL = 4 * 60 * 60 * 1000; // 4 hours

      if (!lastNotification || now - parseInt(lastNotification) > HOURS_INTERVAL) {
        if (Notification.permission === 'granted') {
          const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
          const quote = MOTIVATIONAL_QUOTES[randomIndex];

          new Notification("Growth Ladder: Motivación", {
            body: quote,
            icon: '/logo-new.png',
            tag: 'motivation'
          });

          localStorage.setItem('gl_last_motivation_time', now.toString());
        }
      }
    };

    // Initial check
    checkMotivation();

    // Loop check every 15 minutes
    const interval = setInterval(checkMotivation, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Notification for Calendar Events
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

      calendarEvents.forEach(event => {
        const eventDate = new Date(event.date);
        // Check if it's the same day (ignore time for date comparison)
        const isSameDay = eventDate.getDate() === now.getDate() &&
          eventDate.getMonth() === now.getMonth() &&
          eventDate.getFullYear() === now.getFullYear();

        if (isSameDay && event.time === currentTime && !event.notified) {
          if (Notification.permission === 'granted') {
            new Notification("Growth Ladder: Hora de Entrenar", {
              body: `${event.title} - ¡Vamos a darle con todo!`,
              icon: '/logo-new.png'
            });

            // Mark as notified locally to avoid double alert (cloud sync optional for this flag)
            const updatedEvents = calendarEvents.map(e => e.id === event.id ? { ...e, notified: true } : e);
            setCalendarEvents(updatedEvents);
            localStorage.setItem('gl_calendar_events', JSON.stringify(updatedEvents));
          }
        }
      });
    }, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, [calendarEvents]);

  const fetchUserData = async (uid: string) => {
    try {
      // Fetch Logs First (Needed for Level Calculation)
      const { data: dbLogs, error: logsError } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', uid)
        .order('date', { ascending: true });

      if (dbLogs) {
        const mappedLogs: DailyLogEntry[] = dbLogs.map((log: any) => ({
          date: log.date,
          calories: log.calories,
          distanceKm: log.distance_km || 0,
          mood: log.mood,
          weight: log.weight,
          bodyFat: log.body_fat,
          muscleMass: log.muscle_mass,
          waterPercent: log.water_percent
        }));
        setLogs(mappedLogs);
      }

      // Fetch Profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();

      if (profile) {
        // Load Preferences (Goals)
        if (profile.preferences) {
          const prefs = profile.preferences;
          if (prefs.selectedGoalId) {
            setSelectedGoalId(prefs.selectedGoalId);
            localStorage.setItem('gl_selected_goal_id', prefs.selectedGoalId.toString());
          }
          if (prefs.goalTargets) {
            setGoalTargets(prefs.goalTargets);
            localStorage.setItem('gl_goal_targets', JSON.stringify(prefs.goalTargets));
          }
        }

        // Calculate Gamification Metrics
        const createdAt = profile.created_at || new Date().toISOString();
        const daysMember = Math.max(1, Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)));
        const totalLogs = dbLogs ? dbLogs.length : 0;
        const goalsCompleted = profile.goals_completed || 0;

        // Formula: 10 XP/day + 50 XP/log + 500 XP/goal
        const calculatedXP = (daysMember * 10) + (totalLogs * 50) + (goalsCompleted * 500);
        const calculatedLevel = Math.floor(calculatedXP / 1000) + 1;

        const mappedProfile: UserProfile = {
          age: profile.age,
          weight: profile.weight,
          height: profile.height,
          experience: profile.experience_level as any,
          focus: profile.primary_goal as any,
          daysAvailable: profile.days_available,
          name: profile.full_name,
          profilePicture: profile.avatar_url,
          gender: profile.gender,
          createdAt: createdAt,
          level: calculatedLevel,
          xp: calculatedXP,
          goalsCompleted: goalsCompleted
        };
        setUserProfile(mappedProfile);
      }

      // Fetch Calendar Events
      const { getCalendarEvents } = await import('./services/supabase');
      const dbEvents = await getCalendarEvents(uid);
      if (dbEvents) {
        const mappedEvents: CalendarEvent[] = dbEvents.map((ev: any) => ({
          id: ev.id,
          date: ev.date,
          time: ev.time,
          title: ev.title,
          completed: ev.completed,
          notified: ev.notified
        }));
        setCalendarEvents(mappedEvents);
        localStorage.setItem('gl_calendar_events', JSON.stringify(mappedEvents));
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleUpdateEvents = async (newEvents: CalendarEvent[]) => {
    // Determine if added or removed by comparing lengths or IDs
    // Simple verification for Add/Update logic for the most recent change
    // Since this is a bulk update prop, we'll implement specific handlers inside App
    // but Tracker sends the WHOLE list. 
    // Optimization: The better approach is to modify Tracker to emit distinct actions, 
    // but to keep minimal changes, we'll sync the whole list difference or just upsert the new ones.

    // HOWEVER, to ensure reliability, we'll just update local state here
    // and rely on specific add/delete functions if we refactored Tracker, 
    // BUT since we can't easily change Tracker's interface without breaking props,
    // we will infer operation or simply update local and sync specific items if possible.

    // Current "onUpdateEvents" from Tracker replaces the entire list.
    // Let's compare to find the diff.
    const added = newEvents.filter(ne => !calendarEvents.some(ce => ce.id === ne.id));
    const removed = calendarEvents.filter(ce => !newEvents.some(ne => ne.id === ce.id));

    setCalendarEvents(newEvents);
    localStorage.setItem('gl_calendar_events', JSON.stringify(newEvents));

    if (!userId || userId === 'offline-guest-user') return;

    try {
      const { saveCalendarEvent, deleteCalendarEvent } = await import('./services/supabase');

      // Handle Added/Updated
      for (const ev of added) {
        await saveCalendarEvent({
          id: ev.id,
          user_id: userId,
          date: ev.date,
          time: ev.time,
          title: ev.title,
          completed: ev.completed,
          notified: ev.notified || false
        });
      }

      // Handle Removed
      for (const ev of removed) {
        await deleteCalendarEvent(ev.id, userId);
      }

    } catch (e) {
      console.error("Sync error calendar", e);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-500', themeColor);
    root.style.setProperty('--brand-600', themeColor);
    localStorage.setItem('gl_theme_color', themeColor);
  }, [themeColor]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove('light-mode');
      localStorage.setItem('gl_theme_mode', 'dark');
    } else {
      root.classList.add('light-mode');
      localStorage.setItem('gl_theme_mode', 'light');
    }
  }, [isDarkMode]);

  const handleLogin = () => {
    // Auth logic is handled by onAuthStateChange
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowLanding(true);
    setView(ViewState.DASHBOARD);
  };

  const handleSubscribe = (proStatus: boolean) => {
    setIsPro(proStatus);
    localStorage.setItem('gl_is_pro', String(proStatus));
    setShowPaywall(false);
  };

  const handleLanguageChange = async (langName: string) => {
    setIsTranslating(true);
    try {
      const newTranslations = await translateUI(langName, DEFAULT_UI_TEXT);
      setUiText(newTranslations);
      setCurrentLangName(langName);
      localStorage.setItem('gl_ui_translations', JSON.stringify(newTranslations));
      localStorage.setItem('gl_current_lang_name', langName);
    } catch (e) {
      toast("Error al traducir. Reintenta.", 'error');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleUpdateProfile = async (updatedProfile: UserProfile) => {
    // Update local state unconditionally (works for offline/guest)
    setUserProfile(updatedProfile);
    localStorage.setItem('gl_user_profile', JSON.stringify(updatedProfile));

    // If offline guest, stop here
    if (!userId || userId === 'offline-guest-user') {
      return;
    }

    // Prepare data for Supabase
    const dbProfile = {
      id: userId, // Required for upsert
      full_name: updatedProfile.name,
      age: updatedProfile.age,
      weight: updatedProfile.weight,
      height: updatedProfile.height,
      experience_level: updatedProfile.experience,
      primary_goal: updatedProfile.focus,
      days_available: updatedProfile.daysAvailable,
      avatar_url: updatedProfile.profilePicture,
      gender: updatedProfile.gender
    };

    // Use upsert instead of update to handle both new and existing profiles
    const { error } = await supabase
      .from('profiles')
      .upsert(dbProfile);

    if (error) {
      console.error('Error updating profile:', error);
      // Optional: don't alert the user if it's just a background sync issue, or keep it if critical
      toast('Error syncing profile to cloud.', 'warning');
    }
  };

  const handleSaveLog = async (entry: DailyLogEntry) => {
    // 1. Siempre guardar logs en estado local para UI inmediata
    setLogs(prev => {
      const existing = prev.findIndex(p => p.date === entry.date);
      if (existing >= 0) {
        const newLogs = [...prev];
        newLogs[existing] = entry;
        // Actualizar localStorage
        localStorage.setItem('gl_daily_logs', JSON.stringify(newLogs));
        return newLogs;
      }
      const newLogs = [...prev, entry];
      localStorage.setItem('gl_daily_logs', JSON.stringify(newLogs));
      return newLogs;
    });

    // 2. Si es usuario offline/guest, terminar aquí
    if (!userId || userId === 'offline-guest-user') {
      setView(ViewState.DASHBOARD);
      return;
    }

    // Save to Supabase
    const dbEntry: DatabaseLogEntry = {
      user_id: userId,
      date: entry.date,
      calories: entry.calories,
      distance_km: entry.distanceKm,
      mood: entry.mood,
      weight: entry.weight,
      body_fat: entry.bodyFat,
      muscle_mass: entry.muscleMass,
      water_percent: entry.waterPercent,
    };

    try {
      // Import this function dynamically or ensure it's imported at top-level
      const { saveWorkoutLog } = await import('./services/supabase');
      await saveWorkoutLog(dbEntry);

      // Success - local state already updated
      setView(ViewState.DASHBOARD);
    } catch (error) {
      console.error("Error syncing log to cloud", error);
      toast("Data saved locally, but cloud sync failed.", 'warning');
    }
  };

  const handleDeleteLog = (entry: DailyLogEntry) => {
    setLogs(prev => {
      const newLogs = prev.filter(l => l.date !== entry.date);
      localStorage.setItem('gl_daily_logs', JSON.stringify(newLogs));
      return newLogs;
    });
    // Todo: Sync delete with Supabase if needed
  };

  const handleStartCustomWorkout = (muscles: any[]) => {
    setCustomWorkoutMuscles(muscles);
    setView(ViewState.WORKOUT);
  };

  const mainBgClass = isPro
    ? (isDarkMode ? 'bg-black text-emerald-50' : 'bg-slate-50 text-slate-900')
    : (isDarkMode ? 'bg-brand-dark text-slate-100' : 'bg-slate-50 text-slate-900');

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={48} />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showPrivacy) {
      return <PrivacyPolicy onBack={() => setShowPrivacy(false)} />;
    }
    if (showTerms) {
      return <TermsAndConditions onClose={() => setShowTerms(false)} />;
    }
    if (showLanding) {
      return (
        <>
          {showSupport && <SupportChat isOpen={true} onClose={() => setShowSupport(false)} />}
          <LandingPage
            onGetStarted={() => setShowLanding(false)}
            onLogin={() => setShowLanding(false)}
            onPrivacy={() => setShowPrivacy(true)}
            onTerms={() => setShowTerms(true)}
            onSupport={() => setShowSupport(true)}
          />
          {/* Support FAB for Landing */}
          <button
            onClick={() => setShowSupport(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center shadow-xl border-2 border-emerald-400/50 transition-all hover:scale-105 active:scale-95 animate-in zoom-in duration-300 hover:shadow-emerald-500/20"
          >
            <Headphones size={24} className="text-white" />
          </button>
        </>
      );
    }
    return <AuthView onLogin={handleLogin} uiText={uiText} onBack={() => setShowLanding(true)} />;
  }

  return (
    <div className={`min-h-screen ${mainBgClass} font-sans transition-colors duration-500`} >
      <div className={`max-w-md mx-auto min-h-screen relative shadow-2xl overflow-hidden ${isDarkMode ? (isPro ? 'bg-black' : 'bg-brand-dark') : 'bg-white'}`}>

        {/* Paywall Modal */}
        {showPaywall && (
          <SubscriptionModal
            onClose={() => setShowPaywall(false)}
            onSubscribe={handleSubscribe}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Translation Overlay */}
        {isTranslating && (
          <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center animate-fade-in">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-brand-500 blur-3xl opacity-20 animate-pulse"></div>
              <div className="w-24 h-24 rounded-3xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center relative">
                <Loader2 size={48} className="text-brand-500 animate-spin" />
              </div>
            </div>
            <h3 className="text-white font-black italic uppercase tracking-tighter text-xl mb-2 flex items-center gap-2">
              <Sparkles className="text-brand-500" /> {uiText.traduciendo}
            </h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Growth Ladder Engine</p>
          </div>
        )}

        {view !== ViewState.CHAT && view !== ViewState.SUPPORT && (
          <>
            <button
              onClick={() => setView(ViewState.CHAT)}
              className="fixed bottom-36 right-5 z-40 w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg border border-emerald-400 transition-transform active:scale-95 animate-in zoom-in"
            >
              <SportyRobotIcon size={28} className="text-white" />
            </button>
            <button
              onClick={() => setView(ViewState.SUPPORT)}
              className="fixed bottom-52 right-5 z-40 w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center shadow-lg border border-zinc-600 transition-transform active:scale-95 animate-in zoom-in delay-100"
            >
              <Headphones size={20} className="text-white" />
            </button>
          </>
        )}

        <main className="p-5 h-full overflow-y-auto pt-safe pb-32">
          {view === ViewState.DASHBOARD && (
            <Dashboard
              logs={logs}
              isPro={isPro}
              togglePro={() => isPro ? setIsPro(false) : setShowPaywall(true)}
              onDeleteDate={() => { }}
              onChangeThemeColor={setThemeColor}
              setView={setView}
              uiText={uiText}
              selectedGoalId={selectedGoalId}
              onSelectGoal={handleSetGoal}
              customTargets={goalTargets}
              onUpdateTarget={handleUpdateGoalTarget}
              userProfile={userProfile}
              onLogout={handleLogout}
            />
          )}
          {view === ViewState.WORKOUT && (
            <WorkoutAI
              isPro={isPro}
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              onSaveLog={handleSaveLog}
              initialMuscles={customWorkoutMuscles.length > 0 ? customWorkoutMuscles : undefined}
            />
          )}
          {view === ViewState.SETTINGS && (
            <SettingsView
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              setView={setView}
              isPro={isPro}
              isDarkMode={isDarkMode}
              toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              onChangeThemeColor={setThemeColor}
              onLanguageChange={handleLanguageChange}
              currentLangName={currentLangName}
              uiText={uiText}
              onLogout={handleLogout}
              userId={userId} // Passing ID for avatar upload
            />
          )}
          {view === ViewState.COMMUNITY && (
            <CommunityView
              setView={setView}
              isPro={isPro}
              uiText={uiText}
            />
          )}
          {view === ViewState.LOG && <Tracker logs={logs} userProfile={userProfile} onUpdateProfile={handleUpdateProfile} onSave={handleSaveLog} onDeleteLog={handleDeleteLog} isPro={isPro} calendarEvents={calendarEvents} onUpdateEvents={handleUpdateEvents} />}
          {view === ViewState.GUIDE && (
            <MuscleWiki
              isPro={isPro}
              onStartWorkout={handleStartCustomWorkout}
              userProfile={userProfile}
              currentGoal={GOAL_OPTIONS.find(g => g.id === selectedGoalId)}
            />
          )}
          {view === ViewState.ACHIEVEMENTS && <Achievements logs={logs} setView={setView} isPro={isPro} />}
          {view === ViewState.CHAT && <AICoachChat userProfile={userProfile} isPro={isPro} />}
          {view === ViewState.SCANNER && <FoodScanner onSave={handleSaveLog} isPro={isPro} />}
          {view === ViewState.RECIPES && <ChefChat userProfile={userProfile} />}
          <SupportChat isOpen={view === ViewState.SUPPORT} onClose={() => setView(ViewState.DASHBOARD)} />
        </main>

        <Navigation currentView={view} setView={setView} isPro={isPro} uiText={uiText} />
      </div>
    </div >
  );
}
