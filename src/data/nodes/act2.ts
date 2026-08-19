// ============================================================================
// 🌴 VICE DYNASTY: ACTO II - LA GUERRA DE TRES FRENTES
// ============================================================================

import type { StoryNode } from '../../types/game';

export const ACT2_NODES: Record<string, StoryNode> = {
  node_act2_prison_release: {
    id: 'node_act2_prison_release',
    act: 2,
    actTitle: 'ACTO II: HIERRO Y LIBERTAD',
    chapterTitle: 'Capítulo 2: Los Portones de la Penitenciaría',
    location: 'PENITENCIARÍA ESTATAL DE LEONIDA — SALIDA PRINCIPAL',
    district: 'AMBROSIA COUNTY',
    gpsCoords: '25.7350° N, 80.1650° W',
    video: {
      id: 'vid_act2_prison',
      title: 'Salida al Sol Cegador de Leonida',
      url: 'prison_cell',
      posterImage: '/assets/gta6/Places/Ambrosia/Ambrosia_01.jpg',
      durationSec: 10,
      themeStyle: 'prison_cell',
      dialogueSubtitle: 'Los portones de hierro se abrieron con un chirrido sordo. Lucia Caminos caminó hacia la luz sin mirar atrás. En su bolsillo llevaba la postal arrugada de Liberty City: "No más fantasías baratas. De ahora en adelante, solo jugadas inteligentes."',
      speaker: 'LUCIA CAMINOS'
    },
    decisionWindow: {
      startTimeSec: 4.0,
      durationSec: 4.5,
      defaultChoiceId: 'choice_act2_head_to_vice'
    },
    choices: [
      {
        id: 'choice_act2_head_to_vice',
        label: '🏙️ Viajar a las Afueras de Vice City',
        sublabel: 'Tomar la carretera interestatal buscando un refugio discreto para planear el regreso',
        dangerLevel: 'SAFE',
        targetNodeId: 'node_act2_dive_bar_fight',
        effects: [
          { action: 'ADD_RESPECT', value: 10 },
          { action: 'SET_FLAG', target: 'lucia_liberty_postcard', value: true }
        ]
      },
      {
        id: 'choice_act2_check_darkpay',
        label: '📱 Sincronizar Billetera Fría en DarkPay',
        sublabel: 'Comprobar los contactos clandestinos antes de pisar el área metropolitana',
        dangerLevel: 'LOW',
        targetNodeId: 'node_act2_dive_bar_fight',
        effects: [
          { action: 'ADD_DIRTY_CASH', value: 5000 },
          { action: 'ADD_RESPECT', value: 5 }
        ]
      }
    ]
  },

  node_act2_dive_bar_fight: {
    id: 'node_act2_dive_bar_fight',
    act: 2,
    actTitle: 'ACTO II: HIERRO Y LIBERTAD',
    chapterTitle: 'Capítulo 2: Encuentro en el Bar de las Afueras',
    location: 'BAR DE MALA MUERTE — PERIFERIA DE VICE CITY',
    district: 'VICE OUTSKIRTS',
    gpsCoords: '25.7610° N, 80.1900° W',
    isViralFeed: true,
    video: {
      id: 'vid_act2_bar_fight',
      title: 'Confrontación y Alianza de Fuego',
      url: 'dock_shootout',
      posterImage: '/assets/gta6/Places/Vice City/Vice_City_01.jpg',
      durationSec: 11,
      themeStyle: 'dock_shootout',
      dialogueSubtitle: 'Lucia rompe una botella contra la barra clavando el cuello de cristal. Jason desarma al compinche arrojándolo fuera. Jason: "Si algo pasa, estoy justo detrás de ti." Lucia: "Otro día en el paraíso, ¿no?"',
      speaker: 'JASON & LUCIA'
    },
    phoneNotification: {
      app: 'signal',
      sender: 'Lucia Caminos',
      message: 'Buen reflejo con ese matón en la barra. Necesitamos hablar de negocios serios en Vice City.',
      avatarUrl: '/assets/gta6/People/Lucia Caminos/Lucia_Caminos_01.jpg',
      audioDurationSec: 4
    },
    qte: {
      id: 'qte_bar_disarm',
      triggerTimeSec: 3.5,
      durationSec: 3.0,
      type: 'TAP_RAPID',
      keyRequired: 'SPACE',
      instructionText: '¡DESARMA AL MATÓN Y PROTEGE LA ESPALDA DE LUCIA!',
      successNodeId: 'node_act3_jack_of_hearts',
      failNodeId: 'node_act3_jack_of_hearts',
      failEffects: [
        { action: 'ADD_LOYALTY', target: 'lucia', value: 10 }
      ]
    },
    decisionWindow: {
      startTimeSec: 4.5,
      durationSec: 5.0,
      defaultChoiceId: 'choice_act2_team_up'
    },
    choices: [
      {
        id: 'choice_act2_team_up',
        label: '🤝 Sellar el Pacto de Confianza Absoluta',
        sublabel: 'Solos son presa fácil, pero juntos cambiarán las reglas de Leonida',
        dangerLevel: 'SAFE',
        targetNodeId: 'node_act3_jack_of_hearts',
        effects: [
          { action: 'ADD_LOYALTY', target: 'lucia', value: 25 },
          { action: 'ADD_RESPECT', value: 15 },
          { action: 'SET_FLAG', target: 'jason_lucia_partnership', value: true }
        ]
      },
      {
        id: 'choice_act2_plan_vice_city',
        label: '🍸 Ir al Club Jack of Hearts por Contactos',
        sublabel: 'Seguir la pista del dinero hasta el club de striptease de Boobie Ike',
        dangerLevel: 'MEDIUM',
        targetNodeId: 'node_act3_jack_of_hearts',
        effects: [
          { action: 'ADD_RESPECT', value: 20 },
          { action: 'ADD_LOYALTY', target: 'lucia', value: 15 }
        ]
      }
    ]
  }
};
