// ============================================================================
// 🌴 VICE DYNASTY: ACTO III - EL GRAN GOLPE ("THE NEON VAULT")
// ============================================================================

import type { StoryNode } from '../../types/game';

export const ACT3_NODES: Record<string, StoryNode> = {
  node_act3_jack_of_hearts: {
    id: 'node_act3_jack_of_hearts',
    act: 3,
    actTitle: 'ACTO III: LAS LUCES DE VICE CITY',
    chapterTitle: 'Capítulo 3: El Club Jack of Hearts',
    location: 'VICE CITY — CLUB STRIPTEASE & ESTUDIO "JACK OF HEARTS"',
    district: 'DOWNTOWN VICE CITY',
    gpsCoords: '25.7890° N, 80.1250° W',
    isViralFeed: true,
    video: {
      id: 'vid_act3_jack_of_hearts',
      title: 'El Imperio de Boobie Ike & Dre\'Quan Priest',
      url: 'club_babylon',
      posterImage: '/assets/gta6/Places/Vice City/Vice_City_04.jpg',
      durationSec: 11,
      themeStyle: 'club_babylon',
      dialogueSubtitle: 'Boobie Ike: "El dinero del club paga el estudio, y el dinero de la droga lo paga todo." Dre\'Quan Priest al teléfono: "¡Las bailarinas son mis cazatalentos! ¡Si el tema de Real Dimez pega en el club, va directo a la radio!"',
      speaker: 'BOOBIE IKE & DRE\'QUAN'
    },
    phoneNotification: {
      app: 'signal',
      sender: 'Dre\'Quan Priest',
      message: 'Si vienen a hablar con Boobie, procuren no hacer ruido. Real Dimez está grabando en el estudio.',
      avatarUrl: '/assets/gta6/People/DreQuan Priest/DreQuan_Priest_01.jpg',
      audioDurationSec: 4
    },
    decisionWindow: {
      startTimeSec: 4.5,
      durationSec: 5.0,
      defaultChoiceId: 'choice_act3_talk_boobie'
    },
    choices: [
      {
        id: 'choice_act3_talk_boobie',
        label: '💎 Negociación Privada con Boobie Ike en el VIP',
        sublabel: 'Subir al balcón y ofrecer las rutas no registradas de Brian Heder a cambio de capital',
        dangerLevel: 'LOW',
        targetNodeId: 'node_act3_boobie_deal',
        effects: [
          { action: 'ADD_LOYALTY', target: 'boobie', value: 25 },
          { action: 'ADD_RESPECT', value: 20 }
        ]
      },
      {
        id: 'choice_act3_talk_drequan',
        label: '🎧 Coordinar Armas y Apoyo con Dre\'Quan Priest',
        sublabel: 'Asegurar suministros pesados y vínculos con el cartel de la ciudad',
        dangerLevel: 'MEDIUM',
        targetNodeId: 'node_act3_boobie_deal',
        effects: [
          { action: 'ADD_LOYALTY', target: 'drequan', value: 30 },
          { action: 'ADD_RESPECT', value: 15 }
        ]
      }
    ]
  },

  node_act3_boobie_deal: {
    id: 'node_act3_boobie_deal',
    act: 3,
    actTitle: 'ACTO III: LAS LUCES DE VICE CITY',
    chapterTitle: 'Capítulo 3: El Trato en el Balcón VIP',
    location: 'JACK OF HEARTS — SALÓN PRIVADO VIP',
    district: 'DOWNTOWN VICE CITY',
    gpsCoords: '25.7920° N, 80.1400° W',
    video: {
      id: 'vid_act3_boobie_deal',
      title: 'Venta de Información y Entrada al Gran Juego',
      url: 'penthouse_deal',
      posterImage: '/assets/gta6/Places/Vice City/Vice_City_05.jpg',
      durationSec: 10,
      themeStyle: 'penthouse_deal',
      dialogueSubtitle: 'Lucia: "Sabemos exactamente qué cargamentos mueve Brian Heder en los Cayos. Queremos efectivo limpio y entrada al círculo financiero." Boobie estrecha su mano: "Respeto a la gente con agallas. Su contacto en Ambrosia los espera."',
      speaker: 'BOOBIE IKE'
    },
    phoneNotification: {
      app: 'darkpay',
      sender: 'Boobie Ike',
      message: 'Transferencia de $75,000 limpia ejecutada. Vayan a Ambrosia, el señor Bautista los espera.',
      avatarUrl: '/assets/gta6/People/Boobie Ike/Boobie_Ike_01.jpg',
      audioDurationSec: 4
    },
    decisionWindow: {
      startTimeSec: 4.0,
      durationSec: 4.5,
      defaultChoiceId: 'choice_act3_take_deal'
    },
    choices: [
      {
        id: 'choice_act3_take_deal',
        label: '🤝 Aceptar los $75,000 y Viajar al Restaurante en Ambrosia',
        sublabel: 'Dirigirse al norte de Leonida para reunirse con el veterano atracador Raul Bautista',
        dangerLevel: 'SAFE',
        targetNodeId: 'node_act4_ambrosia_restaurant',
        effects: [
          { action: 'ADD_CLEAN_CASH', value: 75000 },
          { action: 'ADD_RESPECT', value: 25 },
          { action: 'SET_FLAG', target: 'boobie_deal_signed', value: true }
        ]
      },
      {
        id: 'choice_act3_recruit_crew',
        label: '🚗 Contactar a Cal Hampton para el Transporte Pesado',
        sublabel: 'Asegurar un conductor blindado antes de escuchar la propuesta del banco',
        dangerLevel: 'LOW',
        targetNodeId: 'node_act4_ambrosia_restaurant',
        effects: [
          { action: 'ADD_CLEAN_CASH', value: 75000 },
          { action: 'ADD_LOYALTY', target: 'cal', value: 25 }
        ]
      }
    ]
  }
};
