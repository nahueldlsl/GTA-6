// ============================================================================
// 🌴 HYBRID VIDEO & GTA VI 4K SCENE RENDERER WITH KEN BURNS & SHADER FX
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import type { VideoAsset } from '../../types/game';
import { audioEngine } from '../../engine/audioEngine';

interface HybridVideoRendererProps {
  video: VideoAsset;
  heatLevel: number;
  isEvadingPolice?: boolean;
  isQteActive?: boolean;
  isPaused?: boolean;
  onVideoEnd?: () => void;
}

// Map scene themeStyle to official GTA 6 photorealistic art & Places backdrops
const GTA6_BACKDROP_MAP: Record<string, string> = {
  yacht_heist: '/assets/gta6/Places/Leonida Keys/Leonida_Keys_01.jpg',
  sunset_drive: '/assets/gta6/Places/Vice City/Vice_City_02.jpg',
  dock_shootout: '/assets/gta6/Places/Port Gellhorn/Port_Gellhorn_01.jpg',
  police_chase: '/assets/gta6/Places/Port Gellhorn/Port_Gellhorn_03.jpg',
  club_babylon: '/assets/gta6/Places/Vice City/Vice_City_05.jpg',
  penthouse_deal: '/assets/gta6/Places/Vice City/Vice_City_04.jpg',
  crypto_vault: '/assets/gta6/Places/Vice City/Vice_City_08.jpg',
  helipad_climax: '/assets/gta6/Places/Vice City/Vice_City_09.jpg',
  swamp_chase: '/assets/gta6/Places/Grassrivers/Grassrivers_01.jpg',
  victory_neon: '/assets/gta6/Places/Vice City/Vice_City_06.jpg',
  island_escape: '/assets/gta6/Places/Leonida Keys/Leonida_Keys_03.jpg',
  prison_cell: '/assets/gta6/Places/Ambrosia/Ambrosia_01.jpg'
};

export const HybridVideoRenderer: React.FC<HybridVideoRendererProps> = ({
  video,
  heatLevel,
  isEvadingPolice = false,
  isQteActive,
  isPaused,
  onVideoEnd
}) => {
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [isVideoEnded, setIsVideoEnded] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Compute video source URL
  const videoSrc = video.url.startsWith('http') || video.url.startsWith('/')
    ? video.url
    : `/videos/${video.url}.mp4`;

  // Compute backdrop image URL
  const backdropImageSrc = video.posterImage || GTA6_BACKDROP_MAP[video.themeStyle] || '/assets/gta6/hero.jpg';

  useEffect(() => {
    setVideoLoaded(false);
    setVideoError(false);
    setImageLoaded(false);
    setIsVideoEnded(false);

    // Preload backdrop image
    const img = new Image();
    img.src = backdropImageSrc;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false);

    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.src = videoSrc;
      videoEl.muted = false;
      videoEl.volume = 1.0;
      videoEl.load();
    }
  }, [video.id, videoSrc, backdropImageSrc]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !videoLoaded) return;

    if (isPaused) {
      videoEl.pause();
    } else {
      videoEl.play().catch(() => {
        if (videoEl) {
          videoEl.muted = true;
          videoEl.play().catch(() => {});
        }
      });
    }
  }, [isPaused, videoLoaded]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black select-none pointer-events-none">
      <video
        ref={videoRef}
        poster={backdropImageSrc}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 z-0 ${
          videoLoaded && !videoError && !isVideoEnded ? 'opacity-100' : 'opacity-0'
        }`}
        playsInline
        autoPlay
        onLoadedData={() => {
          setVideoLoaded(true);
          setVideoError(false);
          setIsVideoEnded(false);
          audioEngine.stopMusic();
          if (videoRef.current && !isPaused) {
            videoRef.current.muted = false;
            videoRef.current.volume = 1.0;
            videoRef.current.play().catch(() => {
              if (videoRef.current) {
                videoRef.current.muted = true;
                videoRef.current.play().catch(() => {});
              }
            });
          }
        }}
        onError={() => {
          setVideoError(true);
          setVideoLoaded(false);
        }}
        onEnded={() => {
          setIsVideoEnded(true);
          if (onVideoEnd) {
            onVideoEnd();
          }
        }}
      />

      {/* 2. GTA VI 4K Pure Cinematic Scene Artwork with Gentle Motion */}
      {(!videoLoaded || videoError || isVideoEnded) && imageLoaded && (
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-black">
          <img
            src={backdropImageSrc}
            alt={video.title}
            className="w-full h-full object-cover transition-all duration-1000 scale-105 animate-ken-burns"
          />
        </div>
      )}
    </div>
  );
};
