// ============================================================================
// 🌴 GTA-STYLE IN-GAME TOAST (Mission passed / warnings) — replaces window.alert()
// ============================================================================

import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';

const TOAST_DISPLAY_MS = 4200;

const VARIANT_STYLES: Record<string, { border: string; title: string; glow: string }> = {
  success: { border: 'border-emerald-400', title: 'text-emerald-300', glow: 'shadow-[0_0_40px_rgba(52,211,153,0.45)]' },
  info: { border: 'border-cyan-400', title: 'text-cyan-300', glow: 'shadow-[0_0_40px_rgba(34,211,238,0.45)]' },
  warning: { border: 'border-amber-400', title: 'text-amber-300', glow: 'shadow-[0_0_40px_rgba(251,191,36,0.45)]' },
  danger: { border: 'border-red-500', title: 'text-red-400', glow: 'shadow-[0_0_40px_rgba(239,68,68,0.5)]' }
};

export const GameToast: React.FC = () => {
  const toast = useGameStore((s) => s.gameToast);
  const dismissToast = useGameStore((s) => s.dismissToast);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(dismissToast, TOAST_DISPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [toast, dismissToast]);

  if (!toast) return null;
  const style = VARIANT_STYLES[toast.variant] || VARIANT_STYLES.info;

  return (
    <div
      key={toast.id}
      className="fixed top-1/4 left-1/2 -translate-x-1/2 z-[70] w-full max-w-md px-4 pointer-events-auto select-none animate-decision-banner"
      onClick={dismissToast}
      role="status"
      aria-live="polite"
    >
      <div className={`backdrop-blur-2xl bg-black/90 border-y-2 ${style.border} ${style.glow} px-6 py-4 text-center cursor-pointer`}>
        <h3 className={`text-xl sm:text-2xl font-black italic uppercase tracking-wider ${style.title} drop-shadow-lg`}>
          {toast.title}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-200 mt-1 font-medium leading-snug">{toast.message}</p>
      </div>
    </div>
  );
};
