// ============================================================================
// 🌴 VICE DYNASTY - MULTI-STATION MP3 RADIO AUDIO SYSTEM (LEONIDA STEREO)
// ============================================================================

import type { AudioContextManager } from './AudioContextManager';
import { STATION_TRACK_MAP } from '../../constants/radio';

export { STATION_TRACK_MAP };

export class ProceduralMusicSynth {
  private manager: AudioContextManager;
  private currentStationId: string = 'station_rock';
  private audioElement: HTMLAudioElement | null = null;
  private audioSource: MediaElementAudioSourceNode | null = null;
  private isPlaying: boolean = false;

  constructor(manager: AudioContextManager) {
    this.manager = manager;
  }

  public start(_heat: number = 1) {
    this.isPlaying = true;
    this.playCurrentStation();
  }

  public setStation(stationId: string) {
    this.currentStationId = stationId;
    if (this.isPlaying) {
      this.playCurrentStation();
    }
  }

  public togglePlay(play?: boolean): boolean {
    const nextState = play !== undefined ? play : !this.isPlaying;
    this.isPlaying = nextState;

    if (this.isPlaying) {
      this.playCurrentStation();
    } else {
      this.stopAllAudio();
    }
    return this.isPlaying;
  }

  public setHeatLevel(_heat: number) {
    // Dynamic station filtering or DSP if wanted
  }

  public stop() {
    this.isPlaying = false;
    this.stopAllAudio();
  }

  /**
   * Game-level pause (pause menu). Pauses the element without forgetting that the
   * radio was on, so it resumes exactly where it was when the game is unpaused.
   */
  public setGamePaused(paused: boolean) {
    if (!this.audioElement) return;
    if (paused) {
      this.audioElement.pause();
    } else if (this.isPlaying) {
      this.audioElement.play().catch(() => {});
    }
  }

  public get playing(): boolean {
    return this.isPlaying;
  }

  private stopAllAudio() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  private playCurrentStation() {
    this.stopAllAudio();
    this.manager.ensureContext();
    const ctx = this.manager.getContext();
    const musicGain = this.manager.getMusicGain();

    const stationInfo = STATION_TRACK_MAP[this.currentStationId] || STATION_TRACK_MAP.station_rock;

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.loop = true;
      this.audioElement.preload = 'auto';

      if (ctx && musicGain) {
        try {
          this.audioSource = ctx.createMediaElementSource(this.audioElement);
          this.audioSource.connect(musicGain);
        } catch {
          // Fallback
        }
      }
    }

    if (this.audioElement.src !== window.location.origin + stationInfo.src && !this.audioElement.src.endsWith(stationInfo.src)) {
      this.audioElement.src = stationInfo.src;
      this.audioElement.load();
    }

    this.audioElement.play().catch((e) => {
      console.log('Radio audio playback waiting for user interaction:', e);
    });
  }
}
