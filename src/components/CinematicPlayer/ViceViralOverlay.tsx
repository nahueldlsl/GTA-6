// ============================================================================
// 🌴 VICE VIRAL LIVE STREAM OVERLAY (TikTok/Reels format in Leonida)
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { VIRAL_LIVE_COMMENTS } from '../../constants/hud';

interface ViceViralOverlayProps {
  isActive: boolean;
}

export const ViceViralOverlay: React.FC<ViceViralOverlayProps> = ({ isActive }) => {
  const [floatingReactions, setFloatingReactions] = useState<
    Array<{ id: number; icon: string; left: number }>
  >([]);

  useEffect(() => {
    if (!isActive) {
      setFloatingReactions([]);
      return;
    }

    const interval = setInterval(() => {
      const icons = ['❤️', '🔥', '💀', '💸', '🐊', '🚨'];
      const newReaction = {
        id: Date.now() + Math.random(),
        icon: icons[Math.floor(Math.random() * icons.length)],
        left: 65 + Math.random() * 25
      };

      setFloatingReactions((prev) => [...prev.slice(-8), newReaction]);
    }, 800);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="absolute right-4 top-28 bottom-32 w-72 sm:w-80 pointer-events-none z-30 flex flex-col justify-end">
      {/* Live badge & viewer count */}
      <div className="backdrop-blur-md bg-black/80 border border-pink-500/60 self-end px-3 py-1 rounded-full flex items-center space-x-2 text-[10px] font-mono text-white mb-2 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-live" />
        <span className="font-bold text-pink-400">LIVE</span>
        <span>•</span>
        <span className="flex items-center space-x-1">
          <Eye className="w-3 h-3 text-cyan-400" />
          <span>1.8M</span>
        </span>
      </div>

      {/* Floating live comments list */}
      <div className="space-y-1.5 overflow-hidden max-h-64 flex flex-col justify-end">
        {VIRAL_LIVE_COMMENTS.slice(0, 4).map((comment, i) => (
          <div
            key={i}
            className="backdrop-blur-xl bg-black/75 border border-zinc-800/80 px-3 py-1.5 rounded-xl text-left shadow-lg transform transition-all"
          >
            <div className="flex items-center space-x-1.5 text-[10px] font-mono font-bold text-pink-400">
              <span>{comment.badge}</span>
              <span>{comment.user}</span>
            </div>
            <p className="text-xs text-white mt-0.5 leading-snug">{comment.text}</p>
          </div>
        ))}
      </div>

      {/* Floating animated reactions */}
      <div className="relative h-20 overflow-hidden pointer-events-none">
        {floatingReactions.map((r) => (
          <span
            key={r.id}
            className="absolute text-xl animate-float-reaction"
            style={{ left: `${r.left}%`, bottom: '0px' }}
          >
            {r.icon}
          </span>
        ))}
      </div>
    </div>
  );
};
