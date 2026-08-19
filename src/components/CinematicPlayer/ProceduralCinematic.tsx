// ============================================================================
// 🌴 PROCEDURAL CINEMATIC CANVAS COMPONENT (High-End Neon & Atmosphere Shader)
// ============================================================================

import React, { useEffect, useRef } from 'react';
import type { VideoAsset } from '../../types/game';

interface ProceduralCinematicProps {
  video: VideoAsset;
  heatLevel: number;
  isEvadingPolice?: boolean;
  isQteActive?: boolean;
}

export const ProceduralCinematic: React.FC<ProceduralCinematicProps> = ({
  video,
  heatLevel,
  isEvadingPolice = false,
  isQteActive = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTimestamp: number | null = null;
    let time = 0;

    let logicalWidth = window.innerWidth;
    let logicalHeight = window.innerHeight;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      logicalWidth = window.innerWidth;
      logicalHeight = window.innerHeight;
      canvas.width = Math.floor(logicalWidth * dpr);
      canvas.height = Math.floor(logicalHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Particle pool for rain, dust and embers
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * logicalWidth,
      y: Math.random() * logicalHeight,
      speed: 120 + Math.random() * 300,
      size: 1 + Math.random() * 2.5,
      alpha: 0.2 + Math.random() * 0.7
    }));

    const render = (timestamp: number) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }
      const deltaSec = Math.min(0.1, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;
      time += deltaSec;

      const w = logicalWidth;
      const h = logicalHeight;

      ctx.clearRect(0, 0, w, h);
      ctx.save();

      // 1. POLICE EMERGENCY CHASE STROBE FLASHERS (Active Pursuit Only)
      const shouldShowStrobes =
        (heatLevel >= 2 && !isEvadingPolice) ||
        video.themeStyle === 'police_chase' ||
        (isQteActive && heatLevel > 0);

      if (shouldShowStrobes) {
        const strobePulse = Math.sin(time * 26);
        if (strobePulse > 0.25) {
          const redStrobe = ctx.createRadialGradient(w * 0.15, h * 0.25, 20, w * 0.15, h * 0.25, w * 0.7);
          redStrobe.addColorStop(0, 'rgba(255, 0, 60, 0.45)');
          redStrobe.addColorStop(1, 'rgba(255, 0, 60, 0)');
          ctx.fillStyle = redStrobe;
          ctx.fillRect(0, 0, w, h);
        } else if (strobePulse < -0.25) {
          const blueStrobe = ctx.createRadialGradient(w * 0.85, h * 0.25, 20, w * 0.85, h * 0.25, w * 0.7);
          blueStrobe.addColorStop(0, 'rgba(0, 140, 255, 0.45)');
          blueStrobe.addColorStop(1, 'rgba(0, 140, 255, 0)');
          ctx.fillStyle = blueStrobe;
          ctx.fillRect(0, 0, w, h);
        }
      }

      // 2. CLUB BABYLON LASER BEAMS & STROBES
      if (video.themeStyle === 'club_babylon') {
        for (let i = 0; i < 3; i++) {
          const laserAngle = Math.sin(time * 2.5 + i * 1.6) * 0.85;
          ctx.save();
          ctx.translate(w * 0.5, h * 0.15);
          ctx.rotate(laserAngle);
          const laserGrad = ctx.createLinearGradient(0, 0, 0, h * 1.3);
          laserGrad.addColorStop(0, 'rgba(255, 0, 200, 0.7)');
          laserGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.4)');
          laserGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = laserGrad;
          ctx.fillRect(-3, 0, 6, h * 1.3);
          ctx.restore();
        }
      }

      // 3. LIGHTNING FLASH FOR STORMY HELIPAD / DOCKS
      if (video.themeStyle === 'helipad_climax') {
        const lightningTrigger = Math.sin(time * 0.8);
        if (lightningTrigger > 0.96) {
          ctx.fillStyle = 'rgba(230, 245, 255, 0.25)';
          ctx.fillRect(0, 0, w, h);
        }
      }

      // 4. PARTICLES / RAIN STREAKS / NEON EMBERS
      ctx.fillStyle = video.themeStyle === 'sunset_drive' ? 'rgba(255, 200, 100, 0.6)' : 'rgba(180, 230, 255, 0.5)';
      particles.forEach((p) => {
        p.y += p.speed * deltaSec;
        p.x += Math.sin(time * 2 + p.y * 0.01) * 40 * deltaSec;
        if (p.y > h) {
          p.y = 0;
          p.x = Math.random() * w;
        }

        ctx.beginPath();
        if (video.themeStyle === 'helipad_climax' || heatLevel >= 4 || video.themeStyle === 'dock_shootout') {
          // Slanted rain lines
          ctx.strokeStyle = `rgba(200, 235, 255, ${p.alpha * 0.7})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 7, p.y + 16);
          ctx.stroke();
        } else {
          // Floating bokeh / dust
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 5. ANAMORPHIC CYAN / GOLD HORIZONTAL LENS FLARE STREAK
      const flareY = h * 0.38 + Math.sin(time * 1.2) * 12;
      const flareGrad = ctx.createLinearGradient(0, flareY - 3, 0, flareY + 3);
      flareGrad.addColorStop(0, 'transparent');
      flareGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.35)');
      flareGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, flareY - 3, w, 6);

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [video.themeStyle, heatLevel, isEvadingPolice, isQteActive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover z-5 pointer-events-none"
    />
  );
};
