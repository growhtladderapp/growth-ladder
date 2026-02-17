

import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { createCoachSession } from '../services/geminiService';
import { Send, Bot, Loader2, Sparkles, ShieldCheck, ClipboardList, Volume2, Mic } from 'lucide-react';
import { Chat } from "@google/genai";
import ReactMarkdown from 'react-markdown';

interface AICoachChatProps {
  userProfile: UserProfile | null;
  isPro: boolean;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

type VoiceGender = 'male' | 'female';

// Custom Sporty Robot Component - Exported for use in App FAB
export const SportyRobotIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center`} style={{ width: size, height: size }}>
      {/* Base Robot */}
      <Bot size={size} className={`relative z-10 ${className}`} />

      {/* Headband Overlay (Professional/Technical) */}
      <div
        className="absolute z-20 bg-zinc-500 rounded-[1px]"
        style={{
          top: '46%',
          left: '14%',
          width: '72%',
          height: '8%',
          opacity: 0.9,
        }}
      ></div>

      {/* PRO NOTEBOOK / TABLET OF DATA */}
      <div
        className="absolute z-30 bg-emerald-500 rounded-sm border-[1px] border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)] flex flex-col gap-[1px] p-[1px] justify-center"
        style={{
          bottom: '5%',
          right: '-10%',
          width: '45%',
          height: '55%',
          transform: 'rotate(10deg)',
        }}
      >
        {/* Notebook lines to represent data logs */}
        <div className="w-full h-[1px] bg-white/40"></div>
        <div className="w-4/5 h-[1px] bg-white/40"></div>
        <div className="w-full h-[1px] bg-white/40"></div>
        <div className="w-3/5 h-[1px] bg-white/40"></div>
      </div>

      {/* Active Analysis Indicator */}
      <div className="absolute top-[35%] right-[0%] w-[12%] h-[12%] bg-emerald-400 rounded-full animate-pulse opacity-40"></div>
    </div>
  );
};

export const AICoachChat: React.FC<AICoachChatProps> = ({ userProfile, isPro }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Sesión iniciada. Soy su Director de Rendimiento de Growth Ladder. ¿En qué área técnica de su optimización física requiere asistencia hoy: protocolos nutricionales, biomecánica de ejecución o periodización?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Voice State
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [preferredGender, setPreferredGender] = useState<VoiceGender>(() => {
    return (localStorage.getItem('coach_voice_gender') as VoiceGender) || 'male';
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const getBestVoice = (gender: VoiceGender): SpeechSynthesisVoice | null => {
    const esVoices = voices.filter(v => v.lang.startsWith('es'));
    const femaleNames = ['Helena', 'Sabina', 'Laura', 'Paulina', 'Monica', 'Zira', 'Elena'];

    if (gender === 'female') {
      return esVoices.find(v => v.name.includes('Google') || femaleNames.some(n => v.name.includes(n))) || esVoices[0] || null;
    } else {
      // Prioritize male voices for Coach
      // 1. Explicit Male Names
      const maleVoice = esVoices.find(v => v.name.includes('Pablo') || v.name.includes('Raul') || v.name.includes('Jorge') || v.name.includes('Juan') || v.name.includes('Alvaro') || v.name.includes('Manuel') || v.name.includes('David') || v.name.includes('Mark'));
      if (maleVoice) return maleVoice;

      // 2. Microsoft voices that are NOT female
      const microsoftMale = esVoices.find(v => v.name.includes('Microsoft') && !femaleNames.some(n => v.name.includes(n)));
      if (microsoftMale) return microsoftMale;

      // 3. Fallback: Not Google (often female) and not known female
      return esVoices.find(v => !v.name.includes('Google') && !femaleNames.some(n => v.name.includes(n))) || esVoices[0] || null;
    }
  };

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getBestVoice(preferredGender);
    if (voice) utterance.voice = voice;
    utterance.rate = 1.0;
    utterance.pitch = preferredGender === 'female' ? 1.0 : 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const toggleVoice = () => {
    const newGender = preferredGender === 'female' ? 'male' : 'female';
    setPreferredGender(newGender);
    localStorage.setItem('coach_voice_gender', newGender);

    // Test voice
    const testMsg = "Sistema de audio calibrado. Director de rendimiento en línea.";
    const utterance = new SpeechSynthesisUtterance(testMsg);
    const voice = getBestVoice(newGender);
    if (voice) utterance.voice = voice;
    utterance.pitch = newGender === 'female' ? 1.0 : 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Initialize Chat Session with Async Handling
  useEffect(() => {
    let active = true;

    const initChat = async () => {
      if (userProfile) {
        try {
          // Force async handling even if sync, just in case SDK changes behavior
          const session = await createCoachSession(userProfile);
          if (active) {
            setChatSession(session);
          }
        } catch (e) {
          console.error("Failed to init coach session", e);
        }
      }
    };

    initChat();

    return () => { active = false; };
  }, [isPro, userProfile]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Safe check for sendMessage method
      if (typeof chatSession.sendMessage !== 'function') {
        throw new Error("Chat session not initialized correctly");
      }

      const result = await chatSession.sendMessage({ message: userMsg });

      // Handle response - SDK v1 usually provides .text directly
      const responseText = result.text || "Sin respuesta del modelo.";

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);

      // Auto-speak usage is minimal to not annoy, but user requested "listening also here"
      // We generally don't auto-speak unless requested, but here we add the button.
    } catch (error) {
      console.error("Coach Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Error de conexión con el Director. Por favor verifica tu red e intenta nuevamente.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in bg-[#050505]">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-emerald-900/30 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)] overflow-hidden">
              <img src="/director-logo.png" alt="Director Logo" className="w-full h-full object-cover p-1.5" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-950"></div>
          </div>
          <div>
            <h2 className="text-white text-sm font-black uppercase tracking-widest italic">Director de Rendimiento</h2>
            <p className="text-[9px] text-emerald-500/80 font-mono tracking-[0.2em] uppercase">Status: Análisis Activo</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Toggle */}
          <button
            onClick={toggleVoice}
            className="flex items-center gap-2 bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-500 px-3 py-1.5 rounded-lg transition-colors border border-emerald-500/20"
            title={`Cambiar a voz ${preferredGender === 'female' ? 'masculina' : 'femenina'}`}
          >
            <div className="relative">
              <Mic size={12} />
              <div className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full ${preferredGender === 'female' ? 'bg-pink-400' : 'bg-blue-400'}`}></div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider">
              {preferredGender === 'female' ? 'Voz F' : 'Voz M'}
            </span>
          </button>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide" ref={scrollRef}>
        {messages.map((msg, idx) => {
          const isModel = msg.role === 'model';
          return (
            <div key={idx} className={`flex ${isModel ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 shadow-xl relative group ${isModel
                ? 'bg-zinc-900/80 text-slate-200 border border-zinc-800 rounded-tl-none'
                : 'bg-emerald-600/90 text-white border-t border-emerald-400/30 rounded-br-none'
                }`}>
                <div className="text-xs leading-relaxed whitespace-pre-wrap font-medium">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>

                <div className={`mt-3 flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity ${isModel ? 'justify-between' : 'justify-end'}`}>
                  {isModel && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="text-emerald-500 hover:text-emerald-400 transition-colors"
                      title="Escuchar análisis"
                    >
                      <Volume2 size={14} />
                    </button>
                  )}
                  <span className="text-[8px] font-black uppercase tracking-widest">
                    {isModel ? 'GL_PERFORMANCE_DIRECTOR' : 'ATHLETE_ID_001'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900/50 px-4 py-3 rounded-2xl rounded-tl-none border border-zinc-800 flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
              </div>
              <span className="text-[10px] text-emerald-500/60 font-mono uppercase tracking-widest">Calculando Biometría...</span>
            </div>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-zinc-950 border-t border-emerald-900/20">
        <div className="relative flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ingrese consulta técnica (nutrición, biomecánica...)"
            rows={1}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 pl-4 pr-12 text-white placeholder:text-zinc-700 text-xs focus:ring-1 focus:ring-emerald-500/50 shadow-inner resize-none overflow-hidden outline-none"
            style={{ minHeight: '56px' }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 p-2 bg-transparent hover:bg-white/10 rounded-full transition-all active:scale-95 disabled:opacity-30 disabled:scale-100"
          >
            <img src="/send-icon.svg" alt="Enviar" className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[8px] text-zinc-600 mt-2 text-center font-bold uppercase tracking-widest">Growth Ladder Performance Protocol v2.5</p>
      </div>
    </div>
  );
};
