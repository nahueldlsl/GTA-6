// ============================================================================
// 🌴 GTA VI VICE DYNASTY - HUD & HEADER INTERACTIVE ONBOARDING TUTORIAL
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { audioEngine } from '../../engine/audioEngine';
import {
  DollarSign,
  Flame,
  Users,
  History,
  Smartphone,
  Volume2,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  ShieldAlert,
  MapPin,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface TutorialStep {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
  highlightItems: Array<{
    icon: React.ReactNode;
    title: string;
    text: string;
  }>;
  hotkey?: string;
  proTip?: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    badge: 'GUÍA OFICIAL • GTA VI',
    badgeColor: 'from-pink-500 to-cyan-400',
    title: 'Bienvenido a Leonida State',
    subtitle: 'El Encabezado (HUD) y la Interfaz del Crimen',
    icon: <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />,
    description:
      'En Vice Dynasty cada decisión modifica tu reputación, finanzas y el destino de Jason y Lucia en el bajo mundo. El encabezado superior (HUD) es tu panel de control vital.',
    highlightItems: [
      {
        icon: <Users className="w-4 h-4 text-pink-400" />,
        title: 'Dúo Protagonista (Jason & Lucia)',
        text: 'Alterna entre Jason [J] y Lucia [L] en cualquier momento desde la barra superior.'
      },
      {
        icon: <Flame className="w-4 h-4 text-orange-400" />,
        title: 'Presión Policial (Estrellas)',
        text: 'Tus decisiones aumentan o reducen tu nivel de búsqueda de 0 a 5 estrellas con consecuencias reales.'
      },
      {
        icon: <Smartphone className="w-4 h-4 text-cyan-400" />,
        title: 'Terminal ViceOS [M]',
        text: 'Comunícate por Signal, recibe misiones, escucha la radio y consulta el GPS.'
      }
    ],
    proTip: 'Puedes pausar la historia con [P] o abrir el mapa con [Tab] en cualquier momento.'
  },
  {
    id: 'finances',
    badge: 'COLUMNA IZQUIERDA • ECONOMÍA',
    badgeColor: 'from-emerald-500 to-teal-400',
    title: 'Finanzas, Respeto & Protagonistas',
    subtitle: 'Dinero, Reputación y Cambio de Personaje',
    icon: <DollarSign className="w-8 h-8 text-emerald-400" />,
    description:
      'Tus finanzas determinan tu capacidad de comprar armamento, sobornar policías y reclutar especialistas:',
    highlightItems: [
      {
        icon: <span className="font-bold text-emerald-400 font-mono text-xs">🟢 LIMPIO</span>,
        title: 'Dinero Limpio (Bancarizado)',
        text: 'Fondos 100% legales listos para compras y sobornos policiales sin levantar sospechas.'
      },
      {
        icon: <span className="font-bold text-red-400 font-mono text-xs">🔴 SUCIO</span>,
        title: 'Dinero Sucio (Efectivo Clandestino)',
        text: 'Botín obtenido en golpes y misiones clandestinas.'
      },
      {
        icon: <Sparkles className="w-4 h-4 text-yellow-400" />,
        title: 'Respeto (0 - 100%)',
        text: 'Tu reputación criminal. Desbloquea contactos de élite y mejores acuerdos.'
      }
    ],
    proTip: 'Cambia a Lucia [L] para negociaciones y hackeo, o a Jason [J] para acción y armas pesadas.'
  },
  {
    id: 'chapter',
    badge: 'COLUMNA CENTRAL • NARRATIVA',
    badgeColor: 'from-pink-600 to-purple-600',
    title: 'Banner de Acto, Capítulo & Distrito',
    subtitle: 'Navegación Narrativa de Leonida',
    icon: <MapPin className="w-8 h-8 text-pink-400" />,
    description:
      'El banner central del encabezado te indica en tiempo real el progreso de tu historia y tu ubicación geográfica:',
    highlightItems: [
      {
        icon: <MapPin className="w-4 h-4 text-cyan-400" />,
        title: 'Distrito Activo',
        text: 'Leonida Keys, Port Gellhorn, Ambrosia County, Downtown Vice City, Grassrivers Swamps.'
      },
      {
        icon: <Sparkles className="w-4 h-4 text-pink-400" />,
        title: 'Acto y Capítulo',
        text: 'Identifica la fase de la campaña en la que te encuentras (Actos I al V y Epílogos).'
      }
    ],
    proTip: 'Al cambiar de escena se realiza una transición de barrido satelital estilo Rockstar.'
  },
  {
    id: 'wanted',
    badge: 'COLUMNA DERECHA • PERSECUCIÓN',
    badgeColor: 'from-red-600 to-orange-500',
    title: 'Estrellas de Búsqueda Policial (Heat)',
    subtitle: 'Consecuencias Directas de tus Decisiones Narrativas',
    icon: <ShieldAlert className="w-8 h-8 text-red-500" />,
    description:
      'Cometer actos violentos en tus decisiones aumenta las estrellas policiales de Leonida:',
    highlightItems: [
      {
        icon: <Flame className="w-4 h-4 text-red-400" />,
        title: '1-2 Estrellas: Patrullas Locales',
        text: 'Patrullas te siguen la pista. Puedes evadirlos eligiendo opciones de sigilo o rutas secundarias.'
      },
      {
        icon: <Flame className="w-4 h-4 text-red-500" />,
        title: '3-5 Estrellas: SWAT y Helicópteros',
        text: 'Persecución a fondo con sirenas y bloqueos armados en la historia.'
      },
      {
        icon: <Volume2 className="w-4 h-4 text-cyan-400" />,
        title: 'Scanner Policial',
        text: 'Escucharás frecuencias de radio policiales reales al entrar en alerta.'
      }
    ],
    proTip: 'Las estrellas bajan exclusivamente tomando decisiones inteligentes, cambiando de vehículo o refugiándote.'
  },
  {
    id: 'crew_history',
    badge: 'HERRAMIENTAS • GESTIÓN & LÍNEA TEMPORAL',
    badgeColor: 'from-cyan-500 to-blue-600',
    title: 'Equipo Progresivo & Historial DAG',
    subtitle: 'Descubre Aliados y Rebobina Decisiones',
    icon: <Users className="w-8 h-8 text-cyan-400" />,
    description:
      'Tus elecciones determinan quién se une a tu banda y quién sobrevive:',
    highlightItems: [
      {
        icon: <Users className="w-4 h-4 text-cyan-400" />,
        title: 'Equipo & Contactos (Botón Equipo)',
        text: 'Descubre y monitorea la lealtad de Brian Heder, Cal Hampton, Raul Bautista y Boobie Ike.'
      },
      {
        icon: <History className="w-4 h-4 text-zinc-300" />,
        title: 'Historial de Decisiones (Botón Reloj)',
        text: 'Visualiza el árbol cronológico completo y rebobina a cualquier punto si deseas explorar otros caminos.'
      }
    ],
    proTip: 'Nuevos miembros del equipo se desbloquean en el menú conforme los conoces en la trama.'
  },
  {
    id: 'viceos',
    badge: 'TERMINAL DEL CRIMEN • VICEOS',
    badgeColor: 'from-pink-500 via-purple-500 to-cyan-500',
    title: 'Smartphone ViceOS',
    subtitle: 'El Dispositivo Central de Jason & Lucia',
    icon: <Smartphone className="w-8 h-8 text-pink-400" />,
    hotkey: 'Tecla M',
    description:
      'Tu teléfono inteligente oficial ViceOS contiene 4 aplicaciones esenciales:',
    highlightItems: [
      {
        icon: <span className="font-bold text-pink-400 font-mono text-xs">💬 Signal</span>,
        title: 'Misiones & Mensajes',
        text: 'Objetivos de misión activos y comunicación directa con personajes clave.'
      },
      {
        icon: <span className="font-bold text-yellow-400 font-mono text-xs">📻 ViceRadio</span>,
        title: 'ViceRadio FM',
        text: 'Sintoniza tus canciones MP3 favoritas con reproductor de alta fidelidad.'
      },
      {
        icon: <span className="font-bold text-cyan-400 font-mono text-xs">🗺️ GPS Maps</span>,
        title: 'ViceMaps Satelital',
        text: 'Ubicación actual y lista de puntos de interés y misiones.'
      },
      {
        icon: <span className="font-bold text-orange-400 font-mono text-xs">📸 InstaVice</span>,
        title: 'InstaVice Social',
        text: 'Feed fotográfico y social del estado de Leonida.'
      }
    ],
    proTip: 'Presiona [M] en cualquier momento para abrir el teléfono y revisar tu objetivo actual.'
  }
];

export const HUDTutorialModal: React.FC = () => {
  const { isTutorialOpen, completeTutorial } = useGameStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const step = TUTORIAL_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === TUTORIAL_STEPS.length - 1;

  // Keyboard navigation for tutorial
  useEffect(() => {
    if (!isTutorialOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (isLastStep) {
          completeTutorial();
        } else {
          audioEngine.playClick();
          setCurrentStepIndex((prev) => Math.min(TUTORIAL_STEPS.length - 1, prev + 1));
        }
      } else if (e.key === 'ArrowLeft') {
        audioEngine.playClick();
        setCurrentStepIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        completeTutorial();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTutorialOpen, isLastStep, completeTutorial]);

  if (!isTutorialOpen) return null;

  const handleNext = () => {
    audioEngine.playClick();
    if (isLastStep) {
      completeTutorial();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    audioEngine.playClick();
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    completeTutorial();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn select-none"
    >
      <div className="relative w-full max-w-2xl bg-zinc-950 border-2 border-pink-500/70 rounded-3xl shadow-[0_0_80px_rgba(255,42,133,0.4)] flex flex-col overflow-hidden ring-4 ring-black/90">
        
        {/* Top Gradient Ribbon */}
        <div className={`h-2 bg-gradient-to-r ${step.badgeColor} w-full`} />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 bg-zinc-900/60 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-black/70 border border-zinc-700 shadow-inner">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest bg-gradient-to-r ${step.badgeColor} bg-clip-text text-transparent`}>
                {step.badge}
              </span>
              <h2 className="text-base sm:text-lg font-black italic tracking-wide text-white uppercase mt-0.5">
                GUÍA INTERACTIVA DEL HEADER & INTERFAZ
              </h2>
            </div>
          </div>

          <button
            onClick={handleSkip}
            className="text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 p-1.5 rounded-full transition-colors cursor-pointer"
            title="Cerrar Guía (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-zinc-800">
          {/* Step Hero Card */}
          <div className="flex items-start space-x-4 bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl">
            <div className="p-3 bg-black/90 rounded-2xl border border-zinc-700/80 shrink-0 shadow-lg">
              {step.icon}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white italic">{step.title}</h3>
                {step.hotkey && (
                  <span className="text-[10px] font-mono font-bold bg-pink-950/80 border border-pink-500/60 text-pink-300 px-2 py-0.5 rounded">
                    [{step.hotkey}]
                  </span>
                )}
              </div>
              <p className="text-xs text-cyan-300 font-mono font-medium">{step.subtitle}</p>
              <p className="text-xs text-zinc-300 leading-relaxed pt-1">{step.description}</p>
            </div>
          </div>

          {/* Highlights List */}
          <div className="grid grid-cols-1 gap-2.5">
            {step.highlightItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/40 border border-zinc-800/70 p-3 rounded-xl flex items-start space-x-3 transition-colors hover:border-zinc-700"
              >
                <div className="p-1.5 bg-black/80 rounded-lg shrink-0 mt-0.5 border border-zinc-800">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-[11px] text-zinc-400 leading-snug mt-0.5">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ProTip Callout */}
          {step.proTip && (
            <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-xl text-xs font-mono text-cyan-300 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white uppercase font-bold">Consejo de Juego:</strong> {step.proTip}
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer & Navigation */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-900/95 flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Step Indicators */}
          <div className="flex items-center space-x-1.5">
            {TUTORIAL_STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  audioEngine.playClick();
                  setCurrentStepIndex(idx);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? 'w-6 bg-pink-500 shadow-[0_0_10px_#ff2a85]'
                    : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                }`}
                title={`Ir al paso ${idx + 1}: ${s.title}`}
              />
            ))}
            <span className="text-[10px] font-mono text-zinc-400 ml-2">
              {currentStepIndex + 1} / {TUTORIAL_STEPS.length}
            </span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleSkip}
              className="px-3 py-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Omitir
            </button>

            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-mono font-bold flex items-center space-x-1 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-gradient-to-r from-pink-600 via-orange-500 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(255,42,133,0.5)] active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span>{isLastStep ? '¡Entendido, a Jugar!' : 'Siguiente'}</span>
              {isLastStep ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
