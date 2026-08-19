// ============================================================================
// 🌴 GTA WANTED LEVEL STARS COMPONENT (AUTHENTIC GTA VI ANIMATION)
// ============================================================================

import React from 'react';
import { Star, ShieldAlert, Radio } from 'lucide-react';
import { audioEngine } from '../../engine/audioEngine';

interface WantedStarsProps {
  heatLevel: number;
  isEvadingPolice: boolean;
}

export const WantedStars: React.FC<WantedStarsProps> = ({
  heatLevel,
  isEvadingPolice
}) => {
  const isWanted = heatLevel > 0;

  const getContainerStyles = () => {
    if (!isWanted) {
      return 'border-zinc-800 bg-zinc-900/90 text-zinc-600';
    }
    if (isEvadingPolice) {
      return 'border-yellow-500/70 bg-yellow-950/40 shadow-[0_0_15px_rgba(250,204,21,0.35)]';
    }
    return 'border-red-600/80 bg-red-950/50 shadow-[0_0_20px_rgba(255,0,60,0.45)]';
  };

  const getTooltip = () => {
    if (!isWanted) {
      return 'Sin Nivel de Búsqueda Policial (Tranquilo)';
    }
    if (isEvadingPolice) {
      return `Nivel ${heatLevel} ★ (EVADIENDO: La policía perdió tu rastro. Evítalos con decisiones silenciosas)`;
    }
    return `Nivel ${heatLevel} ★ (PERSECUCIÓN ACTIVA: La policía de Leonida te busca)`;
  };

  return (
    <div
      className={`px-2 py-1 rounded-lg border flex items-center space-x-1 shadow-sm transition-all select-none ${getContainerStyles()}`}
      title={getTooltip()}
    >
      {/* Mini status indicator icon */}
      {isWanted && (
        <span className="mr-0.5 text-xs">
          {isEvadingPolice ? (
            <Radio className="w-3 h-3 text-yellow-400 animate-spin inline-block" />
          ) : (
            <ShieldAlert className="w-3 h-3 text-red-500 animate-pulse inline-block" />
          )}
        </span>
      )}

      {/* 5 Stars */}
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((starNum) => {
          const starActive = starNum <= heatLevel;

          return (
            <Star
              key={starNum}
              className={`w-3.5 sm:w-4 h-3.5 sm:h-4 transition-colors ${
                starActive
                  ? isEvadingPolice
                    ? 'animate-gta-star-evading fill-current'
                    : 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.9)] animate-gta-star-active'
                  : 'text-zinc-700 fill-zinc-800/80'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
