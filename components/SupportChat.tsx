import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, PhoneOff } from 'lucide-react';
import { createSupportSession } from '../services/geminiService';

interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
}

type CallState = 'idle' | 'listening' | 'processing' | 'speaking';

export const SupportChat: React.FC<SupportChatProps> = ({ isOpen, onClose }) => {
  const [callState, setCallState] = useState<CallState>('idle');
  const [transcript, setTranscript] = useState('');
  const [aiText, setAiText] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [permissionError, setPermissionError] = useState(false);

  const chatSessionRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop everything function
  const stopAll = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    window.speechSynthesis.cancel();
  };

  useEffect(() => {
    if (isOpen) {
      setCallState('processing'); // Initial loading
      setTranscript('');
      setAiText('');
      setPermissionError(false);
      setIsMuted(false);

      // 1. Initialize Gemini
      createSupportSession().then(session => {
        chatSessionRef.current = session;
        // Greet the user to start the interaction
        speakResponse("Hola. Soy el asistente de Training With Habits. ¿En qué te puedo ayudar hoy?");
      }).catch(err => {
        console.error("Failed to init chat", err);
        setCallState('idle');
      });

      // 2. Initialize Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Stop on pause
        recognition.interimResults = true;
        recognition.lang = 'es-ES';

        let finalTx = '';

        recognition.onstart = () => {
          setCallState('listening');
          finalTx = '';
          setTranscript('');
          setAiText('');
        };

        recognition.onresult = (event: any) => {
          let interimTx = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTx += event.results[i][0].transcript;
            } else {
              interimTx += event.results[i][0].transcript;
            }
          }
          setTranscript(finalTx || interimTx);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech Recognition Error:", event.error);
          if (event.error === 'not-allowed') {
            setPermissionError(true);
          }
          setCallState('idle');
        };

        recognition.onend = () => {
          if (finalTx.trim()) {
            handleUserMessage(finalTx.trim());
          } else {
            setCallState('idle');
          }
        };

        recognitionRef.current = recognition;
      } else {
        setPermissionError(true);
      }
    } else {
      stopAll();
    }

    return () => stopAll();
  }, [isOpen]);

  // Load voices proactively
  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  const handleUserMessage = async (text: string) => {
    if (!chatSessionRef.current) return;
    setCallState('processing');
    setTranscript('');

    try {
      const result = await chatSessionRef.current.sendMessage(text);
      const response = result.response.text();
      speakResponse(response);
    } catch (error) {
      console.error(error);
      speakResponse("Lo siento, tuve un problema para procesar eso. ¿Puedes repetir?");
    }
  };

  const speakResponse = (text: string) => {
    setCallState('speaking');
    setAiText(text);

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    
    const voices = window.speechSynthesis.getVoices();
    // Try to find a nice Spanish voice
    const esVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Google') || v.name.includes('Natural')));
    if (esVoice) utterance.voice = esVoice;

    utterance.onend = () => {
      setAiText('');
      setCallState('idle');
      // If not muted, automatically start listening again
      if (!isMuted && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {}
      }
    };

    utterance.onerror = () => {
      setCallState('idle');
    };

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    
    if (nextMuted) {
      // Muting: stop recognition if running
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (callState === 'listening') setCallState('idle');
    } else {
      // Unmuting: if idle, start listening
      if (callState === 'idle' && recognitionRef.current) {
        try { recognitionRef.current.start(); } catch (e) {}
      }
    }
  };

  const handleManualTap = () => {
    if (callState === 'idle') {
      window.speechSynthesis.cancel(); // Interrupt AI if it was somehow stuck
      if (!isMuted && recognitionRef.current) {
        try { recognitionRef.current.start(); } catch (e) {}
      }
    } else if (callState === 'speaking') {
      // Interrupt AI speaking
      window.speechSynthesis.cancel();
      setCallState('idle');
      if (!isMuted && recognitionRef.current) {
        try { recognitionRef.current.start(); } catch (e) {}
      }
    }
  };

  if (!isOpen) return null;

  // Visual state mapping
  const getOrbStateClasses = () => {
    switch (callState) {
      case 'listening': return 'scale-125 bg-brand-500 shadow-[0_0_80px_rgba(16,185,129,0.8)] animate-pulse';
      case 'processing': return 'scale-90 bg-white/20 shadow-[0_0_40px_rgba(255,255,255,0.2)] animate-spin';
      case 'speaking': return 'scale-110 bg-brand-400 shadow-[0_0_60px_rgba(52,211,153,0.5)] animate-pulse';
      case 'idle':
      default: return 'scale-100 bg-brand-500/50 shadow-[0_0_40px_rgba(16,185,129,0.3)]';
    }
  };

  const getStateText = () => {
    if (permissionError) return 'Micrófono no disponible';
    if (isMuted) return 'Micrófono silenciado';
    switch (callState) {
      case 'listening': return 'Escuchando...';
      case 'processing': return 'Pensando...';
      case 'speaking': return 'Hablando...';
      case 'idle': return 'Toca para hablar';
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col justify-between items-center px-6 py-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Asistente de IA</span>
          <span className="text-white text-xl font-black">Soporte TWH</span>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Orb Area */}
      <div 
        className="flex-1 w-full flex flex-col items-center justify-center relative cursor-pointer"
        onClick={handleManualTap}
      >
        <div className={`w-32 h-32 rounded-full transition-all duration-700 ease-out flex items-center justify-center ${getOrbStateClasses()}`}>
           {callState === 'processing' && (
             <div className="w-full h-full rounded-full border-t-4 border-white opacity-50 animate-spin"></div>
           )}
        </div>
        
        {/* Status Text */}
        <p className={`mt-12 font-bold uppercase tracking-widest transition-colors ${callState === 'listening' ? 'text-brand-500' : 'text-white/50'}`}>
          {getStateText()}
        </p>

        {/* Subtitles Area (Transcript / AI Text) */}
        <div className="absolute bottom-10 w-full text-center px-8 h-20 flex items-end justify-center">
          <p className="text-white text-lg font-medium leading-snug line-clamp-3">
            {transcript || aiText}
          </p>
        </div>
      </div>

      {/* Controls Area */}
      <div className="w-full flex items-center justify-center gap-8 mb-8">
        <button 
          onClick={toggleMute}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-white/20 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        
        <button 
          onClick={onClose}
          className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-500 transition-all shadow-[0_0_40px_rgba(220,38,38,0.4)]"
        >
          <PhoneOff size={32} />
        </button>
      </div>
      
    </div>
  );
};
