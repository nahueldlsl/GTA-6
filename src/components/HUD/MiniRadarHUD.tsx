// ============================================================================
// 🌴 GTA VI MINI-RADAR GPS & LIVE POLICE SCANNER TICKER (Bottom-Left HUD)
// ============================================================================

import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { LEONIDA_MARKERS } from '../../data/mapMarkers.data';
import { audioEngine } from '../../engine/audioEngine';
import type { DispatchTransmission } from '../../engine/audioEngine';
import { Compass, Car, Radio, Navigation } from 'lucide-react';

export const MiniRadarHUD: React.FC = () => {
  const { currentNodeId, heatLevel, isDrivingMode, isMapOpen, isPhoneOpen, toggleMap, toggleDrivingMode } =
    useGameStore();

  const [dispatchMsg, setDispatchMsg] = useState<DispatchTransmission | null>(null);

  // Subscribe to Police Dispatcher 10-code radio transmissions
  useEffect(() => {
    const unsub = audioEngine.subscribeDispatch((t) => {
      setDispatchMsg(t);
    });
    return unsub;
  }, []);

  // Auto-hide dispatch subtitle after 6.5s
  useEffect(() => {
    if (!dispatchMsg) return;
    const timer = window.setTimeout(() => setDispatchMsg(null), 6500);
    return () => window.clearTimeout(timer);
  }, [dispatchMsg]);

  // Trigger police dispatch when heat level changes
  useEffect(() => {
    if (heatLevel > 0) {
      audioEngine.policeDispatch(heatLevel);
    }
  }, [heatLevel]);

  if (isDrivingMode || isMapOpen || isPhoneOpen) return null;

  const activeMarker =
    LEONIDA_MARKERS.find((m) => m.nodeId === currentNodeId) || LEONIDA_MARKERS[0];

  return (
    <div className="fixed bottom-4 left-4 z-35 hidden sm:flex flex-col gap-2 select-none pointer-events-auto max-w-xs">
      {/* Live VCPD Police Scanner Radio Ticker */}
      {dispatchMsg && (
        <div className="backdrop-blur-2xl bg-red-950/90 border border-red-500/80 px-3 py-2 rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.45)] animate-fadeIn">
          <div className="flex items-center justify-between text-[9px] font-mono text-red-300 font-bold uppercase">
            <span className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-red-400 animate-pulse" /> {dispatchMsg.unit}
            </span>
            <span className="bg-red-600 text-white px-1.5 py-0.2 rounded">{dispatchMsg.code}</span>
          </div>
          <p className="text-[11px] font-mono text-zinc-100 leading-snug mt-0.5">{dispatchMsg.text}</p>
        </div>
      )}

      {/* Mini Satellite Radar Card */}
      <div className="backdrop-blur-2xl bg-black/85 border-2 border-zinc-800 hover:border-cyan-500/60 rounded-2xl overflow-hidden shadow-2xl transition-all w-52">
        {/* Radar Viewport */}
        <div
          onClick={() => toggleMap(true)}
          className="relative h-28 w-full overflow-hidden cursor-pointer group bg-[#06101e]"
          title="Abrir Mapa Satelital (Tab)"
        >
          <img
            src="/assets/gta6/mapa.png"
            alt="Leonida Radar"
            className="absolute w-[260%] max-w-none h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            style={{
              left: `${50 - activeMarker.xPct * 2.2}%`,
              top: `${50 - activeMarker.yPct * 1.6}%`
            }}
            draggable={false}
          />

          {/* Radar Sweep Grid & Police Flash */}
          <div
            className={`absolute inset-0 pointer-events-none ${
              heatLevel > 0
                ? 'bg-gradient-to-tr from-red-600/25 via-transparent to-blue-600/25 animate-pulse'
                : 'bg-[radial-gradient(circle,transparent_45%,rgba(0,0,0,0.75)_100%)]'
            }`}
          />

          {/* Center Player Arrow Blip */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute -inset-2 rounded-full bg-pink-500/50 animate-ping" />
            <div className="relative w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_10px_#00f0ff]" />
          </div>

          {/* North indicator */}
          <span className="absolute top-1.5 right-2 text-[9px] font-mono font-black bg-black/80 text-cyan-400 px-1.5 rounded border border-cyan-500/40">
            N
          </span>

          {/* District Label */}
          <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[9px] font-mono text-white bg-black/75 px-2 py-0.5 rounded-md">
            <span className="truncate flex items-center gap-1">
              <Navigation className="w-2.5 h-2.5 text-pink-400 shrink-0" />
              {activeMarker.district}
            </span>
            <span className="text-cyan-400 font-bold">GPS</span>
          </div>
        </div>

        {/* Bottom Radar Action Bar */}
        <div className="grid grid-cols-2 divide-x divide-zinc-800 bg-zinc-950/95 text-[10px] font-mono font-bold">
          <button
            onClick={() => toggleMap(true)}
            className="py-1.5 px-2 text-zinc-300 hover:text-cyan-300 hover:bg-zinc-900 flex items-center justify-center gap-1 cursor-pointer transition-colors"
            title="Abrir Mapa de Leonida (Tab)"
          >
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>MAPA [TAB]</span>
          </button>
          <button
            onClick={() => toggleDrivingMode(true)}
            className="py-1.5 px-2 text-pink-300 hover:text-white hover:bg-pink-600/30 flex items-center justify-center gap-1 cursor-pointer transition-colors"
            title="Modo Conducción Libre 2D (G)"
          >
            <Car className="w-3 h-3 text-pink-400" />
            <span>MANEJAR [G]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
