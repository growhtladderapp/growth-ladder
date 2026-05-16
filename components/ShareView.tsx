import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { ViewState } from '../types';

interface Props {
  setView: (view: ViewState) => void;
  uiText: Record<string, string>;
}

export const ShareView: React.FC<Props> = ({ setView, uiText }) => {
  const handleShare = async () => {
    const shareData = {
      title: 'Compartir hábitos',
      text: '¡Únete a mi círculo de rendimiento y compartamos nuestros hábitos!',
      url: 'https://twh.app/invite/user123',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  const handleRequestData = async () => {
    const shareData = {
      title: 'Pedir compartir',
      text: 'Por favor comparte tus datos de hábitos conmigo usando este enlace.',
      url: 'https://twh.app/request/user123',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      }
    } catch (err) {
      console.log('Error requesting share:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white px-5 pt-16 pb-32 font-sans relative items-center text-center">
      
      <div className="mb-6 flex justify-center">
        <Users size={100} className="text-zinc-500" strokeWidth={1} />
      </div>

      <h1 className="text-2xl font-bold mb-3">Compartir hábitos</h1>
      
      <p className="text-zinc-400 text-[15px] mb-8 px-2 leading-snug">
        Comparte tus hábitos con otros seleccionando cuáles deseas compartir, eligiendo con quién compartirlos y aceptando invitaciones para unirte a hábitos compartidos.
      </p>

      <div className="text-left text-zinc-400 text-[15px] mb-12 px-2 leading-snug space-y-3">
        <p>Cómo funciona la compartición:</p>
        <p>1. Creas una compartición y envías el enlace a un amigo. Cuando se una, podrá ver tus hábitos.</p>
        <p>2. Tu amigo crea una compartición y te envía un enlace. Cuando te unas, podrás ver sus hábitos.</p>
      </div>

      <div className="w-full max-w-[340px] flex flex-col gap-4 mt-auto mb-10">
        <button 
           onClick={handleShare}
           className="w-full bg-brand-500 hover:bg-brand-600 active:bg-brand-600 text-black font-bold py-4 rounded-[2rem] transition-all active:scale-95 shadow-lg shadow-brand-500/20 text-[15px]"
        >
          Compartir con alguien
        </button>

        <button 
           onClick={handleRequestData}
           className="w-full bg-brand-500/10 hover:bg-brand-500/20 active:bg-brand-500/20 text-brand-500 border border-brand-500/20 font-bold py-4 rounded-[2rem] transition-all active:scale-95 text-[15px]"
        >
          Pedir a alguien que comparta sus datos
        </button>
      </div>

    </div>
  );
};
