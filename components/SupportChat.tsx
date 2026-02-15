import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';
import { createSupportSession } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const SupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '¡Hola! Soy el Asistente de Soporte de Growth Ladder. 🤖\n\n¿En qué puedo ayudarte hoy? (Problemas de login, registro, cómo funciona la app...)'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleOpen = async () => {
    setIsOpen(true);
    if (!chatSessionRef.current) {
      try {
        chatSessionRef.current = await createSupportSession();
      } catch (error) {
        console.error("Failed to init support chat", error);
      }
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage = { id: Date.now().toString(), role: 'user' as const, text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = await createSupportSession();
      }

      const result = await chatSessionRef.current.sendMessage(userMessage.text);
      const response = result.response.text();

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response
      }]);
    } catch (error) {
      console.error("Error sending message", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 animate-in fade-in slide-in-from-bottom-10 overflow-hidden border-2 border-white bg-white"
        >
          <img
            src="/support-avatar.svg"
            alt="Soporte"
            className="w-full h-full object-cover"
          />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[400px] h-[500px] bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 sm:right-6">

          {/* Header */}
          <div className="p-4 bg-zinc-800/50 border-b border-white/5 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/20">
                <img src="/support-avatar.svg" alt="Bot" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Soporte Técnico</h3>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> En línea
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden ${msg.role === 'user' ? 'bg-slate-700 text-slate-300' : 'bg-transparent border border-white/10'
                  }`}>
                  {msg.role === 'user' ? <User size={14} /> : <img src="/support-avatar.svg" alt="Bot" className="w-full h-full object-cover" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-none'
                  : 'bg-zinc-800 text-slate-200 rounded-tl-none border border-white/5'
                  }`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-transparent border border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img src="/support-avatar.svg" alt="Bot" className="w-full h-full object-cover" />
                </div>
                <div className="bg-zinc-800 rounded-2xl p-3 rounded-tl-none border border-white/5 flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-slate-400" />
                  <span className="text-xs text-slate-400">Escribiendo...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-zinc-800/30 border-t border-white/5 backdrop-blur-sm">
            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Describe tu problema..."
                className="w-full bg-zinc-900 border border-white/10 text-white pl-4 pr-12 py-3 rounded-xl focus:outline-none focus:border-brand-500 transition-colors text-sm"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-transparent hover:bg-white/5 rounded-full transition-all disabled:opacity-50"
              >
                <img src="/send-icon.svg" alt="Enviar" className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
