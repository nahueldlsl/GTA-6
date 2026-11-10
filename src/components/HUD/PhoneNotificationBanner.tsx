// ============================================================================
// 🌴 VICE-OS FLOATING NOTIFICATION BANNER (Top Screen Toast)
// ============================================================================

import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { MessageSquare, Radio, Camera, Navigation, X, ShieldCheck, Target } from 'lucide-react';
import { NOTIFICATION_DISPLAY_MS } from '../../constants/audio';
import type { PhoneAppId } from '../../types/game';

function getAppIcon(app: PhoneAppId) {
  switch (app) {
    case 'signal':
      return <MessageSquare className="w-4 h-4" />;
    case 'viceradio':
      return <Radio className="w-4 h-4" />;
    case 'instavice':
      return <Camera className="w-4 h-4" />;
    case 'vicemaps':
      return <Navigation className="w-4 h-4" />;
    case 'darkpay':
      return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    case 'heistplanner':
      return <Target className="w-4 h-4 text-red-400" />;
    default:
      return <MessageSquare className="w-4 h-4" />;
  }
}

export const PhoneNotificationBanner: React.FC = () => {
  const { phoneNotificationBanner, dismissPhoneNotification, togglePhone, setPhoneApp } = useGameStore();

  useEffect(() => {
    if (phoneNotificationBanner?.visible) {
      const timer = window.setTimeout(() => {
        dismissPhoneNotification();
      }, NOTIFICATION_DISPLAY_MS);
      return () => window.clearTimeout(timer);
    }
  }, [phoneNotificationBanner?.visible, phoneNotificationBanner?.message, dismissPhoneNotification]);

  if (!phoneNotificationBanner?.visible) return null;

  const handleClick = () => {
    togglePhone(true);
    setPhoneApp(phoneNotificationBanner.app || 'signal');
    dismissPhoneNotification();
  };

  return (
    <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-45 w-full max-w-md sm:max-w-lg px-4 animate-slideDown pointer-events-auto select-none">
      <div
        onClick={handleClick}
        className="backdrop-blur-2xl bg-black/95 border-2 border-cyan-500/80 p-3 rounded-2xl shadow-[0_0_35px_rgba(0,240,255,0.4)] flex items-start sm:items-center justify-between gap-3 cursor-pointer group hover:scale-[1.02] transition-all"
      >
        <div className="flex items-start sm:items-center space-x-3 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-600 to-cyan-500 flex items-center justify-center text-white shadow-md shrink-0 border border-white/20 mt-0.5 sm:mt-0">
            {getAppIcon(phoneNotificationBanner.app)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1.5 mb-0.5">
              <span className="text-xs font-bold text-white font-mono truncate">{phoneNotificationBanner.sender}</span>
              <span className="text-[8px] font-mono bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded-md border border-cyan-700 uppercase shrink-0 font-bold">
                {phoneNotificationBanner.app === 'signal' ? 'MISIONES' : phoneNotificationBanner.app}
              </span>
            </div>
            <p className="text-xs text-zinc-200 line-clamp-2 leading-snug break-words font-medium">
              {phoneNotificationBanner.message}
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            dismissPhoneNotification();
          }}
          className="text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 p-1.5 rounded-xl transition-colors cursor-pointer shrink-0 border border-zinc-800"
          title="Cerrar notificación"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
