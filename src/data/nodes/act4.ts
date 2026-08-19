// ============================================================================
// 🌴 VICE DYNASTY: ACTO IV - LA OFERTA DE RAUL BAUTISTA
// ============================================================================

import type { StoryNode } from '../../types/game';

export const ACT4_NODES: Record<string, StoryNode> = {
  node_act4_ambrosia_restaurant: {
    id: 'node_act4_ambrosia_restaurant',
    act: 4,
    actTitle: 'ACTO IV: LA OFERTA DE RAUL BAUTISTA',
    chapterTitle: 'Capítulo 4: Café Cubano en Ambrosia',
    location: 'RESTAURANTE CUBANO — AMBROSIA NORTE',
    district: 'AMBROSIA COUNTY',
    gpsCoords: '25.7350° N, 80.1650° W',
    video: {
      id: 'vid_act4_raul_intro',
      title: 'La Propuesta de Raul Bautista',
      url: 'crypto_vault',
      posterImage: '/assets/gta6/Places/Ambrosia/Ambrosia_02.jpg',
      durationSec: 11,
      themeStyle: 'crypto_vault',
      dialogueSubtitle: 'Raul Bautista sirve café en tazas pequeñas con su camisa de lino impoluta: "Experiencia es lo que cuenta, mis amigos. La vida está llena de sorpresas. Tengo un objetivo: la sucursal del First National. Necesito el entrenamiento militar de Jason y la sangre fría de Lucia para la recompensa con la que su mamá sueña desde Liberty City."',
      speaker: 'RAUL BAUTISTA'
    },
    phoneNotification: {
      app: 'signal',
      sender: 'Raul Bautista',
      message: 'Revisen los planos de la bóveda del First National. Es un golpe de $3,000,000. Los veo en posición al caer la niebla.',
      avatarUrl: '/assets/gta6/People/Raul Bautista/Raul_Bautista_01.jpg',
      audioDurationSec: 4
    },
    decisionWindow: {
      startTimeSec: 4.5,
      durationSec: 5.0,
      defaultChoiceId: 'choice_act4_accept_heist'
    },
    choices: [
      {
        id: 'choice_act4_accept_heist',
        label: '🏦 "Estamos Dentro": Aceptar el Golpe Bancario',
        sublabel: 'Lucia mira a Jason; saben que las oportunidades así solo pasan una vez en la vida',
        dangerLevel: 'HIGH',
        targetNodeId: 'node_act4_prep_recon',
        effects: [
          { action: 'ADD_LOYALTY', target: 'raul', value: 30 },
          { action: 'ADD_LOYALTY', target: 'lucia', value: 15 },
          { action: 'SET_FLAG', target: 'raul_heist_agreed', value: true }
        ]
      },
      {
        id: 'choice_act4_question_risk',
        label: '🔍 Exigir el Plan de Fuga Hacia Grassrivers',
        sublabel: 'Asegurar las rutas de escape clandestinas antes de comprometerse al asalto',
        dangerLevel: 'MEDIUM',
        targetNodeId: 'node_act4_prep_recon',
        effects: [
          { action: 'ADD_RESPECT', value: 20 },
          { action: 'ADD_LOYALTY', target: 'raul', value: 10 }
        ]
      }
    ]
  },

  node_act4_prep_recon: {
    id: 'node_act4_prep_recon',
    act: 4,
    actTitle: 'ACTO IV: LA OFERTA DE RAUL BAUTISTA',
    chapterTitle: 'Capítulo 4: Planificación en el Distrito Financiero',
    location: 'PERÍMETRO DEL FIRST NATIONAL BANK — FINANCIAL DISTRICT',
    district: 'FINANCIAL DISTRICT',
    gpsCoords: '25.7950° N, 80.1450° W',
    video: {
      id: 'vid_act4_recon',
      title: 'Inspección de Bóveda y Sensores Térmicos',
      url: 'crypto_vault',
      posterImage: '/assets/gta6/Places/Vice City/Vice_City_08.jpg',
      durationSec: 9,
      themeStyle: 'crypto_vault',
      dialogueSubtitle: 'Jason: "La bóveda tiene bloqueo electrónico y sensores térmicos. Necesitaremos C4 para la salida trasera si las cosas se ponen feas." Lucia: "Yo me encargo de las bolsas con los tres millones. Solo mantén a Raul enfocado."',
      speaker: 'JASON & LUCIA'
    },
    decisionWindow: {
      startTimeSec: 4.0,
      durationSec: 4.5,
      defaultChoiceId: 'choice_act4_ready_heist'
    },
    choices: [
      {
        id: 'choice_act4_ready_heist',
        label: '💥 Equipar C4 y Avanzar al Banco en Ambrosia',
        sublabel: 'Esperar a que la niebla húmeda de Grassrivers cubra la ciudad para iniciar el golpe',
        dangerLevel: 'HIGH',
        targetNodeId: 'node_act5_bank_assault',
        effects: [
          { action: 'ADD_INVENTORY', value: 'c4_breach_charges' },
          { action: 'ADD_RESPECT', value: 20 }
        ]
      },
      {
        id: 'choice_act4_tune_muscle_car',
        label: '🏎️ Preparar el Muscle Car Modificado para la Fuga',
        sublabel: 'Ajustar la suspensión y el motor para derrapar en el asfalto mojado y los pantanos',
        dangerLevel: 'SAFE',
        targetNodeId: 'node_act5_bank_assault',
        effects: [
          { action: 'ADD_INVENTORY', value: 'tuned_muscle_car' },
          { action: 'ADD_LOYALTY', target: 'lucia', value: 15 }
        ]
      }
    ]
  }
};
