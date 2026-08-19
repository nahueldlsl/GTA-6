// ============================================================================
// 🌴 VICE DYNASTY: EPÍLOGOS & FINALES CANÓNICOS
// ============================================================================

import type { StoryNode } from '../../types/game';

export const EPILOGUE_NODES: Record<string, StoryNode> = {
  node_epilogue_suncoast_dawn: {
    id: 'node_epilogue_suncoast_dawn',
    act: 5,
    actTitle: 'EPÍLOGO CANÓNICO',
    chapterTitle: '🌅 FINAL: EL SOL PONIENTE',
    location: 'PLAYA APARTADA — CAYOS DE LEONIDA (AL AMANECER)',
    district: 'LEONIDA KEYS',
    gpsCoords: '24.5551° N, 81.7800° W',
    video: {
      id: 'vid_epilogue_sunset',
      title: 'El Sol Poniente sobre el Atlántico',
      url: 'island_escape',
      posterImage: '/assets/gta6/Places/Leonida Keys/Leonida_Keys_03.jpg',
      durationSec: 15,
      themeStyle: 'island_escape',
      dialogueSubtitle: 'Jason sentado en la trasera del coche limpiándose la pólvora. Lucia le entrega una botella de agua, contemplando el sol naranja sobre el Atlántico. Jason: "¿Valió la pena?" Lucia apoya su cabeza en su hombro: "Solo importa a quién conoces y qué tienes en las manos. Y por primera vez, Jason... lo tenemos todo."',
      speaker: 'LUCIA & JASON'
    },
    isEnding: true,
    endingType: 'ESCAPE',
    choices: []
  },

  node_ending_empire: {
    id: 'node_ending_empire',
    act: 5,
    actTitle: 'EPÍLOGO ALTERNATIVO 1',
    chapterTitle: '🏆 FINAL: THE NEON IMPERIUM',
    location: 'PALACIO COSTERO DE STAR ISLAND — UN AÑO DESPUÉS',
    district: 'STAR ISLAND',
    gpsCoords: '25.7780° N, 80.1520° W',
    video: {
      id: 'vid_end_empire',
      title: 'El Trono de Vice City',
      url: 'victory_neon',
      posterImage: '/assets/gta6/Places/Vice City/Vice_City_06.jpg',
      durationSec: 15,
      themeStyle: 'victory_neon',
      dialogueSubtitle: 'Jason: "Brian Heder, Boobie Ike y la policía comen de nuestra mano. Vice City y los Cayos son nuestro feudo."',
      speaker: 'JASON DUVAL'
    },
    isEnding: true,
    endingType: 'EMPIRE',
    choices: []
  },

  node_ending_prison: {
    id: 'node_ending_prison',
    act: 5,
    actTitle: 'EPÍLOGO ALTERNATIVO 2',
    chapterTitle: '⚖️ FINAL: IRON CAGE',
    location: 'PENITENCIARÍA ESTATAL DE LEONIDA',
    district: 'AMBROSIA COUNTY',
    gpsCoords: '25.7600° N, 80.2000° W',
    video: {
      id: 'vid_end_prison',
      title: 'El Precio de la Traición',
      url: 'prison_cell',
      posterImage: '/assets/gta6/Places/Ambrosia/Ambrosia_01.jpg',
      durationSec: 15,
      themeStyle: 'prison_cell',
      dialogueSubtitle: 'Fiscal: "El acusado es sentenciado a prisión federal. En Leonida, nadie se retira gratis."',
      speaker: 'JUEZ FEDERAL'
    },
    isEnding: true,
    endingType: 'PRISON',
    choices: []
  },

  node_ending_death: {
    id: 'node_ending_death',
    act: 5,
    actTitle: 'EPÍLOGO ALTERNATIVO 3',
    chapterTitle: '💀 FINAL: THE GRASSRIVERS GRAVE',
    location: 'PANTANOS DE GRASSRIVERS — RUTA PERDIDA',
    district: 'GRASSRIVERS',
    gpsCoords: '25.6800° N, 80.5500° W',
    video: {
      id: 'vid_end_death',
      title: 'Humo en el Agua',
      url: 'swamp_chase',
      posterImage: '/assets/gta6/Places/Mount Kalaga National Park/Mount_Kalaga_National_Park_01.jpg',
      durationSec: 15,
      themeStyle: 'swamp_chase',
      dialogueSubtitle: 'El coche arde en el barro. La ambición desmedida lo consumió todo en la noche de Leonida.',
      speaker: 'NARRADOR TRÁGICO'
    },
    isEnding: true,
    endingType: 'DEATH',
    choices: []
  }
};
