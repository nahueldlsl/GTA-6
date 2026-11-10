// ============================================================================
// 🌴 VICE DYNASTY: NEON SYNDICATE - CORE TYPESCRIPT SPECIFICATION
// ============================================================================

export type NodeId = string;
export type ChoiceId = string;
export type FlagKey = string;
export type CharacterId = 'jason' | 'lucia' | 'cal' | 'boobie' | 'drequan' | 'baeluxe' | 'roxy' | 'raul' | 'brian';
export type PhoneAppId = 'signal' | 'viceradio' | 'vicemaps' | 'instavice' | 'darkpay' | 'heistplanner';

export type HeatLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type DangerLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME' | 'FATAL';

export interface GameState {
  version: string;
  timestamp: number;
  currentNodeId: NodeId;
  cleanCash: number;
  dirtyCash: number;
  heatLevel: HeatLevel;
  respect: number; // 0 - 100
  crewLoyalty: Record<CharacterId, number>; // 0 - 100
  unlockedCrew: CharacterId[];
  activeProtagonist: 'jason' | 'lucia';
  inventory: string[];
  flags: Record<FlagKey, boolean | number | string>;
  history: Array<{
    nodeId: NodeId;
    choiceId?: ChoiceId;
    timestamp: number;
    title: string;
  }>;
  activeHeist?: HeistSession;
  unlockedEndings: string[];
}

export type ConditionOperator = 'EQ' | 'NEQ' | 'GT' | 'GTE' | 'LT' | 'LTE' | 'HAS' | 'NOT_HAS';

export interface StateCondition {
  field: 'cleanCash' | 'dirtyCash' | 'heatLevel' | 'respect' | 'inventory' | 'flags' | 'crewLoyalty';
  key?: string; // Para flags o loyalty específica (e.g. 'val')
  operator: ConditionOperator;
  value: number | string | boolean;
  failMessage?: string;
}

export type EffectAction =
  | 'ADD_CLEAN_CASH'
  | 'ADD_DIRTY_CASH'
  | 'WASH_CASH'
  | 'SET_HEAT'
  | 'ADD_HEAT'
  | 'SUB_HEAT'
  | 'REMOVE_HEAT'
  | 'ADD_RESPECT'
  | 'SET_LOYALTY'
  | 'ADD_LOYALTY'
  | 'SET_FLAG'
  | 'ADD_INVENTORY'
  | 'REMOVE_INVENTORY'
  | 'TRIGGER_PHONE_NOTIFICATION';

export interface StateEffect {
  action: EffectAction;
  target?: string;
  value: number | string | boolean;
}

export interface QTEEvent {
  id: string;
  triggerTimeSec: number;
  durationSec: number;
  type: 'SWIPE_UP' | 'SWIPE_DOWN' | 'TAP_RAPID' | 'PRECISION_TARGET' | 'KEY_COMBO';
  keyRequired?: string;
  targetZone?: { xPct: number; yPct: number; radiusPct: number };
  instructionText: string;
  successNodeId: NodeId;
  failNodeId: NodeId;
  failEffects?: StateEffect[];
}

export interface StoryChoice {
  id: ChoiceId;
  label: string;
  sublabel?: string;
  icon?: string;
  targetNodeId: NodeId;
  dangerLevel: DangerLevel;
  conditions?: StateCondition[];
  effects?: StateEffect[];
  isLocked?: boolean;
  lockHint?: string;
}

export interface VideoAsset {
  id: string;
  title: string;
  url: string; // Video URL or WebGL visual theme identifier
  posterImage?: string; // High-res GTA 6 artwork backdrop
  thumbnailUrl?: string;
  durationSec: number;
  themeStyle: 'sunset_drive' | 'yacht_heist' | 'club_babylon' | 'police_chase' | 'crypto_vault' | 'dock_shootout' | 'penthouse_deal' | 'helipad_climax' | 'victory_neon' | 'prison_cell' | 'island_escape' | 'swamp_chase';
  dialogueSubtitle?: string;
  speaker?: string;
}

export interface DecisionWindow {
  startTimeSec: number;
  durationSec: number; // e.g. 4.0s
  defaultChoiceId: ChoiceId; // Inaction fallback
}

export interface PhoneNotificationPayload {
  app: PhoneAppId;
  sender: string;
  message: string;
  avatarUrl?: string;
  audioDurationSec?: number;
}

export interface StoryNode {
  id: NodeId;
  act: 1 | 2 | 3 | 4 | 5;
  actTitle: string;
  chapterTitle: string;
  location: string;
  district?: string;
  gpsCoords?: string;
  isViralFeed?: boolean;
  video: VideoAsset;
  decisionWindow?: DecisionWindow;
  choices: StoryChoice[];
  qte?: QTEEvent;
  autoTransitionNodeId?: NodeId;
  phoneNotification?: PhoneNotificationPayload;
  isEnding?: boolean;
  endingType?: 'EMPIRE' | 'ESCAPE' | 'PRISON' | 'DEATH';
}

export interface SignalMessage {
  id: string;
  senderId: CharacterId;
  senderName: string;
  avatar: string;
  text: string;
  timestamp: string;
  isAudio?: boolean;
  audioDuration?: string;
  image?: string;
  isIncoming?: boolean;
}

export interface InstaPost {
  id: string;
  username: string;
  handle: string;
  avatar: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  caption: string;
  likes: number;
  commentsCount: number;
  timeAgo: string;
  isVerified?: boolean;
  badge?: string;
}

export type CrewRole = 'Hacker' | 'Driver' | 'Gunman' | 'hacker' | 'driver' | 'gunman';

export interface HeistCrewMember {
  id: CharacterId;
  name: string;
  role: 'Hacker' | 'Driver' | 'Gunman';
  skill: number; // 0-100
  demandedCut: number; // 15-35%
  avatar: string;
  description: string;
}

export interface HeistSession {
  id: string;
  title: string;
  targetName: string;
  estimatedLoot: number;
  approach: 'STEALTH_CYBER' | 'HEAVY_ASSAULT';
  selectedCrew: Partial<Record<'hacker' | 'driver' | 'gunman', CharacterId>>;
  playerCut: number;
  riskFactor: 'LOW' | 'MEDIUM' | 'HIGH' | 'SUICIDE';
}
