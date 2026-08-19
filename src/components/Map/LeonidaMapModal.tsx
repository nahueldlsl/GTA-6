// ============================================================================
// 🌴 LEONIDA STATE HIGH-RES INTERACTIVE SATELLITE MAP (GTA VI OFFICIAL MAP)
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { audioEngine } from '../../engine/audioEngine';
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
  Navigation
} from 'lucide-react';

interface MapMarker {
  id: string;
  type: 'MAIN_MISSION' | 'CONTRACT' | 'SERVICE';
  title: string;
  subtitle: string;
  district: string;
  region: 'VICE_CITY' | 'LEONIDA_KEYS' | 'PORT_GELLHORN' | 'AMBROSIA' | 'GRASSRIVERS' | 'MOUNT_KALAGA';
  xPct: number; // 0-100% position on map
  yPct: number;
  nodeId?: string;
  reward?: string;
  characterAvatar?: string;
  characterName?: string;
  image?: string;
  description: string;
  dangerLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
}

const LEONIDA_MARKERS: MapMarker[] = [
  // ACT I - Leonida Keys & Port Gellhorn
  {
    id: 'poi_act1_keys',
    type: 'MAIN_MISSION',
    title: 'ACTO I: Taller de Brian Heder',
    subtitle: 'El Asfalto de los Cayos & La Sangría de Lori',
    district: 'Leonida Keys',
    region: 'LEONIDA_KEYS',
    xPct: 28,
    yPct: 84,
    nodeId: 'node_act1_keys_workshop',
    reward: '$15,000 + Alquiler Gratis',
    characterAvatar: '/assets/gta6/People/Brian Heder/Brian_Heder_01.jpg',
    characterName: 'Brian Heder & Lori',
    image: '/assets/gta6/Places/Leonida Keys/Leonida_Keys_01.jpg',
    description: 'Encuentro con Brian Heder masticando su puro en el taller náutico y Lori sirviendo sangría. Recibe el encargo para cobrar la deuda de la lancha en Port Gellhorn.',
    dangerLevel: 'LOW'
  },
  {
    id: 'poi_act1_gellhorn',
    type: 'MAIN_MISSION',
    title: 'ACTO I: Cobro en la Marina',
    subtitle: 'Muelles de Reparación de Port Gellhorn',
    district: 'Port Gellhorn Marina',
    region: 'PORT_GELLHORN',
    xPct: 18,
    yPct: 62,
    nodeId: 'node_act1_port_gellhorn_errand',
    reward: '$25,000 + Lancha Rápida',
    characterAvatar: '/assets/gta6/People/Jason Duval/Jason_Duval_01.jpg',
    characterName: 'Jason Duval',
    image: '/assets/gta6/Places/Port Gellhorn/Port_Gellhorn_01.jpg',
    description: 'Confrontación en los muelles con el moroso de la lancha rápida. Asústalo lo suficiente para recuperar el dinero sin llamar a la policía.',
    dangerLevel: 'MEDIUM'
  },

  // ACT II - Ambrosia Prison & Dive Bar
  {
    id: 'poi_act2_prison',
    type: 'MAIN_MISSION',
    title: 'ACTO II: Penitenciaría de Leonida',
    subtitle: 'Hierro, Libertad y la Postal de Liberty City',
    district: 'Ambrosia County',
    region: 'AMBROSIA',
    xPct: 44,
    yPct: 32,
    nodeId: 'node_act2_prison_release',
    reward: '+15 Respeto',
    characterAvatar: '/assets/gta6/People/Lucia Caminos/Lucia_Caminos_01.jpg',
    characterName: 'Lucia Caminos',
    image: '/assets/gta6/Places/Ambrosia/Ambrosia_01.jpg',
    description: 'Salida de Lucia tras cumplir su condena bajo el sol abrasador. La promesa de jugar solo partidas inteligentes.',
    dangerLevel: 'SAFE'
  },
  {
    id: 'poi_act2_bar',
    type: 'MAIN_MISSION',
    title: 'ACTO II: Bar de las Afueras',
    subtitle: 'Encuentro, Pelea de Botellas y Pacto de Fuego',
    district: 'Vice Outskirts',
    region: 'VICE_CITY',
    xPct: 64,
    yPct: 52,
    nodeId: 'node_act2_dive_bar_fight',
    reward: 'Alianza Jason & Lucia',
    characterAvatar: '/assets/gta6/People/Jason Duval/Jason_Duval_03.jpg',
    characterName: 'Jason & Lucia',
    image: '/assets/gta6/Places/Vice City/Vice_City_01.jpg',
    description: 'Pelea de bar contra matones locales. Desarme táctico y nacimiento del pacto de lealtad indestructible.',
    dangerLevel: 'HIGH'
  },

  // ACT III - Jack of Hearts & Boobie Ike
  {
    id: 'poi_act3_club',
    type: 'MAIN_MISSION',
    title: 'ACTO III: Club Jack of Hearts',
    subtitle: 'Boobie Ike, Dre\'Quan Priest & Real Dimez',
    district: 'Downtown Vice City',
    region: 'VICE_CITY',
    xPct: 76,
    yPct: 46,
    nodeId: 'node_act3_jack_of_hearts',
    reward: '$75,000 Limpios',
    characterAvatar: '/assets/gta6/People/Boobie Ike/Boobie_Ike_01.jpg',
    characterName: 'Boobie Ike & Dre\'Quan',
    image: '/assets/gta6/Places/Vice City/Vice_City_04.jpg',
    description: 'El corazón nocturno de Vice City. Venta de rutas marítimas de Brian Heder a cambio de capital y contactos financieros.',
    dangerLevel: 'LOW'
  },

  // ACT IV - Ambrosia Cuban Diner & First National
  {
    id: 'poi_act4_diner',
    type: 'MAIN_MISSION',
    title: 'ACTO IV: Restaurante en Ambrosia',
    subtitle: 'Café Cubano y la Oferta de Raul Bautista',
    district: 'Ambrosia Norte',
    region: 'AMBROSIA',
    xPct: 48,
    yPct: 24,
    nodeId: 'node_act4_ambrosia_restaurant',
    reward: 'Plan del Golpe First National',
    characterAvatar: '/assets/gta6/People/Raul Bautista/Raul_Bautista_01.jpg',
    characterName: 'Raul Bautista',
    image: '/assets/gta6/Places/Ambrosia/Ambrosia_02.jpg',
    description: 'Reunión en restaurante cubano con Raul Bautista para planear el asalto de $3,000,000 al First National Bank.',
    dangerLevel: 'HIGH'
  },

  // ACT V - Bank Assault & Swamp Escape
  {
    id: 'poi_act5_bank',
    type: 'MAIN_MISSION',
    title: 'ACTO V: Asalto al First National',
    subtitle: 'Niebla, C4 y Ruptura Blindada',
    district: 'Ambrosia Metro',
    region: 'AMBROSIA',
    xPct: 46,
    yPct: 28,
    nodeId: 'node_act5_bank_assault',
    reward: '$3,000,000 en Efectivo',
    characterAvatar: '/assets/gta6/People/Lucia Caminos/Lucia_Caminos_05.jpg',
    characterName: 'Escuadrón del Asalto',
    image: '/assets/gta6/Places/Ambrosia/Ambrosia_04.jpg',
    description: 'Atraco a gran escala. Detonación de C4 en puerta trasera y recogida de bolsas de dinero bajo tiroteo.',
    dangerLevel: 'EXTREME'
  },
  {
    id: 'poi_act5_swamp',
    type: 'MAIN_MISSION',
    title: 'ACTO V: Fuga en Grassrivers',
    subtitle: 'Persecución en Pantanos de Caimanes',
    district: 'Grassrivers Swamps',
    region: 'GRASSRIVERS',
    xPct: 36,
    yPct: 58,
    nodeId: 'node_act5_grassrivers_escape',
    reward: 'Fuga Exitosa + 0 Búsqueda',
    characterAvatar: '/assets/gta6/People/Jason Duval/Jason_Duval_05.jpg',
    characterName: 'Jason & Lucia',
    image: '/assets/gta6/Places/Grassrivers/Grassrivers_01.jpg',
    description: 'Derrapes nocturnos en Muscle Car a través de pantanos de caimanes y rutas clandestinas hasta perder a las patrullas.',
    dangerLevel: 'HIGH'
  },

  // EPILOGUE
  {
    id: 'poi_epilogue_keys',
    type: 'MAIN_MISSION',
    title: 'EPÍLOGO: El Sol Poniente',
    subtitle: 'Amanecer en la Playa de los Cayos',
    district: 'Leonida Keys South',
    region: 'LEONIDA_KEYS',
    xPct: 32,
    yPct: 90,
    nodeId: 'node_epilogue_suncoast_dawn',
    reward: 'Victoria Canónica',
    characterAvatar: '/assets/gta6/People/Lucia Caminos/Lucia_Caminos_06.jpg',
    characterName: 'Lucia & Jason',
    image: '/assets/gta6/Places/Leonida Keys/Leonida_Keys_03.jpg',
    description: 'El fin del viaje. Jason y Lucia descansan con el botín contemplando el sol naranja sobre el Atlántico.',
    dangerLevel: 'SAFE'
  },

  // SECONDARY CONTRACTS
  {
    id: 'poi_contract_speed',
    type: 'CONTRACT',
    title: 'Contrato: Carrera Callejera en Ocean Drive',
    subtitle: 'Prueba de Velocidad con Apuestas Altas',
    district: 'Ocean Drive Beach',
    region: 'VICE_CITY',
    xPct: 82,
    yPct: 56,
    reward: '$35,000 Limpios',
    characterAvatar: '/assets/gta6/People/Real Dimez/Real_Dimez_01.jpg',
    characterName: 'Club de Carreras Vice',
    image: '/assets/gta6/Places/Vice City/Vice_City_02.jpg',
    description: 'Compite con el Muscle Car por la costa iluminada de Ocean Drive frente a los superdeportivos locales.',
    dangerLevel: 'MEDIUM'
  },
  {
    id: 'poi_contract_smuggle',
    type: 'CONTRACT',
    title: 'Contrato: Cajas de Contrabando de Brian',
    subtitle: 'Ruta Clandestina hacia Port Gellhorn',
    district: 'Canal de Gellhorn',
    region: 'PORT_GELLHORN',
    xPct: 14,
    yPct: 70,
    reward: '$20,000 Sucio',
    characterAvatar: '/assets/gta6/People/Brian Heder/Brian_Heder_01.jpg',
    characterName: 'Brian Heder',
    image: '/assets/gta6/Places/Port Gellhorn/Port_Gellhorn_03.jpg',
    description: 'Transporta tres cajas de repuestos no declarados sin alertar a los guardacostas de Leonida.',
    dangerLevel: 'MEDIUM'
  },

  // SERVICES & GARAGES
  {
    id: 'poi_service_tuner',
    type: 'SERVICE',
    title: 'Taller de Tuneo & Blindaje Ambrosia',
    subtitle: 'Modificaciones V8, Nitro y Cristales Blindados',
    district: 'Ambrosia Industrial',
    region: 'AMBROSIA',
    xPct: 40,
    yPct: 38,
    characterAvatar: '/assets/gta6/People/Cal Hampton/Cal_Hampton_01.jpg',
    characterName: 'Cal Hampton Customs',
    image: '/assets/gta6/Places/Ambrosia/Ambrosia_03.jpg',
    description: 'Mejora la suspensión y el motor del Muscle Car para resistir impactos policiales y barro de pantano.',
    dangerLevel: 'SAFE'
  },
  {
    id: 'poi_service_mount',
    type: 'SERVICE',
    title: 'Mirador de Mount Kalaga',
    subtitle: 'Parque Nacional y Rutas Off-Road',
    district: 'Mount Kalaga Peak',
    region: 'MOUNT_KALAGA',
    xPct: 66,
    yPct: 16,
    characterAvatar: '/assets/gta6/People/Jason Duval/Jason_Duval_01.jpg',
    characterName: 'Ranger Station',
    image: '/assets/gta6/Places/Mount Kalaga National Park/Mount_Kalaga_National_Park_01.jpg',
    description: 'Punto más alto del estado de Leonida. Vista despejada para vigilar movimientos aéreos de la policía.',
    dangerLevel: 'SAFE'
  }
];

export const LeonidaMapModal: React.FC = () => {
  const { isMapOpen, toggleMap, jumpToNode, currentNodeId, cleanCash, dirtyCash } = useGameStore();
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
    } else if (marker.reward) {
      audioEngine.playCashRegister();
      alert(`¡Contrato "${marker.title}" completado! Recibiste ${marker.reward}.`);
      toggleMap(false);
    }
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
                ${(cleanCash + dirtyCash).toLocaleString()}
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
                <button
                  onClick={() => handleLaunchMission(selectedMarker)}
                  className="w-full py-3.5 bg-gradient-to-r from-pink-600 via-orange-500 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_25px_rgba(255,42,133,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
                >
                  <Crosshair className="w-4 h-4" />
                  <span>INICIAR MISIÓN / VIAJAR</span>
                  <ChevronRight className="w-4 h-4" />
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
