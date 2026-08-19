// ============================================================================
// 🌴 VICE DYNASTY: ACTO I - EL BARRO Y EL NEÓN
// ============================================================================

import type { StoryNode } from '../../types/game';

export const ACT1_NODES: Record<string, StoryNode> = {
  node_custom_intro: {
    id: 'node_custom_intro',
    act: 1,
    actTitle: 'ACTO I: EL BARRO Y EL NEÓN',
    chapterTitle: 'Capítulo 0: Introducción a Leonida',
    location: 'VICE CITY — COSTA ESTE',
    district: 'VICE CITY',
    gpsCoords: '25.7617° N, 80.1918° W',
    video: {
      id: 'vid_gtavi_trailer',
      title: 'Grand Theft Auto VI — Tráiler Oficial',
      url: 'GTAVI_Trailer_1',
      posterImage: '/assets/GTAVI_Trailer_1_fija.png',
      durationSec: 91,
      themeStyle: 'sunset_drive'
    },
    phoneNotification: {
      app: 'signal',
      sender: 'Lucia Caminos',
      message: 'Jason, estamos en el radar de la policía. Tenemos que decidir nuestro próximo movimiento antes de que cierren las salidas.',
      avatarUrl: '/assets/gta6/People/Lucia Caminos/Lucia_Caminos_01.jpg'
    },
    decisionWindow: {
      startTimeSec: 91.0,
      durationSec: 12.0,
      defaultChoiceId: 'choice_intro_lucia'
    },
    choices: [
      {
        id: 'choice_intro_lucia',
        label: '🌴 Ver Cinemática de Lucia',
        sublabel: 'Bifurcación exclusiva: Explorar la cinemática de Lucia',
        dangerLevel: 'MEDIUM',
        targetNodeId: 'node_custom_lucia_video',
        effects: [
          { action: 'ADD_LOYALTY', target: 'lucia', value: 15 }
        ]
      },
      {
        id: 'choice_intro_keys_workshop',
        label: '🔧 Continuar al Taller de Brian',
        sublabel: 'Iniciar la misión en los Cayos de Leonida',
        dangerLevel: 'SAFE',
        targetNodeId: 'node_act1_keys_workshop',
        effects: [
          { action: 'ADD_RESPECT', value: 10 }
        ]
      }
    ]
  },

  node_custom_lucia_video: {
    id: 'node_custom_lucia_video',
    act: 1,
    actTitle: 'ACTO I: EL BARRO Y EL NEÓN',
    chapterTitle: 'Capítulo 0.5: Lucia en Leonida',
    location: 'VICE CITY — PENITENCIARÍA DE LEONIDA',
    district: 'VICE CITY',
    gpsCoords: '25.7617° N, 80.1918° W',
    video: {
      id: 'vid_lucia_custom',
      title: 'Cinemática: Video de Lucia',
      url: 'Lucia_Video',
      posterImage: '/assets/GTAVI_Trailer_1_fija.png',
      durationSec: 15,
      themeStyle: 'sunset_drive'
    },
    phoneNotification: {
      app: 'signal',
      sender: 'Lucia Caminos',
      message: 'Jason, ya salí. Brian nos espera en los Cayos con un encargo. Consigamos transporte rápido.',
      avatarUrl: '/assets/gta6/People/Lucia Caminos/Lucia_Caminos_01.jpg'
    },
    decisionWindow: {
      startTimeSec: 15.0,
      durationSec: 8.0,
      defaultChoiceId: 'choice_lucia_to_workshop'
    },
    choices: [
      {
        id: 'choice_lucia_to_workshop',
        label: '🚗 Ir al Taller de Brian Heder',
        sublabel: 'Reunirse con Brian para el primer encargo en Port Gellhorn',
        dangerLevel: 'SAFE',
        targetNodeId: 'node_act1_keys_workshop',
        effects: [
          { action: 'ADD_LOYALTY', target: 'lucia', value: 10 }
        ]
      }
    ]
  },

  node_act1_keys_workshop: {
    id: 'node_act1_keys_workshop',
    act: 1,
    actTitle: 'ACTO I: EL SABOR DE LA SANGRÍA Y LA SAL',
    chapterTitle: 'Capítulo 1: El Asfalto de los Cayos',
    location: 'CAYOS DE LEONIDA — TALLER DE BARCOS DE BRIAN HEDER',
    district: 'LEONIDA KEYS',
    gpsCoords: '24.5550° N, 81.7800° W',
    video: {
      id: 'vid_act1_workshop',
      title: 'Tarde Sofocante en el Taller de Brian Heder',
      url: 'sunset_drive',
      posterImage: '/assets/gta6/Places/Leonida Keys/Leonida_Keys_01.jpg',
      durationSec: 10,
      themeStyle: 'sunset_drive',
      dialogueSubtitle: 'Brian Heder: "En mis tiempos traía tanta hierba en avioneta que hacía levitar a Leonida... Ve a Port Gellhorn, Jason. El tipo de la marina se retrasó con la cuota. Asústalo un poco. Alquiler gratis en la cabaña mientras me sirvas."',
      speaker: 'BRIAN HEDER'
    },
    phoneNotification: {
      app: 'signal',
      sender: 'Brian Heder',
      message: 'Recuerda Jason: nada loco en la marina. Solo recuérdale quién manda en los muelles.',
      avatarUrl: '/assets/gta6/People/Brian Heder/Brian_Heder_01.jpg',
      audioDurationSec: 4
    },
    decisionWindow: {
      startTimeSec: 4.0,
      durationSec: 4.5,
      defaultChoiceId: 'choice_act1_drive_rancher'
    },
    choices: [
      {
        id: 'choice_act1_drive_rancher',
        label: '🚗 Conducir el Rancher a Port Gellhorn',
        sublabel: 'Tomar la autopista marítima con la radio baja y un trago de la sangría casera de Lori',
        dangerLevel: 'LOW',
        targetNodeId: 'node_act1_port_gellhorn_errand',
        effects: [
          { action: 'ADD_LOYALTY', target: 'brian', value: 10 },
          { action: 'SET_FLAG', target: 'drank_lori_sangria', value: true }
        ]
      },
      {
        id: 'choice_act1_demand_cut',
        label: '💬 Exigir una Mayor Comisión a Brian',
        sublabel: 'Hacer valer tus tres años en el Ejército y tu puntería antes de hacer el trabajo sucio',
        dangerLevel: 'MEDIUM',
        targetNodeId: 'node_act1_port_gellhorn_errand',
        effects: [
          { action: 'ADD_RESPECT', value: 15 },
          { action: 'ADD_LOYALTY', target: 'brian', value: -5 }
        ]
      }
    ]
  },

  node_act1_port_gellhorn_errand: {
    id: 'node_act1_port_gellhorn_errand',
    act: 1,
    actTitle: 'ACTO I: EL SABOR DE LA SANGRÍA Y LA SAL',
    chapterTitle: 'Capítulo 1: Cuentas Pendientes en la Marina',
    location: 'MARINA DE PORT GELLHORN — MUELLES DE REPARACIÓN',
    district: 'PORT GELLHORN',
    gpsCoords: '25.7533° N, 80.1802° W',
    isViralFeed: true,
    video: {
      id: 'vid_act1_marina',
      title: 'Cobro en los Muelles de Port Gellhorn',
      url: 'dock_shootout',
      posterImage: '/assets/gta6/Places/Port Gellhorn/Port_Gellhorn_01.jpg',
      durationSec: 9,
      themeStyle: 'dock_shootout',
      dialogueSubtitle: 'Jason: "Brian no tiene paciencia para excusas. La cuota de la lancha se paga hoy o el motor termina en el fondo del canal." Deudor: "¡Toma el dinero, no rompas nada!"',
      speaker: 'JASON DUVAL'
    },
    qte: {
      id: 'qte_marina_confront',
      triggerTimeSec: 3.2,
      durationSec: 3.0,
      type: 'SWIPE_UP',
      keyRequired: 'SPACE',
      instructionText: '¡INTIMIDA AL DEUDOR Y ASEGURA EL MALETÍN!',
      successNodeId: 'node_act2_prison_release',
      failNodeId: 'node_act2_prison_release',
      failEffects: [
        { action: 'ADD_HEAT', value: 1 }
      ]
    },
    decisionWindow: {
      startTimeSec: 4.0,
      durationSec: 4.5,
      defaultChoiceId: 'choice_act1_collect_clean'
    },
    choices: [
      {
        id: 'choice_act1_collect_clean',
        label: '💵 Recaudar los $15,000 en Efectivo',
        sublabel: 'Cobrar el encargo sin llamar la atención de la Leonida Police',
        dangerLevel: 'SAFE',
        targetNodeId: 'node_act2_prison_release',
        effects: [
          { action: 'ADD_DIRTY_CASH', value: 15000 },
          { action: 'ADD_RESPECT', value: 10 }
        ]
      },
      {
        id: 'choice_act1_seize_speedboat',
        label: '🚤 Incautar las Llaves de la Lancha Rápida',
        sublabel: 'Tomar la embarcación como fianza adicional para futuras operaciones',
        dangerLevel: 'MEDIUM',
        targetNodeId: 'node_act2_prison_release',
        effects: [
          { action: 'ADD_DIRTY_CASH', value: 25000 },
          { action: 'ADD_INVENTORY', value: 'gellhorn_speedboat_key' },
          { action: 'ADD_HEAT', value: 1 }
        ]
      }
    ]
  }
};
