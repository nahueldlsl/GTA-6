// ============================================================================
// 🌴 VICE-OS SMARTPHONE SHELL & APP MANAGER (GTA VI iFruit / ViceOS OFFICIAL)
// ============================================================================

import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { audioEngine } from '../../engine/audioEngine';
import { SignalApp } from './SignalApp';
import { InstaViceApp } from './InstaViceApp';
import { ViceMapsApp } from './ViceMapsApp';
import { ViceRadioApp } from './ViceRadioApp';
import { DarkPayApp } from './DarkPayApp';
import { HeistPlannerApp } from './HeistPlannerApp';
import type { PhoneAppId } from '../../types/game';
import {
  MessageSquare,
  Camera,
  Navigation,
  Radio,
  X,
  Wifi,
  Battery,
  ShieldCheck,
  Target
} from 'lucide-react';

interface AppRegistryItem {
  id: PhoneAppId;
  name: string;
  icon: React.ReactNode;
  activeColor: string;
  component: React.ComponentType;
  badge?: (store: ReturnType<typeof useGameStore.getState>) => number | undefined;
}

const APPS: AppRegistryItem[] = [
  {
    id: 'signal',
    name: 'Misiones',
    icon: <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />,
    activeColor: 'text-pink-400',
    component: SignalApp,
    badge: (state) => (state.unreadSignalCount > 0 ? state.unreadSignalCount : undefined)
  },
  {
    id: 'viceradio',
    name: 'Radio',
    icon: <Radio className="w-4 h-4 sm:w-5 sm:h-5" />,
    activeColor: 'text-yellow-400',
    component: ViceRadioApp
  },
  {
    id: 'vicemaps',
    name: 'GPS Maps',
    icon: <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />,
    activeColor: 'text-cyan-400',
    component: ViceMapsApp
  },
  {
    id: 'instavice',
    name: 'InstaVice',
    icon: <Camera className="w-4 h-4 sm:w-5 sm:h-5" />,
    activeColor: 'text-orange-400',
    component: InstaViceApp
  },
  {
    id: 'darkpay',
    name: 'DarkPay',
    icon: <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />,
    activeColor: 'text-emerald-400',
    component: DarkPayApp
  },
  {
    id: 'heistplanner',
    name: 'Atracos',
    icon: <Target className="w-4 h-4 sm:w-5 sm:h-5" />,
    activeColor: 'text-red-400',
    component: HeistPlannerApp
  }
];

export const ViceOSModal: React.FC = () => {
  const { isPhoneOpen, togglePhone, activePhoneApp, setPhoneApp, unreadSignalCount } = useGameStore();

  if (!isPhoneOpen) return null;

  const handleAppSwitch = (app: PhoneAppId) => {
    audioEngine.playClick();
    setPhoneApp(app);
  };

  const handleClose = () => {
    audioEngine.playClick();
    togglePhone(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn"
    >
      {/* Smartphone Hardware Frame */}
      <div className="relative w-full max-w-sm sm:max-w-md h-[92vh] max-h-[820px] bg-zinc-950 border-[3.5px] border-zinc-700/90 rounded-[42px] shadow-[0_0_70px_rgba(255,42,133,0.35)] flex flex-col overflow-hidden ring-4 ring-black/90">
        
        {/* Dynamic Island & Notch Pill */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-black rounded-full z-30 flex items-center justify-center space-x-2.5 border border-zinc-800 shadow-md">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <div className="flex items-center space-x-1.5">
            <Radio className="w-2.5 h-2.5 text-pink-400 animate-spin" />
            <span className="text-[9px] font-mono font-bold text-zinc-300">VICE-NET 5G</span>
          </div>
        </div>

        {/* Top Status Bar */}
        <div className="bg-zinc-950/95 px-6 pt-3.5 pb-2 flex justify-between items-center text-[10px] font-mono text-zinc-400 select-none z-20 border-b border-zinc-800/80">
          <span className="font-bold text-zinc-200">11:42 PM</span>
          <div className="flex items-center space-x-2.5">
            <span className="text-cyan-400 font-bold">5G</span>
            <Wifi className="w-3 h-3 text-zinc-300" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
            <button
              onClick={handleClose}
              className="ml-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
              title="Cerrar Teléfono (M)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* App Viewport with Ambient Wallpaper */}
        <div className="flex-1 overflow-hidden relative bg-zinc-950">
          {/* Subtle Ambient Wallpaper Layer */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <img
              src="/assets/gta6/featured-mobile.14ok.safz3arg.avif"
              alt="GTA 6 Wallpaper"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 h-full">
            {APPS.map((app) => {
              if (activePhoneApp !== app.id) return null;
              const Component = app.component;
              return <Component key={app.id} />;
            })}
          </div>
        </div>

        {/* Bottom App Navigation Dock */}
        <div className="bg-zinc-900/98 border-t border-zinc-800 px-3 py-2 flex justify-around items-center select-none z-20 shadow-2xl">
          {APPS.map((app) => {
            const isActive = activePhoneApp === app.id;
            const hasUnread = app.id === 'signal' && unreadSignalCount > 0;
            return (
              <button
                key={app.id}
                onClick={() => handleAppSwitch(app.id)}
                className={`flex flex-col items-center space-y-1 relative p-1.5 rounded-xl transition-all cursor-pointer ${
                  isActive ? `${app.activeColor} scale-105 bg-zinc-800/50` : 'text-zinc-400 hover:text-white'
                }`}
                title={app.name}
              >
                {app.icon}
                <span className="text-[9px] font-mono font-bold">{app.name}</span>
                {hasUnread && (
                  <span className="absolute -top-0.5 right-1 w-4 h-4 bg-pink-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {unreadSignalCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Home Indicator Bar */}
        <div className="bg-zinc-950 pb-2 pt-1 flex justify-center">
          <div
            className="w-28 h-1 bg-zinc-600 rounded-full cursor-pointer hover:bg-zinc-400 transition-colors"
            onClick={handleClose}
          />
        </div>
      </div>
    </div>
  );
};
