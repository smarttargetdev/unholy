/**
 * Procedural Web Audio API sound generator for Gothic Abbey atmosphere
 * Zero external audio files (100% synthesized in code)
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private chantOsc1: OscillatorNode | null = null;
  private chantOsc2: OscillatorNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.05, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Resonant gothic bronze cathedral bell
   */
  public playBell(pitch: number = 110, duration: number = 3.5, volume: number = 0.4) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const partials = [1, 2.01, 2.76, 3.25, 4.15, 5.4];
    const amplitudes = [1.0, 0.6, 0.4, 0.3, 0.2, 0.1];

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(volume, t);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    masterGain.connect(this.ctx.destination);

    partials.forEach((mult, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const pGain = this.ctx.createGain();
      
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(pitch * mult, t);

      pGain.gain.setValueAtTime(amplitudes[i], t);
      pGain.gain.exponentialRampToValueAtTime(0.0001, t + duration * (1 - i * 0.12));

      osc.connect(pGain);
      pGain.connect(masterGain);

      osc.start(t);
      osc.stop(t + duration);
    });
  }

  /**
   * Urgent emergency bell for meetings and sabotage alarm
   */
  public playEmergencyAlarm() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.playBell(180 + i * 20, 1.2, 0.4);
      }, i * 350);
    }
  }

  /**
   * Kill / attack sinister string strike
   */
  public playKillSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const noiseNode = this.createNoiseBuffer();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.6);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, t);
    filter.frequency.exponentialRampToValueAtTime(300, t + 0.6);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.8);

    if (noiseNode) {
      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.3, t);
      nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      noiseNode.connect(nGain);
      nGain.connect(this.ctx.destination);
      noiseNode.start(t);
      noiseNode.stop(t + 0.4);
    }
  }

  /**
   * Task completion sacred major chord
   */
  public playTaskComplete() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A major sacred chord
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.06);

      gain.gain.setValueAtTime(0, t + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.18, t + idx * 0.06 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.06 + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 1.3);
    });
  }

  /**
   * Interactive click / step tick in puzzles
   */
  public playTick(pitch: number = 600, vol: number = 0.1) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, t);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.6, t + 0.04);

    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  /**
   * Stone vent grate slide sound
   */
  public playVentWhoosh() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const noise = this.createNoiseBuffer();
    if (!noise) return;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.linearRampToValueAtTime(800, t + 0.2);
    filter.frequency.exponentialRampToValueAtTime(200, t + 0.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 0.55);
  }

  /**
   * Trap trigger sound (gasp / sudden dread sting)
   */
  public playTrapTrigger() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.linearRampToValueAtTime(70, t + 0.4);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.45);
  }

  /**
   * Sound illusion sabotage: whispers and phantom footsteps
   */
  public playPhantomWhisper() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220 + (Math.random() * 80 - 40), t);
    osc.frequency.linearRampToValueAtTime(200, t + 0.6);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.8);
  }

  /**
   * Ambient low monastic drone
   */
  public startAmbient() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || this.ambientGain) return;

    const t = this.ctx.currentTime;
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.04, t);
    this.ambientGain.connect(this.ctx.destination);

    this.chantOsc1 = this.ctx.createOscillator();
    this.chantOsc2 = this.ctx.createOscillator();

    this.chantOsc1.type = 'triangle';
    this.chantOsc1.frequency.setValueAtTime(65.41, t); // C2 low monastic root
    this.chantOsc2.type = 'sine';
    this.chantOsc2.frequency.setValueAtTime(98.0, t); // G2 fifth overtone

    this.chantOsc1.connect(this.ambientGain);
    this.chantOsc2.connect(this.ambientGain);

    this.chantOsc1.start();
    this.chantOsc2.start();
  }

  public stopAmbient() {
    if (this.chantOsc1) {
      try { this.chantOsc1.stop(); } catch {}
      this.chantOsc1.disconnect();
      this.chantOsc1 = null;
    }
    if (this.chantOsc2) {
      try { this.chantOsc2.stop(); } catch {}
      this.chantOsc2.disconnect();
      this.chantOsc2 = null;
    }
    if (this.ambientGain) {
      this.ambientGain.disconnect();
      this.ambientGain = null;
    }
  }

  private createNoiseBuffer(): AudioBufferSourceNode | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    return noise;
  }
}

export const soundEngine = new SoundEngine();
