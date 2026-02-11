
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { createCoachSession } from '../services/geminiService';
import { Send, Bot, Loader2, Sparkles, ShieldCheck, ClipboardList } from 'lucide-react';
import { Chat } from "@google/genai";

interface AICoachChatProps {
  userProfile: UserProfile | null;
  isPro: boolean;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize Chat Session
  useEffect(() => {
    if (userProfile) {
      setChatSession(createCoachSession(userProfile));
    }
  }, [isPro, userProfile]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const result = await chatSession.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: result.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Error en la interfaz de comunicación. Reintente el envío, atleta.' }]);
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
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <SportyRobotIcon size={24} className="text-emerald-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-950"></div>
          </div>
          <div>
            <h2 className="text-white text-sm font-black uppercase tracking-widest italic">Director de Rendimiento</h2>
            <p className="text-[9px] text-emerald-500/80 font-mono tracking-[0.2em] uppercase">Status: Análisis Activo</p>
          </div>
        </div>
        <div className="bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase tracking-tighter">
          Elite AI
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide" ref={scrollRef}>
        {messages.map((msg, idx) => {
          const isModel = msg.role === 'model';
          return (
            <div key={idx} className={`flex ${isModel ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 shadow-xl relative ${isModel
                ? 'bg-zinc-900/80 text-slate-200 border border-zinc-800 rounded-tl-none'
                : 'bg-emerald-600/90 text-white border-t border-emerald-400/30 rounded-br-none'
                }`}>
                <p className="text-xs leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>

                <div className={`mt-3 flex items-center gap-1.5 opacity-30 ${isModel ? 'justify-end' : 'justify-start'}`}>
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
            className="absolute right-2 p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:scale-100"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[8px] text-zinc-600 mt-2 text-center font-bold uppercase tracking-widest">Growth Ladder Performance Protocol v2.5</p>
      </div>
    </div>
  );
};
