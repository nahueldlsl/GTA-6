// ============================================================================
// 🌴 VICE DYNASTY AUDIO ENGINE - UNIFIED FACADE & PROCEDURAL DSP SUITE
// ============================================================================

import { AudioContextManager } from './audio/AudioContextManager';
import { ProceduralMusicSynth } from './audio/ProceduralMusicSynth';
import { HeartbeatSynth } from './audio/HeartbeatSynth';
import { SoundEffects } from './audio/SoundEffects';
import { PoliceDispatcherRadio } from './audio/PoliceDispatcherRadio';
import type { DispatchTransmission } from './audio/PoliceDispatcherRadio';
import { VehicleEngineSynth } from './audio/VehicleEngineSynth';

export type { DispatchTransmission };

class WebAudioEngine {
  private manager: AudioContextManager;
  private musicSynth: ProceduralMusicSynth;
  private heartbeatSynth: HeartbeatSynth;
  private sfx: SoundEffects;
  private dispatcher: PoliceDispatcherRadio;
  private engineSynth: VehicleEngineSynth;

  constructor() {
    this.manager = new AudioContextManager();
    this.musicSynth = new ProceduralMusicSynth(this.manager);
    this.heartbeatSynth = new HeartbeatSynth(this.manager);
    this.sfx = new SoundEffects(this.manager);
    this.dispatcher = new PoliceDispatcherRadio(this.manager);
    this.engineSynth = new VehicleEngineSynth(this.manager);
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

  /** Auto-ducking: lowers the radio to ~20% while cinematics/dialogue play. */
  public duckMusic(active: boolean) {
    this.manager.setDucking(active);
  }

  /** Pauses/resumes the radio together with the game pause menu. */
  public setGamePaused(paused: boolean) {
    this.musicSynth.setGamePaused(paused);
  }

  public get isRadioPlaying(): boolean {
    return this.musicSynth.playing;
  }

  // Police dispatcher radio (10-codes)
  public policeDispatch(heatLevel: number) {
    this.dispatcher.transmit(heatLevel);
  }

  public subscribeDispatch(listener: (t: DispatchTransmission) => void): () => void {
    return this.dispatcher.subscribe(listener);
  }

  // Free-roam driving SFX
  public startEngine() {
    this.engineSynth.start();
  }

  public updateEngine(speedRatio: number, throttle: number) {
    this.engineSynth.update(speedRatio, throttle);
  }

  public stopEngine() {
    this.engineSynth.stop();
  }

  public setSiren(active: boolean, proximity: number = 1) {
    this.engineSynth.setSiren(active, proximity);
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
