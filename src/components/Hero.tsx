import React from 'react';
import { Heart, HandHelping, Flame } from 'lucide-react';

interface HeroProps {
  onFilterSupportType: (type: 'pide_ayuda' | 'ofrece_ayuda' | null) => void;
  selectedSupportType: 'pide_ayuda' | 'ofrece_ayuda' | null;
  onOpenCreateStory: () => void;
  isAuthenticated: boolean;
}

export default function Hero({
  onFilterSupportType,
  selectedSupportType,
  onOpenCreateStory,
  isAuthenticated
}: HeroProps) {
  return (
    <div className="bg-emerald-900 text-white overflow-hidden relative" id="hero-banner">
      {/* Absolute design accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-700/50 via-emerald-900 to-emerald-950 opacity-90 z-0" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-800/80 border border-emerald-700 text-emerald-300 text-xs font-semibold rounded-full mb-6">
          <Heart className="h-3 w-3 fill-emerald-400 text-emerald-400" />
          <span>Plataforma Comunitaria Solidaria</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-tight text-white max-w-4xl mx-auto uppercase">
          Las historias <span className="text-emerald-400">nos unen</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-emerald-100 max-w-3xl mx-auto font-normal leading-relaxed">
          Hagamos cosas hermosas por los demás para equilibrar el universo. Compartí tu historia si necesitás ayuda, o sumate a dar una mano con tu tiempo, alimentos o habilidades si querés cooperar.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => onFilterSupportType(selectedSupportType === 'pide_ayuda' ? null : 'pide_ayuda')}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
              selectedSupportType === 'pide_ayuda'
                ? 'bg-emerald-400 text-emerald-950 ring-4 ring-emerald-400/20 shadow-lg font-bold'
                : 'bg-emerald-800/80 hover:bg-emerald-800 text-white border border-emerald-700'
            }`}
            id="hero-need-help-btn"
          >
            <Flame className="h-4 w-4" />
            Colabora con estas historias
          </button>

          <button
            onClick={() => onFilterSupportType(selectedSupportType === 'ofrece_ayuda' ? null : 'ofrece_ayuda')}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
              selectedSupportType === 'ofrece_ayuda'
                ? 'bg-emerald-400 text-emerald-950 ring-4 ring-emerald-400/20 shadow-lg font-bold'
                : 'bg-emerald-800/80 hover:bg-emerald-800 text-white border border-emerald-700'
            }`}
            id="hero-offer-help-btn"
          >
            <HandHelping className="h-4 w-4" />
            Gente ofreciendo ayuda
          </button>

          <button
            onClick={onOpenCreateStory}
            className="w-full sm:w-auto px-6 py-3 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-bold text-sm transition shadow-md cursor-pointer flex items-center justify-center"
            id="hero-publish-btn"
          >
            + Sumar tu historia
          </button>
        </div>
      </div>
    </div>
  );
}
