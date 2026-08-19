// ============================================================================
// 🌴 INSTAVICE REELS & STORIES DATA (GTA VI OFFICIAL AVIF ASSETS)
// ============================================================================

export interface StoryItem {
  id: string;
  username: string;
  handle: string;
  avatar: string;
  mediaUrl: string;
  caption: string;
  musicTrack: string;
  views: string;
  verified?: boolean;
}

export const OFFICIAL_GTA6_STORIES: StoryItem[] = [
  {
    id: 'story_01',
    username: 'Lucía & Jason',
    handle: '@lucia_jason_official',
    avatar: '/assets/gta6/People/Lucia Caminos/Lucia_Caminos_01.jpg',
    mediaUrl: '/assets/gta6/Places/Vice City/Vice_City_02.jpg',
    caption: 'Confianza ciega. La única forma de salir vivos de Leonida es juntos. 🌴🔥 #GTA6 #ViceCity #Trust',
    musicTrack: 'Tom Petty - Love Is a Long Road (Vice Sunset Mix)',
    views: '3.4M',
    verified: true
  },
  {
    id: 'story_02',
    username: 'Leonida Keys Live',
    handle: '@LeonidaKeysLive',
    avatar: '/assets/gta6/People/Jason Duval/Jason_Duval_02.jpg',
    mediaUrl: '/assets/gta6/Places/Leonida Keys/Leonida_Keys_01.jpg',
    caption: 'Crucero a 120 nudos por los Cayos de Leonida. El agua turquesa antes del gran asalto 🚤🌊 #KeysLife #Leonida',
    musicTrack: 'Leonida FM - Sunset Drive 104.5',
    views: '2.8M',
    verified: true
  },
  {
    id: 'story_03',
    username: 'Real Dimez 305',
    handle: '@RealDimezVIP',
    avatar: '/assets/gta6/People/Real Dimez/Real_Dimez_02.jpg',
    mediaUrl: '/assets/gta6/Places/Vice City/Vice_City_04.jpg',
    caption: 'Luces de neón en Ocean Drive. La fiesta no para mientras la ciudad arde 🍾✨ #ViceNightlife #305Vibes',
    musicTrack: 'Vice City Synth - Ocean Glow',
    views: '1.9M',
    verified: true
  },
  {
    id: 'story_04',
    username: 'Grassrivers Outlaws',
    handle: '@SwampAirboats',
    avatar: '/assets/gta6/People/Brian Heder/Brian_Heder_02.jpg',
    mediaUrl: '/assets/gta6/Places/Grassrivers/Grassrivers_02.jpg',
    caption: 'Esquivando caimanes y radares en lo profundo de Grassrivers. ¡Solo en Leonida State! 🐊💨 #SwampGators',
    musicTrack: 'Flash FM Classics - 1986 Remix',
    views: '1.4M',
    verified: true
  },
  {
    id: 'story_05',
    username: 'Mount Kalaga Peak',
    handle: '@KalagaRangers',
    avatar: '/assets/gta6/People/Cal Hampton/Cal_Hampton_03.jpg',
    mediaUrl: '/assets/gta6/Places/Mount Kalaga National Park/Mount_Kalaga_National_Park_01.jpg',
    caption: 'Vistas panorámicas desde el pico de Mount Kalaga. La niebla cubre el condado norte 🌲⛰️ #WildLeonida',
    musicTrack: 'K-Rose Wave - Digital Sun',
    views: '1.6M',
    verified: true
  },
  {
    id: 'story_06',
    username: 'Port Gellhorn Harbor',
    handle: '@GellhornDocks',
    avatar: '/assets/gta6/People/DreQuan Priest/DreQuan_Priest_02.jpg',
    mediaUrl: '/assets/gta6/Places/Port Gellhorn/Port_Gellhorn_01.jpg',
    caption: 'Contenedores y grúas de alta mar en Port Gellhorn. El cargamento más peligroso del año está aquí ⚓📦 #DocksSmuggle',
    musicTrack: 'Vice Underworld Beat - Heavy Syndicate',
    views: '2.3M',
    verified: true
  }
];
