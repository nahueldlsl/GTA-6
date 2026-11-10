// ============================================================================
// 🌴 VICE DYNASTY - AUDIO CONTEXT & BUS ROUTING MANAGER
// ============================================================================

export class AudioContextManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private duckGain: GainNode | null = null;
  private phoneFilter: BiquadFilterNode | null = null;
  public isMuted: boolean = false;

  public init() {
    if (this.ctx) return;
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtxClass();

    // Master bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

    // Dynamic lowpass filter for ViceOS calls / menus (450Hz muffle)
    this.phoneFilter = this.ctx.createBiquadFilter();
    this.phoneFilter.type = 'lowpass';
    this.phoneFilter.frequency.setValueAtTime(20000, this.ctx.currentTime);

    // Sub-buses
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    // Separate ducking stage so ducking never overrides the user's chosen radio volume
    this.duckGain = this.ctx.createGain();
    this.duckGain.gain.setValueAtTime(1, this.ctx.currentTime);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

    // Route: [Music -> duck] & [SFX] -> [phoneFilter] -> [masterGain] -> [destination]
    this.musicGain.connect(this.duckGain);
    this.duckGain.connect(this.phoneFilter);
    this.sfxGain.connect(this.phoneFilter);
    this.phoneFilter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  /** Smoothly lowers the radio bus (e.g. while a cinematic with dialogue plays). */
  public setDucking(active: boolean) {
    if (!this.duckGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.duckGain.gain.cancelScheduledValues(now);
    this.duckGain.gain.setTargetAtTime(active ? 0.2 : 1, now, active ? 0.25 : 0.6);
  }

  public ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getContext(): AudioContext | null {
    return this.ctx;
  }

  public getMusicGain(): GainNode | null {
    return this.musicGain;
  }

  public getSfxGain(): GainNode | null {
    return this.sfxGain;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public setPhoneFilter(active: boolean) {
    if (!this.phoneFilter || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.phoneFilter.frequency.cancelScheduledValues(now);
    if (active) {
      this.phoneFilter.frequency.setTargetAtTime(450, now, 0.15); // Muffled sound
    } else {
      this.phoneFilter.frequency.setTargetAtTime(20000, now, 0.15); // Clear sound
    }
  }

  public setMusicGain(gainValue: number) {
    if (!this.musicGain || !this.ctx) return;
    const clamped = Math.max(0, Math.min(1, gainValue));
    this.musicGain.gain.setValueAtTime(clamped * 0.5, this.ctx.currentTime);
  }
}
