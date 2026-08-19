// ============================================================================
// 🌴 VICE DYNASTY: TRIPULACIÓN PARA EL SISTEMA DE ATRACOS
// ============================================================================

import type { HeistCrewMember } from '../types/game';

export const HEIST_CREW_MEMBERS: HeistCrewMember[] = [
  {
    id: 'lucia',
    name: 'Lucia Caminos',
    role: 'Hacker',
    skill: 98,
    demandedCut: 25,
    avatar: '/assets/gta6/People/Lucia Caminos/Lucia_Caminos_01.jpg',
    description: 'Especialista en bypass biométrico y desactivación de láseres en tiempo real.'
  },
  {
    id: 'cal',
    name: 'Cal Hampton',
    role: 'Driver',
    skill: 88,
    demandedCut: 20,
    avatar: '/assets/gta6/People/Cal Hampton/Cal_Hampton_01.jpg',
    description: 'Ex-piloto de carreras ilegales en Grassrivers. Capaz de evadir bloqueos policiales de nivel 5.'
  },
  {
    id: 'drequan',
    name: 'Dre\'Quan Priest',
    role: 'Gunman',
    skill: 92,
    demandedCut: 25,
    avatar: '/assets/gta6/People/DreQuan Priest/DreQuan_Priest_01.jpg',
    description: 'Mano armada de Port Gellhorn. Supresión pesada con fusiles tácticos y armamento de asalto.'
  },
  {
    id: 'boobie',
    name: 'Boobie Ike',
    role: 'Hacker',
    skill: 95,
    demandedCut: 22,
    avatar: '/assets/gta6/People/Boobie Ike/Boobie_Ike_01.jpg',
    description: 'Genio cibernético del Silicon Syndicate. Drenaje de fondos y neutralización de cortafuegos bancarios.'
  },
  {
    id: 'brian',
    name: 'Brian Heder',
    role: 'Gunman',
    skill: 86,
    demandedCut: 18,
    avatar: '/assets/gta6/People/Brian Heder/Brian_Heder_01.jpg',
    description: 'Veterano de operaciones encubiertas en Ambrosia. Especialista en demoliciones y explosivos C4.'
  }
];
