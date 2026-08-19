// ============================================================================
// 🌴 VICE DYNASTY: MENSAJES INICIALES DE SIGNAL-VICE
// ============================================================================

import type { SignalMessage } from '../types/game';

export const INITIAL_SIGNAL_MESSAGES: SignalMessage[] = [
  {
    id: 'msg_01',
    senderId: 'brian',
    senderName: 'Brian Heder',
    avatar: '/assets/gta6/People/Brian Heder/Brian_Heder_01.jpg',
    text: 'Jason, el tipo de la marina en Port Gellhorn se retrasó con la cuota de la lancha. Asústalo un poco. Alquiler gratis en la cabaña mientras me sirvas.',
    timestamp: '02:15 PM',
    isIncoming: true
  },
  {
    id: 'msg_02',
    senderId: 'lucia',
    senderName: 'Lucia Caminos',
    avatar: '/assets/gta6/People/Lucia Caminos/Lucia_Caminos_01.jpg',
    text: 'Acabo de cruzar los portones de la Penitenciaría. Si algo pasa en el bar de Vice City, cuento contigo.',
    timestamp: '04:30 PM',
    isIncoming: true
  },
  {
    id: 'msg_03',
    senderId: 'boobie',
    senderName: 'Boobie Ike',
    avatar: '/assets/gta6/People/Boobie Ike/Boobie_Ike_01.jpg',
    text: 'El dinero de los cargamentos de los Cayos fue verificado. Su contacto en Ambrosia los espera para el golpe al First National.',
    timestamp: '09:45 PM',
    isIncoming: true
  },
  {
    id: 'msg_04',
    senderId: 'raul',
    senderName: 'Raul Bautista',
    avatar: '/assets/gta6/People/Raul Bautista/Raul_Bautista_01.jpg',
    text: 'Preparen el C4 y el Muscle car. Cuando caiga la niebla de Grassrivers sobre el banco, doblamos la apuesta.',
    timestamp: '11:20 PM',
    isIncoming: true
  }
];
