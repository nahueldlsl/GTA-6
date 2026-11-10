// ============================================================================
// 🚨 VICE DYNASTY - PROCEDURAL POLICE DISPATCHER RADIO (10-codes, squelch, static)
// ============================================================================
// Synthesises a band-limited police radio transmission entirely with WebAudio
// (squelch "kerchunk", hiss bed, roger beep) and, when available, an optional
// low-volume Spanish voice via the Web Speech API. Every transmission is also
// broadcast to subscribers so the HUD can render it as a radio subtitle.

import type { AudioContextManager } from './AudioContextManager';

export interface DispatchTransmission {
  id: number;
  code: string;
  unit: string;
  text: string;
}

type Listener = (t: DispatchTransmission) => void;

const UNITS = ['Unidad 4-Adam-12', 'Unidad 7-Lincoln-3', 'Aire-1 (helicóptero)', 'Unidad K9-22', 'Patrulla Costera 5'];

const STREETS = [
  'Ocean Drive',
  'el puente de los Cayos',
  'la Ruta 1 de Leonida',
  'los muelles de Port Gellhorn',
  'el centro de Vice City',
  'la autopista de Ambrosia',
  'los pantanos de Grassrivers'
];

const MESSAGES_BY_HEAT: Record<number, Array<{ code: string; text: (s: string) => string }>> = {
  1: [
    { code: '10-37', text: (s) => `Vehículo sospechoso reportado cerca de ${s}. Unidades cercanas, verifiquen.` },
    { code: '10-66', text: (s) => `Actividad sospechosa en ${s}. Mantengan distancia y reporten.` }
  ],
  2: [
    { code: '10-80', text: (s) => `Persecución en curso por ${s}. Sospechoso en vehículo de alta potencia.` },
    { code: '10-38', text: (s) => `Intentando detener al sospechoso en ${s}. Solicito apoyo.` }
  ],
  3: [
    { code: '10-33', text: (s) => `Emergencia. Disparos reportados en ${s}. Todas las unidades disponibles respondan.` },
    { code: '10-78', text: (s) => `Necesito refuerzos urgentes en ${s}. El sospechoso está armado.` }
  ],
  4: [
    { code: '10-99', text: (s) => `Fuga a alta velocidad por ${s}. Autorizado el uso de bloqueos de carretera.` },
    { code: '10-35', text: (s) => `Alerta mayor. Despliegue de SWAT hacia ${s}.` }
  ],
  5: [
    { code: 'CÓDIGO 3', text: (s) => `Amenaza máxima. Guardia Nacional en camino a ${s}. Fuerza letal autorizada.` },
    { code: '10-0', text: (s) => `Precaución extrema en ${s}. Sospechosos altamente peligrosos.` }
  ]
};

const CLEAR_MESSAGES = [
  { code: '10-22', text: () => 'Se perdió el contacto visual con el sospechoso. Cancelen la persecución.' },
  { code: '10-24', text: () => 'Búsqueda finalizada. Unidades, regresen a patrullaje normal.' }
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export class PoliceDispatcherRadio {
  private manager: AudioContextManager;
  private listeners = new Set<Listener>();
  private lastTransmissionAt = 0;
  private seq = 0;
  public voiceEnabled = true;

  constructor(manager: AudioContextManager) {
    this.manager = manager;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** Broadcasts a transmission matching the given wanted level (0 = pursuit cleared). */
  public transmit(heatLevel: number, minIntervalMs = 2500) {
    const nowMs = Date.now();
    if (nowMs - this.lastTransmissionAt < minIntervalMs) return;
    this.lastTransmissionAt = nowMs;

    const street = pick(STREETS);
    const entry =
      heatLevel <= 0 ? pick(CLEAR_MESSAGES) : pick(MESSAGES_BY_HEAT[Math.min(5, Math.max(1, heatLevel))]);
    const transmission: DispatchTransmission = {
      id: ++this.seq,
      code: entry.code,
      unit: heatLevel <= 0 ? 'Central VCPD' : pick(UNITS),
      text: entry.text(street)
    };

    this.playSquelch();
    this.speak(`${transmission.code}. ${transmission.text}`);
    this.listeners.forEach((l) => l(transmission));
  }

  // ---------------------------------------------------------------------------
  // DSP: squelch kerchunk + band-limited static bed + roger beep
  // ---------------------------------------------------------------------------
  private playSquelch() {
    this.manager.ensureContext();
    const ctx = this.manager.getContext();
    const sfx = this.manager.getSfxGain();
    if (!ctx || !sfx || this.manager.isMuted) return;
    const now = ctx.currentTime;

    // Static hiss bed (bandpassed white noise like a 300Hz–3.4kHz radio channel)
    const len = Math.floor(ctx.sampleRate * 0.55);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.8;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 300;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 3400;

    // Analog saturation
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i / 255) * 2 - 1;
      curve[i] = Math.tanh(x * 3);
    }
    shaper.curve = curve;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
    noiseGain.gain.setValueAtTime(0.22, now + 0.12);
    noiseGain.gain.exponentialRampToValueAtTime(0.03, now + 0.18);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    noise.connect(hp).connect(lp).connect(shaper).connect(noiseGain).connect(sfx);
    noise.start(now);
    noise.stop(now + 0.56);

    // Roger beep (two short tones)
    [0, 0.09].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = idx === 0 ? 1200 : 1600;
      g.gain.setValueAtTime(0.0001, now + offset);
      g.gain.exponentialRampToValueAtTime(0.08, now + offset + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.07);
      osc.connect(g).connect(sfx);
      osc.start(now + offset);
      osc.stop(now + offset + 0.08);
    });
  }

  private speak(text: string) {
    if (!this.voiceEnabled || this.manager.isMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const synth = window.speechSynthesis;
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'es-ES';
      utter.rate = 1.15;
      utter.pitch = 0.75;
      utter.volume = 0.45;
      const spanishVoice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith('es'));
      if (spanishVoice) utter.voice = spanishVoice;
      // Small delay so the squelch is heard first
      window.setTimeout(() => synth.speak(utter), 180);
    } catch {
      // Speech synthesis is optional — subtitles still render
    }
  }
}
