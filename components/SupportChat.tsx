
import React, { useState, useRef, useEffect } from 'react';
import { Send, HelpCircle, Loader2, ChevronLeft, MessageSquare, Info } from 'lucide-react';
import { ViewState } from '../types';
import { GoogleGenAI } from "@google/genai";

interface SupportChatProps {
  setView: (view: ViewState) => void;
  isPro: boolean;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const SupportChat: React.FC<SupportChatProps> = ({ setView, isPro }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hola, soy el asistente de soporte de Growth Ladder. ¿Tienes problemas con el escáner, las rutinas o tu perfil? ¡Dime cómo puedo ayudarte!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const accentColor = isPro ? 'text-emerald-500' : 'text-brand-500';
  const bgAccent = isPro ? 'bg-emerald-600' : 'bg-brand-600';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "Eres el Soporte Técnico de la app Growth Ladder. Tu misión es ayudar al usuario con problemas de la app (Escáner, Registro de Calorías, Rutinas AI, Perfil). Sé amable, útil y conciso. Si el problema es técnico, sugiere reiniciar la app o revisar permisos de cámara/notificaciones.",
        }
      });
      setMessages(prev => [...prev, { role: 'model', text: response.text || 'Entendido. ¿Alguna otra duda?' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: 'Error de conexión con el soporte. Por favor, intenta más tarde.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] animate-fade-in pb-16">
      <div className="flex items-center gap-3 p-2 mb-4">
        <button onClick={() => setView(ViewState.DASHBOARD)} className="p-2 text-slate-400 hover:text-white"><ChevronLeft size={20} /></button>
        <div className={`p-2 rounded-xl ${bgAccent} text-white shadow-lg`}>
           <HelpCircle size={20} />
        </div>
        <div>
           <h2 className="text-white font-bold leading-tight">Ayuda y Soporte</h2>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Chatbot de Asistencia</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-2 scrollbar-hide" ref={scrollRef}>
         {messages.map((msg, idx) => (
           <div key={idx} className={`flex ${msg.role === 'model' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                msg.role === 'model' 
                  ? 'bg-zinc-900 text-slate-300 border border-slate-800 rounded-tl-none' 
                  : `${bgAccent} text-white rounded-br-none`
              }`}>
                 {msg.text}
              </div>
           </div>
         ))}
         {loading && (
            <div className="flex justify-start animate-pulse">
               <div className="bg-zinc-900 p-4 rounded-2xl rounded-tl-none border border-slate-800 flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-slate-500" />
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Escribiendo...</span>
               </div>
            </div>
         )}
      </div>

      <div className="p-2 mt-auto">
         <div className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Describe tu problema..."
              className="w-full bg-zinc-900 border border-slate-800 rounded-xl py-4 pl-4 pr-12 text-white placeholder:text-slate-600 focus:border-brand-500 outline-none"
            />
            <button 
              onClick={handleSend}
              className={`absolute right-2 p-2 rounded-lg ${bgAccent} text-white shadow-lg active:scale-95 transition-transform`}
            >
               <Send size={18} />
            </button>
         </div>
      </div>
    </div>
  );
};
