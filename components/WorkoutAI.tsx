
import React, { useState, useEffect, useRef } from 'react';
import { generatePersonalizedRoutine } from '../services/geminiService';
import { Routine, MuscleGroup, UserProfile, DailyLogEntry } from '../types';
import { useToast } from '../components/ToastContext';
import { CheckCircle2, AlertCircle, User, Scale, Ruler, Calendar, Trophy, Star, Sparkles, Trash2, Repeat, Share2, Save, PenSquare, X, BatteryCharging, Settings, Dumbbell, Clock, Target, Loader2, Camera } from 'lucide-react';

interface WorkoutAIProps {
  isPro?: boolean;
  userProfile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile) => void;
  onSaveLog: (entry: DailyLogEntry) => void;
  initialMuscles?: MuscleGroup[];
}

const STORAGE_KEY = 'gl_definitive_routine';
const WORKOUT_COMPLETED_KEY = 'gl_last_workout_completed';

export const WorkoutAI: React.FC<WorkoutAIProps> = ({ isPro = false, userProfile, onUpdateProfile, onSaveLog, initialMuscles }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [muscle, setMuscle] = useState<MuscleGroup>(MuscleGroup.UPPER);
  const [isRecovery, setIsRecovery] = useState(false);
  const [environment, setEnvironment] = useState<'home' | 'gym'>('gym');

  const [isEditing, setIsEditing] = useState(false);
  const [regAge, setRegAge] = useState('');
  const [regWeight, setRegWeight] = useState('');
  const [regHeight, setRegHeight] = useState('');
  const [regExp, setRegExp] = useState<UserProfile['experience']>('Beginner');
  const [regFocus, setRegFocus] = useState<UserProfile['focus']>('Muscle Gain');
  const [regGender, setRegGender] = useState<UserProfile['gender']>('Masculino');
  const [regAvatar, setRegAvatar] = useState<string | undefined>(undefined);

  // Auto-generation trigger if initialMuscles provided
  useEffect(() => {
    if (initialMuscles && initialMuscles.length > 0 && userProfile && !routine && !loading) {
      // Only trigger if we don't have a routine loaded (or if we want to override)
      // Let's force generate if initialMuscles are passed to ensure user gets what they asked for
      setMuscle(MuscleGroup.FULL_BODY); // UI placeholder
      handleGenerateCustom(initialMuscles);
    }
  }, [initialMuscles, userProfile]);

  useEffect(() => {
    const savedRoutine = localStorage.getItem(STORAGE_KEY);
    if (savedRoutine) {
      try {
        setRoutine(JSON.parse(savedRoutine));
      } catch (e) {
        console.error("Error loading routine", e);
      }
    }
  }, []);

  useEffect(() => {
    if (userProfile) {
      setRegAge(userProfile.age.toString());
      setRegWeight(userProfile.weight.toString());
      setRegHeight(userProfile.height.toString());
      setRegExp(userProfile.experience);
      setRegFocus(userProfile.focus);
      setRegGender(userProfile.gender || 'Masculino');
      setRegAvatar(userProfile.profilePicture);
    } else {
      setIsEditing(true);
    }
  }, [userProfile]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterProfile = () => {
    if (!regAge || !regWeight || !regHeight) {
      toast("Por favor completa todos los campos biométricos.", 'warning');
      return;
    }

    onUpdateProfile({
      age: parseInt(regAge),
      weight: parseFloat(regWeight),
      height: parseFloat(regHeight),
      experience: regExp,
      focus: regFocus,
      gender: regGender,
      daysAvailable: 3,
      profilePicture: regAvatar
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 1500);
  };

  const handleGenerateCustom = async (customMuscles: MuscleGroup[]) => {
    setLoading(true);
    setRoutine(null);
    setCompletedExercises(new Set());

    try {
      const result = await generatePersonalizedRoutine(
        { experience: userProfile!.experience, focus: userProfile!.focus as any, daysAvailable: 3 },
        {
          age: userProfile!.age,
          weight: userProfile!.weight,
          height: userProfile!.height
        },
        customMuscles,
        environment
      );

      setRoutine(result);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    } catch (e) {
      console.error(e);
      toast("Error generando rutina personalizada.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!userProfile) {
      setIsEditing(true);
      return;
    }

    setLoading(true);
    setRoutine(null);
    setCompletedExercises(new Set());

    const effectiveFocus = isRecovery && isPro ? 'Active Recovery' : userProfile.focus;
    const effectiveMuscle = isRecovery && isPro ? MuscleGroup.FULL_BODY : muscle;

    try {
      const result = await generatePersonalizedRoutine(
        { experience: userProfile.experience, focus: effectiveFocus as any, daysAvailable: 3 },
        {
          age: userProfile.age,
          weight: userProfile.weight,
          height: userProfile.height
        },
        effectiveMuscle,
        environment
      );

      setRoutine(result);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    } catch (e) {
      console.error(e);
      toast("Hubo un error al conectar con la IA de entrenamiento. Inténtalo de nuevo.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteRoutine = () => {
    if (confirm("¿Borrar rutina actual?")) {
      setRoutine(null);
      localStorage.removeItem(STORAGE_KEY);
      setCompletedExercises(new Set());
    }
  };

  const toggleExercise = (index: number) => {
    const newSet = new Set(completedExercises);
    if (newSet.has(index)) newSet.delete(index);
    else newSet.add(index);
    setCompletedExercises(newSet);
  };

  const finishWorkout = () => {
    if (completedExercises.size === 0) {
      toast("Marca ejercicios completados.", 'warning');
      return;
    }
    if (completedExercises.size < (routine?.exercises?.length || 0)) {
      if (!confirm('¿Terminar sin completar todo?')) return;
    }

    const estimatedCalories = completedExercises.size * 75;
    onSaveLog({
      date: new Date().toISOString(),
      calories: estimatedCalories,
      distanceKm: 0,
      mood: 5,
      weight: userProfile?.weight || 0
    });

    localStorage.setItem(WORKOUT_COMPLETED_KEY, new Date().toISOString());
    setShowCelebration(true);

    // Reset routine state after a delay or immediately, 
    // but here we wait for the celebration modal to be closed by user
    // Actually, we want to reset it so the user goes back to generation screen.
    // We'll clean the storage right now.
    localStorage.removeItem(STORAGE_KEY);
    setRoutine(null);
    setCompletedExercises(new Set());
  };

  const accentColor = isPro ? 'text-emerald-500' : 'text-brand-500';
  const bgAccent = isPro ? 'bg-emerald-600' : 'bg-brand-600';
  const glowClass = isPro ? 'shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'shadow-[0_0_20px_rgba(249,115,22,0.5)]';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-pulse">
        <div className="relative">
          <div className={`absolute inset-0 blur-2xl opacity-20 ${bgAccent}`}></div>
          <Loader2 className={`animate-spin relative z-10 ${accentColor}`} size={64} />
        </div>
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Diseñando Plan Maestro...</h3>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Analizando Biometría y Objetivos</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="pb-20 pt-4 animate-fade-in">
        <div className="bg-zinc-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          {saveSuccess && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
              <CheckCircle2 size={60} className="text-emerald-500 mb-4" />
              <h3 className="text-white font-bold text-xl uppercase tracking-widest">Perfil Guardado</h3>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <User className={accentColor} /> Perfil del Atleta
            </h2>
            {userProfile && (
              <button onClick={() => setIsEditing(false)} className="text-slate-500 p-1">
                <X size={20} />
              </button>
            )}
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className={`w-24 h-24 rounded-2xl ${bgAccent} flex items-center justify-center border-4 border-slate-800 ${glowClass} shrink-0 rotate-3 overflow-hidden transition-all duration-500 group-hover:rotate-0`}>
                {regAvatar ? (
                  <img src={regAvatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="text-white" size={48} />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-white text-black p-2 rounded-full shadow-lg border border-slate-300 hover:scale-110 active:scale-95 transition-all z-20"
              >
                <Camera size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-4 tracking-widest">Imagen de Atleta</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Peso (kg)</label>
                <input type="number" value={regWeight} onChange={e => setRegWeight(e.target.value)} className="w-full bg-black border border-slate-700 rounded-lg p-3 text-white focus:border-brand-500 outline-none" placeholder="70" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Altura (cm)</label>
                <input type="number" value={regHeight} onChange={e => setRegHeight(e.target.value)} className="w-full bg-black border border-slate-700 rounded-lg p-3 text-white focus:border-brand-500 outline-none" placeholder="175" />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Edad</label>
              <input type="number" value={regAge} onChange={e => setRegAge(e.target.value)} className="w-full bg-black border border-slate-700 rounded-lg p-3 text-white focus:border-brand-500 outline-none" placeholder="25" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase mb-2 block">Nivel</label>
              <div className="grid grid-cols-3 gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                  <button key={lvl} onClick={() => setRegExp(lvl as any)} className={`py-2 rounded-lg text-[10px] font-bold uppercase border ${regExp === lvl ? `${bgAccent} text-white border-transparent` : 'bg-transparent text-slate-400 border-slate-700'}`}>{lvl}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase mb-2 block">Objetivo</label>
              <div className="grid grid-cols-3 gap-2">
                {['Muscle Gain', 'Weight Loss', 'Endurance'].map(foc => (
                  <button key={foc} onClick={() => setRegFocus(foc as any)} className={`py-2 rounded-lg text-[10px] font-bold uppercase border ${regFocus === foc ? `${bgAccent} text-white border-transparent` : 'bg-transparent text-slate-400 border-slate-700'}`}>{foc === 'Muscle Gain' ? 'Músculo' : foc === 'Weight Loss' ? 'Grasa' : 'Cardio'}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase mb-2 block">Género</label>
              <div className="grid grid-cols-3 gap-2">
                {['Masculino', 'Femenino', 'Otro'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setRegGender(g as any)}
                    className={`py-2 rounded-lg text-[10px] font-bold uppercase border ${regGender === g ? `${bgAccent} text-white border-transparent` : 'bg-transparent text-slate-400 border-slate-700'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleRegisterProfile} className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider mt-4 flex items-center justify-center gap-2 ${bgAccent} text-white shadow-lg transition-all active:scale-95`}>
              <Save size={18} /> Guardar Perfil
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="pb-20 pt-4 space-y-6 animate-fade-in">
        <div className="bg-zinc-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-4 mb-6 p-4 bg-black/40 rounded-xl border border-slate-800">
            <div className={`w-14 h-14 rounded-xl ${bgAccent} ${glowClass} flex items-center justify-center border-2 border-slate-700 shrink-0 overflow-hidden`}>
              {userProfile?.profilePicture ? (
                <img src={userProfile.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="text-white" size={24} />
              )}
            </div>
            <div>
              <h3 className="text-white font-bold uppercase tracking-tighter italic">Status: <span className={accentColor}>Preparado</span></h3>
              <p className="text-[10px] text-slate-500 font-black uppercase">{userProfile?.focus}</p>
            </div>
            <button onClick={() => setIsEditing(true)} className="ml-auto p-2 text-slate-500 hover:text-white transition-colors">
              <PenSquare size={20} />
            </button>
          </div>

          <h2 className="text-2xl font-black text-white mb-2 italic">ENTRENAMIENTO <span className={accentColor}>TOP</span></h2>
          <p className="text-slate-400 text-sm mb-6">Selecciona qué parte del cuerpo vas a destruir hoy.</p>
          <div className="space-y-3">
            {[
              { id: MuscleGroup.UPPER, label: 'Tren Superior', icon: '💪', desc: 'Pecho, Espalda, Hombros y Brazos' },
              { id: MuscleGroup.LOWER, label: 'Tren Inferior', icon: '🦵', desc: 'Cuádriceps, Isquios, Glúteos y Piernas' },
              { id: MuscleGroup.FULL_BODY, label: 'Cuerpo Completo', icon: '🔥', desc: 'Activación metabólica total' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMuscle(m.id)}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all duration-200 active:scale-95 ${muscle === m.id ? `${bgAccent} text-white border-white/20 shadow-xl scale-[1.02] ring-2 ring-white/10` : 'bg-black/50 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:border-slate-700'}`}
              >
                <span className="text-3xl filter drop-shadow-md">{m.icon}</span>
                <div className="text-left">
                  <p className={`text-sm font-black uppercase ${muscle === m.id ? 'text-white' : 'text-slate-300'}`}>{m.label}</p>
                  <p className={`text-[10px] ${muscle === m.id ? 'text-white/80' : 'opacity-70'}`}>{m.desc}</p>
                </div>
                {muscle === m.id && <CheckCircle2 className="ml-auto text-white animate-in zoom-in spin-in-45 duration-300" size={20} />}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setEnvironment('gym')}
              className={`flex-1 py-3 rounded-xl border-2 font-black uppercase text-xs flex items-center justify-center gap-2 transition-all ${environment === 'gym' ? `${bgAccent} text-white border-white/20 shadow-lg` : 'bg-black border-slate-800 text-slate-500 hover:bg-slate-900'}`}
            >
              <Dumbbell size={16} /> Gimnasio
            </button>
            <button
              onClick={() => {
                setEnvironment('home');
                toast("Modo 'En Casa' activado: Peso Corporal.", 'success');
              }}
              className={`flex-1 py-3 rounded-xl border-2 font-black uppercase text-xs flex items-center justify-center gap-2 transition-all ${environment === 'home' ? `${bgAccent} text-white border-white/20 shadow-lg` : 'bg-black border-slate-800 text-slate-500 hover:bg-slate-900'}`}
            >
              <Target size={16} /> En Casa
            </button>
          </div>

          {isPro && (
            <div onClick={() => setIsRecovery(!isRecovery)} className={`mt-4 p-4 rounded-xl border flex items-center justify-between cursor-pointer ${isRecovery ? 'bg-emerald-900/20 border-emerald-500' : 'bg-black border-slate-800'}`}>
              <div className="flex items-center gap-3">
                <BatteryCharging size={20} className={isRecovery ? 'text-emerald-500' : 'text-slate-600'} />
                <p className={`text-sm font-bold ${isRecovery ? 'text-emerald-400' : 'text-slate-300'}`}>Modo Recuperación</p>
              </div>
            </div>
          )}
          <button
            onClick={handleGenerate}
            className={`w-full py-5 rounded-xl font-black uppercase tracking-widest text-lg mt-6 flex items-center justify-center gap-3 ${bgAccent} text-white shadow-xl transition-all active:scale-95 hover:brightness-110 relative overflow-hidden group`}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
            <Sparkles size={22} className="animate-pulse" /> Comenzar Rutina
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 animate-fade-in">
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-zinc-900 w-full max-w-sm rounded-3xl border border-slate-800 p-8 text-center shadow-2xl relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-2 ${bgAccent}`}></div>
            <Trophy size={64} className="mx-auto text-yellow-500 mb-6" />
            <h2 className="text-3xl font-black text-white italic mb-2 uppercase tracking-tighter">¡NIVEL ÉLITE!</h2>
            <p className="text-slate-400 mb-8">Has completado tu sesión con éxito. Disciplina es libertad.</p>
            <button onClick={() => setShowCelebration(false)} className={`w-full py-4 rounded-xl font-bold ${bgAccent} text-white`}>Aceptar</button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-slate-800 ${accentColor} mb-2 inline-block`}>Rutina Generada</span>
          <h1 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter">{routine.title}</h1>
          <p className="text-slate-500 text-xs flex items-center gap-1 mt-1"><Clock size={12} /> {routine.estimatedDuration}</p>
        </div>
        <div className={`text-lg font-black ${accentColor}`}>{Math.round((completedExercises.size / (routine.exercises?.length || 1)) * 100)}%</div>
      </div>

      <div className="space-y-4">
        {routine.exercises?.map((ex, idx) => {
          const isDone = completedExercises.has(idx);
          return (
            <div key={idx} onClick={() => toggleExercise(idx)} className={`rounded-2xl p-4 border transition-all cursor-pointer ${isDone ? 'bg-emerald-900/10 border-emerald-500/30' : 'bg-zinc-900 border-slate-800 shadow-lg'}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-1 ${isDone ? 'text-emerald-400 line-through' : 'text-white'}`}>{ex.name}</h3>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">
                    <span className="bg-black px-2 py-0.5 rounded border border-slate-800">{ex.sets} Sets</span>
                    <span className="bg-black px-2 py-0.5 rounded border border-slate-800">{ex.reps}</span>
                  </div>
                  <p className="text-xs text-slate-400 bg-slate-800/50 p-3 rounded-lg border border-slate-700">{ex.notes}</p>
                </div>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ml-4 shrink-0 ${isDone ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700'}`}>
                  {isDone && <CheckCircle2 className="text-white" size={18} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <button onClick={deleteRoutine} className="py-4 rounded-xl font-bold text-slate-500 bg-slate-800/50 border border-slate-800">Borrar</button>
        <button onClick={finishWorkout} className={`py-4 rounded-xl font-bold text-white shadow-xl ${bgAccent}`}>Terminar</button>
      </div>
    </div>
  );
};
