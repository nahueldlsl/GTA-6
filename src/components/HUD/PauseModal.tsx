// ============================================================================
// 🌴 PAUSE MENU & STORY SELECTOR MODAL (Level Select / Settings / Debug)
// ============================================================================

import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { STORY_NODES } from '../../data/storyGraph';
import {
  Play,
  Clock,
  RefreshCw,
  X,
  MapPin,
  Compass
} from 'lucide-react';

export const PauseModal: React.FC = () => {
  const {
    isPauseModalOpen,
    togglePauseModal,
    toggleMap,
    timerMode,
    setTimerMode,
    jumpToNode,
    restartGame,
    currentNodeId
  } = useGameStore();

  if (!isPauseModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-zinc-950 border-2 border-cyan-500/60 p-6 rounded-3xl max-w-lg w-full space-y-5 shadow-[0_0_60px_rgba(0,240,255,0.3)] ring-4 ring-black/90 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
              VICE DYNASTY • SISTEMA DE CONTROL
            </span>
            <h2 className="text-xl sm:text-2xl font-black italic tracking-wider text-white uppercase mt-0.5">
              JUEGO PAUSADO
            </h2>
          </div>
          <button
            onClick={() => togglePauseModal(false)}
            className="text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Actions */}
        <div className="space-y-2.5">
          <button
            onClick={() => togglePauseModal(false)}
            className="w-full py-3.5 bg-gradient-to-r from-pink-600 via-red-500 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" /> Reanudar Partida
          </button>
        </div>

        {/* Game Mode Selector (Narrative vs Intense Timer) */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-pink-400" /> Modo de Experiencia
            </span>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
              {timerMode === 'INTENSE' ? '🔥 4s Heartbeat' : '📖 Narrativo / Libre'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setTimerMode('NARRATIVE')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                timerMode === 'NARRATIVE'
                  ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-sm'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <div className="text-xs font-bold text-cyan-300">Narrativo (Recomendado)</div>
              <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                Sin prisa: lee los diálogos y avanza a tu ritmo con el botón.
              </p>
            </button>

            <button
              onClick={() => setTimerMode('INTENSE')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                timerMode === 'INTENSE'
                  ? 'bg-pink-950/50 border-pink-500 text-white shadow-sm'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <div className="text-xs font-bold text-pink-300">Intenso (Hardcore)</div>
              <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                Decisiones críticas de 4 segundos con latidos cardíacos.
              </p>
            </button>
          </div>

          {/* Quick Open Map in Free Roam */}
          <button
            onClick={() => {
              togglePauseModal(false);
              toggleMap(true);
            }}
            className="w-full mt-1.5 py-2.5 bg-zinc-950 hover:bg-zinc-850 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Compass className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Abrir Mapa de Leonida State (Tab)</span>
          </button>
        </div>

        {/* Level / Scene Selector (DAG Debugger) */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-400" /> Selector de Capítulos / Escenas
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">Salta a cualquier nodo</span>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
            {Object.values(STORY_NODES).map((node) => {
              const isCurrent = node.id === currentNodeId;
              return (
                <button
                  key={node.id}
                  onClick={() => {
                    jumpToNode(node.id);
                    togglePauseModal(false);
                  }}
                  className={`w-full p-2 rounded-xl text-left border transition-all flex items-center justify-between text-xs cursor-pointer ${
                    isCurrent
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                      : 'bg-zinc-950 border-zinc-850 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="text-[9px] font-mono text-zinc-400 block uppercase">
                      {node.actTitle}
                    </span>
                    <span className="font-bold truncate block">{node.chapterTitle}</span>
                  </div>
                  {isCurrent ? (
                    <span className="text-[9px] font-mono bg-cyan-500 text-black px-1.5 py-0.5 rounded font-bold shrink-0">
                      ACTUAL
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-zinc-400 shrink-0">
                      Cargar ➔
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-xs">
          <button
            onClick={() => {
              restartGame();
              togglePauseModal(false);
            }}
            className="text-red-400 hover:text-red-300 font-mono flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reiniciar Historia Completa
          </button>
          <span className="text-[10px] font-mono text-zinc-500">v1.0.0 • Leonida Engine</span>
        </div>
      </div>
    </div>
  );
};
