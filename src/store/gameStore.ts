// ============================================================================
// 🌴 VICE DYNASTY CENTRAL GAME STORE (Zustand + Persistence + Pause Management)
// ============================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  NodeId,
  StoryChoice,
  StateEffect,
  SignalMessage,
  InstaPost,
  HeistSession,
  HeatLevel,
  PhoneAppId,
  StoryNode,
  CharacterId
} from '../types/game';
import { INITIAL_SIGNAL_MESSAGES, INSTA_POSTS } from '../data/storyGraph';
import { getMergedStoryNodes } from './editorStore';
import { audioEngine } from '../engine/audioEngine';
import { processEffects } from '../services/effectProcessor';
import { BOT_REPLY_DELAY_MS } from '../constants/audio';

export interface GameStore extends GameState {
  // Global Pause & Accessibility
  isPaused: boolean;
  isPauseModalOpen: boolean;
  isMapOpen: boolean;
  isTutorialOpen: boolean;
  hasCompletedTutorial: boolean;
  timerMode: 'NARRATIVE' | 'INTENSE' | 'FREE_ROAM';

  // ViceOS & HUD UI state
  isPhoneOpen: boolean;
  activePhoneApp: PhoneAppId;
  signalMessages: SignalMessage[];
  instaPosts: InstaPost[];
  unreadSignalCount: number;
  isEvadingPolice: boolean;
  phoneNotificationBanner: {
    app: PhoneAppId;
    sender: string;
    message: string;
    visible: boolean;
  } | null;

  // Actions
  switchProtagonist: (protagonist: 'jason' | 'lucia') => void;
  unlockCrewMember: (memberId: CharacterId) => void;
  initGame: () => void;
  togglePause: (force?: boolean) => void;
  togglePauseModal: (force?: boolean) => void;
  toggleMap: (force?: boolean) => void;
  toggleTutorial: (force?: boolean) => void;
  completeTutorial: () => void;
  setTimerMode: (mode: 'NARRATIVE' | 'INTENSE' | 'FREE_ROAM') => void;
  selectChoice: (choice: StoryChoice) => void;
  handleTimeout: () => void;
  handleQteResult: (success: boolean) => void;
  jumpToNode: (nodeId: NodeId) => void;
  applyEffects: (effects: StateEffect[]) => void;
  reduceHeatLevel: (amount?: number) => void;
  clearHeat: () => void;
  washMoney: (amount: number, feePct: number) => { success: boolean; washedClean: number };
  buyBlackMarketItem: (itemId: string, name: string, price: number) => { success: boolean; message: string };
  bribePolice: (cost?: number) => { success: boolean; message: string };
  togglePhone: (force?: boolean) => void;
  setPhoneApp: (app: PhoneAppId) => void;
  sendSignalMessage: (text: string) => void;
  sendInteractiveReply: (senderId: CharacterId, replyText: string, cashReward?: number) => void;
  dismissPhoneNotification: () => void;
  configureHeist: (heist: HeistSession) => void;
  restartGame: () => void;
}

const INITIAL_GAME_STATE: GameState = {
  version: '1.5.0',
  timestamp: Date.now(),
  currentNodeId: 'node_new_cinematic_1',
  cleanCash: 12000,
  dirtyCash: 35000,
  heatLevel: 0, // Clean wanted status at initial start
  respect: 25,
  activeProtagonist: 'jason',
  unlockedCrew: ['jason', 'lucia'],
  crewLoyalty: {
    jason: 100,
    lucia: 100,
    cal: 75,
    boobie: 20,
    drequan: 25,
    raul: 30,
    brian: 60,
    baeluxe: 50,
    roxy: 50
  },
  inventory: ['rancher_car_keys', 'military_dog_tags', 'burner_phone_v1'],
  flags: {},
  history: [
    {
      nodeId: 'node_new_cinematic_1',
      timestamp: Date.now(),
      title: 'Introducción a Leonida'
    }
  ],
  unlockedEndings: []
};

// Internal reference for bot automated response timeout
let botReplyTimeoutId: number | null = null;

// DRY helper for ending unlocking
function checkAndUnlockEnding(unlockedEndings: string[], node: StoryNode | undefined): string[] {
  if (node?.isEnding && node.endingType && !unlockedEndings.includes(node.endingType)) {
    return [...unlockedEndings, node.endingType];
  }
  return unlockedEndings;
}

// Progressive crew unlocking helper
function checkAndUnlockCrew(unlockedCrew: CharacterId[], nodeId: string): CharacterId[] {
  const next = [...unlockedCrew];
  if (nodeId.includes('keys') || nodeId.includes('workshop')) {
    if (!next.includes('brian')) next.push('brian');
  }
  if (nodeId.includes('jack_of_hearts') || nodeId.includes('club')) {
    if (!next.includes('boobie')) next.push('boobie');
    if (!next.includes('drequan')) next.push('drequan');
  }
  if (nodeId.includes('ambrosia') || nodeId.includes('restaurant')) {
    if (!next.includes('raul')) next.push('raul');
  }
  if (nodeId.includes('bank') || nodeId.includes('swamp')) {
    if (!next.includes('cal')) next.push('cal');
  }
  return next;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_GAME_STATE,

      isPaused: false,
      isPauseModalOpen: false,
      isMapOpen: false,
      isTutorialOpen: false,
      hasCompletedTutorial: true,
      timerMode: 'NARRATIVE',

      isPhoneOpen: false,
      activePhoneApp: 'signal',
      signalMessages: INITIAL_SIGNAL_MESSAGES,
      instaPosts: INSTA_POSTS,
      unreadSignalCount: 1,
      isEvadingPolice: false,
      phoneNotificationBanner: null,

      switchProtagonist: (protagonist) => {
        audioEngine.playDecisionImpact();
        set({ activeProtagonist: protagonist });
      },

      unlockCrewMember: (memberId) => {
        set((state) => {
          if (state.unlockedCrew.includes(memberId)) return state;
          return { unlockedCrew: [...state.unlockedCrew, memberId] };
        });
      },

      initGame: () => {
        const state = get();
        audioEngine.setHeatLevel(state.heatLevel);
      },

      reduceHeatLevel: (amount = 1) => {
        const current = get().heatLevel;
        const next = Math.max(0, current - amount) as HeatLevel;
        set({ heatLevel: next, isEvadingPolice: false });
        audioEngine.setHeatLevel(next);
        if (next === 0) {
          audioEngine.playPoliceScanner();
        }
      },

      clearHeat: () => {
        set({ heatLevel: 0, isEvadingPolice: false });
        audioEngine.setHeatLevel(0);
        audioEngine.playPoliceScanner();
      },

      toggleTutorial: (force) => {
        set((state) => {
          const next = force !== undefined ? force : !state.isTutorialOpen;
          if (next) {
            audioEngine.playClick();
          }
          return {
            isTutorialOpen: next,
            isPaused: next || state.isPauseModalOpen || state.isMapOpen || state.isPhoneOpen
          };
        });
      },

      completeTutorial: () => {
        audioEngine.playClick();
        set((state) => ({
          isTutorialOpen: false,
          hasCompletedTutorial: true,
          isPaused: state.isPauseModalOpen || state.isMapOpen || state.isPhoneOpen ? true : false
        }));
      },

      toggleMap: (force) => {
        set((state) => {
          const next = force !== undefined ? force : !state.isMapOpen;
          if (next) {
            audioEngine.playSatelliteWhoosh();
          } else {
            audioEngine.playClick();
          }
          return {
            isMapOpen: next,
            isPhoneOpen: false,
            isPauseModalOpen: false,
            isTutorialOpen: false,
            isPaused: next
          };
        });
      },

      togglePauseModal: (force) => {
        set((state) => {
          const next = force !== undefined ? force : !state.isPauseModalOpen;
          if (next) {
            audioEngine.stopHeartbeat();
          }
          return {
            isPauseModalOpen: next,
            isMapOpen: false,
            isTutorialOpen: false,
            isPhoneOpen: next ? false : state.isPhoneOpen,
            isPaused: next || state.isPhoneOpen
          };
        });
      },

      togglePause: (force) => {
        get().togglePauseModal(force);
      },

      setTimerMode: (mode) => {
        set({ timerMode: mode });
      },

      selectChoice: (choice) => {
        const state = get();
        audioEngine.playClick();

        if (choice.effects && choice.effects.length > 0) {
          state.applyEffects(choice.effects);
        }

        const targetNode = getMergedStoryNodes()[choice.targetNodeId];
        if (!targetNode) return;

        const unlocked = checkAndUnlockEnding(state.unlockedEndings, targetNode);

        // Trigger phone notification if present on node
        let notificationBanner = null;
        let unreadCount = state.unreadSignalCount;
        const messages = [...state.signalMessages];

        if (targetNode.phoneNotification) {
          notificationBanner = {
            app: targetNode.phoneNotification.app,
            sender: targetNode.phoneNotification.sender,
            message: targetNode.phoneNotification.message,
            visible: true
          };
          unreadCount += 1;
          audioEngine.playNotification();

          if (targetNode.phoneNotification.app === 'signal') {
            messages.push({
              id: 'msg_' + Date.now(),
              senderId: 'lucia',
              senderName: targetNode.phoneNotification.sender,
              avatar: '👩‍💻',
              text: targetNode.phoneNotification.message,
              timestamp: 'Ahora',
              isIncoming: true
            });
          }
        }

        const nextCrew = checkAndUnlockCrew(state.unlockedCrew, choice.targetNodeId);

        set({
          currentNodeId: choice.targetNodeId,
          timestamp: Date.now(),
          unlockedEndings: unlocked,
          unlockedCrew: nextCrew,
          phoneNotificationBanner: notificationBanner,
          unreadSignalCount: unreadCount,
          signalMessages: messages,
          isPaused: false,
          isPauseModalOpen: false,
          history: [
            ...state.history,
            {
              nodeId: choice.targetNodeId,
              choiceId: choice.id,
              timestamp: Date.now(),
              title: targetNode.chapterTitle
            }
          ]
        });
      },

      handleTimeout: () => {
        const state = get();
        if (state.isPaused || state.timerMode !== 'INTENSE') return;

        const currentNode = getMergedStoryNodes()[state.currentNodeId];
        if (!currentNode || !currentNode.decisionWindow) return;

        const defaultChoiceId = currentNode.decisionWindow.defaultChoiceId;
        const choice = currentNode.choices.find((c) => c.id === defaultChoiceId) || currentNode.choices[0];

        if (choice) {
          get().selectChoice(choice);
        }
      },

      handleQteResult: (success) => {
        const state = get();
        const currentNode = getMergedStoryNodes()[state.currentNodeId];
        if (!currentNode || !currentNode.qte) return;

        if (success) {
          audioEngine.playQteSuccess();
          get().jumpToNode(currentNode.qte.successNodeId);
        } else {
          audioEngine.playQteFail();
          if (currentNode.qte.failEffects) {
            get().applyEffects(currentNode.qte.failEffects);
          }
          get().jumpToNode(currentNode.qte.failNodeId);
        }
      },

      jumpToNode: (nodeId) => {
        const state = get();
        const targetNode = getMergedStoryNodes()[nodeId];
        if (!targetNode) return;

        const unlocked = checkAndUnlockEnding(state.unlockedEndings, targetNode);

        // Trigger phone notification if present on node
        let notificationBanner = null;
        let unreadCount = state.unreadSignalCount;
        const messages = [...state.signalMessages];

        if (targetNode.phoneNotification) {
          notificationBanner = {
            app: targetNode.phoneNotification.app,
            sender: targetNode.phoneNotification.sender,
            message: targetNode.phoneNotification.message,
            visible: true
          };
          unreadCount += 1;
          audioEngine.playNotification();

          if (targetNode.phoneNotification.app === 'signal') {
            messages.push({
              id: 'msg_' + Date.now(),
              senderId: 'lucia',
              senderName: targetNode.phoneNotification.sender,
              avatar: targetNode.phoneNotification.avatarUrl || '👩‍💻',
              text: targetNode.phoneNotification.message,
              timestamp: 'Ahora',
              isIncoming: true
            });
          }
        }

        const nextCrew = checkAndUnlockCrew(state.unlockedCrew, nodeId);

        set({
          currentNodeId: nodeId,
          timestamp: Date.now(),
          unlockedEndings: unlocked,
          unlockedCrew: nextCrew,
          phoneNotificationBanner: notificationBanner,
          unreadSignalCount: unreadCount,
          signalMessages: messages,
          isPaused: false,
          isPauseModalOpen: false,
          isPhoneOpen: false,
          history: [
            ...state.history,
            {
              nodeId,
              timestamp: Date.now(),
              title: targetNode.chapterTitle
            }
          ]
        });
      },

      applyEffects: (effects) => {
        set((state) => {
          const result = processEffects(state, effects);

          // Audio side effects driven by processed effect changes
          for (const audioType of result.audioTriggers) {
            if (audioType === 'cashRegister') {
              audioEngine.playCashRegister();
            } else if (audioType === 'heatChange') {
              audioEngine.setHeatLevel(result.heatLevel);
            }
          }

          return {
            cleanCash: result.cleanCash,
            dirtyCash: result.dirtyCash,
            heatLevel: result.heatLevel,
            respect: result.respect,
            crewLoyalty: result.crewLoyalty,
            flags: result.flags,
            inventory: result.inventory
          };
        });
      },

      washMoney: (amount, feePct) => {
        const state = get();
        const cleanAmount = Math.floor(amount);
        if (cleanAmount <= 0 || state.dirtyCash < cleanAmount) {
          return { success: false, washedClean: 0 };
        }

        const fee = (cleanAmount * feePct) / 100;
        const washedClean = Math.floor(cleanAmount - fee);

        audioEngine.playCashRegister();

        set((s) => ({
          dirtyCash: s.dirtyCash - cleanAmount,
          cleanCash: s.cleanCash + washedClean,
          respect: Math.min(100, s.respect + Math.floor(cleanAmount / 50000))
        }));

        return { success: true, washedClean };
      },

      buyBlackMarketItem: (itemId, name, price) => {
        const state = get();
        const totalFunds = state.cleanCash + state.dirtyCash;
        if (totalFunds < price) {
          return { success: false, message: `Fondos insuficientes. Necesitas $${price.toLocaleString()}.` };
        }

        // Deduct from dirty cash first, then clean cash
        let remainingPrice = price;
        let newDirty = state.dirtyCash;
        let newClean = state.cleanCash;

        if (newDirty >= remainingPrice) {
          newDirty -= remainingPrice;
          remainingPrice = 0;
        } else {
          remainingPrice -= newDirty;
          newDirty = 0;
          newClean -= remainingPrice;
        }

        const newInventory = state.inventory.includes(itemId)
          ? state.inventory
          : [...state.inventory, itemId];

        audioEngine.playCashRegister();

        set({
          dirtyCash: newDirty,
          cleanCash: newClean,
          inventory: newInventory,
          respect: Math.min(100, state.respect + 5)
        });

        return { success: true, message: `¡${name} adquirido exitosamente y agregado al inventario!` };
      },

      bribePolice: (cost = 35000) => {
        const state = get();
        if (state.heatLevel === 0) {
          return { success: false, message: 'No tienes estrellas de búsqueda activas.' };
        }

        const totalFunds = state.cleanCash + state.dirtyCash;
        if (totalFunds < cost) {
          return { success: false, message: `Necesitas $${cost.toLocaleString()} para sobornar al contacto policial.` };
        }

        let remaining = cost;
        let newDirty = state.dirtyCash;
        let newClean = state.cleanCash;

        if (newDirty >= remaining) {
          newDirty -= remaining;
        } else {
          remaining -= newDirty;
          newDirty = 0;
          newClean -= remaining;
        }

        audioEngine.playPoliceScanner();
        audioEngine.setHeatLevel(0);

        set({
          dirtyCash: newDirty,
          cleanCash: newClean,
          heatLevel: 0,
          isEvadingPolice: false
        });

        return { success: true, message: '¡Soborno procesado! Tu nivel de búsqueda fue eliminado de la red policial.' };
      },

      togglePhone: (force) => {
        const state = get();
        const next = force !== undefined ? force : !state.isPhoneOpen;

        if (next) {
          audioEngine.playNotification();
        } else {
          audioEngine.playClick();
        }

        set({
          isPhoneOpen: next,
          isPaused: next || state.isPauseModalOpen || state.isMapOpen,
          isPauseModalOpen: false,
          isMapOpen: false,
          unreadSignalCount: next && state.activePhoneApp === 'signal' ? 0 : state.unreadSignalCount
        });
      },

      setPhoneApp: (app) => {
        audioEngine.playClick();
        set((state) => ({
          activePhoneApp: app,
          unreadSignalCount: app === 'signal' ? 0 : state.unreadSignalCount
        }));
      },

      sendSignalMessage: (text) => {
        const userMsg: SignalMessage = {
          id: 'msg_user_' + Date.now(),
          senderId: 'jason',
          senderName: 'Jason Duval (Tú)',
          avatar: '/assets/gta6/People/Jason Duval/Jason_Duval_01.jpg',
          text,
          timestamp: 'Ahora',
          isIncoming: false
        };

        audioEngine.playClick();

        set((state) => ({
          signalMessages: [...state.signalMessages, userMsg]
        }));

        // Cancel previous pending bot reply if user sends another message rapidly
        if (botReplyTimeoutId !== null) {
          window.clearTimeout(botReplyTimeoutId);
        }

        // Bot automated response
        botReplyTimeoutId = window.setTimeout(() => {
          const reply: SignalMessage = {
            id: 'msg_val_reply_' + Date.now(),
            senderId: 'lucia',
            senderName: 'Lucia Caminos',
            avatar: '/assets/gta6/People/Lucia Caminos/Lucia_Caminos_01.jpg',
            text: 'Recibido, Jason. Frecuencias de la policía de Leonida monitoreadas. Todo listo para la siguiente jugada.',
            timestamp: 'Ahora',
            isIncoming: true
          };
          audioEngine.playNotification();
          set((s) => ({
            signalMessages: [...s.signalMessages, reply],
            unreadSignalCount: s.isPhoneOpen ? 0 : s.unreadSignalCount + 1
          }));
          botReplyTimeoutId = null;
        }, BOT_REPLY_DELAY_MS);
      },

      sendInteractiveReply: (senderId, replyText, cashReward = 0) => {
        const userMsg: SignalMessage = {
          id: 'msg_reply_' + Date.now(),
          senderId: 'jason',
          senderName: 'Jason Duval (Tú)',
          avatar: '/assets/gta6/People/Jason Duval/Jason_Duval_01.jpg',
          text: replyText,
          timestamp: 'Ahora',
          isIncoming: false
        };

        audioEngine.playClick();

        set((state) => ({
          signalMessages: [...state.signalMessages, userMsg],
          cleanCash: state.cleanCash + cashReward,
          respect: Math.min(100, state.respect + (cashReward > 0 ? 5 : 2)),
          crewLoyalty: {
            ...state.crewLoyalty,
            [senderId]: Math.min(100, (state.crewLoyalty[senderId] || 50) + 5)
          }
        }));

        if (cashReward > 0) {
          audioEngine.playCashRegister();
        }
      },

      dismissPhoneNotification: () => {
        set({ phoneNotificationBanner: null });
      },

      configureHeist: (heist) => {
        set({ activeHeist: heist });
      },

      restartGame: () => {
        if (botReplyTimeoutId !== null) {
          window.clearTimeout(botReplyTimeoutId);
          botReplyTimeoutId = null;
        }
        audioEngine.stopHeartbeat();
        audioEngine.setHeatLevel(0);
        set({
          ...INITIAL_GAME_STATE,
          heatLevel: 0,
          isPaused: false,
          isPauseModalOpen: false,
          isPhoneOpen: false,
          activePhoneApp: 'signal',
          signalMessages: INITIAL_SIGNAL_MESSAGES,
          instaPosts: INSTA_POSTS,
          unreadSignalCount: 1,
          isEvadingPolice: false,
          phoneNotificationBanner: null
        });
      }
    }),
    {
      name: 'vice_dynasty_save_v1_5'
    }
  )
);
