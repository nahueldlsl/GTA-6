// ============================================================================
// 🌴 VICE DYNASTY: ACTO V - EL GOLPE EN AMBROSIA
// ============================================================================

import type { StoryNode } from '../../types/game';

export const ACT5_NODES: Record<string, StoryNode> = {
  node_act5_bank_assault: {
    id: 'node_act5_bank_assault',
    act: 5,
    actTitle: 'ACTO V: EL GOLPE EN AMBROSIA',
    chapterTitle: 'Capítulo 5: Niebla, Plomo y C4',
    location: 'VESTÍBULO DEL FIRST NATIONAL — AMBROSIA',
    district: 'AMBROSIA COUNTY',
    gpsCoords: '25.7420° N, 80.1700° W',
    isViralFeed: true,
    video: {
      id: 'vid_act5_assault',
      title: 'El Asalto al Banco y la Ruptura con C4',
      url: 'dock_shootout',
      posterImage: '/assets/gta6/Places/Ambrosia/Ambrosia_04.jpg',
      durationSec: 11,
      themeStyle: 'dock_shootout',
      dialogueSubtitle: 'La niebla bajaba húmeda desde Grassrivers. Salta la alarma silenciosa. Raul dispara al techo gritando: "¡Doblamos la apuesta!" Jason detona C4 en la puerta trasera mientras el humo táctico llena el vestíbulo. Lucia asegura las bolsas con $3,000,000.',
      speaker: 'RAUL, JASON & LUCIA'
    },
    qte: {
      id: 'qte_detonate_c4',
      triggerTimeSec: 3.5,
      durationSec: 3.0,
      type: 'PRECISION_TARGET',
      keyRequired: 'SPACE',
      instructionText: '¡DETONA EL C4 EN LA PUERTA TRASERA Y SALTA AL COCHE!',
      successNodeId: 'node_act5_grassrivers_escape',
      failNodeId: 'node_act5_grassrivers_escape',
      failEffects: [
        { action: 'ADD_HEAT', value: 1 }
      ]
    },
    decisionWindow: {
      startTimeSec: 4.0,
      durationSec: 5.5,
      defaultChoiceId: 'choice_act5_stealth_hack'
    },
    choices: [
      {
        id: 'choice_act5_stealth_hack',
        label: '🕶️ Protocolo Fantasma: Desactivar Alarmas y Salida Silenciosa',
        sublabel: 'Hackeo de cámaras térmicas y extracción limpia por el muelle (1★ de búsqueda y botín intacto)',
        dangerLevel: 'LOW',
        targetNodeId: 'node_act5_grassrivers_escape',
        effects: [
          { action: 'ADD_DIRTY_CASH', value: 3500000 },
          { action: 'SET_HEAT', value: 1 },
          { action: 'ADD_LOYALTY', target: 'lucia', value: 20 },
          { action: 'ADD_RESPECT', value: 25 },
          { action: 'SET_FLAG', target: 'heist_stealth_success', value: true }
        ]
      },
      {
        id: 'choice_act5_c4_breach',
        label: '💣 Detonación C4 en Puerta Blindada y Salida Rápida',
        sublabel: 'Volar la salida trasera con explosivo militar para abordar el auto de fuga en segundos',
        dangerLevel: 'HIGH',
        targetNodeId: 'node_act5_grassrivers_escape',
        conditions: [
          {
            field: 'inventory',
            operator: 'HAS',
            value: 'c4_breach_charges',
            failMessage: 'Requiere Cargas de C4 (Compradas en DarkPay o equipadas en Acto 4)'
          }
        ],
        effects: [
          { action: 'ADD_DIRTY_CASH', value: 3000000 },
          { action: 'ADD_HEAT', value: 3 },
          { action: 'ADD_RESPECT', value: 35 },
          { action: 'REMOVE_INVENTORY', value: 'c4_breach_charges' },
          { action: 'SET_FLAG', target: 'heist_c4_used', value: true }
        ]
      },
      {
        id: 'choice_act5_brute_assault',
        label: '💥 Fuego de Supresión Frontal y Fuga a Ciegas',
        sublabel: 'Tiroteo directo contra las patrullas sin explosivos tácticos (Alta búsqueda y riesgo)',
        dangerLevel: 'EXTREME',
        targetNodeId: 'node_act5_grassrivers_escape',
        effects: [
          { action: 'ADD_DIRTY_CASH', value: 2200000 },
          { action: 'ADD_HEAT', value: 4 },
          { action: 'ADD_RESPECT', value: 15 }
        ]
      }
    ]
  },

  node_act5_grassrivers_escape: {
    id: 'node_act5_grassrivers_escape',
    act: 5,
    actTitle: 'ACTO V: EL GOLPE EN AMBROSIA',
    chapterTitle: 'Capítulo 5: Fuga en los Pantanos de Grassrivers',
    location: 'PANTANOS DE GRASSRIVERS — RUTAS CLANDESTINAS',
    district: 'GRASSRIVERS SWAMPS',
    gpsCoords: '25.6800° N, 80.5500° W',
    isViralFeed: true,
    video: {
      id: 'vid_act5_swamp_chase',
      title: 'Escape a Alta Velocidad entre Caimanes y Niebla',
      url: 'swamp_chase',
      posterImage: '/assets/gta6/Places/Grassrivers/Grassrivers_01.jpg',
      durationSec: 12,
      themeStyle: 'swamp_chase',
      dialogueSubtitle: 'Lucia: "¡A la derecha! ¡Hacia los pantanos!" Los faros de la policía estallan. El Muscle car ruge a fondo por caminos oscuros donde solo caimanes y contrabandistas conocen las rutas. Las sirenas y el humo quedan atrás.',
      speaker: 'LUCIA & JASON'
    },
    decisionWindow: {
      startTimeSec: 4.5,
      durationSec: 5.0,
      defaultChoiceId: 'choice_act5_to_epilogue'
    },
    choices: [
      {
        id: 'choice_act5_to_epilogue',
        label: '🌅 Desaparecer por la Autopista Hacia los Cayos',
        sublabel: 'Dejar atrás las sirenas y conducir hacia una playa apartada al amanecer (Final Escape Canónico)',
        dangerLevel: 'SAFE',
        targetNodeId: 'node_epilogue_suncoast_dawn',
        conditions: [
          {
            field: 'crewLoyalty',
            key: 'lucia',
            operator: 'GTE',
            value: 40,
            failMessage: 'Requiere lealtad con Lucia (mínimo 40%)'
          }
        ],
        effects: [
          { action: 'SET_HEAT', value: 0 },
          { action: 'ADD_CLEAN_CASH', value: 1500000 },
          { action: 'ADD_LOYALTY', target: 'lucia', value: 30 }
        ]
      },
      {
        id: 'choice_act5_empire',
        label: '🏆 Invertir el Botín y Conquistar Vice City',
        sublabel: 'Comprar lealtades en Star Island y establecer el imperio criminal del Neón (Final Imperio)',
        dangerLevel: 'LOW',
        targetNodeId: 'node_ending_empire',
        conditions: [
          {
            field: 'cleanCash',
            operator: 'GTE',
            value: 300000,
            failMessage: 'Requiere al menos $300,000 en dinero limpio (lavado en DarkPay)'
          },
          {
            field: 'respect',
            operator: 'GTE',
            value: 50,
            failMessage: 'Requiere al menos 50 de Respeto en el sindicato'
          }
        ],
        effects: [
          { action: 'SET_HEAT', value: 0 },
          { action: 'ADD_CLEAN_CASH', value: 3000000 },
          { action: 'ADD_RESPECT', value: 50 },
          { action: 'ADD_LOYALTY', target: 'lucia', value: 25 }
        ]
      },
      {
        id: 'choice_act5_surrender_prison',
        label: '⚖️ Frenar ante el Cerco Policial Táctico',
        sublabel: 'Evitar el fuego cruzado masivo y asumir condena en la Penitenciaría (Final Prisión)',
        dangerLevel: 'MEDIUM',
        targetNodeId: 'node_ending_prison',
        conditions: [
          {
            field: 'heatLevel',
            operator: 'GTE',
            value: 2,
            failMessage: 'Solo aplicable bajo cerco policial activo (mínimo 2★ de búsqueda)'
          }
        ],
        effects: [
          { action: 'SET_HEAT', value: 0 },
          { action: 'ADD_RESPECT', value: 10 }
        ]
      },
      {
        id: 'choice_act5_suicide_charge',
        label: '💀 Embestir el Bloqueo SWAT a Fondo sin Frenos',
        sublabel: 'Arriesgarlo todo en una embestida suicida entre el fuego y el lodo (Final Trágico)',
        dangerLevel: 'FATAL',
        targetNodeId: 'node_ending_death',
        effects: [
          { action: 'SET_HEAT', value: 5 },
          { action: 'ADD_RESPECT', value: 20 }
        ]
      }
    ]
  }
};
