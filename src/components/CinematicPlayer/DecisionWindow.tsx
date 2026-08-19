// ============================================================================
// 🌴 ZERO-OVERLAP DECISION WINDOW COMPONENT
// ============================================================================

import React from 'react';
import type { StoryChoice } from '../../types/game';
import { Flame, ChevronRight } from 'lucide-react';
import { DANGER_LEVEL_STYLES } from '../../constants/hud';

interface DecisionWindowProps {
  choices: StoryChoice[];
  timerMode: 'NARRATIVE' | 'INTENSE' | 'FREE_ROAM';
  timerProgress: number;
  timeRemaining: number;
  isPaused: boolean;
  onChoiceClick: (choice: StoryChoice) => void;
  dialogueSubtitle?: string;
  speaker?: string;
}

export const DecisionWindow: React.FC<DecisionWindowProps> = ({
  choices,
  timerMode,
  timerProgress,
  timeRemaining,
  isPaused,
  onChoiceClick,
  dialogueSubtitle,
  speaker
}) => {
  return (
    <>
      {/* 1. INTEGRATED DIALOGUE & SUBTITLES CARD */}
      {dialogueSubtitle && (
        <div className="mb-3 text-center pointer-events-none">
          <div className="backdrop-blur-xl bg-black/90 border border-zinc-700/90 px-5 py-2.5 rounded-2xl shadow-2xl inline-block max-w-full">
            {speaker && (
              <span className="text-[11px] font-mono tracking-widest text-pink-400 font-bold block mb-0.5 uppercase">
                ◆ {speaker}
              </span>
            )}
            <p className="text-xs sm:text-sm text-zinc-100 font-medium leading-relaxed drop-shadow-md">
              "{dialogueSubtitle}"
            </p>
          </div>
        </div>
      )}

      {/* 2. Heartbeat Timer Bar (Intense Mode Only) */}
      {timerMode === 'INTENSE' && (
        <div className="mb-3">
          <div className="flex justify-between items-center text-xs font-mono text-pink-400 mb-1 font-bold">
            <span className="flex items-center gap-1.5 animate-pulse">
              <Flame className="w-3.5 h-3.5 text-red-500" /> DECISIÓN CRÍTICA
            </span>
            <span>{`${timeRemaining.toFixed(1)}s`}</span>
          </div>
          <div className="w-full h-2 bg-black/80 rounded-full border border-pink-500/50 overflow-hidden shadow-[0_0_15px_rgba(255,42,133,0.6)]">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-400 transition-all duration-75"
              style={{ width: `${timerProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Choices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {choices.map((choice) => {
          const dangerStyle = DANGER_LEVEL_STYLES[choice.dangerLevel || 'LOW'];

          return (
            <button
              key={choice.id}
              onClick={() => onChoiceClick(choice)}
              disabled={choice.isLocked || isPaused}
              className={`group relative text-left backdrop-blur-xl bg-black/85 border-2 p-3.5 rounded-xl shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer ${dangerStyle} ${
                choice.isLocked ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-black/70 border border-current">
                      {choice.dangerLevel}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                    {choice.label}
                  </h4>
                  {choice.sublabel && (
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug line-clamp-2">
                      {choice.sublabel}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2 mt-1" />
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
};
