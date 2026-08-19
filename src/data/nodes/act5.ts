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
      durationSec: 4.5,
      defaultChoiceId: 'choice_act5_rush_to_car'
    },
    choices: [
      {
        id: 'choice_act5_rush_to_car',
        label: '🏎️ Tomar el Volante del Muscle Car con los $3,000,000',
        sublabel: 'Jason hace derrapar el vehículo entre el cerco de patrullas de la Leonida Police',
        dangerLevel: 'HIGH',
        targetNodeId: 'node_act5_grassrivers_escape',
        effects: [
          { action: 'ADD_DIRTY_CASH', value: 3000000 },
          { action: 'ADD_HEAT', value: 3 },
          { action: 'ADD_LOYALTY', target: 'lucia', value: 20 }
        ]
      },
      {
        id: 'choice_act5_cover_fire',
        label: '💥 Fuego de Supresión y Escape Hacia los Pantanos',
        sublabel: 'Lucia revienta los faros de las patrullas mientras Raul escapa por su cuenta',
        dangerLevel: 'EXTREME',
        targetNodeId: 'node_act5_grassrivers_escape',
        effects: [
          { action: 'ADD_DIRTY_CASH', value: 3000000 },
          { action: 'ADD_RESPECT', value: 30 },
          { action: 'ADD_HEAT', value: 4 }
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
        sublabel: 'Dejar atrás las sirenas y conducir hacia una playa apartada al amanecer',
        dangerLevel: 'SAFE',
        targetNodeId: 'node_epilogue_suncoast_dawn',
        effects: [
          { action: 'SET_HEAT', value: 0 },
          { action: 'ADD_CLEAN_CASH', value: 1500000 },
          { action: 'ADD_LOYALTY', target: 'lucia', value: 30 }
        ]
      },
      {
        id: 'choice_act5_stash_cash',
        label: '💼 Asegurar el Maletín en un Alijo Clandestino',
        sublabel: 'Garantizar el botín antes de la cita final en la costa del Atlántico',
        dangerLevel: 'SAFE',
        targetNodeId: 'node_epilogue_suncoast_dawn',
        effects: [
          { action: 'SET_HEAT', value: 0 },
          { action: 'ADD_CLEAN_CASH', value: 1500000 },
          { action: 'ADD_RESPECT', value: 25 }
        ]
      }
    ]
  }
};
