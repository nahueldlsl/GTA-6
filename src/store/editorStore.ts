import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORY_NODES } from '../data/storyGraph';
import type { StoryNode } from '../types/game';

export interface EditorStore {
  isEditorOpen: boolean;
  toggleEditor: () => void;
  customNodes: Record<string, StoryNode>;
  saveNode: (node: StoryNode) => void;
  deleteNode: (nodeId: string) => void;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      isEditorOpen: false,
      toggleEditor: () => set((state) => ({ isEditorOpen: !state.isEditorOpen })),
      customNodes: {},
      saveNode: (node) => set((state) => ({ 
        customNodes: { ...state.customNodes, [node.id]: node } 
      })),
      deleteNode: (nodeId) => set((state) => {
        const next = { ...state.customNodes };
        delete next[nodeId];
        return { customNodes: next };
      })
    }),
    { name: 'vice_dynasty_editor_saves' }
  )
);

export const getMergedStoryNodes = (): Record<string, StoryNode> => {
  return { ...STORY_NODES, ...useEditorStore.getState().customNodes };
};
