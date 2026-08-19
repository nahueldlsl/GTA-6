// ============================================================================
// 🌴 VICE DYNASTY - PROCEDURAL HEARTBEAT SYNTHESIZER (Variable BPM)
// ============================================================================

import type { AudioContextManager } from './AudioContextManager';

export class HeartbeatSynth {
  private manager: AudioContextManager;
  private intervalId: number | null = null;

  constructor(manager: AudioContextManager) {
    this.manager = manager;
  }

  public start(bpm: number = 80) {
    this.stop();
    this.manager.ensureContext();
    const ctx = this.manager.getContext();
    if (!ctx) return;

    const intervalMs = (60 / bpm) * 1000;
    this.playHeartbeatThump();

    this.intervalId = window.setInterval(() => {
      this.playHeartbeatThump();
    }, intervalMs);
  }

  public updateBpm(bpm: number) {
    if (this.intervalId !== null) {
      this.start(bpm);
    }
  }

  public stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private playHeartbeatThump() {
    const ctx = this.manager.getContext();
    const sfxGain = this.manager.getSfxGain();
    if (!ctx || !sfxGain || this.manager.isMuted) return;

    const now = ctx.currentTime;

    // Double thump (Lub-Dub)
    this.triggerThump(now, 65, 0.9);
    this.triggerThump(now + 0.12, 50, 0.7);
  }

  private triggerThump(time: number, freq: number, volume: number) {
    const ctx = this.manager.getContext();
    const sfxGain = this.manager.getSfxGain();
    if (!ctx || !sfxGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(30, time + 0.09);

    gain.gain.setValueAtTime(volume * 0.8, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

    osc.connect(gain);
    gain.connect(sfxGain);

    osc.start(time);
    osc.stop(time + 0.15);
  }
}
