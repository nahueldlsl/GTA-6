// ============================================================================
// 🌴 ROCKSTAR LOCATION & TIMESTAMP STAMP CARD
// ============================================================================

import React from 'react';
import type { StoryNode } from '../../types/game';

interface LocationStampProps {
  currentNode: StoryNode;
}

export const LocationStamp: React.FC<LocationStampProps> = ({ currentNode }) => {
  return (
    <div className="absolute top-16 sm:top-20 left-4 sm:left-8 z-30 pointer-events-none animate-location-stamp">
      <div className="backdrop-blur-xl bg-black/85 border-l-4 border-pink-500 px-4 py-2.5 rounded-r-xl shadow-2xl">
        <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-pink-400 font-bold uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
          <span>LEONIDA STATE • {currentNode.district || 'VICE CITY'}</span>
        </div>
        <h2 className="text-base sm:text-lg font-black text-white italic tracking-wide uppercase mt-0.5">
          {currentNode.location}
        </h2>
        <div className="flex items-center space-x-3 text-[10px] font-mono text-zinc-400 mt-1">
          <span>📍 {currentNode.gpsCoords || '25.7617° N, 80.1918° W'}</span>
          <span>•</span>
          <span>23:45 EST</span>
        </div>
      </div>
    </div>
  );
};
