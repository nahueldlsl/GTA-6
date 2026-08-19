// ============================================================================
// 🌴 ROCKSTAR GAMES GTA VI OFFICIAL TITLE SCREEN & ARTWORK LOADING SCREEN
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Play, Sparkles } from 'lucide-react';

interface TitleScreenProps {
  onStart: () => void;
}

const ARTWORK_WALLPAPERS = [
  '/assets/gta6/wallpapers/art_01_cover.jpg',
  '/assets/gta6/wallpapers/art_02_motel.jpg',
  '/assets/gta6/wallpapers/art_03_robbery.jpg',
  '/assets/gta6/wallpapers/art_04_duo1.jpg',
  '/assets/gta6/wallpapers/art_05_vice_city.jpg',
  '/assets/gta6/wallpapers/art_06_keys.jpg',
  '/assets/gta6/wallpapers/art_07_dimez.jpg'
];

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  const [bgIndex, setBgIndex] = useState(0);

  // Rotate loading screen artworks every 6.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % ARTWORK_WALLPAPERS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative z-50 w-full h-full flex flex-col items-center justify-between p-6 sm:p-10 text-white select-none overflow-hidden">
      {/* 1. DYNAMIC GTA VI ARTWORK ROTATING BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {ARTWORK_WALLPAPERS.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === bgIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={src}
              alt="Grand Theft Auto VI Artwork"
              className="w-full h-full object-cover object-center scale-105 animate-ken-burns"
            />
          </div>
        ))}
        {/* Subtle Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/70 z-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70 z-20" />
      </div>

      {/* 2. TOP ROCKSTAR BAR & TAGLINE */}
      <div className="relative z-30 w-full max-w-6xl flex justify-between items-center pt-2">
        <div className="flex items-center space-x-2">
          {/* Rockstar Emblem */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg font-black text-black text-base">
            R★
          </div>
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-zinc-300 uppercase">
            ROCKSTAR GAMES PRESENTS
          </span>
        </div>

        <div className="backdrop-blur-md bg-black/60 border border-pink-500/40 px-3 py-1 rounded-full flex items-center space-x-2 text-[11px] font-mono text-pink-300">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          <span className="font-bold tracking-wider uppercase">LEONIDA STATE • 2026</span>
        </div>
      </div>

      {/* 3. CENTER OFFICIAL GTA VI LOGO & CALL TO ACTION */}
      <div className="relative z-30 text-center max-w-3xl px-4 my-auto animate-fadeIn flex flex-col items-center">
        {/* Official GTA VI Logo Badge */}
        <div className="relative inline-flex flex-col items-center mb-3">
          <img
            src="/assets/gta6/poster_logo.0c1t44bwef8fc.avif"
            alt="Grand Theft Auto VI Logo"
            className="max-w-[280px] sm:max-w-[360px] h-auto drop-shadow-[0_10px_30px_rgba(255,42,133,0.6)] animate-pulse"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="text-sm sm:text-base font-bold tracking-[0.3em] text-cyan-300 uppercase font-mono mt-2 drop-shadow-[0_0_15px_rgba(0,240,255,0.8)] text-center">
            LEONIDA • CUENTAS PENDIENTES BAJO EL NEÓN
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-200 font-sans max-w-xl mx-auto leading-relaxed mt-2 drop-shadow-lg">
          El calor en los Cayos de Leonida no se respira; se muerde. Jason Duval regresa al taller de Brian Heder intentando escapar de su pasado. Cuando el destino cruza su camino con Lucia Caminos, ambos descubrirán que la única forma de conquistar Leonida es cambiando las reglas del juego juntos.
        </p>

        {/* Launch Button */}
        <button
          onClick={onStart}
          className="mt-8 group relative inline-flex items-center gap-3.5 px-10 py-4 text-base sm:text-lg font-black uppercase tracking-widest bg-gradient-to-r from-pink-600 via-orange-500 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white rounded-2xl shadow-[0_0_50px_rgba(255,42,133,0.7)] transform hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/40"
        >
          <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
          <span>INICIAR EXPERIENCIA</span>
          <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
        </button>
      </div>

      {/* 4. CLEAN BOTTOM BRANDING WATERMARK */}
      <div className="relative z-30 w-full max-w-5xl flex justify-center items-center pb-2">
        <span className="text-[10px] font-mono text-zinc-400/80 tracking-widest uppercase">
          GRAND THEFT AUTO VI • LEONIDA STATE
        </span>
      </div>
    </div>
  );
};
