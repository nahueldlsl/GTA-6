// ============================================================================
// 🌴 CANONICAL ENDING EPILOGUE SCREEN
// ============================================================================

import React from 'react';
import type { StoryNode } from '../../types/game';
import { Trophy, RefreshCw } from 'lucide-react';

interface EndingScreenProps {
  currentNode: StoryNode;
  onRestart: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({ currentNode, onRestart }) => {
  return (
    <div className="relative z-30 max-w-2xl mx-auto my-auto px-6 py-8 backdrop-blur-2xl bg-black/90 border-2 border-yellow-500/70 rounded-2xl shadow-[0_0_60px_rgba(255,200,0,0.3)] text-center">
      <Trophy className="w-14 h-14 text-yellow-400 mx-auto mb-3 animate-bounce" />
      <span className="text-xs font-mono text-yellow-400 tracking-widest uppercase font-bold">
        HISTORIA COMPLETADA
      </span>
      <h2 className="text-2xl sm:text-3xl font-black text-white italic uppercase tracking-wider mt-1">
        {currentNode.chapterTitle}
      </h2>
      <p className="text-xs sm:text-sm text-zinc-300 mt-3 leading-relaxed font-sans">
        Has forjado tu propio destino en las calles bañadas en sangre y neón de Sunport, Leonida State.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all transform active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Jugar Otra Ruta
        </button>
      </div>
    </div>
  );
};
