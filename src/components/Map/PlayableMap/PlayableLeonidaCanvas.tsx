// ============================================================================
// 🌴 LEONIDA 2D FREE-ROAM DRIVING & EXPLORATION ENGINE (60FPS HTML5 CANVAS)
// ============================================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore, PROTAGONIST_PERKS } from '../../../store/gameStore';
import { LEONIDA_MARKERS } from '../../../data/mapMarkers.data';
import type { MapMarker } from '../../../data/mapMarkers.data';
import { OFFICIAL_RADIO_STATIONS } from '../../../constants/radio';
import { audioEngine } from '../../../engine/audioEngine';
import {
  Car,
  Compass,
  Zap,
  ShieldAlert,
  Sun,
  Sunset,
  Moon,
  CloudRain,
  Navigation,
  X,
  UserCheck,
  Volume2,
  CornerDownLeft,
  Wrench,
  Radio,
  Shield
} from 'lucide-react';

// World dimensions (virtual coordinate space mapped 1:1 to mapa.png aspect ratio ~ 7860x11338)
const WORLD_WIDTH = 3930;
const WORLD_HEIGHT = 5669;

type WeatherMode = 'SUNSET' | 'NIGHT' | 'STORM' | 'DAY';

interface SkidMark {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  alpha: number;
  isWater: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

interface PoliceUnit {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  speed: number;
  alerted: boolean;
}

export const PlayableLeonidaCanvas: React.FC = () => {
  const {
    isDrivingMode,
    toggleDrivingMode,
    currentNodeId,
    jumpToNode,
    heatLevel,
    addHeat,
    clearHeat,
    reduceHeatLevel,
    activeProtagonist,
    switchProtagonist,
    completeContract,
    completedContracts,
    showToast,
    cleanCash,
    dirtyCash,
    inventory
  } = useGameStore();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mapImageRef = useRef<HTMLImageElement | null>(null);
  const terrainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const terrainCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [weather, setWeather] = useState<WeatherMode>('NIGHT');
  const [hudSpeedKmh, setHudSpeedKmh] = useState(0);
  const [hudNitro, setHudNitro] = useState(100);
  const [isOnWater, setIsOnWater] = useState(false);
  const [nearbyMarker, setNearbyMarker] = useState<MapMarker | null>(null);
  const [selectedWaypoint, setSelectedWaypoint] = useState<MapMarker>(
    () => LEONIDA_MARKERS.find((m) => m.nodeId === currentNodeId) || LEONIDA_MARKERS[0]
  );
  const [evasionPct, setEvasionPct] = useState(0);

  // Mutable refs for 60fps simulation loop
  const inventoryRef = useRef(inventory);
  inventoryRef.current = inventory;
  const radioIdxRef = useRef(0);
  const armorShieldsRef = useRef(inventory.includes('body_armor_tactical') ? 2 : 0);
  const [hudArmor, setHudArmor] = useState(armorShieldsRef.current);

  const keysRef = useRef<Record<string, boolean>>({});
  const weatherRef = useRef<WeatherMode>(weather);
  weatherRef.current = weather;
  const activeProtagonistRef = useRef(activeProtagonist);
  activeProtagonistRef.current = activeProtagonist;
  const heatLevelRef = useRef(heatLevel);
  heatLevelRef.current = heatLevel;
  const selectedWaypointRef = useRef<MapMarker>(selectedWaypoint);
  selectedWaypointRef.current = selectedWaypoint;
  const nearbyMarkerRef = useRef<MapMarker | null>(null);

  // Player vehicle physics state
  const playerRef = useRef({
    x: (28 / 100) * WORLD_WIDTH,
    y: (84 / 100) * WORLD_HEIGHT,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2,
    speed: 0,
    nitro: 100,
    drifting: false,
    onWater: false
  });

  const skidMarksRef = useRef<SkidMark[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const policeUnitsRef = useRef<PoliceUnit[]>([]);
  const unseenTimeRef = useRef<number>(0);
  const lastRamTimeRef = useRef<number>(0);

  // Position player at current story marker when opening driving mode
  useEffect(() => {
    if (!isDrivingMode) return;
    const currentMarker = LEONIDA_MARKERS.find((m) => m.nodeId === currentNodeId) || LEONIDA_MARKERS[0];
    playerRef.current.x = (currentMarker.xPct / 100) * WORLD_WIDTH;
    playerRef.current.y = (currentMarker.yPct / 100) * WORLD_HEIGHT;
    playerRef.current.vx = 0;
    playerRef.current.vy = 0;
    playerRef.current.speed = 0;

    // Pick next mission as default GPS target
    const currentIdx = LEONIDA_MARKERS.indexOf(currentMarker);
    const nextMarker = LEONIDA_MARKERS[(currentIdx + 1) % LEONIDA_MARKERS.length];
    setSelectedWaypoint(nextMarker);
  }, [isDrivingMode, currentNodeId]);

  // Load high-res map & build low-res terrain sampler canvas for water/road detection
  useEffect(() => {
    const img = new Image();
    img.src = '/assets/gta6/mapa.png';
    img.onload = () => {
      mapImageRef.current = img;
      const sampleW = 393;
      const sampleH = 567;
      const off = document.createElement('canvas');
      off.width = sampleW;
      off.height = sampleH;
      const offCtx = off.getContext('2d', { willReadFrequently: true });
      if (offCtx) {
        offCtx.drawImage(img, 0, 0, sampleW, sampleH);
        terrainCanvasRef.current = off;
        terrainCtxRef.current = offCtx;
      }
      setMapLoaded(true);
    };
  }, []);

  // Spawn or despawn police units when heat level changes
  useEffect(() => {
    if (!isDrivingMode) return;
    const desiredCount = heatLevel === 0 ? 0 : Math.min(6, heatLevel + 1);
    const current = policeUnitsRef.current;

    if (desiredCount === 0) {
      policeUnitsRef.current = [];
      audioEngine.setSiren(false, 0);
      setEvasionPct(0);
      return;
    }

    while (current.length < desiredCount) {
      const spawnAngle = Math.random() * Math.PI * 2;
      const dist = 420 + Math.random() * 260;
      current.push({
        id: Date.now() + Math.random(),
        x: Math.max(80, Math.min(WORLD_WIDTH - 80, playerRef.current.x + Math.cos(spawnAngle) * dist)),
        y: Math.max(80, Math.min(WORLD_HEIGHT - 80, playerRef.current.y + Math.sin(spawnAngle) * dist)),
        vx: 0,
        vy: 0,
        angle: spawnAngle + Math.PI,
        speed: 0,
        alerted: true
      });
    }
    if (current.length > desiredCount) {
      policeUnitsRef.current = current.slice(0, desiredCount);
    }
  }, [heatLevel, isDrivingMode]);

  // Trigger action on nearby marker (Enter key or HUD button)
  const handleTriggerMarker = useCallback(
    (marker: MapMarker) => {
      audioEngine.playDecisionImpact();
      if (marker.nodeId) {
        toggleDrivingMode(false);
        jumpToNode(marker.nodeId);
        return;
      }
      if (marker.type === 'CONTRACT' && marker.payout) {
        const paid = completeContract(marker.id, marker.payout);
        if (paid) {
          if (marker.payout.heat) addHeat(marker.payout.heat);
          showToast(
            'CONTRATO COMPLETADO',
            `${marker.title.replace('Contrato: ', '')} • Recibiste ${marker.reward}.`,
            'success'
          );
        }
        return;
      }
      if (marker.type === 'SERVICE') {
        if (heatLevelRef.current > 0) {
          clearHeat();
          showToast(
            'TALLER CLANDESTINO',
            'Carrocería repintada y matrículas cambiadas. Nivel de búsqueda eliminado.',
            'success'
          );
        } else {
          playerRef.current.nitro = 100;
          setHudNitro(100);
          showToast('TALLER CUSTOMS', 'Tanque de óxido nitroso recargado al 100% y motor puesto a punto.', 'info');
        }
      }
    },
    [toggleDrivingMode, jumpToNode, completeContract, addHeat, showToast, clearHeat]
  );

  // Reset armor shields on entry
  useEffect(() => {
    if (isDrivingMode && inventory.includes('body_armor_tactical')) {
      armorShieldsRef.current = 2;
      setHudArmor(2);
    }
  }, [isDrivingMode, inventory]);

  const handleCycleRadio = useCallback(() => {
    audioEngine.playClick();
    const nextIdx = (radioIdxRef.current + 1) % OFFICIAL_RADIO_STATIONS.length;
    radioIdxRef.current = nextIdx;
    const station = OFFICIAL_RADIO_STATIONS[nextIdx];
    audioEngine.setRadioStation(station.id);
    showToast(`📻 ${station.name} (${station.frequency})`, `${station.currentTrack} — ${station.artist}`, 'info');
  }, [showToast]);

  // Keyboard listeners for driving controls
  useEffect(() => {
    if (!isDrivingMode) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysRef.current[k] = true;
      keysRef.current[e.code] = true;

      if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleCycleRadio();
      }

      if (e.key === 'Enter' && nearbyMarkerRef.current) {
        e.preventDefault();
        handleTriggerMarker(nearbyMarkerRef.current);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysRef.current[k] = false;
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      keysRef.current = {};
    };
  }, [isDrivingMode, handleTriggerMarker, handleCycleRadio]);

  // Start / stop procedural engine sound
  useEffect(() => {
    if (!isDrivingMode) {
      audioEngine.stopEngine();
      return;
    }
    audioEngine.startEngine();
    return () => {
      audioEngine.stopEngine();
    };
  }, [isDrivingMode]);

  // Main 60FPS Canvas Game Loop
  useEffect(() => {
    if (!isDrivingMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();
    let hudUpdateAccum = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Helper: sample terrain pixel (water vs road vs off-road)
    const sampleTerrain = (wx: number, wy: number): 'WATER' | 'ROAD' | 'LAND' => {
      const tCtx = terrainCtxRef.current;
      const tCanvas = terrainCanvasRef.current;
      if (!tCtx || !tCanvas) return 'LAND';
      const sx = Math.max(0, Math.min(tCanvas.width - 1, Math.floor((wx / WORLD_WIDTH) * tCanvas.width)));
      const sy = Math.max(0, Math.min(tCanvas.height - 1, Math.floor((wy / WORLD_HEIGHT) * tCanvas.height)));
      const pixel = tCtx.getImageData(sx, sy, 1, 1).data;
      const r = pixel[0];
      const g = pixel[1];
      const b = pixel[2];
      // Ocean / Lake cyan-blue tone in mapa.png: R~109, G~180, B~198
      if (b > r + 28 && g > r + 15) return 'WATER';
      // Asphalt road lines are dark charcoal
      if (r < 95 && g < 95 && b < 95) return 'ROAD';
      return 'LAND';
    };

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const p = playerRef.current;
      const keys = keysRef.current;
      const isLucia = activeProtagonistRef.current === 'lucia';

      // Controls
      const up = Boolean(keys['w'] || keys['arrowup']);
      const down = Boolean(keys['s'] || keys['arrowdown']);
      const left = Boolean(keys['a'] || keys['arrowleft']);
      const right = Boolean(keys['d'] || keys['arrowright']);
      const drift = Boolean(keys[' '] || keys['Space']);
      const nitroActive = Boolean((keys['shift'] || keys['ShiftLeft'] || keys['ShiftRight']) && p.nitro > 2 && up);

      // Terrain check
      const terrain = sampleTerrain(p.x, p.y);
      p.onWater = terrain === 'WATER';

      // Inventory upgrades
      const hasTunedCar = inventoryRef.current.includes('tuned_muscle_car');
      const hasSpeedboatKey = inventoryRef.current.includes('gellhorn_speedboat_key');

      // Vehicle tuning (Jason = Muscle V8 with higher top speed; Lucia = Street Bike with sharper turn & accel)
      const baseMaxSpeed = isLucia ? 440 : (hasTunedCar ? 530 : 470);
      const terrainFactor = terrain === 'ROAD' ? 1.08 : terrain === 'WATER' ? (hasSpeedboatKey ? 1.15 : 0.88) : 0.94;
      const maxSpeed = baseMaxSpeed * terrainFactor * (nitroActive ? 1.45 : 1);
      const accel = (isLucia ? 560 : (hasTunedCar ? 560 : 490)) * (nitroActive ? 1.7 : 1);
      const turnRate = (isLucia ? 3.3 : 2.75) * (drift ? 1.38 : 1);

      if (up) {
        p.speed = Math.min(maxSpeed, p.speed + accel * dt);
      } else if (down) {
        p.speed = Math.max(-maxSpeed * 0.45, p.speed - accel * 1.15 * dt);
      } else {
        p.speed *= Math.pow(0.22, dt);
        if (Math.abs(p.speed) < 3) p.speed = 0;
      }

      // Nitro consumption / recharge (Tuned car recharges 2x as fast)
      if (nitroActive) {
        p.nitro = Math.max(0, p.nitro - 38 * dt);
      } else {
        p.nitro = Math.min(100, p.nitro + (hasTunedCar ? 26 : 14) * dt);
      }

      // Steering
      const speedFactor = Math.min(1, Math.abs(p.speed) / 90);
      const dirSign = p.speed >= -5 ? 1 : -1;
      if (left) p.angle -= turnRate * speedFactor * dirSign * dt;
      if (right) p.angle += turnRate * speedFactor * dirSign * dt;

      // Arcade drift vector blending (forward heading vs lateral momentum)
      const forwardX = Math.cos(p.angle) * p.speed;
      const forwardY = Math.sin(p.angle) * p.speed;
      const grip = drift ? 0.08 : p.onWater ? 0.14 : 0.28;
      p.vx = p.vx * (1 - grip) + forwardX * grip;
      p.vy = p.vy * (1 - grip) + forwardY * grip;

      const prevX = p.x;
      const prevY = p.y;
      p.x = Math.max(60, Math.min(WORLD_WIDTH - 60, p.x + p.vx * dt));
      p.y = Math.max(60, Math.min(WORLD_HEIGHT - 60, p.y + p.vy * dt));
      p.drifting = drift && Math.abs(p.speed) > 140;

      // Update procedural engine synth
      const actualSpeed = Math.hypot(p.vx, p.vy);
      audioEngine.updateEngine(Math.min(1, actualSpeed / 520), up ? (nitroActive ? 1 : 0.75) : 0.05);

      // Record skidmarks or boat wake ripples
      if ((p.drifting || p.onWater) && actualSpeed > 90) {
        const perpX = -Math.sin(p.angle) * 7;
        const perpY = Math.cos(p.angle) * 7;
        skidMarksRef.current.push(
          {
            x1: prevX + perpX,
            y1: prevY + perpY,
            x2: p.x + perpX,
            y2: p.y + perpY,
            alpha: p.onWater ? 0.55 : 0.65,
            isWater: p.onWater
          },
          {
            x1: prevX - perpX,
            y1: prevY - perpY,
            x2: p.x - perpX,
            y2: p.y - perpY,
            alpha: p.onWater ? 0.55 : 0.65,
            isWater: p.onWater
          }
        );
        if (skidMarksRef.current.length > 360) {
          skidMarksRef.current.splice(0, skidMarksRef.current.length - 360);
        }
      }

      // Exhaust / drift / nitro particles
      if (nitroActive || p.drifting) {
        const backX = p.x - Math.cos(p.angle) * 16;
        const backY = p.y - Math.sin(p.angle) * 16;
        particlesRef.current.push({
          x: backX + (Math.random() - 0.5) * 8,
          y: backY + (Math.random() - 0.5) * 8,
          vx: -Math.cos(p.angle) * (nitroActive ? 140 : 40) + (Math.random() - 0.5) * 30,
          vy: -Math.sin(p.angle) * (nitroActive ? 140 : 40) + (Math.random() - 0.5) * 30,
          size: nitroActive ? 5 : 7,
          alpha: 0.85,
          color: nitroActive ? '#00f0ff' : p.onWater ? '#bae6fd' : '#e4e4e7'
        });
      }

      // Update Police Pursuit AI
      let anySeeingPlayer = false;
      let closestPoliceDist = Infinity;
      const units = policeUnitsRef.current;

      for (const cop of units) {
        const dx = p.x - cop.x;
        const dy = p.y - cop.y;
        const dist = Math.hypot(dx, dy);
        if (dist < closestPoliceDist) closestPoliceDist = dist;

        const targetAngle = Math.atan2(dy, dx);
        let diff = targetAngle - cop.angle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;

        // Check if player is within radar vision cone (dist < 430 and angle < 55 deg) or very close (< 180)
        const inCone = dist < 430 && Math.abs(diff) < 0.95;
        if (inCone || dist < 185) {
          anySeeingPlayer = true;
          cop.alerted = true;
        }

        // Steer cop toward player
        cop.angle += Math.sign(diff) * Math.min(Math.abs(diff), 2.5 * dt);
        const copMaxSpeed = 335 + heatLevelRef.current * 24;
        cop.speed = Math.min(copMaxSpeed, cop.speed + 380 * dt);
        cop.vx = Math.cos(cop.angle) * cop.speed;
        cop.vy = Math.sin(cop.angle) * cop.speed;
        cop.x += cop.vx * dt;
        cop.y += cop.vy * dt;

        // Ramming collision with player
        if (dist < 26) {
          const pushX = dx / (dist || 1);
          const pushY = dy / (dist || 1);
          p.vx += pushX * 190;
          p.vy += pushY * 190;
          cop.vx -= pushX * 160;
          cop.vy -= pushY * 160;
          if (now - lastRamTimeRef.current > 4500) {
            lastRamTimeRef.current = now;
            audioEngine.playDecisionImpact();
            if (armorShieldsRef.current > 0) {
              armorShieldsRef.current -= 1;
              setHudArmor(armorShieldsRef.current);
              showToast(
                '🛡️ CHALECO BLINDADO KEVLAR',
                `Impacto de patrulla absorbido. Escudo restante: ${armorShieldsRef.current}/2`,
                'info'
              );
            } else if (heatLevelRef.current < 5) {
              addHeat(1);
            }
          }
        }
      }

      // Siren proximity & evasion timer
      if (heatLevelRef.current > 0 && units.length > 0) {
        const proximity = Math.max(0, Math.min(1, 1 - closestPoliceDist / 900));
        audioEngine.setSiren(true, proximity);
        if (anySeeingPlayer) {
          unseenTimeRef.current = Math.max(0, unseenTimeRef.current - dt * 1.5);
        } else {
          unseenTimeRef.current += dt;
          if (unseenTimeRef.current >= 8) {
            unseenTimeRef.current = 0;
            reduceHeatLevel(1);
            showToast('PERSECUCIÓN EVADIDA', 'Saliste del radar visual de las patrullas de Leonida.', 'success');
          }
        }
      } else {
        audioEngine.setSiren(false, 0);
        unseenTimeRef.current = 0;
      }

      // Check proximity to markers
      let foundNearby: MapMarker | null = null;
      let minMarkerDist = Infinity;
      for (const m of LEONIDA_MARKERS) {
        const mx = (m.xPct / 100) * WORLD_WIDTH;
        const my = (m.yPct / 100) * WORLD_HEIGHT;
        const d = Math.hypot(p.x - mx, p.y - my);
        if (d < 78 && d < minMarkerDist) {
          minMarkerDist = d;
          foundNearby = m;
        }
      }
      nearbyMarkerRef.current = foundNearby;

      // Throttle React HUD state updates to ~10Hz
      hudUpdateAccum += dt;
      if (hudUpdateAccum >= 0.1) {
        hudUpdateAccum = 0;
        setHudSpeedKmh(Math.round(actualSpeed * 0.52));
        setHudNitro(Math.round(p.nitro));
        setIsOnWater(p.onWater);
        setNearbyMarker(foundNearby);
        setEvasionPct(Math.min(100, Math.round((unseenTimeRef.current / 8) * 100)));
      }

      // ======================================================================
      // RENDER PASS
      // ======================================================================
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Dynamic camera zoom: zooms out slightly at high speed
      const camZoom = Math.max(0.85, 1.18 - (actualSpeed / 600) * 0.25);

      ctx.save();
      ctx.fillStyle = '#040810';
      ctx.fillRect(0, 0, vw, vh);

      // Camera transform centered on player
      ctx.translate(vw / 2, vh / 2);
      ctx.scale(camZoom, camZoom);
      ctx.translate(-p.x, -p.y);

      // 1. Draw high-res Leonida satellite map
      if (mapImageRef.current) {
        ctx.drawImage(mapImageRef.current, 0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      } else {
        ctx.fillStyle = '#0b1528';
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      }

      // 2. GPS Route Polyline from Player to Selected Waypoint
      const wp = selectedWaypointRef.current;
      if (wp) {
        const wx = (wp.xPct / 100) * WORLD_WIDTH;
        const wy = (wp.yPct / 100) * WORLD_HEIGHT;
        ctx.save();
        ctx.strokeStyle = '#ff2a85';
        ctx.lineWidth = 6;
        ctx.setLineDash([18, 12]);
        ctx.lineDashOffset = -now * 0.06;
        ctx.shadowColor = '#ff2a85';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(wx, wy);
        ctx.stroke();
        ctx.restore();
      }

      // 3. Skid marks & water wakes
      for (let i = skidMarksRef.current.length - 1; i >= 0; i--) {
        const s = skidMarksRef.current[i];
        s.alpha -= dt * 0.08;
        if (s.alpha <= 0) {
          skidMarksRef.current.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = s.isWater
          ? `rgba(186, 230, 253, ${s.alpha})`
          : `rgba(15, 15, 20, ${s.alpha})`;
        ctx.lineWidth = s.isWater ? 3 : 2.5;
        ctx.beginPath();
        ctx.moveTo(s.x1, s.y1);
        ctx.lineTo(s.x2, s.y2);
        ctx.stroke();
      }

      // 4. Particles (drift smoke / nitro fire)
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const pt = particlesRef.current[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.alpha -= dt * 1.4;
        pt.size += dt * 10;
        if (pt.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // 5. Mission, Contract & Service Markers
      const pulse = 1 + Math.sin(now * 0.006) * 0.18;
      for (const m of LEONIDA_MARKERS) {
        const mx = (m.xPct / 100) * WORLD_WIDTH;
        const my = (m.yPct / 100) * WORLD_HEIGHT;
        const isCurrent = m.nodeId === currentNodeId;
        const isTarget = wp?.id === m.id;
        const color =
          m.type === 'MAIN_MISSION' ? '#facc15' : m.type === 'CONTRACT' ? '#34d399' : '#22d3ee';

        ctx.save();
        // Outer radar ring
        ctx.strokeStyle = color;
        ctx.lineWidth = isTarget ? 4 : 2.5;
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.arc(mx, my, 42 * pulse, 0, Math.PI * 2);
        ctx.stroke();

        // Trigger zone fill
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.18;
        ctx.beginPath();
        ctx.arc(mx, my, 58, 0, Math.PI * 2);
        ctx.fill();

        // Center blip
        ctx.globalAlpha = 1;
        ctx.fillStyle = isCurrent ? '#ec4899' : color;
        ctx.beginPath();
        ctx.arc(mx, my, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#09090b';
        ctx.stroke();

        // Label tag
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(0,0,0,0.82)';
        const label = m.title.replace(/^ACTO [IVX]+:\s*/i, '').replace(/^Contrato:\s*/i, '');
        const textW = ctx.measureText(label).width + 14;
        ctx.fillRect(mx - textW / 2, my - 38, textW, 18);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(label, mx, my - 25);
        ctx.restore();
      }

      // 6. Police Patrol Cars & Search Cones
      const strobeRed = Math.floor(now / 120) % 2 === 0;
      for (const cop of units) {
        ctx.save();
        ctx.translate(cop.x, cop.y);
        ctx.rotate(cop.angle);

        // Radar vision cone
        const coneGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 420);
        coneGrad.addColorStop(0, strobeRed ? 'rgba(239,68,68,0.28)' : 'rgba(59,130,246,0.28)');
        coneGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = coneGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 420, -0.85, 0.85);
        ctx.closePath();
        ctx.fill();

        // VCPD Cruiser chassis
        ctx.fillStyle = '#111827';
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(-16, -9, 32, 18, 4);
        ctx.fill();
        ctx.stroke();

        // White doors
        ctx.fillStyle = '#f9fafb';
        ctx.fillRect(-6, -8, 12, 16);

        // Flashing lightbar
        ctx.fillStyle = strobeRed ? '#ef4444' : '#3b82f6';
        ctx.shadowColor = strobeRed ? '#ef4444' : '#3b82f6';
        ctx.shadowBlur = 18;
        ctx.fillRect(-2, -7, 4, 7);
        ctx.fillStyle = strobeRed ? '#3b82f6' : '#ef4444';
        ctx.fillRect(-2, 0, 4, 7);
        ctx.restore();
      }

      // 7. Player Vehicle (Muscle Car V8 / Street Bike / Speedboat on water)
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      // Headlight beam in Night / Storm / Sunset
      if (weatherRef.current !== 'DAY') {
        const beamGrad = ctx.createRadialGradient(12, 0, 8, 12, 0, 310);
        beamGrad.addColorStop(0, 'rgba(254, 249, 195, 0.55)');
        beamGrad.addColorStop(0.6, 'rgba(254, 249, 195, 0.16)');
        beamGrad.addColorStop(1, 'rgba(254, 249, 195, 0)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.arc(10, 0, 310, -0.45, 0.45);
        ctx.closePath();
        ctx.fill();
      }

      if (p.onWater) {
        // Speedboat hull
        ctx.fillStyle = isLucia ? '#ec4899' : '#06b6d4';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(22, 0);
        ctx.lineTo(-16, -11);
        ctx.lineTo(-12, 0);
        ctx.lineTo(-16, 11);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (isLucia) {
        // Lucia's Yellow/Pink Turbo Street Bike
        ctx.fillStyle = '#facc15';
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-14, -5, 28, 10, 4);
        ctx.fill();
        ctx.stroke();
        // Rider helmet
        ctx.fillStyle = '#18181b';
        ctx.beginPath();
        ctx.arc(-2, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Tuned Muscle Car neon underglow
        if (hasTunedCar && weatherRef.current !== 'DAY') {
          ctx.save();
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 22;
          ctx.fillStyle = 'rgba(0, 240, 255, 0.55)';
          ctx.fillRect(-22, -13, 44, 26);
          ctx.restore();
        }

        // Jason's Classic Leonida Muscle Car V8
        ctx.fillStyle = hasTunedCar ? '#0284c7' : '#0ea5e9';
        ctx.strokeStyle = hasTunedCar ? '#38bdf8' : '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-18, -10, 36, 20, 5);
        ctx.fill();
        ctx.stroke();
        // Dual racing stripes
        ctx.fillStyle = hasTunedCar ? '#facc15' : '#0f172a';
        ctx.fillRect(-14, -4, 28, 3);
        ctx.fillRect(-14, 1, 28, 3);
        // Windshield
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(2, -7, 7, 14);
      }

      // Nitro afterburner flame
      if (nitroActive) {
        ctx.fillStyle = '#22d3ee';
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.moveTo(-18, -4);
        ctx.lineTo(-34 - Math.random() * 10, 0);
        ctx.lineTo(-18, 4);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      ctx.restore(); // End world space

      // ======================================================================
      // 8. SCREEN-SPACE WEATHER & TIME-OF-DAY ATMOSPHERE OVERLAY
      // ======================================================================
      const currentWeather = weatherRef.current;
      if (currentWeather === 'NIGHT') {
        ctx.fillStyle = 'rgba(6, 11, 28, 0.36)';
        ctx.fillRect(0, 0, vw, vh);
      } else if (currentWeather === 'SUNSET') {
        const sunGrad = ctx.createLinearGradient(0, 0, 0, vh);
        sunGrad.addColorStop(0, 'rgba(249, 115, 22, 0.24)');
        sunGrad.addColorStop(1, 'rgba(219, 39, 119, 0.22)');
        ctx.fillStyle = sunGrad;
        ctx.fillRect(0, 0, vw, vh);
      } else if (currentWeather === 'STORM') {
        ctx.fillStyle = 'rgba(8, 18, 38, 0.42)';
        ctx.fillRect(0, 0, vw, vh);
        // Tropical rain streaks
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < 95; i++) {
          const rx = ((i * 137 + now * 0.65) % (vw + 200)) - 100;
          const ry = ((i * 293 + now * 1.35) % (vh + 200)) - 100;
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 14, ry + 28);
        }
        ctx.stroke();

        // Occasional lightning flash
        if (Math.sin(now * 0.0037) > 0.992) {
          ctx.fillStyle = 'rgba(224, 242, 254, 0.35)';
          ctx.fillRect(0, 0, vw, vh);
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [isDrivingMode, currentNodeId, addHeat, reduceHeatLevel, showToast]);

  if (!isDrivingMode) return null;

  const wpDistMeters = Math.round(
    Math.hypot(
      playerRef.current.x - (selectedWaypoint.xPct / 100) * WORLD_WIDTH,
      playerRef.current.y - (selectedWaypoint.yPct / 100) * WORLD_HEIGHT
    ) * 3.2
  );

  const activePerk = PROTAGONIST_PERKS[activeProtagonist];

  return (
    <div className="fixed inset-0 z-45 bg-black select-none overflow-hidden">
      {/* 60FPS World Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Loading overlay while high-res map decodes */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 space-y-3">
          <Compass className="w-10 h-10 text-cyan-400 animate-spin" />
          <p className="text-xs font-mono uppercase tracking-widest text-cyan-300">
            Cargando Cartografía Satelital de Leonida (60 FPS)...
          </p>
        </div>
      )}

      {/* TOP-LEFT BAR: Mode Title, Weather Switcher & Protagonist Toggle */}
      <div className="absolute top-16 left-4 z-40 flex flex-wrap items-center gap-2">
        <div className="backdrop-blur-xl bg-black/85 border border-cyan-500/60 px-3.5 py-2 rounded-2xl shadow-2xl flex items-center gap-2.5">
          <Car className="w-4 h-4 text-cyan-400" />
          <div>
            <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block">
              MODO CONDUCCIÓN LIBRE • 2D
            </span>
            <span className="text-xs font-black text-white uppercase italic">
              {isOnWater
                ? 'Lancha Rápida de los Cayos'
                : activeProtagonist === 'lucia'
                  ? 'Moto Streetfighter de Lucia'
                  : 'Muscle Car V8 de Jason'}
            </span>
          </div>
        </div>

        {/* Weather & Time-of-Day Selector */}
        <div className="backdrop-blur-xl bg-black/85 border border-zinc-800 p-1 rounded-2xl flex items-center gap-1">
          {(
            [
              { id: 'DAY', icon: <Sun className="w-3.5 h-3.5" />, label: 'Día' },
              { id: 'SUNSET', icon: <Sunset className="w-3.5 h-3.5" />, label: 'Atardecer' },
              { id: 'NIGHT', icon: <Moon className="w-3.5 h-3.5" />, label: 'Neón' },
              { id: 'STORM', icon: <CloudRain className="w-3.5 h-3.5" />, label: 'Tormenta' }
            ] as const
          ).map((w) => (
            <button
              key={w.id}
              onClick={() => {
                audioEngine.playClick();
                setWeather(w.id);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                weather === w.id
                  ? 'bg-gradient-to-r from-pink-600 to-cyan-500 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title={`Clima: ${w.label}`}
            >
              {w.icon}
              <span className="hidden sm:inline">{w.label}</span>
            </button>
          ))}
        </div>

        {/* Protagonist Quick Switch */}
        <button
          onClick={() => switchProtagonist(activeProtagonist === 'jason' ? 'lucia' : 'jason')}
          className="backdrop-blur-xl bg-black/85 hover:bg-zinc-900 border border-pink-500/50 px-3 py-2 rounded-2xl text-xs font-mono text-white flex items-center gap-2 cursor-pointer transition-all"
          title={`${activePerk.name}: ${activePerk.description}`}
        >
          <UserCheck className="w-3.5 h-3.5 text-pink-400" />
          <span className="font-bold uppercase">{activeProtagonist} (C)</span>
        </button>
      </div>

      {/* TOP-RIGHT: Exit Free Roam back to Story Cinematic */}
      <div className="absolute top-16 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => toggleDrivingMode(false)}
          className="backdrop-blur-xl bg-pink-600/90 hover:bg-pink-500 text-white font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-2xl shadow-[0_0_25px_rgba(255,42,133,0.6)] flex items-center gap-2 cursor-pointer border border-white/30"
        >
          <X className="w-4 h-4" />
          <span>Volver a Escena (G / Esc)</span>
        </button>
      </div>

      {/* LEFT SIDEBAR: GPS Waypoint Selector */}
      <div className="hidden md:flex flex-col absolute left-4 top-36 bottom-28 w-64 backdrop-blur-xl bg-black/80 border border-zinc-800/90 rounded-2xl p-3 z-30 overflow-hidden">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5" /> Destinos GPS ({LEONIDA_MARKERS.length})
          </span>
          <span className="text-[10px] font-mono text-pink-400 font-bold">{wpDistMeters} m</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
          {LEONIDA_MARKERS.map((m) => {
            const isSelected = selectedWaypoint.id === m.id;
            const isDone = m.type === 'CONTRACT' && completedContracts.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => {
                  audioEngine.playClick();
                  setSelectedWaypoint(m);
                }}
                onDoubleClick={() => {
                  // Teleport near marker if double-clicked
                  playerRef.current.x = (m.xPct / 100) * WORLD_WIDTH;
                  playerRef.current.y = (m.yPct / 100) * WORLD_HEIGHT;
                  audioEngine.playSatelliteWhoosh();
                }}
                className={`w-full text-left p-2 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-400 text-white'
                    : 'bg-zinc-900/70 border-zinc-800/80 text-zinc-300 hover:bg-zinc-800/80'
                }`}
              >
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span
                    className={
                      m.type === 'MAIN_MISSION'
                        ? 'text-yellow-400 font-bold'
                        : m.type === 'CONTRACT'
                          ? 'text-emerald-400 font-bold'
                          : 'text-cyan-400 font-bold'
                    }
                  >
                    {m.type === 'MAIN_MISSION' ? '● MISIÓN' : m.type === 'CONTRACT' ? '◆ CONTRATO' : '■ TALLER'}
                  </span>
                  <span>{isDone ? '✓ COBRADO' : m.district}</span>
                </div>
                <div className="text-xs font-bold truncate mt-0.5">{m.title}</div>
              </button>
            );
          })}
        </div>
        <p className="text-[9px] font-mono text-zinc-500 pt-2 border-t border-zinc-800/80 mt-2">
          Clic: trazar ruta GPS • Doble clic: viaje rápido
        </p>
      </div>

      {/* CENTER-BOTTOM CONTEXTUAL MISSION / CONTRACT / GARAGE TRIGGER BANNER */}
      {nearbyMarker && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4 animate-bounce">
          <div className="backdrop-blur-2xl bg-black/95 border-2 border-yellow-400 p-4 rounded-2xl shadow-[0_0_50px_rgba(250,204,21,0.55)] flex items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="text-[10px] font-mono font-bold text-yellow-400 uppercase tracking-widest block">
                {nearbyMarker.type === 'MAIN_MISSION'
                  ? '★ PUNTO DE MISIÓN ALCANZADO'
                  : nearbyMarker.type === 'CONTRACT'
                    ? '◆ CONTRATO DISPONIBLE'
                    : '🔧 TALLER CUSTOMS & PAY-N-SPRAY'}
              </span>
              <h4 className="text-sm sm:text-base font-black text-white uppercase italic truncate">
                {nearbyMarker.title}
              </h4>
              <p className="text-xs text-zinc-300 truncate">{nearbyMarker.subtitle}</p>
            </div>
            <button
              onClick={() => handleTriggerMarker(nearbyMarker)}
              className="shrink-0 px-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              {nearbyMarker.type === 'SERVICE' ? <Wrench className="w-4 h-4" /> : <CornerDownLeft className="w-4 h-4" />}
              <span>ENTRAR [ENTER]</span>
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM HUD BAR: Speedometer, Nitro Boost, Police Evasion & Controls Legend */}
      <div className="absolute bottom-4 left-4 right-4 z-40 flex flex-wrap items-end justify-between gap-3 pointer-events-none">
        {/* Controls Legend */}
        <div className="backdrop-blur-xl bg-black/85 border border-zinc-800 px-3.5 py-2.5 rounded-2xl text-[11px] font-mono text-zinc-300 space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span>
              <strong className="text-cyan-400">[WASD / Flechas]</strong> Conducir
            </span>
            <span>
              <strong className="text-pink-400">[Espacio]</strong> Derrape
            </span>
            <span>
              <strong className="text-yellow-400">[Shift]</strong> Nitro
            </span>
            <button
              onClick={handleCycleRadio}
              className="pointer-events-auto bg-zinc-900 hover:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700 hover:border-pink-500 text-pink-300 cursor-pointer flex items-center gap-1 active:scale-95 transition-all"
              title="Cambiar emisora de radio"
            >
              <Radio className="w-3 h-3 text-pink-400" />
              <span>[R] Cambiar Radio</span>
            </button>
          </div>
          <div className="text-[10px] text-zinc-400 flex items-center gap-3 flex-wrap pt-0.5">
            <span>
              <Volume2 className="w-3 h-3 inline mr-1 text-emerald-400" />
              Fondos: <strong className="text-emerald-400">${(cleanCash + dirtyCash).toLocaleString()}</strong>
            </span>
            {inventory.includes('body_armor_tactical') && (
              <span className="text-cyan-300 font-bold flex items-center gap-1 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-700/60">
                <Shield className="w-3 h-3 text-cyan-400" /> Escudo Blindado ({hudArmor}/2)
              </span>
            )}
            {inventory.includes('tuned_muscle_car') && (
              <span className="text-amber-300 font-bold flex items-center gap-1 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-700/60">
                <Zap className="w-3 h-3 text-yellow-400" /> V8 Tuned (+22% Vel)
              </span>
            )}
            {inventory.includes('gellhorn_speedboat_key') && (
              <span className="text-blue-300 font-bold flex items-center gap-1 bg-blue-950/60 px-1.5 py-0.2 rounded border border-blue-700/60">
                🚤 Turbo Lancha Activo
              </span>
            )}
          </div>
        </div>

        {/* Speedometer + Nitro + Police Evasion */}
        <div className="flex items-center gap-3">
          {heatLevel > 0 && (
            <div className="backdrop-blur-xl bg-red-950/90 border border-red-500 px-3.5 py-2 rounded-2xl text-xs font-mono text-red-200 flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-red-400 animate-ping" />
              <div>
                <div className="text-[10px] font-bold uppercase text-red-300">
                  PERSECUCIÓN VCPD ({heatLevel}★)
                </div>
                <div className="w-28 h-1.5 bg-black/60 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-emerald-400 transition-all"
                    style={{ width: `${evasionPct}%` }}
                  />
                </div>
                <span className="text-[9px] text-zinc-300">Sigilo fuera de radar: {evasionPct}%</span>
              </div>
            </div>
          )}

          <div className="backdrop-blur-xl bg-black/90 border border-cyan-500/50 px-4 py-2.5 rounded-2xl flex items-center gap-4 shadow-2xl">
            {/* Nitro Bar */}
            <div className="w-24">
              <div className="flex justify-between text-[10px] font-mono text-cyan-300 font-bold mb-1">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-400" /> NITRO
                </span>
                <span>{hudNitro}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-100"
                  style={{ width: `${hudNitro}%` }}
                />
              </div>
            </div>

            {/* Digital Speedometer */}
            <div className="text-right border-l border-zinc-800 pl-4">
              <span className="text-2xl sm:text-3xl font-black font-mono italic text-white leading-none block">
                {hudSpeedKmh}
              </span>
              <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">
                {isOnWater ? 'NUDOS / KM/H' : 'KM/H • V8'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
