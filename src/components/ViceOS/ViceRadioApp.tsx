// ============================================================================
// 🌴 VICE-OS: VICERADIO MUSIC & BROADCAST APP (GTA VI LEONIDA STEREO)
// ============================================================================

import React, { useState } from 'react';
import { audioEngine } from '../../engine/audioEngine';
import {
  Radio,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Disc3,
  Sparkles,
  Music
} from 'lucide-react';

interface RadioStation {
  id: string;
  name: string;
  frequency: string;
  genre: string;
  currentTrack: string;
  artist: string;
  coverImage: string;
  themeColor: string;
  accentBg: string;
}

const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'station_rock',
    name: 'Vice City Rock Radio',
    frequency: '99.5 FM',
    genre: 'Classic Southern Rock & Highway Anthems',
    currentTrack: 'Love Is a Long Road',
    artist: 'Tom Petty',
    coverImage: '/assets/gta6/Places/Leonida Keys/Leonida_Keys_01.jpg',
    themeColor: 'from-orange-600 to-red-600',
    accentBg: 'border-orange-500/50 bg-orange-950/30'
  },
  {
    id: 'station_wave',
    name: 'Wave 103',
    frequency: '103.0 FM',
    genre: 'Indie, Alternative & Psych Rock',
    currentTrack: 'Loser',
    artist: 'Tame Impala',
    coverImage: '/assets/gta6/Places/Vice City/Vice_City_05.jpg',
    themeColor: 'from-cyan-600 to-blue-600',
    accentBg: 'border-cyan-500/50 bg-cyan-950/30'
  },
  {
    id: 'station_latino',
    name: 'Radio Espantoso / Vice Latino',
    frequency: '97.5 FM',
    genre: 'Urbano Latino & Reggaeton Hits',
    currentTrack: 'EoO (DeBÍ TiRAR MáS FOToS)',
    artist: 'Bad Bunny',
    coverImage: '/assets/gta6/Places/Vice City/Vice_City_02.jpg',
    themeColor: 'from-amber-500 to-yellow-600',
    accentBg: 'border-amber-500/50 bg-amber-950/30'
  },
  {
    id: 'station_flash',
    name: 'Flash FM / Leonida Hits',
    frequency: '102.5 FM',
    genre: 'Soul, Neo-Soul & Pop Hits',
    currentTrack: "Feet Don't Fail Me Now",
    artist: 'Joy Crookes',
    coverImage: '/assets/gta6/Places/Vice City/Vice_City_04.jpg',
    themeColor: 'from-pink-600 to-purple-600',
    accentBg: 'border-pink-500/50 bg-pink-950/30'
  }
];

export const ViceRadioApp: React.FC = () => {
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(80);

  const activeStation = RADIO_STATIONS[currentStationIndex];

  const handleSelectStation = (index: number) => {
    setCurrentStationIndex(index);
    setIsPlaying(true);
    audioEngine.setRadioStation(RADIO_STATIONS[index].id);
  };

  const handleNextStation = () => {
    const nextIdx = (currentStationIndex + 1) % RADIO_STATIONS.length;
    handleSelectStation(nextIdx);
  };

  const handlePrevStation = () => {
    const prevIdx = (currentStationIndex - 1 + RADIO_STATIONS.length) % RADIO_STATIONS.length;
    handleSelectStation(prevIdx);
  };

  const togglePlay = () => {
    audioEngine.playClick();
    const nextPlay = !isPlaying;
    setIsPlaying(nextPlay);
    audioEngine.toggleMusicPlayback(nextPlay);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    audioEngine.setMusicVolume(newVol / 100);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white select-none overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
      {/* 1. Header */}
      <div className="sticky top-0 z-20 p-3 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-pink-950 text-pink-400 rounded-lg border border-pink-500/40">
            <Radio className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <h3 className="text-xs font-black italic tracking-wide uppercase">ViceRadio Leonida</h3>
            <span className="text-[9px] font-mono text-zinc-400">FM Stereo DSP Streaming</span>
          </div>
        </div>

        <span className="text-[9px] font-mono font-bold bg-pink-600 text-white px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> EN VIVO
        </span>
      </div>

      {/* 2. Main Station Visualizer & Player Card */}
      <div className="p-4 flex flex-col items-center justify-between text-center border-b border-zinc-800/80 bg-gradient-to-b from-zinc-900/40 to-transparent">
        {/* Station Album Cover */}
        <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(255,42,133,0.35)] border-2 border-white/20 my-1">
          <img
            src={activeStation.coverImage}
            alt={activeStation.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isPlaying ? 'scale-105 animate-pulse' : 'grayscale opacity-70'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-xs font-mono">
            <span className="text-[10px] bg-black/80 px-2 py-0.5 rounded text-cyan-300 font-bold border border-cyan-500/40">
              {activeStation.frequency}
            </span>
            <Disc3 className={`w-4 h-4 text-pink-400 ${isPlaying ? 'animate-spin' : ''}`} />
          </div>
        </div>

        {/* Track & Artist Info */}
        <div className="space-y-1 my-2 max-w-full">
          <span className="text-[10px] font-mono font-bold text-pink-400 uppercase tracking-widest block">
            {activeStation.name}
          </span>
          <h4 className="text-base font-black text-white italic truncate max-w-[260px] mx-auto">
            {activeStation.currentTrack}
          </h4>
          <p className="text-xs text-zinc-400 font-medium truncate max-w-[260px] mx-auto">
            {activeStation.artist}
          </p>
          <span className="text-[9px] font-mono text-zinc-500 block">
            {activeStation.genre}
          </span>
        </div>

        {/* Animated Frequency Equalizer Bars */}
        <div className="flex items-center justify-center space-x-1.5 h-7 my-1.5">
          {[40, 75, 100, 60, 90, 45, 80, 65, 95, 50, 85, 30].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full bg-gradient-to-t ${activeStation.themeColor} transition-all duration-150`}
              style={{
                height: isPlaying ? `${Math.max(15, h * (volume / 100))}%` : '15%'
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="w-full space-y-3 pt-2">
          <div className="flex items-center justify-center space-x-5">
            <button
              onClick={handlePrevStation}
              className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 rounded-full text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95"
              title="Emisora Anterior"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="p-3.5 bg-gradient-to-r from-pink-600 via-orange-500 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white rounded-full shadow-[0_0_20px_rgba(255,42,133,0.5)] transform active:scale-95 transition-all cursor-pointer"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>

            <button
              onClick={handleNextStation}
              className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 rounded-full text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95"
              title="Siguiente Emisora"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 px-3">
            {volume === 0 ? (
              <VolumeX className="w-4 h-4 text-zinc-500 shrink-0" />
            ) : (
              <Volume2 className="w-4 h-4 text-pink-400 shrink-0" />
            )}
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
            <span className="text-[10px] font-mono text-zinc-400 shrink-0 w-7 text-right">
              {volume}%
            </span>
          </div>
        </div>
      </div>

      {/* 3. Direct Stations Selection List */}
      <div className="p-3.5 space-y-2 pb-8">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold flex items-center gap-1">
            <Music className="w-3 h-3 text-cyan-400" /> Sintonizar Emisoras de Leonida ({RADIO_STATIONS.length})
          </span>
          <span className="text-[9px] font-mono text-zinc-500">Toca para cambiar</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {RADIO_STATIONS.map((station, idx) => {
            const isSelected = idx === currentStationIndex;
            return (
              <button
                key={station.id}
                onClick={() => handleSelectStation(idx)}
                className={`w-full p-2.5 rounded-2xl border text-left flex items-center space-x-3 transition-all cursor-pointer ${
                  isSelected
                    ? `${station.accentBg} border-pink-500 shadow-md ring-1 ring-pink-500/50`
                    : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850'
                }`}
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-zinc-700">
                  <img
                    src={station.coverImage}
                    alt={station.name}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-pink-600/40 backdrop-blur-xs flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 truncate">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{station.name}</span>
                    <span className="text-[9px] font-mono font-bold text-cyan-400 bg-black/60 px-1.5 py-0.2 rounded shrink-0">
                      {station.frequency}
                    </span>
                  </div>
                  <p className="text-[10px] text-pink-300 font-mono truncate">{station.currentTrack}</p>
                  <p className="text-[9px] text-zinc-400 truncate">{station.genre}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
