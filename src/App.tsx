import React, { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { STORY_NODES } from './data/storyGraph';
import { TitleScreen } from './components/TitleScreen';
import { CinematicPlayer } from './components/CinematicPlayer/CinematicPlayer';
import { GameHUD } from './components/HUD/GameHUD';
import { ViceOSModal } from './components/ViceOS/ViceOSModal';
import { PauseModal } from './components/HUD/PauseModal';
import { LeonidaMapModal } from './components/Map/LeonidaMapModal';
import { PhoneNotificationBanner } from './components/HUD/PhoneNotificationBanner';
import { audioEngine } from './engine/audioEngine';
import { useGlobalHotkeys } from './hooks/useGlobalHotkeys';
import { useHeatCooldown } from './hooks/useHeatCooldown';

export const App: React.FC = () => {
  const currentNodeId = useGameStore((s) => s.currentNodeId);
  const initGame = useGameStore((s) => s.initGame);
  const [hasStarted, setHasStarted] = useState(false);

  const currentNode = STORY_NODES[currentNodeId] || STORY_NODES['node_custom_intro'] || STORY_NODES['node_act1_keys_workshop'];

  // Global hotkeys hook (Tab, M, P, ESC) with input safety
  useGlobalHotkeys();

  // GTA Heat stars evading and cooldown loop with cleanup
  useHeatCooldown();

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleStartGame = () => {
    audioEngine.init();
    audioEngine.playSatelliteWhoosh();
    setHasStarted(true);
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex flex-col justify-between font-sans">
      {!hasStarted ? (
        <TitleScreen onStart={handleStartGame} />
      ) : (
        <>
          <GameHUD />
          <PhoneNotificationBanner />
          <CinematicPlayer currentNode={currentNode} />
          <ViceOSModal />
          <LeonidaMapModal />
          <PauseModal />
        </>
      )}
    </div>
  );
};

export default App;
