// ============================================================================
// 🌴 VICE-OS: INSTAVICE SATIRICAL SOCIAL FEED & STORIES APP (GTA VI LEONIDA)
// ============================================================================

import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { audioEngine } from '../../engine/audioEngine';
import { StoryViewerModal } from './StoryViewerModal';
import { OFFICIAL_GTA6_STORIES } from '../../data/storyReels.data';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  CheckCircle2,
  TrendingUp,
  Flame,
  Play,
  Camera,
  Eye,
  Music,
  Sparkles,
  Layers
} from 'lucide-react';

type InstaViceTab = 'STORIES' | 'FEED' | 'TRENDS';

export const InstaViceApp: React.FC = () => {
  const { instaPosts } = useGameStore();
  const [activeTab, setActiveTab] = useState<InstaViceTab>('STORIES');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  const toggleLike = (postId: string) => {
    audioEngine.playViralReaction();
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleOpenStory = (index: number) => {
    audioEngine.playClick();
    setActiveStoryIndex(index);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white select-none overflow-hidden">
      {/* 1. APP HEADER & BRAND */}
      <div className="bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 px-3.5 py-2.5 flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-pink-600 via-orange-500 to-cyan-500">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black italic tracking-wider bg-gradient-to-r from-pink-500 via-orange-400 to-cyan-400 bg-clip-text text-transparent">
              InstaVice
            </h3>
            <span className="text-[9px] font-mono text-zinc-400 block -mt-0.5">
              Leonida 5G Live
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-[10px] font-mono text-pink-400 bg-pink-950/70 px-2 py-0.5 rounded-full border border-pink-800/60">
          <TrendingUp className="w-3 h-3" />
          <span>#ViceViral</span>
        </div>
      </div>

      {/* 2. TOP SEGMENTED NAVIGATION TABS */}
      <div className="flex border-b border-zinc-800 bg-zinc-900/80 p-1.5 shrink-0 gap-1">
        <button
          onClick={() => {
            audioEngine.playClick();
            setActiveTab('STORIES');
          }}
          className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'STORIES'
              ? 'bg-gradient-to-r from-pink-600 to-orange-500 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Historias ({OFFICIAL_GTA6_STORIES.length})</span>
        </button>

        <button
          onClick={() => {
            audioEngine.playClick();
            setActiveTab('FEED');
          }}
          className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'FEED'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-500 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Feed ({instaPosts.length})</span>
        </button>

        <button
          onClick={() => {
            audioEngine.playClick();
            setActiveTab('TRENDS');
          }}
          className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'TRENDS'
              ? 'bg-zinc-800 text-pink-400 border border-pink-500/40 shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Tendencias</span>
        </button>
      </div>

      {/* 3. MAIN TAB CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-zinc-800 space-y-3 pb-16">
        
        {/* TAB 1: DEDICATED STORIES & REELS GALLERY */}
        {activeTab === 'STORIES' && (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-pink-950/50 via-purple-950/40 to-cyan-950/40 p-3 rounded-2xl border border-pink-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-pink-300 uppercase block">
                  HISTORIAS EN VIVO DE LEONIDA
                </span>
                <p className="text-[11px] text-zinc-300 leading-tight mt-0.5">
                  Toca cualquier tarjeta para ver la historia completa con música y reacciones.
                </p>
              </div>
              <span className="text-[9px] font-mono bg-pink-600 text-white px-2 py-0.5 rounded-full shrink-0 animate-pulse">
                AUTO-PLAY
              </span>
            </div>

            {/* Stories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {OFFICIAL_GTA6_STORIES.map((story, i) => (
                <div
                  key={story.id}
                  onClick={() => handleOpenStory(i)}
                  className="group relative rounded-2xl overflow-hidden border border-zinc-800 hover:border-pink-500 bg-zinc-900 shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:scale-98 transition-all flex flex-col h-56"
                >
                  {/* Background Image Preview */}
                  <div className="relative flex-1 overflow-hidden">
                    <img
                      src={story.mediaUrl}
                      alt={story.username}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />

                    {/* Author Stamp on Top */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                      <div className="flex items-center space-x-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
                        <img
                          src={story.avatar}
                          alt={story.username}
                          className="w-5 h-5 rounded-full object-cover border border-pink-400"
                        />
                        <span className="text-[10px] font-bold text-white truncate max-w-[90px]">
                          {story.username}
                        </span>
                        {story.verified && (
                          <CheckCircle2 className="w-3 h-3 text-cyan-400 fill-cyan-400 shrink-0" />
                        )}
                      </div>

                      <span className="text-[9px] font-mono text-zinc-300 bg-black/70 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5 text-pink-400" />
                        {story.views}
                      </span>
                    </div>

                    {/* Big Center Play Overlay Button */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-11 h-11 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,42,133,0.7)] group-hover:scale-115 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Caption & Audio Info */}
                  <div className="p-2.5 bg-zinc-950 border-t border-zinc-800/80 space-y-1">
                    <p className="text-[11px] text-zinc-200 line-clamp-2 leading-tight">
                      {story.caption}
                    </p>
                    <div className="flex items-center space-x-1 text-[9px] font-mono text-cyan-400 truncate">
                      <Music className="w-2.5 h-2.5 shrink-0 animate-spin" />
                      <span className="truncate">{story.musicTrack}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: POSTS FEED */}
        {activeTab === 'FEED' && (
          <div className="space-y-4">
            {/* Pinned Top Stories Ribbon */}
            <div className="bg-zinc-900/60 p-2.5 rounded-2xl border border-zinc-800">
              <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold block mb-2 px-1">
                Historias Rápidas:
              </span>
              <div className="flex space-x-3 overflow-x-auto scrollbar-none pb-1">
                {OFFICIAL_GTA6_STORIES.map((story, i) => (
                  <button
                    key={story.id}
                    onClick={() => handleOpenStory(i)}
                    className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer group transform hover:scale-105 active:scale-95 transition-all text-left"
                  >
                    <div className="p-[2px] rounded-full bg-gradient-to-tr from-pink-500 via-orange-500 to-cyan-400 group-hover:shadow-[0_0_12px_rgba(255,42,133,0.8)]">
                      <div className="w-11 h-11 bg-zinc-950 rounded-full flex items-center justify-center border-2 border-black overflow-hidden relative">
                        <img
                          src={story.mediaUrl}
                          alt={story.username}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="w-3 h-3 text-white fill-white opacity-80" />
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-medium text-zinc-300 max-w-[55px] truncate">
                      {story.username.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Stream */}
            <div className="space-y-3">
              {instaPosts.map((post) => {
                const isLiked = !!likedPosts[post.id];
                const likesCount = isLiked ? post.likes + 1 : post.likes;

                return (
                  <div
                    key={post.id}
                    className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 space-y-2.5 shadow-md"
                  >
                    {/* Post Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 overflow-hidden shrink-0">
                          {post.avatar && (post.avatar.startsWith('/') || post.avatar.includes('.')) ? (
                            <img
                              src={post.avatar}
                              alt={post.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            post.avatar
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs font-bold text-zinc-100">{post.username}</span>
                            {post.isVerified && (
                              <CheckCircle2 className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                            )}
                            {post.badge && (
                              <span className="text-[8px] bg-red-950 text-red-400 border border-red-800 px-1 rounded font-mono">
                                {post.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-400 block">{post.handle}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">{post.timeAgo}</span>
                    </div>

                    {/* Media Container */}
                    <div className="w-full h-44 bg-zinc-950 border border-zinc-800 rounded-xl relative overflow-hidden group shadow-inner">
                      <img
                        src={post.mediaUrl}
                        alt={post.caption}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2 left-2 flex items-center space-x-1 text-[9px] font-mono text-zinc-200 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-zinc-700/60">
                        <Flame className="w-3 h-3 text-orange-400" />
                        <span>LEONIDA STATE • 4K</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className="flex items-center space-x-1.5 text-xs active:scale-95 transition-all cursor-pointer"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              isLiked ? 'text-pink-500 fill-pink-500' : 'text-zinc-400 hover:text-pink-400'
                            }`}
                          />
                          <span className="font-mono text-zinc-300 font-bold">{likesCount.toLocaleString()}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-xs text-zinc-400 hover:text-cyan-400 cursor-pointer">
                          <MessageCircle className="w-4 h-4" />
                          <span className="font-mono">{post.commentsCount}</span>
                        </button>
                        <button className="text-zinc-400 hover:text-white cursor-pointer">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="text-zinc-400 hover:text-white cursor-pointer">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Caption */}
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      <span className="font-bold text-white mr-1.5">{post.username}</span>
                      {post.caption}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: TRENDING HASHTAGS & VIRAL HIGHLIGHTS */}
        {activeTab === 'TRENDS' && (
          <div className="space-y-3">
            <div className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-pink-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> Tendencias en Leonida State
              </h4>

              {[
                { tag: '#ViceViral', posts: '4.8M publicaciones', category: 'Viral en Vice City' },
                { tag: '#FirstNationalBank', posts: '1.2M publicaciones', category: 'Noticias y Seguridad' },
                { tag: '#AlligatorHighway', posts: '890K publicaciones', category: 'Sucesos Grassrivers' },
                { tag: '#OceanDriveRaces', posts: '640K publicaciones', category: 'Deportes Callejeros' },
                { tag: '#LeonidaKeysSun', posts: '510K publicaciones', category: 'Estilo de Vida' }
              ].map((trend, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-850 flex justify-between items-center hover:border-pink-500/50 transition-colors cursor-pointer"
                  onClick={() => {
                    audioEngine.playViralReaction();
                    setActiveTab('STORIES');
                  }}
                >
                  <div>
                    <span className="text-[9px] font-mono text-zinc-500 block">{trend.category}</span>
                    <span className="text-xs font-bold text-white font-mono">{trend.tag}</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400">{trend.posts}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. FULL-SCREEN INTERACTIVE STORY VIEWER MODAL */}
      {activeStoryIndex !== null && (
        <StoryViewerModal
          initialIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
        />
      )}
    </div>
  );
};
