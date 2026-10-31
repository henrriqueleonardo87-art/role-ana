/**
 * Audio Synthesizer using Web Audio API
 * Zero external audio files required - works offline and loads instantly!
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isUnlocked = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isUnlocked = true;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  playPop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    const now = this.ctx.currentTime;
    
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  playSelect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25]; // C5, E5
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.18, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.18);
    });
  }

  playScanHum() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(280, now + 0.2);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  playScanSuccess() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    chords.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.35);
    });
  }

  playDodge() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    // Funny boing / slide up then down
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.09);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.22);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  playFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Celebratory victory arpeggio: C4, E4, G4, C5, E5, G5
    const fanfareNotes = [
      { f: 523.25, time: 0.00, dur: 0.15 },
      { f: 659.25, time: 0.14, dur: 0.15 },
      { f: 783.99, time: 0.28, dur: 0.15 },
      { f: 1046.50, time: 0.42, dur: 0.55 },
      { f: 1318.51, time: 0.52, dur: 0.70 }
    ];

    fanfareNotes.forEach((n) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.time);

      gain.gain.setValueAtTime(0.25, now + n.time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + n.time);
      osc.stop(now + n.time + n.dur);
    });
  }
}

window.soundEngine = new SoundEngine();
