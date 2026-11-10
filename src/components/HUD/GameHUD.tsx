// ============================================================================
// 🌴 UNIFIED TOP HEADS-UP DISPLAY (HUD) - ZERO OVERLAP ARCHITECTURE
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { useGameStore, PROTAGONIST_PERKS } from '../../store/gameStore';
import { getMergedStoryNodes } from '../../store/editorStore';
import { audioEngine } from '../../engine/audioEngine';
import { FinancesDisplay } from './FinancesDisplay';
import { ChapterBanner } from './ChapterBanner';
import { WantedStars } from './WantedStars';
import { CrewModal } from './CrewModal';
import { HistoryModal } from './HistoryModal';
import {
  Smartphone,
  Volume2,
  VolumeX,
  History,
  Users,
  Pause,
  Compass,
  Car
} from 'lucide-react';

export const GameHUD: React.FC = () => {
  const {
    cleanCash,
    dirtyCash,
    heatLevel,
    respect,
    togglePhone,
    unreadSignalCount,
    history,
    jumpToNode,
    currentNodeId,
    togglePauseModal,
    toggleMap,
    isPauseModalOpen,
    isEvadingPolice,
    activeProtagonist,
    switchProtagonist,
    isDrivingMode,
    toggleDrivingMode
  } = useGameStore();

  const [isMuted, setIsMuted] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCrewModal, setShowCrewModal] = useState(false);

  const mergedNodes = getMergedStoryNodes();
  const currentNode = mergedNodes[currentNodeId] || mergedNodes['node_act1_keys_workshop'] || mergedNodes['node_new_cinematic_1'];

  // Trigger police radio siren on wanted level escalation
  const previousHeatRef = useRef(heatLevel);
  useEffect(() => {
    if (heatLevel > previousHeatRef.current && heatLevel > 0) {
      audioEngine.playWantedLevelChange(heatLevel);
    }
    previousHeatRef.current = heatLevel;
  }, [heatLevel]);

  // Pause radio when pause menu is open
  useEffect(() => {
    audioEngine.setGamePaused(isPauseModalOpen);
  }, [isPauseModalOpen]);

  const activePerk = PROTAGONIST_PERKS[activeProtagonist];

  const toggleSound = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 py-2.5 backdrop-blur-xl bg-black/80 border-b border-zinc-800/80 shadow-2xl select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* 1. LEFT COLUMN: FINANCES & SYNDICATE RESPECT */}
          <FinancesDisplay
            cleanCash={cleanCash}
            dirtyCash={dirtyCash}
            respect={respect}
          />

          {/* 2. CENTER COLUMN: INTEGRATED LOCATION & CHAPTER BANNER */}
          <ChapterBanner currentNode={currentNode} />

          {/* 3. RIGHT COLUMN: WANTED STARS, MODALS, SOUND, PAUSE & VICE-OS */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Wanted Stars (0 to 5) - Strictly Choice Driven */}
            <WantedStars
              heatLevel={heatLevel}
              isEvadingPolice={isEvadingPolice}
            />

            {/* Protagonist Switcher (Jason <-> Lucia) with Passive Perk */}
            <button
              onClick={() => switchProtagonist(activeProtagonist === 'jason' ? 'lucia' : 'jason')}
              className="bg-zinc-900 hover:bg-zinc-800 border border-pink-500/50 hover:border-pink-400 text-white p-1 sm:px-2 sm:py-1 rounded-lg transition-all active:scale-95 flex items-center space-x-1.5 text-xs font-mono cursor-pointer"
              title={`Cambiar Protagonista [C] • Activo: ${activeProtagonist.toUpperCase()} (${activePerk.name}: ${activePerk.description})`}
            >
              <img
                src={
                  activeProtagonist === 'lucia'
                    ? '/assets/gta6/People/Lucia Caminos/Lucia_Caminos_01.jpg'
                    : '/assets/gta6/People/Jason Duval/Jason_Duval_01.jpg'
                }
                alt={activeProtagonist}
                className="w-5 h-5 rounded-full object-cover border border-pink-400"
              />
              <span className="hidden md:inline text-[11px] font-bold uppercase text-pink-300">
                {activeProtagonist}
              </span>
              <span className="text-[9px] text-zinc-500 hidden lg:inline">[C]</span>
            </button>

            {/* Free-Roam 2D Map Driving Toggle */}
            <button
              onClick={() => toggleDrivingMode()}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg border transition-all active:scale-95 flex items-center space-x-1 text-xs font-mono cursor-pointer ${
                isDrivingMode
                  ? 'bg-cyan-500 text-black border-cyan-300 font-bold'
                  : 'bg-zinc-900 hover:bg-cyan-950/80 border-zinc-750 hover:border-cyan-400 text-cyan-300'
              }`}
              title="Modo Conducción Libre 2D en Leonida (Tecla G)"
            >
              <Car className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[11px] font-bold">Manejar</span>
              <span className="text-[9px] opacity-75 hidden sm:inline">[G]</span>
            </button>

            {/* Crew Status Modal Button */}
            <button
              onClick={() => setShowCrewModal(true)}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 hover:border-cyan-400 text-zinc-300 p-1.5 sm:px-2.5 sm:py-1 rounded-lg transition-all active:scale-95 flex items-center space-x-1 text-xs font-mono cursor-pointer"
              title="Lealtad de Tripulación"
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xl:inline text-[11px]">Equipo</span>
            </button>

            {/* History DAG Tree Button */}
            <button
              onClick={() => setShowHistoryModal(true)}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 hover:border-cyan-400 text-zinc-300 p-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
              title="Historial de Decisiones"
            >
              <History className="w-3.5 h-3.5 text-zinc-300" />
            </button>

            {/* Leonida Interactive Map Button */}
            <button
              onClick={() => toggleMap(true)}
              className="bg-zinc-900 hover:bg-cyan-950/80 border border-zinc-750 hover:border-cyan-400 text-cyan-300 p-1.5 sm:px-2.5 sm:py-1 rounded-lg transition-all active:scale-95 flex items-center space-x-1 text-xs font-mono cursor-pointer shadow-md"
              title="Abrir Mapa de Leonida (Tecla Tab)"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span className="hidden lg:inline text-[11px] font-bold">Mapa</span>
              <span className="text-[9px] text-zinc-500 hidden sm:inline">[Tab]</span>
            </button>

            {/* Audio Mute Toggle */}
            <button
              onClick={toggleSound}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 hover:border-pink-500 text-zinc-300 p-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
              title="Silenciar / Activar Audio"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-red-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-pink-400" />
              )}
            </button>

            {/* Pause Button */}
            <button
              onClick={() => togglePauseModal(true)}
              className={`p-1.5 px-2 rounded-lg border transition-all active:scale-95 cursor-pointer flex items-center space-x-1 ${
                isPauseModalOpen
                  ? 'bg-yellow-500 text-black border-yellow-400 font-bold'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-750 text-zinc-300 hover:text-white'
              }`}
              title="Pausar Juego (P)"
            >
              <Pause className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono hidden sm:inline">[P]</span>
            </button>

            {/* ViceOS Phone Button */}
            <button
              onClick={() => togglePhone(true)}
              className="relative bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white px-2.5 sm:px-3 py-1 rounded-lg shadow-[0_0_20px_rgba(255,0,128,0.5)] transition-all transform active:scale-95 flex items-center space-x-1.5 cursor-pointer"
              title="Abrir Smartphone ViceOS (Tecla M)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider hidden sm:inline">
                ViceOS <span className="text-[9px] opacity-75 font-normal">[M]</span>
              </span>
              {unreadSignalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-pink-600 text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center border border-black animate-bounce">
                  {unreadSignalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* CREW LOYALTY MODAL */}
      <CrewModal
        isOpen={showCrewModal}
        onClose={() => setShowCrewModal(false)}
      />

      {/* HISTORY / TIMELINE MODAL */}
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={history}
        onRewind={jumpToNode}
      />
    </>
  );
};
