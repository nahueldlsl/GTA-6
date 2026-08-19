// ============================================================================
// 🌴 VICE DYNASTY AUDIO ENGINE - UNIFIED FACADE & PROCEDURAL DSP SUITE
// ============================================================================

import { AudioContextManager } from './audio/AudioContextManager';
import { ProceduralMusicSynth } from './audio/ProceduralMusicSynth';
import { HeartbeatSynth } from './audio/HeartbeatSynth';
import { SoundEffects } from './audio/SoundEffects';

class WebAudioEngine {
  private manager: AudioContextManager;
  private musicSynth: ProceduralMusicSynth;
  private heartbeatSynth: HeartbeatSynth;
  private sfx: SoundEffects;

  constructor() {
    this.manager = new AudioContextManager();
    this.musicSynth = new ProceduralMusicSynth(this.manager);
    this.heartbeatSynth = new HeartbeatSynth(this.manager);
    this.sfx = new SoundEffects(this.manager);
  }

  public init() {
    this.manager.init();
  }

  public ensureContext() {
    this.manager.ensureContext();
  }

  public toggleMute(): boolean {
    return this.manager.toggleMute();
  }

  public get isMuted(): boolean {
    return this.manager.isMuted;
  }

  public setPhoneFilter(active: boolean) {
    this.manager.setPhoneFilter(active);
  }

  // Heartbeat synthesizer controls
  public startHeartbeat(bpm: number = 80) {
    this.heartbeatSynth.start(bpm);
  }

  public updateHeartbeatBpm(bpm: number) {
    this.heartbeatSynth.updateBpm(bpm);
  }

  public stopHeartbeat() {
    this.heartbeatSynth.stop();
  }

  // Procedural Synthwave & Radio music engine
  public startMusic(heat: number = 1) {
    this.musicSynth.start(heat);
  }

  public setRadioStation(stationId: string) {
    this.sfx.playRadioSwitch();
    this.musicSynth.setStation(stationId);
  }

  public setMusicVolume(volume0to1: number) {
    this.manager.setMusicGain(volume0to1);
  }

  public toggleMusicPlayback(play?: boolean): boolean {
    return this.musicSynth.togglePlay(play);
  }

  public setHeatLevel(heat: number) {
    this.musicSynth.setHeatLevel(heat);
  }

  public stopMusic() {
    this.musicSynth.stop();
  }

  // SFX Suite
  public playSatelliteWhoosh() {
    this.sfx.playSatelliteWhoosh();
  }

  public playDecisionImpact() {
    this.sfx.playDecisionImpact();
  }

  public playPoliceScanner() {
    this.sfx.playPoliceScanner();
  }

  public playWantedLevelChange(level: number) {
    this.sfx.playWantedLevelChange(level);
  }

  public playGlitchStatic() {
    this.sfx.playGlitchStatic();
  }

  public playViralReaction() {
    this.sfx.playViralReaction();
  }

  public playRadioSwitch() {
    this.sfx.playRadioSwitch();
  }

  public playClick() {
    this.sfx.playClick();
  }

  public playCashRegister() {
    this.sfx.playCashRegister();
  }

  public playNotification() {
    this.sfx.playNotification();
  }

  public playGunshot() {
    this.sfx.playGunshot();
  }

  public playQteSuccess() {
    this.sfx.playQteSuccess();
  }

  public playQteFail() {
    this.sfx.playQteFail();
  }
}

export const audioEngine = new WebAudioEngine();
