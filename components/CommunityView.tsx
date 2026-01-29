
import React, { useState } from 'react';
import { Users, ChevronLeft, Star, MapPin, Instagram, CheckCircle2, MessageCircle, ArrowRight, Filter } from 'lucide-react';
import { ViewState } from '../types';

interface CommunityViewProps {
   setView: (view: ViewState) => void;
   isPro: boolean;
   uiText: Record<string, string>;
}

// Mock Data for Personal Trainers
const TRAINERS = [
   {
      id: 1,
      name: "Alex Rivera",
      specialty: "Hipertrofia & Fuerza",
      rating: 4.9,
      reviews: 128,
      location: "Madrid, ES",
      image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=1000&auto=format&fit=crop",
      price: "45€ / mes",
      isVerified: true,
      tags: ["Culturismo", "Powerlifting"],
      bio: "Transformando cuerpos desde 2015. Enfoque científico y resultados garantizados si sigues el plan."
   },
   {
      id: 2,
      name: "Sarah Connors",
      specialty: "Yoga & Movilidad",
      rating: 5.0,
      reviews: 84,
      location: "Online",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
      price: "30€ / mes",
      isVerified: true,
      tags: ["Flexibilidad", "Mindfulness"],
      bio: "Ayudo a atletas rígidos a moverse como el agua. Recuperación activa y prevención de lesiones."
   },
   {
      id: 3,
      name: "Marcus 'Titan' Jones",
      specialty: "CrossFit & Rendimiento",
      rating: 4.8,
      reviews: 215,
      location: "Miami, USA",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
      price: "60€ / mes",
      isVerified: true,
      tags: ["HIIT", "Resistencia"],
      bio: "Ex-militar. Te llevaré al límite para que descubras de qué eres capaz realmente."
   },
   {
      id: 4,
      name: "Elena V.",
      specialty: "Pérdida de Peso",
      rating: 4.7,
      reviews: 56,
      location: "Barcelona, ES",
      image: "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?q=80&w=1000&auto=format&fit=crop",
      price: "40€ / mes",
      isVerified: false,
      tags: ["Nutrición", "Cardio"],
      bio: "Nutricionista y entrenadora. El cambio empieza en la cocina y termina en la pista."
   }
];

export const CommunityView: React.FC<CommunityViewProps> = ({ setView, isPro, uiText }) => {
   const [filter, setFilter] = useState('Todos');

   const accentColor = isPro ? 'text-emerald-500' : 'text-brand-500';
   const bgAccent = isPro ? 'bg-emerald-600' : 'bg-brand-600';
   const borderAccent = isPro ? 'border-emerald-500' : 'border-brand-500';

   return (
      <div className="pb-24 pt-4 animate-fade-in space-y-6">
         {/* Header */}
         <div className="flex justify-between items-center">
            <button
               onClick={() => setView(ViewState.DASHBOARD)}
               className="flex items-center gap-2 text-slate-400 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors"
            >
               <ChevronLeft size={16} /> Volver
            </button>
            <div className="bg-slate-800 p-2 rounded-full border border-slate-700">
               <Filter size={16} className="text-slate-400" />
            </div>
         </div>

         <header className="px-1">
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
               Explora Trainers
            </h1>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
               Conecta con entrenadores de élite para llevar tu rendimiento al siguiente nivel. Planes personalizados y seguimiento 1 a 1.
            </p>
         </header>

         {/* Featured Banner (Fake Ad/Highlight) */}
         <div className={`relative rounded-2xl overflow-hidden p-6 border ${borderAccent} shadow-2xl`}>
            <div className="absolute inset-0">
               <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
               <div className={`absolute inset-0 bg-gradient-to-r ${isPro ? 'from-emerald-900/90 to-black/60' : 'from-brand-900/90 to-black/60'}`}></div>
            </div>
            <div className="relative z-10">
               <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest bg-white text-black mb-3 inline-block`}>Destacado</span>
               <h2 className="text-2xl font-bold text-white mb-1">Coach IA Pro</h2>
               <p className="text-slate-200 text-xs mb-4 max-w-[200px]">¿Prefieres la tecnología? Prueba nuestro sistema de entrenamiento inteligente.</p>
               <button onClick={() => setView(ViewState.CHAT)} className={`px-4 py-2 rounded-lg font-bold text-xs ${bgAccent} text-white shadow-lg active:scale-95 transition-transform`}>
                  Probar Ahora
               </button>
            </div>
         </div>

         {/* Trainers Feed */}
         <div className="space-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest px-1 flex items-center gap-2">
               <Star size={14} className="text-yellow-500" fill="currentColor" /> Trainers Recomendados
            </h3>

            {TRAINERS.map(trainer => (
               <div key={trainer.id} className="bg-zinc-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg group hover:border-slate-600 transition-all">

                  {/* Card Header with Image */}
                  <div className="relative h-32 overflow-hidden">
                     <img src={trainer.image} alt={trainer.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                     <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent"></div>

                     {/* Rating Badge */}
                     <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10">
                        <Star size={12} className="text-yellow-500" fill="currentColor" />
                        <span className="text-white font-bold text-xs">{trainer.rating}</span>
                        <span className="text-[10px] text-slate-400">({trainer.reviews})</span>
                     </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 -mt-6 relative z-10">
                     <div className="flex justify-between items-start mb-2">
                        <div>
                           <h3 className="text-lg font-bold text-white flex items-center gap-1">
                              {trainer.name}
                              {trainer.isVerified && <CheckCircle2 size={16} className="text-blue-500" fill="currentColor" stroke="black" />}
                           </h3>
                           <p className={`text-xs font-bold ${accentColor} uppercase tracking-wide`}>{trainer.specialty}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-white font-black text-lg leading-none">{trainer.price}</p>
                        </div>
                     </div>

                     <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
                        {trainer.bio}
                     </p>

                     {/* Tags */}
                     <div className="flex flex-wrap gap-2 mb-4">
                        {trainer.tags.map(tag => (
                           <span key={tag} className="px-2 py-1 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                              {tag}
                           </span>
                        ))}
                        <span className="px-2 py-1 rounded text-[10px] bg-slate-800 text-slate-500 border border-slate-700 flex items-center gap-1">
                           <MapPin size={8} /> {trainer.location}
                        </span>
                     </div>

                     {/* Actions */}
                     <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-700 text-white text-xs font-bold hover:bg-slate-800 transition-colors">
                           <MessageCircle size={16} /> Contactar
                        </button>
                        <button className={`flex items-center justify-center gap-2 py-2.5 rounded-xl ${bgAccent} text-white text-xs font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all`}>
                           Contratar <ArrowRight size={16} />
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};
