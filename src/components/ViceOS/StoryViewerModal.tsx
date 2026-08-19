// ============================================================================
// 🌴 INSTAVICE STORY & REELS INTERACTIVE VIEWER (GTA VI OFFICIAL AVIF ASSETS)
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { audioEngine } from '../../engine/audioEngine';
import { OFFICIAL_GTA6_STORIES } from '../../data/storyReels.data';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Volume2,
  VolumeX,
  Music,
  Eye,
  Sparkles
} from 'lucide-react';

interface StoryViewerModalProps {
  initialIndex?: number;
  onClose: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  initialIndex = 0,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [floatingEmojis, setFloatingEmojis] = useState<Array<{ id: number; icon: string; left: number }>>([]);

  const currentStory = OFFICIAL_GTA6_STORIES[currentIndex] || OFFICIAL_GTA6_STORIES[0];

  const handleNextStory = useCallback(() => {
    audioEngine.playClick();
    if (currentIndex < OFFICIAL_GTA6_STORIES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, onClose]);

  const handlePrevStory = useCallback(() => {
    audioEngine.playClick();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  // Story Auto-Advance Timer (6 seconds per story)
  useEffect(() => {
    setProgress(0);
    const duration = 6000; // 6s
    const step = 50;

    const interval = setInterval(() => {
      if (isPaused) return;

      setProgress((prev) => {
        const next = prev + (step / duration) * 100;
        if (next >= 100) {
          handleNextStory();
          return 0;
        }
        return next;
      });
    }, step);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, handleNextStory]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNextStory();
      } else if (e.key === 'ArrowLeft') {
        handlePrevStory();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextStory, handlePrevStory, onClose]);

  const handleSendReaction = (emoji: string) => {
    audioEngine.playViralReaction();
    setLikes((prev) => ({
      ...prev,
      [currentStory.id]: (prev[currentStory.id] || 0) + 1
    }));

    const newEmoji = {
      id: Date.now() + Math.random(),
      icon: emoji,
      left: 70 + Math.random() * 20
    };
    setFloatingEmojis((prev) => [...prev.slice(-6), newEmoji]);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/95 backdrop-blur-xl flex items-center justify-center p-0 sm:p-4 select-none animate-fadeIn">
      {/* Smartphone Story Container */}
      <div
        className="relative w-full max-w-md sm:max-w-lg h-full sm:h-[92vh] max-h-[820px] bg-black sm:rounded-[36px] overflow-hidden flex flex-col justify-between border-0 sm:border-2 sm:border-zinc-700 shadow-[0_0_70px_rgba(255,42,133,0.4)]"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* 1. BACKGROUND HIGH-RES GTA 6 STORY IMAGE */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={currentStory.mediaUrl}
            alt={currentStory.caption}
            className="w-full h-full object-cover object-center animate-ken-burns scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/70" />
          <div className="absolute inset-0 gta-scanlines opacity-20" />
        </div>

        {/* 2. TOP STORY PROGRESS BARS */}
        <div className="relative z-20 px-3 pt-3 flex space-x-1.5">
          {OFFICIAL_GTA6_STORIES.map((story, i) => {
            let fillPct = 0;
            if (i < currentIndex) fillPct = 100;
            else if (i === currentIndex) fillPct = progress;

            return (
              <div key={story.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 transition-all duration-75"
                  style={{ width: `${fillPct}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* 3. TOP AUTHOR BAR & CONTROLS */}
        <div className="relative z-20 px-4 pt-3 flex justify-between items-center text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-cyan-400 p-[2px] shadow-lg">
              <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center text-base overflow-hidden">
                {currentStory.avatar && (currentStory.avatar.startsWith('/') || currentStory.avatar.includes('.')) ? (
                  <img
                    src={currentStory.avatar}
                    alt={currentStory.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentStory.avatar
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-xs font-bold text-white drop-shadow-md">{currentStory.username}</span>
                {currentStory.verified && (
                  <Sparkles className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                )}
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-300">
                <span>{currentStory.handle}</span>
                <span>•</span>
                <span className="flex items-center space-x-1 text-pink-300">
                  <Eye className="w-2.5 h-2.5" />
                  <span>{currentStory.views}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4. TAP NAVIGATION ZONES (Left = Prev, Right = Next) */}
        <div className="relative z-10 flex-1 flex">
          <div
            className="w-1/3 h-full cursor-pointer flex items-center justify-start pl-2 opacity-0 hover:opacity-100 transition-opacity"
            onClick={handlePrevStory}
          >
            {currentIndex > 0 && (
              <div className="p-2 rounded-full bg-black/60 text-white">
                <ChevronLeft className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="w-1/3 h-full" />
          <div
            className="w-1/3 h-full cursor-pointer flex items-center justify-end pr-2 opacity-0 hover:opacity-100 transition-opacity"
            onClick={handleNextStory}
          >
            <div className="p-2 rounded-full bg-black/60 text-white">
              <ChevronRight className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 5. FLOATING REACTIONS */}
        <div className="absolute right-4 bottom-28 h-40 w-24 pointer-events-none z-25 overflow-hidden">
          {floatingEmojis.map((e) => (
            <span
              key={e.id}
              className="absolute text-2xl animate-float-reaction"
              style={{ left: `${e.left - 70}%`, bottom: '0px' }}
            >
              {e.icon}
            </span>
          ))}
        </div>

        {/* 6. BOTTOM CAPTION & INTERACTION BAR */}
        <div className="relative z-20 p-4 bg-gradient-to-t from-black via-black/80 to-transparent space-y-3">
          {/* Music track ticker */}
          <div className="flex items-center space-x-2 text-[10px] font-mono text-cyan-300 bg-black/70 px-3 py-1 rounded-full border border-cyan-500/30 w-fit backdrop-blur-md">
            <Music className="w-3 h-3 text-pink-400 animate-spin" />
            <span className="truncate max-w-[240px]">{currentStory.musicTrack}</span>
          </div>

          {/* Caption text */}
          <p className="text-xs sm:text-sm text-zinc-100 leading-relaxed drop-shadow-md">
            {currentStory.caption}
          </p>

          {/* Bottom Quick Reaction Row */}
          <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80">
            <div className="flex items-center space-x-2">
              {['🔥', '❤️', '💸', '🐊', '🚨'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleSendReaction(emoji)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-base transform active:scale-125 transition-transform cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSendReaction('❤️')}
                className="p-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white transition-all transform active:scale-95 cursor-pointer flex items-center space-x-1"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span className="text-[10px] font-mono font-bold">
                  {(likes[currentStory.id] || 0) + 120}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
