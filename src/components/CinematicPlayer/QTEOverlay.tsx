// ============================================================================
// 🌴 QTE INTERACTIVE RETICLE OVERLAY
// ============================================================================

import React from 'react';
import type { QTEEvent } from '../../types/game';
import { Zap } from 'lucide-react';

interface QTEOverlayProps {
  qte: QTEEvent;
  qteProgress: number;
  timerMode: 'NARRATIVE' | 'INTENSE' | 'FREE_ROAM';
  isPaused: boolean;
  onTrigger: () => void;
}

export const QTEOverlay: React.FC<QTEOverlayProps> = ({
  qte,
  qteProgress,
  timerMode,
  isPaused,
  onTrigger
}) => {
  return (
    <div className="relative z-30 self-center my-auto flex flex-col items-center animate-bounce">
      <button
        onClick={() => {
          if (isPaused) return;
          onTrigger();
        }}
        className="group cursor-pointer backdrop-blur-2xl bg-gradient-to-br from-pink-600 via-orange-500 to-cyan-500 border-4 border-white p-7 sm:p-9 rounded-full shadow-[0_0_60px_rgba(255,42,133,0.9)] transform active:scale-95 transition-all ring-8 ring-pink-500/30"
      >
        <Zap className="w-10 h-10 sm:w-14 sm:h-14 text-white fill-white animate-pulse" />
      </button>

      <div className="mt-4 text-center">
        <span className="bg-black/90 border border-pink-500 px-5 py-2 rounded-full text-xs sm:text-sm font-black text-white tracking-widest uppercase shadow-2xl">
          {qte.instructionText}
        </span>
        <div className="text-[11px] font-mono text-pink-300 mt-2 font-bold">
          [ Presiona <span className="underline text-white font-black">{qte.keyRequired || 'ESPACIO'}</span> o Toca el círculo ]
        </div>
        {timerMode === 'INTENSE' && (
          <div className="w-48 bg-zinc-900 h-2 rounded-full mx-auto mt-2.5 overflow-hidden border border-pink-500/50">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-orange-400 transition-all duration-75"
              style={{ width: `${qteProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
