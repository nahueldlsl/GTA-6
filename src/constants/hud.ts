// ============================================================================
// 🌴 VICE DYNASTY - HUD & VISUAL CONFIGURATIONS
// ============================================================================

import type { DangerLevel, CharacterId } from '../types/game';

export const DANGER_LEVEL_STYLES: Record<DangerLevel, string> = {
  SAFE: 'border-emerald-500/60 hover:bg-emerald-950/40 text-emerald-300',
  LOW: 'border-cyan-500/60 hover:bg-cyan-950/40 text-cyan-300',
  MEDIUM: 'border-yellow-500/60 hover:bg-yellow-950/40 text-yellow-300',
  HIGH: 'border-orange-500/60 hover:bg-orange-950/40 text-orange-300',
  EXTREME: 'border-red-500/60 hover:bg-red-950/40 text-red-400',
  FATAL: 'border-purple-600/80 hover:bg-purple-950/50 text-pink-400'
};

export interface CrewMemberDisplay {
  id: CharacterId;
  name: string;
  role: string;
  avatar: string;
}

export const CREW_MEMBERS_DISPLAY: CrewMemberDisplay[] = [
  { id: 'lucia', name: 'Lucia Caminos', role: 'Hacker / Fugas', avatar: '/assets/gta6/People/Lucia Caminos/Lucia_Caminos_01.jpg' },
  { id: 'cal', name: 'Cal Hampton', role: 'Conductor Pesado', avatar: '/assets/gta6/People/Cal Hampton/Cal_Hampton_01.jpg' },
  { id: 'drequan', name: 'Dre\'Quan Priest', role: 'Sicario Cartel', avatar: '/assets/gta6/People/DreQuan Priest/DreQuan_Priest_01.jpg' },
  { id: 'raul', name: 'Raul Bautista', role: 'Leonida Police', avatar: '/assets/gta6/People/Raul Bautista/Raul_Bautista_01.jpg' },
  { id: 'boobie', name: 'Boobie Ike', role: 'Silicon Syndicate', avatar: '/assets/gta6/People/Boobie Ike/Boobie_Ike_01.jpg' },
  { id: 'brian', name: 'Brian Heder', role: 'Logística & Armas', avatar: '/assets/gta6/People/Brian Heder/Brian_Heder_01.jpg' }
];

export const VIRAL_LIVE_COMMENTS = [
  { user: '@vice_insider', text: 'Solo pasa en Leonida jajaja 💀🐊', badge: '🔥' },
  { user: '@305_lucia_fan', text: '¡Esa lancha va a 90 nudos! 🚤💨', badge: '⚡' },
  { user: '@sunport_news', text: 'Task Force VCPD activó código 3 en el sector 🚔', badge: '🚨' },
  { user: '@gator_dave99', text: 'Lucia y Mateo no perdonan una 💸', badge: '👑' },
  { user: '@vice_nightlife', text: 'Nos vemos en Club Babylon después de esto 🥂', badge: '🌴' },
  { user: '@cryptodragon', text: 'Se movieron 50 BTC en DarkPay en vivo 📈', badge: '💰' },
  { user: '@southbeach_live', text: '¿Quién está transmitiendo esto? W streamers', badge: '👀' }
];
