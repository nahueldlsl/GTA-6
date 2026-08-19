// ============================================================================
// 🌴 CHAPTER & LOCATION BANNER DISPLAY
// ============================================================================

import React from 'react';
import { Compass } from 'lucide-react';
import type { StoryNode } from '../../types/game';

interface ChapterBannerProps {
  currentNode: StoryNode;
}

export const ChapterBanner: React.FC<ChapterBannerProps> = ({ currentNode }) => {
  return (
    <div className="hidden lg:flex flex-col items-center text-center px-4 max-w-md truncate select-none">
      <div className="flex items-center space-x-1 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
        <Compass className="w-3 h-3 text-cyan-400" />
        <span>{currentNode.actTitle}</span>
      </div>
      <h3 className="text-xs sm:text-sm font-black text-white italic uppercase tracking-wide truncate max-w-full">
        {currentNode.chapterTitle}
      </h3>
      <span className="text-[9px] font-mono text-zinc-400 truncate max-w-full">
        📍 {currentNode.location}
      </span>
    </div>
  );
};
