// ============================================================================
// 🌴 VICE DYNASTY: NEON SYNDICATE - COMPLETE BRANCHING DAG STORY GRAPH
// ============================================================================

import type { StoryNode } from '../types/game';
import { ACT1_NODES } from './nodes/act1';
import { ACT2_NODES } from './nodes/act2';
import { ACT3_NODES } from './nodes/act3';
import { ACT4_NODES } from './nodes/act4';
import { ACT5_NODES } from './nodes/act5';
import { EPILOGUE_NODES } from './nodes/epilogues';
import { INTRO_CINEMATICS } from './nodes/introCinematics';

// Re-export aggregated story nodes
export const STORY_NODES: Record<string, StoryNode> = {
  ...INTRO_CINEMATICS,
  ...ACT1_NODES,
  ...ACT2_NODES,
  ...ACT3_NODES,
  ...ACT4_NODES,
  ...ACT5_NODES,
  ...EPILOGUE_NODES
};

// Re-export modular datasets for 100% backward compatibility
export { INITIAL_SIGNAL_MESSAGES } from './signalMessages.data';
export { INSTA_POSTS } from './socialFeed.data';
export { HEIST_CREW_MEMBERS } from './heistCrew.data';
