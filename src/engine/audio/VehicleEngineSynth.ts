// ============================================================================
// 🏎️ VICE DYNASTY - PROCEDURAL VEHICLE ENGINE + POLICE SIREN SYNTH (free roam)
// ============================================================================
// Engine: two detuned sawtooth oscillators through a lowpass whose pitch/cutoff
// follow speed & throttle (V8-ish rumble). Siren: LFO-swept "wail" whose volume
// follows the distance to the closest pursuing patrol car.

import type { AudioContextManager } from './AudioContextManager';

export class VehicleEngineSynth {
  private manager: AudioContextManager;
  private oscA: OscillatorNode | null = null;
  private oscB: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private engineGain: GainNode | null = null;

  private sirenOsc: OscillatorNode | null = null;
  private sirenLfo: OscillatorNode | null = null;
  private sirenLfoGain: GainNode | null = null;
  private sirenGain: GainNode | null = null;

  constructor(manager: AudioContextManager) {
    this.manager = manager;
  }

  public start() {
    this.manager.ensureContext();
    const ctx = this.manager.getContext();
    const sfx = this.manager.getSfxGain();
    if (!ctx || !sfx || this.oscA) return;
    const now = ctx.currentTime;

    this.oscA = ctx.createOscillator();
    this.oscB = ctx.createOscillator();
    this.oscA.type = 'sawtooth';
    this.oscB.type = 'sawtooth';
    this.oscA.frequency.value = 38;
    this.oscB.frequency.value = 38.7;

    this.filter = ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 280;
    this.filter.Q.value = 4;

    this.engineGain = ctx.createGain();
    this.engineGain.gain.setValueAtTime(0.0001, now);
    this.engineGain.gain.exponentialRampToValueAtTime(0.09, now + 0.4);

    this.oscA.connect(this.filter);
    this.oscB.connect(this.filter);
    this.filter.connect(this.engineGain).connect(sfx);
    this.oscA.start(now);
    this.oscB.start(now);

    // Siren chain (silent until enabled)
    this.sirenOsc = ctx.createOscillator();
    this.sirenOsc.type = 'triangle';
    this.sirenOsc.frequency.value = 900;
    this.sirenLfo = ctx.createOscillator();
    this.sirenLfo.frequency.value = 0.45;
    this.sirenLfoGain = ctx.createGain();
    this.sirenLfoGain.gain.value = 320;
    this.sirenLfo.connect(this.sirenLfoGain).connect(this.sirenOsc.frequency);
    this.sirenGain = ctx.createGain();
    this.sirenGain.gain.value = 0;
    this.sirenOsc.connect(this.sirenGain).connect(sfx);
    this.sirenOsc.start(now);
    this.sirenLfo.start(now);
  }

  /** speedRatio 0..1 (abs speed / max speed), throttle 0..1 */
  public update(speedRatio: number, throttle: number) {
    const ctx = this.manager.getContext();
    if (!ctx || !this.oscA || !this.oscB || !this.filter || !this.engineGain) return;
    const now = ctx.currentTime;
    // Fake gearbox: RPM rises and drops back at each "gear" threshold
    const gears = 4;
    const gearPos = (speedRatio * gears) % 1;
    const gear = Math.min(gears - 1, Math.floor(speedRatio * gears));
    const rpm = 0.25 + gearPos * 0.6 + gear * 0.04 + throttle * 0.12;
    const base = 34 + rpm * 70;
    this.oscA.frequency.setTargetAtTime(base, now, 0.06);
    this.oscB.frequency.setTargetAtTime(base * 1.018, now, 0.06);
    this.filter.frequency.setTargetAtTime(220 + rpm * 900 + throttle * 400, now, 0.08);
    this.engineGain.gain.setTargetAtTime(this.manager.isMuted ? 0 : 0.05 + throttle * 0.05 + speedRatio * 0.03, now, 0.1);
  }

  public setSiren(active: boolean, proximity: number = 1) {
    const ctx = this.manager.getContext();
    if (!ctx || !this.sirenGain) return;
    const target = active && !this.manager.isMuted ? 0.015 + 0.05 * Math.max(0, Math.min(1, proximity)) : 0;
    this.sirenGain.gain.setTargetAtTime(target, ctx.currentTime, 0.15);
  }

  public stop() {
    const ctx = this.manager.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const nodes = [this.oscA, this.oscB, this.sirenOsc, this.sirenLfo];
    if (this.engineGain) this.engineGain.gain.setTargetAtTime(0.0001, now, 0.1);
    if (this.sirenGain) this.sirenGain.gain.setTargetAtTime(0, now, 0.1);
    nodes.forEach((n) => {
      try {
        n?.stop(now + 0.4);
      } catch {
        // already stopped
      }
    });
    this.oscA = this.oscB = this.sirenOsc = this.sirenLfo = null;
    this.filter = this.engineGain = this.sirenGain = this.sirenLfoGain = null;
  }
}
