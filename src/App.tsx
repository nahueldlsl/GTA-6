import React, { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { useEditorStore } from './store/editorStore';
import { STORY_NODES } from './data/storyGraph';
import { TitleScreen } from './components/TitleScreen';
import { CinematicPlayer } from './components/CinematicPlayer/CinematicPlayer';
import { GameHUD } from './components/HUD/GameHUD';
import { ViceOSModal } from './components/ViceOS/ViceOSModal';
import { PauseModal } from './components/HUD/PauseModal';
import { LeonidaMapModal } from './components/Map/LeonidaMapModal';
import { PlayableLeonidaCanvas } from './components/Map/PlayableMap/PlayableLeonidaCanvas';
import { PhoneNotificationBanner } from './components/HUD/PhoneNotificationBanner';
import { GameToast } from './components/HUD/GameToast';
import { MiniRadarHUD } from './components/HUD/MiniRadarHUD';
import { audioEngine } from './engine/audioEngine';
import { useGlobalHotkeys } from './hooks/useGlobalHotkeys';
import { useHeatCooldown } from './hooks/useHeatCooldown';
import { StoryEditor } from './components/Admin/StoryEditor';

export const App: React.FC = () => {
  const currentNodeId = useGameStore((s) => s.currentNodeId);
  const initGame = useGameStore((s) => s.initGame);
  const jumpToNode = useGameStore((s) => s.jumpToNode);
  const toggleDrivingMode = useGameStore((s) => s.toggleDrivingMode);
  const isEditorOpen = useEditorStore((s) => s.isEditorOpen);
  const customNodes = useEditorStore((s) => s.customNodes);
  const mergedNodes = { ...STORY_NODES, ...customNodes };
  const [hasStarted, setHasStarted] = useState(false);

  const currentNode = mergedNodes[currentNodeId] || mergedNodes['node_custom_intro'] || mergedNodes['node_act1_keys_workshop'];

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

  const handleStartAct1 = () => {
    audioEngine.init();
    audioEngine.playSatelliteWhoosh();
    jumpToNode('node_act1_keys_workshop');
    setHasStarted(true);
  };

  const handleStartFreeRoam = () => {
    audioEngine.init();
    audioEngine.playSatelliteWhoosh();
    jumpToNode('node_act1_keys_workshop');
    setHasStarted(true);
    toggleDrivingMode(true);
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex flex-col justify-between font-sans">
      {!hasStarted ? (
        <TitleScreen
          onStart={handleStartGame}
          onStartAct1={handleStartAct1}
          onStartFreeRoam={handleStartFreeRoam}
        />
      ) : (
        <>
          <GameHUD />
          <PhoneNotificationBanner />
          <GameToast />
          <MiniRadarHUD />
          <CinematicPlayer currentNode={currentNode} />
          <PlayableLeonidaCanvas />
          <ViceOSModal />
          <LeonidaMapModal />
          <PauseModal />
        </>
      )}
      {isEditorOpen && <StoryEditor />}
    </div>
  );
};

export default App;
