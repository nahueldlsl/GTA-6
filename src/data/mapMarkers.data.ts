// ============================================================================
// 🌴 LEONIDA MAP MARKERS — shared by the satellite map modal and the playable 2D map
// ============================================================================

export interface MapMarker {
  id: string;
  type: 'MAIN_MISSION' | 'CONTRACT' | 'SERVICE';
  title: string;
  subtitle: string;
  district: string;
  region: 'VICE_CITY' | 'LEONIDA_KEYS' | 'PORT_GELLHORN' | 'AMBROSIA' | 'GRASSRIVERS' | 'MOUNT_KALAGA';
  xPct: number; // 0-100% position on map
  yPct: number;
  nodeId?: string;
  reward?: string;
  /** Actual payout applied to the store when a CONTRACT is completed */
  payout?: { clean?: number; dirty?: number; respect?: number; heat?: number };
  characterAvatar?: string;
  characterName?: string;
  image?: string;
  description: string;
  dangerLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
}

export const LEONIDA_MARKERS: MapMarker[] = [
  // ACT I - Leonida Keys & Port Gellhorn
  {
    id: 'poi_act1_keys',
    type: 'MAIN_MISSION',
    title: 'ACTO I: Taller de Brian Heder',
    subtitle: 'El Asfalto de los Cayos & La Sangría de Lori',
    district: 'Leonida Keys',
    region: 'LEONIDA_KEYS',
    xPct: 28,
    yPct: 84,
    nodeId: 'node_act1_keys_workshop',
    reward: '$15,000 + Alquiler Gratis',
    characterAvatar: '/assets/gta6/People/Brian Heder/Brian_Heder_01.jpg',
    characterName: 'Brian Heder & Lori',
    image: '/assets/gta6/Places/Leonida Keys/Leonida_Keys_01.jpg',
    description: 'Encuentro con Brian Heder masticando su puro en el taller náutico y Lori sirviendo sangría. Recibe el encargo para cobrar la deuda de la lancha en Port Gellhorn.',
    dangerLevel: 'LOW'
  },
  {
    id: 'poi_act1_gellhorn',
    type: 'MAIN_MISSION',
    title: 'ACTO I: Cobro en la Marina',
    subtitle: 'Muelles de Reparación de Port Gellhorn',
    district: 'Port Gellhorn Marina',
    region: 'PORT_GELLHORN',
    xPct: 18,
    yPct: 62,
    nodeId: 'node_act1_port_gellhorn_errand',
    reward: '$25,000 + Lancha Rápida',
    characterAvatar: '/assets/gta6/People/Jason Duval/Jason_Duval_01.jpg',
    characterName: 'Jason Duval',
    image: '/assets/gta6/Places/Port Gellhorn/Port_Gellhorn_01.jpg',
    description: 'Confrontación en los muelles con el moroso de la lancha rápida. Asústalo lo suficiente para recuperar el dinero sin llamar a la policía.',
    dangerLevel: 'MEDIUM'
  },

  // ACT II - Ambrosia Prison & Dive Bar
  {
    id: 'poi_act2_prison',
    type: 'MAIN_MISSION',
    title: 'ACTO II: Penitenciaría de Leonida',
    subtitle: 'Hierro, Libertad y la Postal de Liberty City',
    district: 'Ambrosia County',
    region: 'AMBROSIA',
    xPct: 44,
    yPct: 32,
    nodeId: 'node_act2_prison_release',
    reward: '+15 Respeto',
    characterAvatar: '/assets/gta6/People/Lucia Caminos/Lucia_Caminos_01.jpg',
    characterName: 'Lucia Caminos',
    image: '/assets/gta6/Places/Ambrosia/Ambrosia_01.jpg',
    description: 'Salida de Lucia tras cumplir su condena bajo el sol abrasador. La promesa de jugar solo partidas inteligentes.',
    dangerLevel: 'SAFE'
  },
  {
    id: 'poi_act2_bar',
    type: 'MAIN_MISSION',
    title: 'ACTO II: Bar de las Afueras',
    subtitle: 'Encuentro, Pelea de Botellas y Pacto de Fuego',
    district: 'Vice Outskirts',
    region: 'VICE_CITY',
    xPct: 64,
    yPct: 52,
    nodeId: 'node_act2_dive_bar_fight',
    reward: 'Alianza Jason & Lucia',
    characterAvatar: '/assets/gta6/People/Jason Duval/Jason_Duval_03.jpg',
    characterName: 'Jason & Lucia',
    image: '/assets/gta6/Places/Vice City/Vice_City_01.jpg',
    description: 'Pelea de bar contra matones locales. Desarme táctico y nacimiento del pacto de lealtad indestructible.',
    dangerLevel: 'HIGH'
  },

  // ACT III - Jack of Hearts & Boobie Ike
  {
    id: 'poi_act3_club',
    type: 'MAIN_MISSION',
    title: 'ACTO III: Club Jack of Hearts',
    subtitle: 'Boobie Ike, Dre\'Quan Priest & Real Dimez',
    district: 'Downtown Vice City',
    region: 'VICE_CITY',
    xPct: 76,
    yPct: 46,
    nodeId: 'node_act3_jack_of_hearts',
    reward: '$75,000 Limpios',
    characterAvatar: '/assets/gta6/People/Boobie Ike/Boobie_Ike_01.jpg',
    characterName: 'Boobie Ike & Dre\'Quan',
    image: '/assets/gta6/Places/Vice City/Vice_City_04.jpg',
    description: 'El corazón nocturno de Vice City. Venta de rutas marítimas de Brian Heder a cambio de capital y contactos financieros.',
    dangerLevel: 'LOW'
  },

  // ACT IV - Ambrosia Cuban Diner & First National
  {
    id: 'poi_act4_diner',
    type: 'MAIN_MISSION',
    title: 'ACTO IV: Restaurante en Ambrosia',
    subtitle: 'Café Cubano y la Oferta de Raul Bautista',
    district: 'Ambrosia Norte',
    region: 'AMBROSIA',
    xPct: 48,
    yPct: 24,
    nodeId: 'node_act4_ambrosia_restaurant',
    reward: 'Plan del Golpe First National',
    characterAvatar: '/assets/gta6/People/Raul Bautista/Raul_Bautista_01.jpg',
    characterName: 'Raul Bautista',
    image: '/assets/gta6/Places/Ambrosia/Ambrosia_02.jpg',
    description: 'Reunión en restaurante cubano con Raul Bautista para planear el asalto de $3,000,000 al First National Bank.',
    dangerLevel: 'HIGH'
  },

  // ACT V - Bank Assault & Swamp Escape
  {
    id: 'poi_act5_bank',
    type: 'MAIN_MISSION',
    title: 'ACTO V: Asalto al First National',
    subtitle: 'Niebla, C4 y Ruptura Blindada',
    district: 'Ambrosia Metro',
    region: 'AMBROSIA',
    xPct: 46,
    yPct: 28,
    nodeId: 'node_act5_bank_assault',
    reward: '$3,000,000 en Efectivo',
    characterAvatar: '/assets/gta6/People/Lucia Caminos/Lucia_Caminos_05.jpg',
    characterName: 'Escuadrón del Asalto',
    image: '/assets/gta6/Places/Ambrosia/Ambrosia_04.jpg',
    description: 'Atraco a gran escala. Detonación de C4 en puerta trasera y recogida de bolsas de dinero bajo tiroteo.',
    dangerLevel: 'EXTREME'
  },
  {
    id: 'poi_act5_swamp',
    type: 'MAIN_MISSION',
    title: 'ACTO V: Fuga en Grassrivers',
    subtitle: 'Persecución en Pantanos de Caimanes',
    district: 'Grassrivers Swamps',
    region: 'GRASSRIVERS',
    xPct: 36,
    yPct: 58,
    nodeId: 'node_act5_grassrivers_escape',
    reward: 'Fuga Exitosa + 0 Búsqueda',
    characterAvatar: '/assets/gta6/People/Jason Duval/Jason_Duval_05.jpg',
    characterName: 'Jason & Lucia',
    image: '/assets/gta6/Places/Grassrivers/Grassrivers_01.jpg',
    description: 'Derrapes nocturnos en Muscle Car a través de pantanos de caimanes y rutas clandestinas hasta perder a las patrullas.',
    dangerLevel: 'HIGH'
  },

  // EPILOGUE
  {
    id: 'poi_epilogue_keys',
    type: 'MAIN_MISSION',
    title: 'EPÍLOGO: El Sol Poniente',
    subtitle: 'Amanecer en la Playa de los Cayos',
    district: 'Leonida Keys South',
    region: 'LEONIDA_KEYS',
    xPct: 32,
    yPct: 90,
    nodeId: 'node_epilogue_suncoast_dawn',
    reward: 'Victoria Canónica',
    characterAvatar: '/assets/gta6/People/Lucia Caminos/Lucia_Caminos_06.jpg',
    characterName: 'Lucia & Jason',
    image: '/assets/gta6/Places/Leonida Keys/Leonida_Keys_03.jpg',
    description: 'El fin del viaje. Jason y Lucia descansan con el botín contemplando el sol naranja sobre el Atlántico.',
    dangerLevel: 'SAFE'
  },

  // SECONDARY CONTRACTS
  {
    id: 'poi_contract_speed',
    type: 'CONTRACT',
    title: 'Contrato: Carrera Callejera en Ocean Drive',
    subtitle: 'Prueba de Velocidad con Apuestas Altas',
    district: 'Ocean Drive Beach',
    region: 'VICE_CITY',
    xPct: 82,
    yPct: 56,
    reward: '$35,000 Limpios',
    payout: { clean: 35000, respect: 5, heat: 1 },
    characterAvatar: '/assets/gta6/People/Real Dimez/Real_Dimez_01.jpg',
    characterName: 'Club de Carreras Vice',
    image: '/assets/gta6/Places/Vice City/Vice_City_02.jpg',
    description: 'Compite con el Muscle Car por la costa iluminada de Ocean Drive frente a los superdeportivos locales.',
    dangerLevel: 'MEDIUM'
  },
  {
    id: 'poi_contract_smuggle',
    type: 'CONTRACT',
    title: 'Contrato: Cajas de Contrabando de Brian',
    subtitle: 'Ruta Clandestina hacia Port Gellhorn',
    district: 'Canal de Gellhorn',
    region: 'PORT_GELLHORN',
    xPct: 14,
    yPct: 70,
    reward: '$20,000 Sucio',
    payout: { dirty: 20000, respect: 4 },
    characterAvatar: '/assets/gta6/People/Brian Heder/Brian_Heder_01.jpg',
    characterName: 'Brian Heder',
    image: '/assets/gta6/Places/Port Gellhorn/Port_Gellhorn_03.jpg',
    description: 'Transporta tres cajas de repuestos no declarados sin alertar a los guardacostas de Leonida.',
    dangerLevel: 'MEDIUM'
  },

  // SERVICES & GARAGES
  {
    id: 'poi_service_tuner',
    type: 'SERVICE',
    title: 'Taller de Tuneo & Blindaje Ambrosia',
    subtitle: 'Modificaciones V8, Nitro y Cristales Blindados',
    district: 'Ambrosia Industrial',
    region: 'AMBROSIA',
    xPct: 40,
    yPct: 38,
    characterAvatar: '/assets/gta6/People/Cal Hampton/Cal_Hampton_01.jpg',
    characterName: 'Cal Hampton Customs',
    image: '/assets/gta6/Places/Ambrosia/Ambrosia_03.jpg',
    description: 'Mejora la suspensión y el motor del Muscle Car para resistir impactos policiales y barro de pantano.',
    dangerLevel: 'SAFE'
  },
  {
    id: 'poi_service_mount',
    type: 'SERVICE',
    title: 'Mirador de Mount Kalaga',
    subtitle: 'Parque Nacional y Rutas Off-Road',
    district: 'Mount Kalaga Peak',
    region: 'MOUNT_KALAGA',
    xPct: 66,
    yPct: 16,
    characterAvatar: '/assets/gta6/People/Jason Duval/Jason_Duval_01.jpg',
    characterName: 'Ranger Station',
    image: '/assets/gta6/Places/Mount Kalaga National Park/Mount_Kalaga_National_Park_01.jpg',
    description: 'Punto más alto del estado de Leonida. Vista despejada para vigilar movimientos aéreos de la policía.',
    dangerLevel: 'SAFE'
  }
];
