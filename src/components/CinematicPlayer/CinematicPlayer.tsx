// ============================================================================
// 🌴 CINEMATIC PLAYER & ZERO-OVERLAP DECISION HUD (GTA VI ENHANCED)
// ============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { StoryNode, StoryChoice } from '../../types/game';
import { HybridVideoRenderer } from './HybridVideoRenderer';
import { LocationStamp } from './LocationStamp';
import { DecisionWindow } from './DecisionWindow';
import { EndingScreen } from './EndingScreen';
import { QTEOverlay } from './QTEOverlay';
import { ViceViralOverlay } from './ViceViralOverlay';
import { useGameStore, PROTAGONIST_PERKS } from '../../store/gameStore';
import { audioEngine } from '../../engine/audioEngine';
import { useCountdownTimer } from '../../hooks/useCountdownTimer';
import {
  HEARTBEAT_DECISION_BASE_BPM,
  HEARTBEAT_DECISION_MAX_ADD,
  HEARTBEAT_QTE_BPM,
  DECISION_TIMER_TICK_MS,
  QTE_TIMER_TICK_MS,
  LOCATION_STAMP_DISPLAY_MS,
  SATELLITE_WIPE_MS,
  DECISION_BANNER_DISPLAY_MS
} from '../../constants/audio';
import { ArrowRight, FastForward, Car } from 'lucide-react';

interface CinematicPlayerProps {
  currentNode: StoryNode;
}

export const CinematicPlayer: React.FC<CinematicPlayerProps> = ({ currentNode }) => {
  const {
    heatLevel,
    isEvadingPolice,
    selectChoice,
    handleTimeout,
    handleQteResult,
    jumpToNode,
    restartGame,
    isPaused,
    timerMode,
    activeProtagonist,
    toggleDrivingMode
  } = useGameStore();

  // Transitions & Visual FX states
  const [isSatelliteWiping, setIsSatelliteWiping] = useState<boolean>(false);
  const [showLocationStamp, setShowLocationStamp] = useState<boolean>(true);
  const [recentDecisionLabel, setRecentDecisionLabel] = useState<string | null>(null);
  const [isDecisionActive, setIsDecisionActive] = useState<boolean>(false);
  const [isQteActive, setIsQteActive] = useState<boolean>(false);
  const isQteHandledRef = useRef<boolean>(false);

  // Video progress
  const playbackSecRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(isPaused);
  isPausedRef.current = isPaused;

  const currentNodeRef = useRef(currentNode);
  currentNodeRef.current = currentNode;
  const timerModeRef = useRef(timerMode);
  timerModeRef.current = timerMode;
  const activeProtagonistRef = useRef(activeProtagonist);
  activeProtagonistRef.current = activeProtagonist;
  const jumpToNodeRef = useRef(jumpToNode);
  jumpToNodeRef.current = jumpToNode;

  // --------------------------------------------------------------------------
  // DECISION & QTE TIMERS HOOKS
  // --------------------------------------------------------------------------
  const onDecisionTimerTick = useCallback(
    (progressPct: number) => {
      if (timerModeRef.current === 'INTENSE') {
        const calculatedBpm =
          HEARTBEAT_DECISION_BASE_BPM +
          Math.floor((1 - progressPct / 100) * HEARTBEAT_DECISION_MAX_ADD);
        audioEngine.updateHeartbeatBpm(calculatedBpm);
      }
    },
    []
  );

  const onDecisionTimeout = useCallback(() => {
    audioEngine.stopHeartbeat();
    handleTimeout();
  }, [handleTimeout]);

  const decisionTimer = useCountdownTimer({
    onComplete: onDecisionTimeout,
    onTick: onDecisionTimerTick
  });

  const decisionTimerRef = useRef(decisionTimer);
  decisionTimerRef.current = decisionTimer;

  const onQteTimeout = useCallback(() => {
    audioEngine.stopHeartbeat();
    setIsQteActive(false);
    handleQteResult(false);
  }, [handleQteResult]);

  const qteTimer = useCountdownTimer({
    onComplete: onQteTimeout
  });

  const qteTimerRef = useRef(qteTimer);
  qteTimerRef.current = qteTimer;

  const onQteTrigger = useCallback(() => {
    if (isPausedRef.current) return;
    audioEngine.stopHeartbeat();
    qteTimerRef.current.stop();
    setIsQteActive(false);
    handleQteResult(true);
  }, [handleQteResult]);

  // Keyboard shortcut for QTE
  useEffect(() => {
    if (!isQteActive || !currentNode.qte) return;
    const requiredKey = (currentNode.qte.keyRequired || ' ').toLowerCase();

    const handleKey = (e: KeyboardEvent) => {
      if (isPausedRef.current) return;
      const keyName = e.key.toLowerCase();
      if (
        keyName === requiredKey ||
        (requiredKey === 'space' && e.code === 'Space') ||
        (requiredKey === ' ' && e.code === 'Space')
      ) {
        e.preventDefault();
        onQteTrigger();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isQteActive, currentNode.qte, onQteTrigger]);

  // Update paused state to timer hooks
  useEffect(() => {
    decisionTimer.setPaused(isPaused || timerMode !== 'INTENSE');
    qteTimer.setPaused(isPaused);
  }, [isPaused, timerMode, decisionTimer, qteTimer]);

  // --------------------------------------------------------------------------
  // NODE CHANGE / SCENE PROGRESSION ENGINE
  // --------------------------------------------------------------------------
  useEffect(() => {
    playbackSecRef.current = 0;
    setIsDecisionActive(false);
    setIsQteActive(false);
    isQteHandledRef.current = false;
    decisionTimerRef.current.stop();
    qteTimerRef.current.stop();
    audioEngine.stopHeartbeat();

    // Trigger Satellite Snap Zoom Transition & Sound
    setIsSatelliteWiping(true);
    setShowLocationStamp(true);
    audioEngine.playSatelliteWhoosh();

    const wipeTimer = window.setTimeout(() => {
      setIsSatelliteWiping(false);
    }, SATELLITE_WIPE_MS);

    const stampTimer = window.setTimeout(() => {
      setShowLocationStamp(false);
    }, LOCATION_STAMP_DISPLAY_MS);

    const node = currentNodeRef.current;
    const duration = node.video.durationSec;

    const interval = window.setInterval(() => {
      if (isPausedRef.current) return;

      playbackSecRef.current += 0.1;
      const elapsed = playbackSecRef.current;

      const activeNode = currentNodeRef.current;
      const currentDecisionTimer = decisionTimerRef.current;
      const currentMode = timerModeRef.current;
      const timeMult = PROTAGONIST_PERKS[activeProtagonistRef.current].decisionTimeMultiplier;

      // Trigger QTE if configured
      if (
        activeNode.qte &&
        elapsed >= activeNode.qte.triggerTimeSec &&
        !qteTimerRef.current.isActive &&
        !isQteHandledRef.current
      ) {
        isQteHandledRef.current = true;
        setIsQteActive(true);
        if (currentMode === 'INTENSE') {
          audioEngine.startHeartbeat(HEARTBEAT_QTE_BPM);
        }
        qteTimerRef.current.start(activeNode.qte.durationSec * timeMult, QTE_TIMER_TICK_MS);
      }

      // Trigger Decision Window if configured
      if (
        activeNode.decisionWindow &&
        elapsed >= activeNode.decisionWindow.startTimeSec &&
        !currentDecisionTimer.isActive &&
        activeNode.choices.length > 0
      ) {
        setIsDecisionActive(true);
        if (currentMode === 'INTENSE') {
          audioEngine.startHeartbeat(HEARTBEAT_DECISION_BASE_BPM);
        }
        currentDecisionTimer.start(activeNode.decisionWindow.durationSec * timeMult, DECISION_TIMER_TICK_MS);
      }

      // Auto transition when playback ends
      if (elapsed >= duration) {
        if (activeNode.autoTransitionNodeId) {
          clearInterval(interval);
          jumpToNodeRef.current(activeNode.autoTransitionNodeId);
        } else if (activeNode.choices.length > 0 && !currentDecisionTimer.isActive) {
          setIsDecisionActive(true);
          if (currentMode === 'INTENSE') {
            audioEngine.startHeartbeat(HEARTBEAT_DECISION_BASE_BPM);
          }
          currentDecisionTimer.start((activeNode.decisionWindow?.durationSec || 6.0) * timeMult, DECISION_TIMER_TICK_MS);
        }
      }
    }, 100);

    return () => {
      window.clearTimeout(wipeTimer);
      window.clearTimeout(stampTimer);
      window.clearInterval(interval);
      audioEngine.stopHeartbeat();
    };
  }, [currentNode.id]);

  const onChoiceClick = useCallback(
    (choice: StoryChoice) => {
      if (choice.isLocked || isPaused) return;
      audioEngine.stopHeartbeat();
      audioEngine.playDecisionImpact();
      setRecentDecisionLabel(choice.label);
      decisionTimer.stop();

      window.setTimeout(() => {
        setRecentDecisionLabel(null);
      }, DECISION_BANNER_DISPLAY_MS);

      selectChoice(choice);
    },
    [isPaused, decisionTimer, selectChoice]
  );

  const handleSkipCinematic = useCallback(() => {
    if (isPausedRef.current) return;
    const activeNode = currentNodeRef.current;
    audioEngine.playClick();
    if (activeNode.autoTransitionNodeId) {
      jumpToNodeRef.current(activeNode.autoTransitionNodeId);
      return;
    }
    setIsDecisionActive(true);
    if (activeNode.choices.length > 0 && !decisionTimerRef.current.isActive) {
      if (timerModeRef.current === 'INTENSE') {
        audioEngine.startHeartbeat(HEARTBEAT_DECISION_BASE_BPM);
      }
      decisionTimerRef.current.start(activeNode.decisionWindow?.durationSec || 6.0, DECISION_TIMER_TICK_MS);
    }
  }, []);

  // Keyboard shortcut to skip cinematic with Space if decision is not yet active
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isPausedRef.current) return;
      if (e.code === 'Space' && !isDecisionActive && !isQteActive && !currentNode.isEnding) {
        const target = document.activeElement as HTMLElement | null;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
        e.preventDefault();
        handleSkipCinematic();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isDecisionActive, isQteActive, currentNode.isEnding, handleSkipCinematic]);

  const handleManualAdvance = useCallback(() => {
    if (isPaused) return;
    if (currentNode.choices.length > 0) {
      onChoiceClick(currentNode.choices[0]);
    } else if (currentNode.autoTransitionNodeId) {
      jumpToNode(currentNode.autoTransitionNodeId);
    }
  }, [isPaused, currentNode, onChoiceClick, jumpToNode]);

  const handleVideoEnded = useCallback(() => {
    const activeNode = currentNodeRef.current;
    setIsDecisionActive(true);
    if (activeNode.autoTransitionNodeId) {
      jumpToNodeRef.current(activeNode.autoTransitionNodeId);
    } else if (activeNode.choices.length > 0 && !decisionTimerRef.current.isActive) {
      if (timerModeRef.current === 'INTENSE') {
        audioEngine.startHeartbeat(HEARTBEAT_DECISION_BASE_BPM);
      }
      decisionTimerRef.current.start(activeNode.decisionWindow?.durationSec || 6.0, DECISION_TIMER_TICK_MS);
    }
  }, []);

  return (
    <div
      className={`relative w-full h-full min-h-screen bg-black overflow-hidden select-none ${
        isSatelliteWiping ? 'animate-satellite-zoom' : ''
      }`}
    >
      {/* 1. HYBRID VIDEO & GTA VI 4K SCENE BACKDROP */}
      <HybridVideoRenderer
        video={currentNode.video}
        heatLevel={heatLevel}
        isEvadingPolice={isEvadingPolice}
        isQteActive={isQteActive || decisionTimer.isActive}
        isPaused={isPaused}
        onVideoEnd={handleVideoEnded}
      />

      {/* 2. VICE VIRAL LIVE STREAM OVERLAY (Social feeds) */}
      <ViceViralOverlay isActive={Boolean(currentNode.isViralFeed)} />

      {/* 2.2 SKIP CINEMATIC BUTTON */}
      {!isDecisionActive && !currentNode.isEnding && (
        <div className="absolute top-20 right-4 z-35 animate-fadeIn">
          <button
            onClick={handleSkipCinematic}
            className="backdrop-blur-xl bg-black/80 hover:bg-zinc-800 border border-zinc-700 hover:border-cyan-400 text-zinc-300 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
            title="Saltar cinemática y pasar a decisiones (Espacio)"
          >
            <FastForward className="w-3.5 h-3.5 text-cyan-400" />
            <span>Saltar Escena</span>
            <span className="text-[10px] text-zinc-500 font-normal">[Espacio]</span>
          </button>
        </div>
      )}

      {/* 2.5 INTERACTIVE QUICK-TIME EVENT (QTE) RETICLE */}
      {currentNode.qte && isQteActive && (
        <div className="absolute inset-0 z-35 flex items-center justify-center pointer-events-auto">
          <QTEOverlay
            qte={currentNode.qte}
            qteProgress={qteTimer.progress}
            timerMode={timerMode}
            isPaused={isPaused}
            onTrigger={onQteTrigger}
          />
        </div>
      )}

      {/* 2.7 CAMERA FLASH WHITE BURST DURING SATELLITE ZOOM */}
      {isSatelliteWiping && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-md pointer-events-none z-40 transition-opacity duration-500 animate-pulse" />
      )}

      {/* 3. ROCKSTAR LOCATION & TIMESTAMP STAMP CARD */}
      {showLocationStamp && <LocationStamp currentNode={currentNode} />}

      {/* 4. ROCKSTAR DECISION REGISTERED BANNER */}
      {recentDecisionLabel && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none animate-decision-banner w-full max-w-lg px-4 text-center">
          <div className="backdrop-blur-2xl bg-black/90 border-2 border-pink-500 px-6 py-4 rounded-2xl shadow-[0_0_60px_rgba(255,42,133,0.8)]">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase block">
              ★ DECISIÓN REGISTRADA • EFECTO MARIPOSA ★
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white italic uppercase tracking-wider mt-1">
              {recentDecisionLabel}
            </h3>
          </div>
        </div>
      )}

      {/* 5. DECISION WINDOW & INTEGRATED SUBTITLES (PINNED TO BOTTOM) */}
      {!currentNode.isEnding && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-3xl px-4 sm:px-6">
          {currentNode.choices.length > 0 && isDecisionActive ? (
            <>
              <DecisionWindow
                choices={currentNode.choices}
                timerMode={timerMode}
                timerProgress={decisionTimer.progress}
                timeRemaining={decisionTimer.remaining}
                isPaused={isPaused}
                onChoiceClick={onChoiceClick}
                dialogueSubtitle={currentNode.video.dialogueSubtitle}
                speaker={currentNode.video.speaker}
              />
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => toggleDrivingMode(true)}
                  className="backdrop-blur-xl bg-zinc-950/90 hover:bg-zinc-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                  title="Conducir libremente por Leonida hacia el siguiente objetivo (G)"
                >
                  <Car className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Conducir al Objetivo en Mapa 2D [G]</span>
                </button>
              </div>
            </>
          ) : (currentNode.choices.length === 0 && isDecisionActive) ? (
            <div className="flex justify-center">
              <button
                onClick={handleManualAdvance}
                disabled={isPaused}
                className="group py-3.5 px-8 bg-gradient-to-r from-pink-600 via-orange-500 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-black text-xs sm:text-sm uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(255,42,133,0.5)] active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <span>Avanzar Historia ➔</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* 6. ENDING SCREEN */}
      {currentNode.isEnding && (
        <EndingScreen currentNode={currentNode} onRestart={restartGame} />
      )}
    </div>
  );
};
