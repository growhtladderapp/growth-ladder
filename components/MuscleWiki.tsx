import React, { useState, useMemo } from 'react';
import { getMuscleGuide, getSportGuide } from '../services/geminiService';
import { MuscleGroup, MuscleGuide, SportGuide, UserProfile, WeeklyGoalOption } from '../types';
import { ChevronLeft, Dumbbell, ArrowRight, PlayCircle, AlertTriangle, Medal, Search, Layers, ScanLine, Box, Info, Aperture, X, Home, Building2 } from 'lucide-react';

type Category = 'MUSCLE' | 'SPORT';

interface MuscleWikiProps {
  isPro?: boolean;
  onStartWorkout?: (muscles: MuscleGroup[]) => void;
  userProfile: UserProfile | null;
  currentGoal?: WeeklyGoalOption;
}

// Extensive list of sports categorized
const SPORTS_DATA: Record<string, string[]> = {
  "Populares": [
    "Fútbol", "Baloncesto", "Tenis", "Running", "CrossFit", "Natación", "Voleibol", "Pádel", "Gimnasio", "Yoga"
  ],
  "Equipos": [
    "Rugby", "Fútbol Americano", "Balonmano", "Hockey", "Waterpolo", "Béisbol", "Cricket"
  ],
  "Deportes de Combate": [
    "Boxeo", "MMA", "Muay Thai", "Judo", "Karate", "Jiu-Jitsu", "Taekwondo", "Lucha Libre", "Esgrima"
  ],
  "Raqueta": [
    "Tenis", "Pádel", "Bádminton", "Squash", "Ping Pong", "Frontón"
  ],
  "Individuales": [
    "Golf", "Gimnasia", "Ciclismo", "Escalada", "Atletismo", "Triatlón", "Halterofilia", "Powerlifting", "Calistenia"
  ],
  "Acuáticos": [
    "Natación", "Surf", "Kitesurf", "Remo", "Piragüismo", "Buceo", "Snorkel"
  ],
  "Invierno": [
    "Esquí", "Snowboard", "Patinaje sobre Hielo", "Hockey sobre Hielo", "Curling"
  ],
  "Motor y Extremos": [
    "Fórmula 1", "Motociclismo", "Rally", "Karting", "Motocross", "BMX", "Skateboarding", "Patinaje en Línea", "Paracaidismo", "Puenting"
  ]
};

const ALL_CATEGORIES = Object.keys(SPORTS_DATA);

export const MuscleWiki: React.FC<MuscleWikiProps> = ({ isPro = false, onStartWorkout, userProfile, currentGoal }) => {
  const [activeTab, setActiveTab] = useState<Category>('MUSCLE');
  // New Environment State
  const [environment, setEnvironment] = useState<'home' | 'gym'>('gym');

  // Selection State
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  // Custom Workout Selection
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [customSelection, setCustomSelection] = useState<Set<MuscleGroup>>(new Set());

  // Data State
  const [muscleGuide, setMuscleGuide] = useState<MuscleGuide | null>(null);
  const [sportGuide, setSportGuide] = useState<SportGuide | null>(null);

  // Sports Filter State
  const [activeSportCategory, setActiveSportCategory] = useState<string>("Populares");
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(false);

  // Theme Constants
  const accentColor = isPro ? 'text-emerald-500' : 'text-brand-500';
  const accentColorLight = isPro ? 'text-emerald-400' : 'text-brand-400';
  const bgAccent = isPro ? 'bg-emerald-600' : 'bg-brand-600';
  const hoverBgAccent = isPro ? 'group-hover:bg-emerald-500' : 'group-hover:bg-brand-500';
  const borderAccent = isPro ? 'border-emerald-500' : 'border-brand-500';
  const hoverBorderAccent = isPro ? 'hover:border-emerald-500/50' : 'hover:border-brand-500/50';
  const focusBorderAccent = isPro ? 'focus:border-emerald-500' : 'focus:border-brand-500';
  const shadowAccent = isPro ? 'hover:shadow-emerald-500/20' : 'hover:shadow-brand-500/20';

  // Filter sports based on search query (flattens the object)
  const filteredSports = useMemo(() => {
    if (!searchQuery) return [];

    // Get all sports in a single list
    const allSports = Array.from(new Set(Object.values(SPORTS_DATA).flat()));
    return allSports.filter(s =>
      s.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectMuscle = async (m: MuscleGroup) => {
    if (isSelectionMode) {
      setCustomSelection(prev => {
        const next = new Set(prev);
        if (next.has(m)) next.delete(m);
        else next.add(m);
        return next;
      });
      return;
    }

    setSelectedMuscle(m);
    setLoading(true);
    setMuscleGuide(null);
    try {
      // Pass environment context
      const data = await getMuscleGuide(m, userProfile, currentGoal, environment);
      setMuscleGuide(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSport = async (sportName: string) => {
    setSelectedSport(sportName);
    setLoading(true);
    setSportGuide(null);
    try {
      // Pass environment context (optional for sports but good consistency)
      const data = await getSportGuide(sportName, userProfile, currentGoal, environment);
      setSportGuide(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedMuscle(null);
    setSelectedSport(null);
    setMuscleGuide(null);
    setSportGuide(null);
  };
  const SPORT_IMAGES: Record<string, string> = {
    // Populares
    "fútbol": "https://images.unsplash.com/photo-1579952363873-27f3bde9be51?q=80&w=1000&auto=format&fit=crop",
    "baloncesto": "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop",
    "tenis": "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1000&auto=format&fit=crop",
    "running": "https://images.unsplash.com/photo-1502904550040-7534597429ae?q=80&w=1000&auto=format&fit=crop",
    "crossfit": "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1000&auto=format&fit=crop",
    "natación": "https://images.unsplash.com/photo-1600965962102-9d260a304c63?q=80&w=1000&auto=format&fit=crop",
    "voleibol": "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1000&auto=format&fit=crop",
    "pádel": "https://images.unsplash.com/photo-1632517594958-86d49cb075d1?q=80&w=1000&auto=format&fit=crop",
    "gimnasio": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
    "yoga": "https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=1000&auto=format&fit=crop",

    // Equipos
    "rugby": "https://images.unsplash.com/photo-1531053326607-9d349096d887?q=80&w=1000&auto=format&fit=crop",
    "fútbol americano": "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=1000&auto=format&fit=crop",
    "balonmano": "https://images.unsplash.com/photo-1517486430290-35657bd05532?q=80&w=1000&auto=format&fit=crop",
    "hockey": "https://images.unsplash.com/photo-1580748141549-7174bcd862bf?q=80&w=1000&auto=format&fit=crop",
    "waterpolo": "https://images.unsplash.com/photo-1553603227-2358e579bd51?q=80&w=1000&auto=format&fit=crop",

    // Deportes de Combate
    "boxeo": "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1000&auto=format&fit=crop",
    "mma": "https://images.unsplash.com/photo-1544117519-31a4b71922bb?q=80&w=1000&auto=format&fit=crop",
    "muay thai": "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=1000&auto=format&fit=crop",
    "judo": "https://images.unsplash.com/photo-1616248231268-0744cb89d53c?q=80&w=1000&auto=format&fit=crop",
    "karate": "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=1000&auto=format&fit=crop",
    "jiu-jitsu": "https://images.unsplash.com/photo-1615118266750-b4998317e13a?q=80&w=1000&auto=format&fit=crop",

    // Raqueta
    "bádminton": "https://images.unsplash.com/photo-1626224583764-8478ab2e0585?q=80&w=1000&auto=format&fit=crop",
    "squash": "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=1000&auto=format&fit=crop",
    "ping pong": "https://images.unsplash.com/photo-1534158914592-0629928be94c?q=80&w=1000&auto=format&fit=crop",

    // Individuales
    "golf": "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1000&auto=format&fit=crop",
    "gimnasia": "https://images.unsplash.com/photo-1599407335272-9cc981316ee6?q=80&w=1000&auto=format&fit=crop",
    "ciclismo": "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000&auto=format&fit=crop",
    "escalada": "https://images.unsplash.com/photo-1547483954-98e3b4886734?q=80&w=1000&auto=format&fit=crop",
    "atletismo": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000&auto=format&fit=crop",

    // Motor y Extremos
    "fórmula 1": "https://images.unsplash.com/photo-1574515570532-680c44ad1404?q=80&w=1000&auto=format&fit=crop",
    "motociclismo": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop",
    "rally": "https://images.unsplash.com/photo-1536746803623-4b68e0d4cc01?q=80&w=1000&auto=format&fit=crop",
    "motocross": "https://images.unsplash.com/photo-1516209322258-0cb933703c14?q=80&w=1000&auto=format&fit=crop",
    "bmx": "https://images.unsplash.com/photo-1598282361138-05c316275813?q=80&w=1000&auto=format&fit=crop",
    "skateboarding": "https://images.unsplash.com/photo-1520045864981-8c4750c99778?q=80&w=1000&auto=format&fit=crop",
    "surf": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=1000&auto=format&fit=crop",
  };

  const getImage = (key: string, type: Category, categoryContext?: string) => {
    if (type === 'MUSCLE') {
      switch (key) {
        case MuscleGroup.CHEST: return '/chest-cover.jpg';
        case MuscleGroup.BACK: return '/back-cover.jpg';
        case MuscleGroup.ARMS: return 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop';
        case MuscleGroup.LEGS: return '/legs-cover.jpg';
        case MuscleGroup.ABS: return '/abs-cover.jpg';
        case MuscleGroup.SHOULDERS: return 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000&auto=format&fit=crop';
        default: return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop';
      }
    } else {
      const k = key.toLowerCase();
      if (SPORT_IMAGES[k]) return SPORT_IMAGES[k];
      if (k.includes('fútbol') || k.includes('soccer')) return SPORT_IMAGES['fútbol'];
      if (k.includes('basket') || k.includes('baloncesto')) return SPORT_IMAGES['baloncesto'];
      if (k.includes('nadar') || k.includes('agua')) return SPORT_IMAGES['natación'];
      if (k.includes('fight') || k.includes('lucha')) return SPORT_IMAGES['mma'];

      const cat = categoryContext || "";
      if (cat.includes('Acuáticos')) return 'https://images.unsplash.com/photo-1534093607318-f025419f49ff?q=80&w=1000&auto=format&fit=crop';
      if (cat.includes('Invierno')) return 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1000&auto=format&fit=crop';
      if (cat.includes('Combate')) return 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=1000&auto=format&fit=crop';
      if (cat.includes('Raqueta')) return 'https://images.unsplash.com/photo-1622163642998-1ea14b60c57e?q=80&w=1000&auto=format&fit=crop';
      if (cat.includes('Motor')) return 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop';
      return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000&auto=format&fit=crop';
    }
  };

  const getYoutubeLink = (exerciseName: string) => {
    return `https://www.youtube.com/results?search_query=tecnica+correcta+${exerciseName.replace(/ /g, '+')}`;
  };

  const renderDetailView = () => {
    const isMuscle = activeTab === 'MUSCLE';
    const guide = isMuscle ? muscleGuide : sportGuide;
    const title = isMuscle ? selectedMuscle : selectedSport;
    const imgUrl = getImage(title as string, activeTab, isMuscle ? undefined : "Populares");

    if (!guide && !loading) return <div className="text-center text-slate-500 mt-10">Error al cargar datos.</div>;

    return (
      <div className="flex flex-col h-full pb-20 animate-fade-in">
        <button
          onClick={handleBack}
          className={`flex items-center gap-2 ${accentColor} mb-4 font-semibold hover:opacity-80 transition-opacity z-10`}
        >
          <ChevronLeft size={20} /> Volver a la lista
        </button>

        <div className="relative h-64 rounded-2xl overflow-hidden mb-6 shadow-2xl border border-slate-700 bg-black group">
          <img
            src={imgUrl}
            alt={title as string}
            className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,255,110,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>

          <div className="absolute top-4 right-4 animate-pulse">
            <Aperture className={`${accentColor} opacity-50`} size={32} />
          </div>
          <div className={`absolute top-4 left-4 border ${isPro ? 'border-emerald-500/30' : 'border-brand-500/30'} bg-black/40 px-2 py-1 rounded text-[10px] ${accentColorLight} font-mono tracking-widest uppercase backdrop-blur-md`}>
            Análisis Biomecánico
          </div>

          <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black via-black/80 to-transparent">
            <div className="flex items-center gap-2 mb-1">
              {isMuscle ? <Box size={16} className={accentColor} /> : <Medal size={16} className={accentColor} />}
              <span className={`text-[10px] ${bgAccent} px-2 py-0.5 rounded text-white font-bold uppercase tracking-widest`}>
                {isMuscle ? 'Grupo Muscular' : 'Deporte'}
              </span>
            </div>
            <h1 className="text-4xl font-black text-white leading-none drop-shadow-md capitalize tracking-tighter">{title}</h1>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${borderAccent} border-r-2 border-r-transparent`}></div>
            <p className={`${accentColorLight} animate-pulse text-center px-6 text-xs font-mono uppercase tracking-widest`}>
              {isMuscle ? "Cargando Biomecánica..." : `Analizando ${title} con IA...`}
            </p>
          </div>
        ) : (
          <div className="space-y-6 overflow-y-auto pr-1">
            <div className={`bg-slate-900/80 p-5 rounded-xl border-l-4 ${borderAccent} shadow-lg backdrop-blur-sm relative overflow-hidden`}>
              <div className="absolute -right-4 -top-4 opacity-10">
                <ScanLine size={100} />
              </div>
              <h3 className={`${accentColorLight} font-bold uppercase text-xs mb-3 tracking-wider flex items-center gap-2`}>
                <Info size={14} />
                {isMuscle ? 'Ficha Técnica' : 'Enfoque del Entrenamiento'}
              </h3>
              <p className="text-slate-200 leading-relaxed text-sm font-medium">
                {guide?.introduction}
              </p>
            </div>

            <h2 className="text-lg font-bold text-white flex items-center gap-2 mt-4">
              <Dumbbell size={20} className={accentColor} />
              Ejecución Técnica
            </h2>

            <div className="space-y-4">
              {guide?.exercises?.map((ex, idx) => (
                <div key={idx} className={`bg-brand-card rounded-xl overflow-hidden border border-slate-700 shadow-lg group ${hoverBorderAccent} transition-colors`}>
                  <div className="bg-slate-900/50 p-3 border-b border-slate-700 flex justify-between items-center">
                    <span className="text-white font-bold text-sm tracking-wide">{ex.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${ex.difficulty === 'Principiante' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      ex.difficulty === 'Intermedio' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                      {ex.difficulty}
                    </span>
                  </div>

                  <div className="p-4 relative">
                    <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-700"></div>

                    {ex.gifUrl && (
                      <div className="mb-4 rounded-lg overflow-hidden shadow-lg border border-slate-700 relative group/gif">
                        <img src={ex.gifUrl} alt={ex.name} className="w-full h-auto object-cover" />
                        <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white font-mono uppercase tracking-widest backdrop-blur-sm flex items-center gap-1">
                          <PlayCircle size={10} className={accentColorLight} /> GIF
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <ul className="space-y-3 relative z-10">
                        {ex.instructions.map((step, i) => (
                          <li key={i} className="flex gap-3 text-xs text-slate-300 leading-snug items-start">
                            <span className={`flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[10px] font-bold ${accentColorLight} mt-[-2px] shadow-sm`}>
                              {i + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-700/50">
                      <div className="flex gap-2 items-start text-orange-400 bg-orange-400/5 p-2 rounded border border-orange-400/10">
                        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                        <div className="text-[11px]">
                          <span className="font-bold block mb-0.5 text-orange-300 uppercase text-[9px]">Error Común:</span>
                          {ex.commonError}
                        </div>
                      </div>
                    </div>
                  </div>

                  <a
                    href={getYoutubeLink(ex.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block bg-slate-800 hover:bg-slate-700 py-3 text-center text-xs ${accentColorLight} font-bold uppercase tracking-wide border-t border-slate-700 transition-colors flex items-center justify-center gap-2`}
                  >
                    <PlayCircle size={14} /> Ver Referencia Visual
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- MAIN LIST VIEW ---
  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Guía de Entrenamiento</h1>
          <p className="text-slate-400 text-sm">Selecciona una categoría para ver guías especializadas.</p>
        </div>
      </header>

      {/* ENVIRONMENT TOGGLE */}
      <div className="bg-slate-800/50 p-1 rounded-xl border border-slate-700 flex relative">
        <button
          onClick={() => setEnvironment('gym')}
          className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${environment === 'gym' ? `${bgAccent} text-white shadow` : 'text-slate-400 hover:text-white'}`}
        >
          <Building2 size={16} /> Entrenar en Gimnasio
        </button>
        <button
          onClick={() => setEnvironment('home')}
          className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${environment === 'home' ? `${bgAccent} text-white shadow` : 'text-slate-400 hover:text-white'}`}
        >
          <Home size={16} /> Entrenar en Casa
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-500" />
        </div>
        <input
          type="text"
          placeholder="Buscar deporte (ej. Tenis, Yoga)..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (activeTab !== 'SPORT' && e.target.value.length > 0) setActiveTab('SPORT');
          }}
          className={`w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-10 focus:outline-none ${focusBorderAccent} transition-all placeholder:text-slate-500`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Main Mode Tabs (Hidden if searching) */}
      {!searchQuery && (
        <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700 mb-4 relative">
          <button
            onClick={() => setActiveTab('MUSCLE')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'MUSCLE' ? `${bgAccent} text-white shadow` : 'text-slate-400 hover:text-white'}`}
          >
            Anatomía Muscular
          </button>
          <button
            onClick={() => setActiveTab('SPORT')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'SPORT' ? `${bgAccent} text-white shadow` : 'text-slate-400 hover:text-white'}`}
          >
            Deportes (+150)
          </button>
        </div>
      )}

      {/* SELECTION MODE TOGGLE */}
      {activeTab === 'MUSCLE' && !searchQuery && (
        <div className="flex justify-between items-center px-1">
          <button
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              setCustomSelection(new Set());
            }}
            className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${isSelectionMode ? `${bgAccent} text-white border-transparent` : 'bg-slate-800 text-slate-400 border-slate-700'}`}
          >
            {isSelectionMode ? 'Cancelar Selección' : 'Seleccionar Varios'}
          </button>

          {isSelectionMode && customSelection.size > 0 && onStartWorkout && (
            <button
              onClick={() => onStartWorkout(Array.from(customSelection))}
              className={`text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-lg bg-white text-black shadow-lg animate-in zoom-in`}
            >
              ¡Entrenar ({customSelection.size})!
            </button>
          )}
        </div>
      )}

      {activeTab === 'MUSCLE' && !searchQuery ? (
        <div className="grid grid-cols-1 gap-4">
          {Object.values(MuscleGroup).filter(m =>
            m !== MuscleGroup.FULL_BODY &&
            m !== MuscleGroup.UPPER &&
            m !== MuscleGroup.LOWER
          ).map((m) => {
            const isSelected = customSelection.has(m);
            return (
              <button
                key={m}
                onClick={() => handleSelectMuscle(m)}
                className={`relative overflow-hidden w-full h-24 rounded-2xl group shadow-lg border transition-all ${isSelected ? `border-white scale-[1.02] ring-2 ring-white/50` : `border-slate-800 ${hoverBorderAccent} ${shadowAccent}`}`}
              >
                <img src={getImage(m, 'MUSCLE')} alt={m} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                <div className={`absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent ${isSelected ? 'opacity-80 mix-blend-multiply' : ''}`}></div>
                <div className="absolute inset-0 flex items-center justify-between p-5">
                  <div className="text-left">
                    <span className="block text-2xl font-bold text-white mb-1 drop-shadow-md">{m}</span>
                    {isSelected && <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded font-bold uppercase">Seleccionado</span>}
                  </div>
                  <div className={`p-2 rounded-full backdrop-blur-sm border transition-colors ${isSelected ? 'bg-white border-white text-black' : `bg-white/10 border-white/20 text-white ${hoverBgAccent} group-hover:border-transparent`}`}>
                    {isSelected ? <PlayCircle size={18} fill="currentColor" /> : <ArrowRight size={18} />}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Search Results vs Categories */}
          {!searchQuery ? (
            <>
              <div className="overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
                <div className="flex gap-2 w-max">
                  {ALL_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveSportCategory(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${activeSportCategory === cat
                        ? `${bgAccent} text-white ${borderAccent} shadow-lg`
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 animate-fade-in">
                {SPORTS_DATA[activeSportCategory]?.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSelectSport(s)}
                    className={`relative overflow-hidden rounded-xl h-24 group border border-slate-700/50 ${hoverBorderAccent} transition-all`}
                  >
                    <img
                      src={getImage(s, 'SPORT', activeSportCategory)}
                      alt={s}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-80 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-3">
                      <p className="text-white font-bold text-sm leading-tight drop-shadow-md">{s}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            // Search Results Render
            <div className="animate-fade-in">
              <p className="text-slate-400 text-xs font-bold uppercase mb-3">Resultados de búsqueda ({filteredSports.length})</p>
              {filteredSports.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {filteredSports.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSelectSport(s)}
                      className={`relative overflow-hidden rounded-xl h-24 group border border-slate-700/50 ${hoverBorderAccent} transition-all`}
                    >
                      <img
                        src={getImage(s, 'SPORT')}
                        alt={s}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-80 grayscale group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 w-full p-3">
                        <p className="text-white font-bold text-sm leading-tight drop-shadow-md">{s}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                  <Search size={32} className="mx-auto text-slate-600 mb-2" />
                  <p className="text-slate-400 text-sm">No encontramos "{searchQuery}"</p>
                  <p className="text-slate-600 text-xs mt-1">Intenta con otro término (ej. "CrossFit")</p>
                </div>
              )}
            </div>
          )}

          {!searchQuery && (
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 text-center mt-4">
              <Layers className="mx-auto text-slate-500 mb-2" size={24} />
              <p className="text-xs text-slate-400">
                Explorando {SPORTS_DATA[activeSportCategory]?.length || 0} modos en <span className={`${accentColorLight} font-bold`}>{activeSportCategory}</span>.
              </p>
              <p className="text-[10px] text-slate-500 mt-1">Impulsado por Gemini AI</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};