/**
 * Audio Synthesizer & Speech Engine
 * Dual-layer acoustic feedback: Native Streamed HD Audio + Web Speech API fallback.
 * Strictly guarantees playback upon biometric scan completion.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isUnlocked = false;
    this.voices = [];
    this.isPlayingVoice = false;

    // Preload speech synthesis voices
    if ('speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  loadVoices() {
    if ('speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
    }
  }

  init() {
    // 1. Initialize Web Audio Context
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

    // 2. Prime the preloaded HTML5 Audio element on user gesture
    const audioEl = document.getElementById('identifiedVoiceAudio');
    if (audioEl) {
      try {
        audioEl.load();
      } catch (e) {
        // Silently catch
      }
    }

    // 3. Resume SpeechSynthesis engine if paused
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
      } catch (e) {
        // Silently catch
      }
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    const audioEl = document.getElementById('identifiedVoiceAudio');
    if (this.isMuted) {
      if (audioEl) {
        audioEl.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
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
    
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
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
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.09, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.16);
    });
  }

  playScanHum() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(330, now + 0.18);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.linearRampToValueAtTime(0.005, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  playChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chimeNotes = [523.25, 659.25, 783.99, 1046.50];
    chimeNotes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.08, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.4);
    });
  }

  playBlockedSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.setValueAtTime(190, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  /**
   * Executa a fala de identificação com garantia absoluta (Camada Dupla)
   * 1. HTML5 Audio Stream com voz natural em pt-BR
   * 2. Fallback imediato para Web Speech API nativa se o áudio falhar
   */
  playIdentifiedVoice(onEndedCallback) {
    if (this.isMuted) {
      if (onEndedCallback) onEndedCallback();
      return;
    }

    this.init();
    const voiceText = 'Pessoa identificada: Ana Gabriela. Característica marcante: Um sorriso lindo, mente brilhante e um deboche sem igual. Acesso liberado.';
    const audioEl = document.getElementById('identifiedVoiceAudio');

    let audioHasPlayed = false;

    const triggerFallback = () => {
      if (audioHasPlayed) return;
      audioHasPlayed = true;
      this.speakVoice(voiceText, onEndedCallback);
    };

    if (audioEl) {
      try {
        audioEl.currentTime = 0;
        
        audioEl.onended = () => {
          audioHasPlayed = true;
          this.isPlayingVoice = false;
          if (onEndedCallback) onEndedCallback();
        };

        audioEl.onerror = () => {
          triggerFallback();
        };

        const playPromise = audioEl.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              audioHasPlayed = true;
              this.isPlayingVoice = true;
            })
            .catch((err) => {
              console.warn('HTML5 Audio playback caught error, using SpeechSynthesis fallback:', err);
              triggerFallback();
            });
        }

        // Timer de segurança: se o áudio não iniciou em 650ms, usa o sintetizador de fala
        setTimeout(() => {
          if (!audioHasPlayed && (audioEl.paused || !audioEl.currentTime)) {
            triggerFallback();
          }
        }, 700);

      } catch (err) {
        console.warn('Audio tag exception:', err);
        triggerFallback();
      }
    } else {
      triggerFallback();
    }
  }

  /**
   * Voz sintetizada nativa em Português (pt-BR) de alta fidelidade (Fallback)
   */
  speakVoice(text, onEnd) {
    if (this.isMuted) {
      if (onEnd) onEnd();
      return;
    }

    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Localiza a melhor voz em pt-BR disponível
      const voices = this.voices.length > 0 ? this.voices : window.speechSynthesis.getVoices();
      const ptVoice = voices.find(v => v.lang === 'pt-BR' || v.lang === 'pt_BR' || (v.lang && v.lang.startsWith('pt')));
      if (ptVoice) {
        utterance.voice = ptVoice;
      }

      let ended = false;
      const finish = () => {
        if (ended) return;
        ended = true;
        this.isPlayingVoice = false;
        if (onEnd) onEnd();
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      this.isPlayingVoice = true;
      window.speechSynthesis.speak(utterance);

      // Keep-alive para Chromium
      const keepAlive = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(keepAlive);
        } else {
          window.speechSynthesis.resume();
        }
      }, 1000);

    } catch (err) {
      console.warn('Speech synthesis warning:', err);
      if (onEnd) onEnd();
    }
  }

  playFanfare() {
    this.playChime();
  }
}

window.soundEngine = new SoundEngine();