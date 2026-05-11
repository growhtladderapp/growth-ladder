import React, { useState } from 'react';
import { Share, Search, Users, Trophy } from 'lucide-react';
import { ViewState } from '../types';

interface Props {
  setView: (view: ViewState) => void;
  uiText: Record<string, string>;
}

export const ShareView: React.FC<Props> = ({ setView, uiText }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'TWH Premium',
      text: '¡Únete a mi círculo de rendimiento en TWH y construyamos consistencia juntos!',
      url: 'https://twh.app/invite/user123',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white px-5 pt-10 pb-32 font-sans relative">
      <div className="flex justify-center items-center mb-10">
        <h1 className="text-xl font-bold">Compartir</h1>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 space-y-6">
        <div className="w-24 h-24 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center relative shadow-[0_0_50px_rgba(16,185,129,0.15)] mb-4">
          <Users size={48} className="text-brand-500 relative z-10" />
        </div>

        <h2 className="text-2xl font-bold text-center">Invita a tus <br/>amigos</h2>
        
        <p className="text-zinc-400 text-center text-sm px-6">
          Los humanos somos criaturas tribales. Tienes un 95% más de probabilidades de alcanzar tus objetivos si lo haces en grupo.
        </p>

        <button 
           onClick={handleShare}
           className="w-full max-w-[280px] bg-brand-500 active:bg-brand-600 hover:bg-brand-600 text-black font-bold py-4 rounded-full flex items-center justify-center gap-2 mt-8 transition-all active:scale-95 shadow-lg shadow-brand-500/20"
        >
          <Share size={20} />
          {copied ? "¡Enlace copiado!" : "Compartir con alguien"}
        </button>

        {/* Simulando búsqueda de amigos */}
        <div className="w-full max-w-[280px] mt-8 bg-[#1c1c1e] rounded-2xl p-4 border border-[#2c2c2e]">
          <div className="flex items-center gap-3 mb-4">
            <Search size={16} className="text-zinc-500" />
            <input 
              type="text" 
              placeholder="Buscar por ID..." 
              className="bg-transparent border-none outline-none text-white text-sm w-full"
            />
          </div>
          <div className="border-t border-[#2c2c2e] pt-4">
             <div className="flex justify-between items-center opacity-50 cursor-not-allowed">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
                 <span className="text-sm font-semibold text-zinc-400">Sin amigos todavía</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
