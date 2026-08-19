// ============================================================================
// 🌴 VICE DYNASTY - GTA WANTED LEVEL PURSUIT & COOLDOWN ENGINE
// ============================================================================

import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { STORY_NODES } from '../data/storyGraph';
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

export function useHeatCooldown() {
  const intervalRef = useRef<number | null>(null);
  const evadeTimeoutRef = useRef<number | null>(null);

  // Sync isEvadingPolice immediately whenever currentNodeId changes
  useEffect(() => {
    const s = useGameStore.getState();
    const currentNode = STORY_NODES[s.currentNodeId];
    const isCombat = ACTIVE_PURSUIT_THEMES.has(currentNode?.video?.themeStyle ?? '');

    if (s.heatLevel > 0) {
      if (isCombat) {
        // Active pursuit: police have visual contact
        useGameStore.setState({ isEvadingPolice: false });
        if (evadeTimeoutRef.current !== null) {
          clearTimeout(evadeTimeoutRef.current);
          evadeTimeoutRef.current = null;
        }
      } else {
        // Evading search: police lost direct sight
        useGameStore.setState({ isEvadingPolice: true });
      }
    } else {
      useGameStore.setState({ isEvadingPolice: false });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = useGameStore.subscribe((state, prevState) => {
      if (state.currentNodeId !== prevState.currentNodeId || state.heatLevel !== prevState.heatLevel) {
        const currentNode = STORY_NODES[state.currentNodeId];
        const isCombat = ACTIVE_PURSUIT_THEMES.has(currentNode?.video?.themeStyle ?? '');

        if (state.heatLevel > 0) {
          if (isCombat) {
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
      }
    });

    return () => unsubscribe();
  }, []);

  // Periodic cooldown loop
  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      const s = useGameStore.getState();
      if (s.isPaused || s.heatLevel <= 0) return;

      const currentNode = STORY_NODES[s.currentNodeId];
      const isCombat = ACTIVE_PURSUIT_THEMES.has(currentNode?.video?.themeStyle ?? '');

      if (!isCombat) {
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
