// ============================================================================
// 🌴 VICE DYNASTY - GLOBAL HOTKEYS HOOK
// ============================================================================

import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { useEditorStore } from '../store/editorStore';

export function useGlobalHotkeys() {
  const togglePhone = useGameStore((s) => s.togglePhone);
  const togglePauseModal = useGameStore((s) => s.togglePauseModal);
  const toggleMap = useGameStore((s) => s.toggleMap);
  const toggleDrivingMode = useGameStore((s) => s.toggleDrivingMode);
  const switchProtagonist = useGameStore((s) => s.switchProtagonist);
  const toggleEditor = useEditorStore((s) => s.toggleEditor);

  // Use refs to track reactive state without re-attaching listeners on every change
  const isPhoneOpenRef = useRef(false);
  const isPauseModalOpenRef = useRef(false);
  const isMapOpenRef = useRef(false);
  const isDrivingModeRef = useRef(false);
  const activeProtagonistRef = useRef<'jason' | 'lucia'>('jason');
  const isEditorOpenRef = useRef(false);

  useEffect(() => {
    const unsubGame = useGameStore.subscribe((state) => {
      isPhoneOpenRef.current = state.isPhoneOpen;
      isPauseModalOpenRef.current = state.isPauseModalOpen;
      isMapOpenRef.current = state.isMapOpen;
      isDrivingModeRef.current = state.isDrivingMode;
      activeProtagonistRef.current = state.activeProtagonist;
    });
    const unsubEditor = useEditorStore.subscribe((state) => {
      isEditorOpenRef.current = state.isEditorOpen;
    });
    return () => {
      unsubGame();
      unsubEditor();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept hotkeys when typing in forms, text inputs, textareas, or contentEditable elements
      const target = document.activeElement as HTMLElement | null;
      if (target) {
        const tagName = target.tagName?.toUpperCase();
        if (tagName === 'INPUT' || tagName === 'TEXTAREA' || target.isContentEditable) {
          return;
        }
      }

      // Admin Editor: Ctrl + Shift + E
      if (e.ctrlKey && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        toggleEditor();
        return;
      }

      // Ignore gameplay hotkeys while Admin Story Editor is open
      if (isEditorOpenRef.current) return;

      // Toggle Leonida Map with 'Tab'
      if (e.key === 'Tab') {
        e.preventDefault();
        if (isDrivingModeRef.current) {
          toggleDrivingMode(false);
        }
        toggleMap();
        return;
      }

      // Toggle 2D Free-Roam Driving Mode with 'G'
      if ((e.key === 'g' || e.key === 'G') && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleDrivingMode();
        return;
      }

      // Switch Protagonist (Jason <-> Lucia) with 'C'
      if ((e.key === 'c' || e.key === 'C') && !e.ctrlKey && !e.metaKey) {
        switchProtagonist(activeProtagonistRef.current === 'jason' ? 'lucia' : 'jason');
        return;
      }

      // Toggle ViceOS phone with 'M'
      if ((e.key === 'm' || e.key === 'M') && !e.ctrlKey && !e.metaKey) {
        if (isDrivingModeRef.current) {
          toggleDrivingMode(false);
        }
        togglePhone();
        return;
      }

      // Toggle Pause menu with 'P' (only if phone, map and driving are closed)
      if ((e.key === 'p' || e.key === 'P') && !e.ctrlKey && !e.metaKey) {
        if (!isPhoneOpenRef.current && !isMapOpenRef.current && !isDrivingModeRef.current) {
          togglePauseModal();
        }
        return;
      }

      // ESC key to close driving mode, map, phone or pause modal
      if (e.key === 'Escape') {
        if (isDrivingModeRef.current) {
          toggleDrivingMode(false);
        } else if (isMapOpenRef.current) {
          toggleMap(false);
        } else if (isPhoneOpenRef.current) {
          togglePhone(false);
        } else if (isPauseModalOpenRef.current) {
          togglePauseModal(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePhone, togglePauseModal, toggleMap, toggleDrivingMode, switchProtagonist, toggleEditor]);
}
