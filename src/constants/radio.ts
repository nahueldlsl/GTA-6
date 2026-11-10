// ============================================================================
// 🌴 VICE DYNASTY - LEONIDA STEREO RADIO STATIONS REGISTRY (DRY Single Source of Truth)
// ============================================================================

export interface RadioStationData {
  id: string;
  name: string;
  frequency: string;
  genre: string;
  currentTrack: string;
  artist: string;
  coverImage: string;
  themeColor: string;
  accentBg: string;
  src: string;
}

export const OFFICIAL_RADIO_STATIONS: RadioStationData[] = [
  {
    id: 'station_rock',
    name: 'Vice City Rock Radio',
    frequency: '99.5 FM',
    genre: 'Classic Southern Rock & Highway Anthems',
    currentTrack: 'Love Is a Long Road',
    artist: 'Tom Petty',
    coverImage: '/assets/gta6/Places/Leonida Keys/Leonida_Keys_01.jpg',
    themeColor: 'from-orange-600 to-red-600',
    accentBg: 'border-orange-500/50 bg-orange-950/30',
    src: '/music/tom_petty.mp3'
  },
  {
    id: 'station_wave',
    name: 'Wave 103',
    frequency: '103.0 FM',
    genre: 'Indie, Alternative & Psych Rock',
    currentTrack: 'Loser',
    artist: 'Tame Impala',
    coverImage: '/assets/gta6/Places/Vice City/Vice_City_05.jpg',
    themeColor: 'from-cyan-600 to-blue-600',
    accentBg: 'border-cyan-500/50 bg-cyan-950/30',
    src: '/music/tame_impala.mp3'
  },
  {
    id: 'station_latino',
    name: 'Radio Espantoso / Vice Latino',
    frequency: '97.5 FM',
    genre: 'Urbano Latino & Reggaeton Hits',
    currentTrack: 'EoO (DeBÍ TiRAR MáS FOToS)',
    artist: 'Bad Bunny',
    coverImage: '/assets/gta6/Places/Vice City/Vice_City_02.jpg',
    themeColor: 'from-amber-500 to-yellow-600',
    accentBg: 'border-amber-500/50 bg-amber-950/30',
    src: '/music/bad_bunny.mp3'
  },
  {
    id: 'station_flash',
    name: 'Flash FM / Leonida Hits',
    frequency: '102.5 FM',
    genre: 'Soul, Neo-Soul & Pop Hits',
    currentTrack: "Feet Don't Fail Me Now",
    artist: 'Joy Crookes',
    coverImage: '/assets/gta6/Places/Vice City/Vice_City_04.jpg',
    themeColor: 'from-pink-600 to-purple-600',
    accentBg: 'border-pink-500/50 bg-pink-950/30',
    src: '/music/joy_crookes.mp3'
  }
];

export const STATION_TRACK_MAP: Record<string, { src: string; title: string; artist: string }> =
  OFFICIAL_RADIO_STATIONS.reduce((acc, station) => {
    acc[station.id] = {
      src: station.src,
      title: station.currentTrack,
      artist: station.artist
    };
    return acc;
  }, {} as Record<string, { src: string; title: string; artist: string }>);
