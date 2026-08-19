// ============================================================================
// 🌴 VICE DYNASTY - PROCEDURAL DSP SOUND EFFECTS SUITE
// ============================================================================

import type { AudioContextManager } from './AudioContextManager';

export class SoundEffects {
  private manager: AudioContextManager;

  constructor(manager: AudioContextManager) {
    this.manager = manager;
  }

  // 1. SATELLITE SNAP ZOOM WHOOSH (GTA VI Camera Pullback)
  public playSatelliteWhoosh() {
    this.manager.ensureContext();
    const ctx = this.manager.getContext();
    const sfxGain = this.manager.getSfxGain();
    if (!ctx || !sfxGain || this.manager.isMuted) return;
    const now = ctx.currentTime;

    const bufferSize = Math.floor(ctx.sampleRate * 0.7);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.35);
    filter.frequency.exponentialRampToValueAtTime(150, now + 0.7);
    filter.Q.setValueAtTime(3.0, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.8, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, now);
    subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.65);
    subGain.gain.setValueAtTime(0.6, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(sfxGain);

    subOsc.connect(subGain);
    subGain.connect(sfxGain);

    noise.start(now);
    noise.stop(now + 0.72);
    subOsc.start(now);
    subOsc.stop(now + 0.68);
  }

  // 2. DECISION IMPACT BASS DROP (Sub-bass 808 + metallic strike)
  public playDecisionImpact() {
    this.manager.ensureContext();
    const ctx = this.manager.getContext();
    const sfxGain = this.manager.getSfxGain();
    if (!ctx || !sfxGain || this.manager.isMuted) return;
    const now = ctx.currentTime;

    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(110, now);
    subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.5);

    subGain.gain.setValueAtTime(0.9, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    const chimeOsc = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chimeOsc.type = 'triangle';
    chimeOsc.frequency.setValueAtTime(1800, now);
    chimeOsc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
    chimeGain.gain.setValueAtTime(0.4, now);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    subOsc.connect(subGain);
    subGain.connect(sfxGain);
    chimeOsc.connect(chimeGain);
    chimeGain.connect(sfxGain);

    subOsc.start(now);
    subOsc.stop(now + 0.62);
    chimeOsc.start(now);
    chimeOsc.stop(now + 0.1);
  }

  // 3. POLICE DISPATCHER SCANNER CHATTER & SQUELCH
  public playPoliceScanner() {
    this.manager.ensureContext();
    const ctx = this.manager.getContext();
    const sfxGain = this.manager.getSfxGain();
    if (!ctx || !sfxGain || this.manager.isMuted) return;
    const now = ctx.currentTime;

    const tone = ctx.createOscillator();
    const toneGain = ctx.createGain();
    tone.type = 'sine';
    tone.frequency.setValueAtTime(950, now);
    tone.frequency.setValueAtTime(1250, now + 0.04);
    toneGain.gain.setValueAtTime(0.25, now);
    toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    tone.connect(toneGain);
    toneGain.connect(sfxGain);
    tone.start(now);
    tone.stop(now + 0.12);

    const bufferSize = Math.floor(ctx.sampleRate * 0.25);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now + 0.1);
    filter.Q.setValueAtTime(4.0, now + 0.1);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18, now + 0.1);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(sfxGain);

    noise.start(now + 0.1);
    noise.stop(now + 0.35);
  }

  // 4. WANTED LEVEL SIREN BURST
  public playWantedLevelChange(level: number) {
    this.manager.ensureContext();
    const ctx = this.manager.getContext();
    const sfxGain = this.manager.getSfxGain();
    if (!ctx || !sfxGain || this.manager.isMuted) return;
    const now = ctx.currentTime;

    const siren = ctx.createOscillator();
    const sirenGain = ctx.createGain();
    siren.type = 'sawtooth';
    siren.frequency.setValueAtTime(550, now);
    siren.frequency.linearRampToValueAtTime(950, now + 0.2);
    siren.frequency.linearRampToValueAtTime(550, now + 0.4);

    sirenGain.gain.setValueAtTime(0.35, now);
    sirenGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

    siren.connect(sirenGain);
    sirenGain.connect(sfxGain);
    siren.start(now);
    siren.stop(now + 0.5);

    if (level >= 3) {
      setTimeout(() => this.playPoliceScanner(), 300);
    }
  }

  // 5. GLITCH DIGITAL ARTIFACTING
  public playGlitchStatic() {
    this.manager.ensureContext();
    const ctx = this.manager.getContext();
    const sfxGain = this.manager.getSfxGain();
    if (!ctx || !sfxGain || this.manager.isMuted) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.setValueAtTime(880, now + 0.03);
    osc.frequency.setValueAtTime(60, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  // 6. SOCIAL REACTION POP (Vice Viral)
  public playViralReaction() {
    this.manager.ensureContext();
    const ctx = this.manager.getContext();
    const sfxGain = this.manager.getSfxGain();
    if (!ctx || !sfxGain || this.manager.isMuted) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  // 7. RADIO STATION SWITCH (Analog dial squelch)
  public playRadioSwitch() {
    this.manager.ensureContext();
    const ctx = this.manager.getContext();
    const sfxGain = this.manager.getSfxGain();
    if (!ctx || !sfxGain || this.manager.isMuted) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(1200, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playClick() {
    this.manager.ensureContext();
    const ctx = this.manager.getContext();
    const sfxGain = this.manager.getSfxGain();
    if (!ctx || !sfxGain || this.manager.isMuted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playCashRegister() {
    this.manager.ensureContext();
    const ctx = this.manager.getContext();
    const sfxGain = this.manager.getSfxGain();
    if (!ctx || !sfxGain || this.manager.isMuted) return;
    const now = ctx.currentTime;

    [2400, 3200, 4800].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.04);
      gain.gain.setValueAtTime(0.2, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.3);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.32);
    });
  }

  public playNotification() {
    this.manager.ensureContext();
    const ctx = this.manager.getContext();
    const sfxGain = this.manager.getSfxGain();
    if (!ctx || !sfxGain || this.manager.isMuted) return;
    const now = ctx.currentTime;

    [880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.25, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.26);
    });
  }

  public playGunshot() {
    this.manager.ensureContext();
    const ctx = this.manager.getContext();
    const sfxGain = this.manager.getSfxGain();
    if (!ctx || !sfxGain || this.manager.isMuted) return;
    const now = ctx.currentTime;

    const bufferSize = Math.floor(ctx.sampleRate * 0.3);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.25);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(sfxGain);

    noise.start(now);
    noise.stop(now + 0.3);
  }

  public playQteSuccess() {
    this.manager.ensureContext();
    const ctx = this.manager.getContext();
    const sfxGain = this.manager.getSfxGain();
    if (!ctx || !sfxGain || this.manager.isMuted) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.3, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.2);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.22);
    });
  }

  public playQteFail() {
    this.manager.ensureContext();
    const ctx = this.manager.getContext();
    const sfxGain = this.manager.getSfxGain();
    if (!ctx || !sfxGain || this.manager.isMuted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(now);
    osc.stop(now + 0.46);
  }
}
