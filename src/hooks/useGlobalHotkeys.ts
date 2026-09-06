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
  const toggleEditor = useEditorStore((s) => s.toggleEditor);

  // Use refs to track reactive state without re-attaching listeners on every change
  const isPhoneOpenRef = useRef(false);
  const isPauseModalOpenRef = useRef(false);
  const isMapOpenRef = useRef(false);

  useEffect(() => {
    return useGameStore.subscribe((state) => {
      isPhoneOpenRef.current = state.isPhoneOpen;
      isPauseModalOpenRef.current = state.isPauseModalOpen;
      isMapOpenRef.current = state.isMapOpen;
    });
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

      // Toggle Leonida Map with 'Tab'
      if (e.key === 'Tab') {
        e.preventDefault();
        toggleMap();
      }

      // Toggle ViceOS phone with 'M'
      if (e.key === 'm' || e.key === 'M') {
        togglePhone();
      }

      // Toggle Pause menu with 'P' (only if phone is closed)
      if (e.key === 'p' || e.key === 'P') {
        if (!isPhoneOpenRef.current && !isMapOpenRef.current) {
          togglePauseModal();
        }
      }

      // ESC key to close phone, map or pause modal
      if (e.key === 'Escape') {
        if (isMapOpenRef.current) {
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
  }, [togglePhone, togglePauseModal, toggleMap, toggleEditor]);
}
