// ============================================================================
// 🌴 VICE-OS: VICEMAPS GPS SATELITAL APP
// ============================================================================

import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { STORY_NODES } from '../../data/storyGraph';
import { audioEngine } from '../../engine/audioEngine';
import {
  Compass,
  Navigation,
  Maximize2,
  ChevronRight,
  Car
} from 'lucide-react';

export const ViceMapsApp: React.FC = () => {
  const { currentNodeId, jumpToNode, toggleMap, togglePhone, toggleDrivingMode } = useGameStore();
  const currentNode = STORY_NODES[currentNodeId] || STORY_NODES['node_act1_keys_workshop'];

  const [activeTab, setActiveTab] = useState<'GPS' | 'MISSIONS'>('GPS');

  const MAIN_STORY_WAYPOINTS = [
    {
      act: 'ACTO I',
      title: 'Taller de Brian Heder',
      location: 'Leonida Keys',
      nodeId: 'node_act1_keys_workshop',
      image: '/assets/gta6/Places/Leonida Keys/Leonida_Keys_01.jpg',
      distance: '0.8 km'
    },
    {
      act: 'ACTO I',
      title: 'Marina de Port Gellhorn',
      location: 'Port Gellhorn',
      nodeId: 'node_act1_port_gellhorn_errand',
      image: '/assets/gta6/Places/Port Gellhorn/Port_Gellhorn_01.jpg',
      distance: '3.4 km'
    },
    {
      act: 'ACTO II',
      title: 'Penitenciaría de Leonida',
      location: 'Ambrosia County',
      nodeId: 'node_act2_prison_release',
      image: '/assets/gta6/Places/Ambrosia/Ambrosia_01.jpg',
      distance: '7.2 km'
    },
    {
      act: 'ACTO II',
      title: 'Bar de las Afueras',
      location: 'Vice Outskirts',
      nodeId: 'node_act2_dive_bar_fight',
      image: '/assets/gta6/Places/Vice City/Vice_City_01.jpg',
      distance: '4.1 km'
    },
    {
      act: 'ACTO III',
      title: 'Club Jack of Hearts',
      location: 'Downtown Vice City',
      nodeId: 'node_act3_jack_of_hearts',
      image: '/assets/gta6/Places/Vice City/Vice_City_04.jpg',
      distance: '6.5 km'
    },
    {
      act: 'ACTO IV',
      title: 'Restaurante en Ambrosia',
      location: 'Ambrosia Norte',
      nodeId: 'node_act4_ambrosia_restaurant',
      image: '/assets/gta6/Places/Ambrosia/Ambrosia_02.jpg',
      distance: '8.9 km'
    },
    {
      act: 'ACTO V',
      title: 'Asalto First National Bank',
      location: 'Ambrosia Financial',
      nodeId: 'node_act5_bank_assault',
      image: '/assets/gta6/Places/Ambrosia/Ambrosia_04.jpg',
      distance: '9.2 km'
    },
    {
      act: 'EPÍLOGO',
      title: 'Amanecer en la Playa',
      location: 'Leonida Keys South',
      nodeId: 'node_epilogue_suncoast_dawn',
      image: '/assets/gta6/Places/Leonida Keys/Leonida_Keys_03.jpg',
      distance: '12.0 km'
    }
  ];

  const handleSelectWaypoint = (nodeId: string) => {
    audioEngine.playClick();
    jumpToNode(nodeId);
    togglePhone(false);
  };

  const handleOpenFullscreenMap = () => {
    togglePhone(false);
    toggleMap(true);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white select-none">
      {/* Header */}
      <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-cyan-950 text-cyan-400 rounded-lg border border-cyan-500/40">
            <Navigation className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <h3 className="text-xs font-black italic tracking-wide uppercase">ViceMaps GPS</h3>
            <span className="text-[9px] font-mono text-zinc-400">Leonida Satellite Active</span>
          </div>
        </div>

        <button
          onClick={handleOpenFullscreenMap}
          className="bg-zinc-800 hover:bg-cyan-500 hover:text-black text-cyan-300 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center space-x-1 transition-all cursor-pointer"
        >
          <Maximize2 className="w-3 h-3" />
          <span>EXPANDIR</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-zinc-800 bg-zinc-900/60 p-1">
        <button
          onClick={() => setActiveTab('GPS')}
          className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'GPS'
              ? 'bg-cyan-500 text-black shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          📍 Mi Ubicación
        </button>
        <button
          onClick={() => setActiveTab('MISSIONS')}
          className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'MISSIONS'
              ? 'bg-cyan-500 text-black shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          🎯 Misiones ({MAIN_STORY_WAYPOINTS.length})
        </button>
      </div>

      {/* Viewport Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-zinc-800">
        {activeTab === 'GPS' ? (
          <div className="space-y-3">
            {/* Mini Radar Satellite Screen */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/50 bg-black h-44 shadow-lg flex items-center justify-center">
              <img
                src="/assets/gta6/mapa.png"
                alt="Leonida GPS Radar Map"
                className="w-full h-full object-cover opacity-60 scale-125 filter contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Pulsing GPS Blip */}
              <div className="absolute flex items-center justify-center">
                <span className="w-8 h-8 rounded-full bg-cyan-500/30 animate-ping absolute" />
                <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_15px_#00f0ff]" />
              </div>

              {/* District HUD Stamp */}
              <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end text-xs font-mono">
                <div>
                  <span className="text-[9px] text-cyan-400 block font-bold">UBICACIÓN ACTUAL:</span>
                  <span className="font-bold text-white uppercase text-[11px] truncate max-w-[200px] block">
                    {currentNode.location}
                  </span>
                </div>
                <span className="text-[9px] text-zinc-400 bg-black/80 px-1.5 py-0.5 rounded">
                  {currentNode.gpsCoords || '25.7617° N'}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl space-y-2">
              <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                Misión en Curso:
              </span>
              <h4 className="text-xs font-bold text-white leading-tight">
                {currentNode.actTitle} • {currentNode.chapterTitle}
              </h4>
              <p className="text-[11px] text-zinc-400 leading-snug">
                📍 {currentNode.district || 'Leonida State'}
              </p>
              <button
                onClick={handleOpenFullscreenMap}
                className="w-full mt-2 py-2 bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-mono font-bold text-xs uppercase rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Abrir Mapa de Leonida Completo</span>
              </button>

              <button
                onClick={() => {
                  togglePhone(false);
                  toggleDrivingMode(true);
                }}
                className="w-full mt-1.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white font-mono font-bold text-xs uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Car className="w-3.5 h-3.5" />
                <span>Conducir en Mapa 2D (G)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wide block">
              Lista de Puntos de Interés:
            </span>
            {MAIN_STORY_WAYPOINTS.map((wp, idx) => {
              const isCurrent = wp.nodeId === currentNodeId;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectWaypoint(wp.nodeId)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-cyan-950/80 border-cyan-400 text-white'
                      : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <img
                    src={wp.image}
                    alt={wp.title}
                    className="w-12 h-10 rounded-lg object-cover border border-zinc-800 shrink-0"
                  />
                  <div className="flex-1 truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono font-bold text-pink-400">
                        {wp.act}
                      </span>
                      <span className="text-[9px] text-zinc-400 font-mono">
                        • {wp.distance}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-white truncate">{wp.title}</h5>
                    <span className="text-[10px] text-zinc-400 truncate block">
                      📍 {wp.location}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
