import type { StoryNode } from '../../types/game';

export const INTRO_CINEMATICS: Record<string, StoryNode> = {
  'node_new_cinematic_1': {
    id: 'node_new_cinematic_1',
    act: 1,
    actTitle: 'Acto 1',
    chapterTitle: 'Tráiler Inicial',
    location: 'Vice City',
    video: { 
      id: 'cinematic_1',
      title: 'Rockstar Intro',
      url: 'Cinematic_k_video_Rockstar_G',
      durationSec: 15,
      themeStyle: 'sunset_drive'
    },
    choices: [],
    autoTransitionNodeId: 'node_new_cinematic_2'
  },
  'node_new_cinematic_2': {
    id: 'node_new_cinematic_2',
    act: 1,
    actTitle: 'Acto 1',
    chapterTitle: 'Escape Futuro',
    location: 'Vice City',
    video: { 
      id: 'cinematic_2',
      title: 'Woman Sprinting',
      url: 'Woman_sprinting_from_futuristic_…_202608261611',
      durationSec: 15,
      themeStyle: 'police_chase'
    },
    choices: [],
    autoTransitionNodeId: 'node_new_cinematic_3'
  },
  'node_new_cinematic_3': {
    id: 'node_new_cinematic_3',
    act: 1,
    actTitle: 'Acto 1',
    chapterTitle: 'Escape en Moto',
    location: 'Leonida Keys',
    video: { 
      id: 'cinematic_3',
      title: 'Lucia Fleeing',
      url: 'Lucia_fleeing_on_yellow_motorcycle_202608261614',
      durationSec: 15,
      themeStyle: 'sunset_drive'
    },
    choices: [],
    autoTransitionNodeId: 'node_custom_intro'
  }
};
