// ============================================================================
// 🌴 LEONIDA STATE HIGH-RES INTERACTIVE SATELLITE MAP (GTA VI OFFICIAL MAP)
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { audioEngine } from '../../engine/audioEngine';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  MapPin,
  Compass,
  X,
  Crosshair,
  DollarSign,
  Wrench,
  ChevronRight,
  Flame,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Navigation,
  Car
} from 'lucide-react';

import { LEONIDA_MARKERS } from '../../data/mapMarkers.data';
import type { MapMarker } from '../../data/mapMarkers.data';

export const LeonidaMapModal: React.FC = () => {
  const {
    isMapOpen,
    toggleMap,
    jumpToNode,
    currentNodeId,
    cleanCash,
    dirtyCash,
    completeContract,
    completedContracts,
    addHeat,
    showToast,
    toggleDrivingMode
  } = useGameStore();
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(LEONIDA_MARKERS[0]);
  const [filterType, setFilterType] = useState<string>('ALL');

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset zoom & pan on modal open
  useEffect(() => {
    if (isMapOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [isMapOpen]);

  if (!isMapOpen) return null;

  const filteredMarkers = LEONIDA_MARKERS.filter((marker) => {
    if (filterType === 'ALL') return true;
    return marker.type === filterType;
  });

  const handleZoomIn = () => {
    audioEngine.playClick();
    setZoom((z) => Math.min(2.5, z + 0.3));
  };

  const handleZoomOut = () => {
    audioEngine.playClick();
    setZoom((z) => {
      const next = Math.max(1, z - 0.3);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    audioEngine.playClick();
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;
      const maxPan = (zoom - 1) * 350;
      setPan({
        x: Math.max(-maxPan, Math.min(maxPan, newX)),
        y: Math.max(-maxPan, Math.min(maxPan, newY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleLaunchMission = (marker: MapMarker) => {
    audioEngine.playDecisionImpact();
    if (marker.nodeId) {
      jumpToNode(marker.nodeId);
      toggleMap(false);
      return;
    }
    if (marker.type === 'CONTRACT' && marker.payout) {
      const paid = completeContract(marker.id, marker.payout);
      if (paid) {
        if (marker.payout.heat) addHeat(marker.payout.heat);
        showToast('CONTRATO COMPLETADO', `${marker.title.replace('Contrato: ', '')} • Recibiste ${marker.reward}.`, 'success');
      }
      toggleMap(false);
      return;
    }
    if (marker.type === 'SERVICE') {
      showToast('UBICACIÓN MARCADA', `GPS fijado en ${marker.district}. Conduce hasta allí en el modo libre.`, 'info');
    }
  };

  const handleStartDriving = () => {
    toggleDrivingMode(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-2xl animate-fadeIn select-none">
      <div className="relative w-full max-w-7xl h-[94vh] bg-zinc-950 border-2 border-cyan-500/60 rounded-3xl shadow-[0_0_90px_rgba(0,240,255,0.4)] flex flex-col overflow-hidden ring-4 ring-black/90">
        
        {/* TOP HEADER BAR */}
        <div className="bg-zinc-900/95 border-b border-zinc-800 px-4 sm:px-6 py-3 flex justify-between items-center z-20 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg">
              <Compass className="w-5 h-5 text-white animate-spin" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  STATE OF LEONIDA • SATELLITE GPS v5.0
                </span>
                <span className="text-[9px] font-mono bg-pink-950/80 text-pink-300 px-2 py-0.2 rounded border border-pink-500/50">
                  MAPA OFICIAL GTA VI
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black italic tracking-wide text-white uppercase mt-0.5">
                MAPA SATELITAL DE LEONIDA & MISIONES
              </h2>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="hidden md:flex items-center space-x-1.5 bg-zinc-950/90 p-1 rounded-xl border border-zinc-800">
            {[
              { id: 'ALL', label: 'Todo' },
              { id: 'MAIN_MISSION', label: '🟡 Misiones' },
              { id: 'CONTRACT', label: '🟢 Contratos' },
              { id: 'SERVICE', label: '🔵 Servicios' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  audioEngine.playClick();
                  setFilterType(tab.id);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-cyan-500 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-mono text-zinc-400 block">FONDOS TOTALES</span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {formatCurrency(cleanCash + dirtyCash)}
              </span>
            </div>
            <button
              onClick={() => toggleMap(false)}
              className="bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white p-2 rounded-full transition-colors cursor-pointer"
              title="Cerrar Mapa (Tab / Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAP WORKSPACE & SIDEBAR */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* HIGH-RES SATELLITE MAP VIEWPORT CANVAS */}
          <div
            className={`flex-1 relative bg-[#040810] overflow-hidden flex items-center justify-center border-b lg:border-b-0 lg:border-r border-zinc-800 ${
              zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Background High-Res GTA 6 Leonida Map Image Container */}
            <div
              className="relative flex items-center justify-center transition-transform duration-100 ease-out select-none"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`
              }}
            >
              {/* Intrinsic Map Surface Container (Exact 1:1 Image Bounds) */}
              <div className="relative inline-block max-w-[92vw] max-h-[80vh]">
                <img
                  src="/assets/gta6/mapa.png"
                  alt="Leonida Satellite Map"
                  className="block max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-2xl shadow-2xl filter contrast-105 border border-cyan-900/40"
                  draggable={false}
                />

                {/* Ambient Grid Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px] rounded-2xl" />

                {/* INTERACTIVE MARKERS LAYER (Bound 1:1 to map dimensions) */}
                <div className="absolute inset-0 pointer-events-none">
                  {filteredMarkers.map((marker) => {
                    const isSelected = selectedMarker?.id === marker.id;
                    const isCurrentNode = marker.nodeId === currentNodeId;

                    let markerBg = 'bg-yellow-400 text-black border-yellow-100 shadow-[0_0_14px_rgba(250,204,21,0.9)]';
                    let ringColor = 'ring-yellow-400/80';
                    if (marker.type === 'CONTRACT') {
                      markerBg = 'bg-emerald-400 text-black border-emerald-100 shadow-[0_0_14px_rgba(52,211,153,0.9)]';
                      ringColor = 'ring-emerald-400/80';
                    } else if (marker.type === 'SERVICE') {
                      markerBg = 'bg-cyan-400 text-black border-cyan-100 shadow-[0_0_14px_rgba(34,211,238,0.9)]';
                      ringColor = 'ring-cyan-400/80';
                    }

                    return (
                      <button
                        key={marker.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          audioEngine.playClick();
                          setSelectedMarker(marker);
                        }}
                        style={{
                          left: `${marker.xPct}%`,
                          top: `${marker.yPct}%`
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 group z-30 transition-transform duration-200 cursor-pointer pointer-events-auto ${
                          isSelected ? 'scale-125 z-40' : 'hover:scale-115'
                        }`}
                      >
                        {/* Pulsing Target Ring if Selected or Current */}
                        {(isSelected || isCurrentNode) && (
                          <span
                            className={`absolute inset-0 -m-1.5 rounded-full animate-ping opacity-80 ${
                              isCurrentNode ? 'bg-pink-500' : 'bg-cyan-400'
                            }`}
                          />
                        )}

                        <div
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-[10px] border-[1.5px] ring-1.5 ${ringColor} ${markerBg} ${
                            isSelected ? 'ring-3 shadow-[0_0_20px_#00f0ff]' : ''
                          }`}
                        >
                          {marker.type === 'MAIN_MISSION' && <Flame className="w-3.5 h-3.5 fill-black" />}
                          {marker.type === 'CONTRACT' && <DollarSign className="w-3.5 h-3.5" />}
                          {marker.type === 'SERVICE' && <Wrench className="w-3.5 h-3.5" />}
                        </div>

                        {/* Marker Title Tooltip on Hover */}
                        <div className="absolute left-1/2 -translate-x-1/2 -top-7 px-2 py-0.5 bg-black/95 border border-zinc-700 text-white rounded-md text-[9px] font-mono font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-50">
                          {marker.title}
                        </div>

                        {isCurrentNode && (
                          <span className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 text-[7px] font-mono font-black bg-pink-600 text-white px-1 py-0.1 rounded-full border border-white shadow-md animate-bounce">
                            AQUÍ
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* MAP ZOOM & NAVIGATION CONTROLS */}
            <div className="absolute top-4 right-4 z-30 flex flex-col space-y-1.5 bg-black/80 backdrop-blur-md p-1.5 rounded-2xl border border-zinc-800 shadow-2xl">
              <button
                onClick={handleZoomIn}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 text-cyan-300 hover:text-white rounded-xl transition-all active:scale-95 cursor-pointer"
                title="Acercar Mapa (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 text-cyan-300 hover:text-white rounded-xl transition-all active:scale-95 cursor-pointer"
                title="Alejar Mapa (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all active:scale-95 cursor-pointer"
                title="Restablecer Vista (100%)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Radar Reticle */}
            <div className="absolute bottom-4 left-4 backdrop-blur-md bg-black/80 border border-zinc-800 p-2.5 rounded-2xl text-xs font-mono space-y-1 text-zinc-400 pointer-events-none z-20 shadow-xl">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                <Crosshair className="w-3.5 h-3.5 animate-spin" />
                <span>GPS RADAR OFICIAL • LEONIDA</span>
              </div>
              <p className="text-[10px]">
                Escala: {Math.round(zoom * 100)}% • {zoom > 1 ? 'Arrastra para mover' : 'Usa zoom para explorar'}
              </p>
            </div>
          </div>

          {/* SIDEBAR: MISSION / POI BRIEFING CARD */}
          <div className="w-full lg:w-96 bg-zinc-950/98 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 shrink-0">
            {selectedMarker ? (
              <div className="space-y-4">
                {/* Region & Type Badge */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-zinc-900 border border-cyan-500/40 text-cyan-300 uppercase flex items-center gap-1">
                    <Navigation className="w-3 h-3" /> {selectedMarker.district}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-300 font-bold flex items-center gap-1">
                    {selectedMarker.dangerLevel === 'EXTREME' ? (
                      <span className="text-red-400 flex items-center gap-0.5">
                        <Flame className="w-3 h-3" /> EXTREMO
                      </span>
                    ) : (
                      <span>Riesgo: {selectedMarker.dangerLevel}</span>
                    )}
                  </span>
                </div>

                {/* Location Image Banner */}
                {selectedMarker.image && (
                  <div className="relative rounded-2xl overflow-hidden border border-zinc-800 h-36 shadow-xl">
                    <img
                      src={selectedMarker.image}
                      alt={selectedMarker.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex justify-between items-end">
                      <span className="text-xs font-black text-white uppercase italic drop-shadow-md">
                        {selectedMarker.title}
                      </span>
                    </div>
                  </div>
                )}

                {/* Character Speaker Card */}
                {selectedMarker.characterAvatar && (
                  <div className="flex items-center space-x-3 bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-2xl shadow-sm">
                    <img
                      src={selectedMarker.characterAvatar}
                      alt={selectedMarker.characterName}
                      className="w-11 h-11 rounded-full object-cover border-2 border-cyan-400 shadow-md"
                    />
                    <div>
                      <span className="text-[9px] font-mono text-zinc-400 block uppercase">
                        Contacto Principal
                      </span>
                      <span className="text-xs font-bold text-white block">
                        {selectedMarker.characterName}
                      </span>
                    </div>
                  </div>
                )}

                {/* Description & Rewards */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {selectedMarker.subtitle}
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {selectedMarker.description}
                  </p>
                  {selectedMarker.reward && (
                    <div className="bg-emerald-950/40 border border-emerald-500/40 p-2.5 rounded-xl text-xs font-mono text-emerald-300 flex items-center justify-between shadow-inner">
                      <span>Recompensa Estimada:</span>
                      <span className="font-bold text-white">{selectedMarker.reward}</span>
                    </div>
                  )}
                </div>

                {/* Action Button: Launch Mission / Fast Travel */}
                {(() => {
                  const isPaidContract =
                    selectedMarker.type === 'CONTRACT' && completedContracts.includes(selectedMarker.id);
                  const label =
                    selectedMarker.type === 'MAIN_MISSION'
                      ? 'INICIAR MISIÓN / VIAJAR'
                      : selectedMarker.type === 'CONTRACT'
                        ? isPaidContract
                          ? 'CONTRATO YA COBRADO'
                          : 'ACEPTAR CONTRATO'
                        : 'MARCAR EN GPS';
                  return (
                    <button
                      onClick={() => handleLaunchMission(selectedMarker)}
                      disabled={isPaidContract}
                      className="w-full py-3.5 bg-gradient-to-r from-pink-600 via-orange-500 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 disabled:from-zinc-700 disabled:via-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed disabled:shadow-none text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_25px_rgba(255,42,133,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
                    >
                      <Crosshair className="w-4 h-4" />
                      <span>{label}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  );
                })()}

                {/* Free roam driving */}
                <button
                  onClick={handleStartDriving}
                  className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-cyan-500/50 hover:border-cyan-300 text-cyan-300 hover:text-white font-black text-xs uppercase tracking-widest rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  title="Conducir libremente por Leonida (tecla G)"
                >
                  <Car className="w-4 h-4" />
                  <span>CONDUCIR POR LEONIDA (G)</span>
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 py-12">
                <MapPin className="w-12 h-12 text-zinc-700 mb-2" />
                <p className="text-xs font-mono">Selecciona un marcador en el mapa para ver los detalles de la misión.</p>
              </div>
            )}

            {/* Quick Map Legend */}
            <div className="pt-3 border-t border-zinc-800 text-[10px] font-mono text-zinc-400 flex justify-between items-center">
              <span className="flex items-center gap-1">🟡 Misión Principal</span>
              <span className="flex items-center gap-1">🟢 Contrato</span>
              <span className="flex items-center gap-1">🔵 Servicio</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
