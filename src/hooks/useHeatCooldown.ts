// ============================================================================
// 🌴 VICE DYNASTY - GTA WANTED LEVEL PURSUIT & COOLDOWN ENGINE
// ============================================================================

import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { getMergedStoryNodes } from '../store/editorStore';
import { audioEngine } from '../engine/audioEngine';
import { HEAT_COOLDOWN_INTERVAL_MS, HEAT_COOLDOWN_EVADE_DELAY_MS } from '../constants/audio';
import type { HeatLevel } from '../types/game';

// Themes that represent active police pursuit / armed combat
const ACTIVE_PURSUIT_THEMES = new Set([
  'police_chase',
  'dock_shootout',
  'swamp_chase',
  'helipad_climax'
]);

function isPursuitCombat(nodeId: string): boolean {
  const currentNode = getMergedStoryNodes()[nodeId];
  return ACTIVE_PURSUIT_THEMES.has(currentNode?.video?.themeStyle ?? '');
}

export function useHeatCooldown() {
  const intervalRef = useRef<number | null>(null);
  const evadeTimeoutRef = useRef<number | null>(null);

  const syncEvadingState = (nodeId: string, heatLevel: number) => {
    if (heatLevel > 0) {
      if (isPursuitCombat(nodeId)) {
        useGameStore.setState({ isEvadingPolice: false });
        if (evadeTimeoutRef.current !== null) {
          clearTimeout(evadeTimeoutRef.current);
          evadeTimeoutRef.current = null;
        }
      } else {
        useGameStore.setState({ isEvadingPolice: true });
      }
    } else {
      useGameStore.setState({ isEvadingPolice: false });
    }
  };

  // Sync isEvadingPolice immediately on mount
  useEffect(() => {
    const s = useGameStore.getState();
    syncEvadingState(s.currentNodeId, s.heatLevel);
  }, []);

  // Sync when currentNodeId or heatLevel changes
  useEffect(() => {
    const unsubscribe = useGameStore.subscribe((state, prevState) => {
      if (state.currentNodeId !== prevState.currentNodeId || state.heatLevel !== prevState.heatLevel) {
        syncEvadingState(state.currentNodeId, state.heatLevel);
      }
    });

    return () => unsubscribe();
  }, []);

  // Periodic cooldown loop
  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      const s = useGameStore.getState();
      if (s.isPaused || s.heatLevel <= 0) return;

      if (!isPursuitCombat(s.currentNodeId)) {
        useGameStore.setState({ isEvadingPolice: true });

        if (evadeTimeoutRef.current !== null) {
          clearTimeout(evadeTimeoutRef.current);
        }

        evadeTimeoutRef.current = window.setTimeout(() => {
          const latest = useGameStore.getState();
          if (latest.heatLevel > 0) {
            const newHeat = Math.max(0, latest.heatLevel - 1) as HeatLevel;
            const stillEvading = newHeat > 0;
            useGameStore.setState({ heatLevel: newHeat, isEvadingPolice: stillEvading });
            audioEngine.setHeatLevel(newHeat);
            if (newHeat === 0) {
              audioEngine.playPoliceScanner();
            }
          } else {
            useGameStore.setState({ isEvadingPolice: false });
          }
          evadeTimeoutRef.current = null;
        }, HEAT_COOLDOWN_EVADE_DELAY_MS);
      }
    }, HEAT_COOLDOWN_INTERVAL_MS);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (evadeTimeoutRef.current !== null) {
        clearTimeout(evadeTimeoutRef.current);
        evadeTimeoutRef.current = null;
      }
    };
  }, []);
}
