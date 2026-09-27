import { Language } from '../types';

// Web Audio API Sound Effects Helper
class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Positive verification chime
  playSuccess(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // AudioContext not allowed or disabled
    }
  }

  // Warning or error buzzer
  playWarning(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.linearRampToValueAtTime(160, now + 0.25);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch {
      // ignore
    }
  }

  // AR Reticle Lock / Target Ping / Click
  playTargetLock(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(1480, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // ignore
    }
  }

  // Emergency Alarm pulse
  playAlarmBurst(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      for (let i = 0; i < 2; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(i % 2 === 0 ? 800 : 600, now + i * 0.15);
        gain.gain.setValueAtTime(0.08, now + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (i + 1) * 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.15);
        osc.stop(now + (i + 1) * 0.15);
      }
    } catch {
      // ignore
    }
  }

  // Metallic safety pin pull
  playPinPull(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // High metallic chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(2600, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.18);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    } catch {
      // ignore
    }
  }

  private sprayNode: { osc: AudioNode; gain: GainNode } | null = null;

  // Pressurized extinguisher spray whoosh
  startSpray(): void {
    try {
      if (this.sprayNode) return;
      const ctx = this.getContext();
      if (!ctx) return;

      // White noise buffer for realistic high-pressure gas spray
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Bandpass filter to model powder nozzle hiss
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      this.sprayNode = { osc: whiteNoise, gain };
    } catch {
      // ignore
    }
  }

  stopSpray(): void {
    try {
      if (this.sprayNode) {
        const ctx = this.getContext();
        const now = ctx ? ctx.currentTime : 0;
        this.sprayNode.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        setTimeout(() => {
          try {
            (this.sprayNode?.osc as AudioBufferSourceNode)?.stop();
          } catch {
            // ignore
          }
          this.sprayNode = null;
        }, 120);
      }
    } catch {
      this.sprayNode = null;
    }
  }

  // Sizzling steam when embers extinguished
  playSteamHiss(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const bufferSize = ctx.sampleRate * 0.4;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2400, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {
      // ignore
    }
  }

  // Multi-Gas Detector High-Pitched Toxic Alert Chirp
  playGasAlarmBeep(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2800, now);
      osc.frequency.setValueAtTime(3200, now + 0.04);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // ignore
    }
  }

  // SCBA Positive-Pressure Demand Valve Breath
  playSCBABreath(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.5;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(700, now);
      filter.Q.setValueAtTime(2.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.5);
    } catch {
      // ignore
    }
  }

  // Ventilation Fan / Air Blower starting
  playVentBlower(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.6);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.72);
    } catch {
      // ignore
    }
  }

  // Emergency Egress Beacon Identified (Chime + confirmation tone)
  playEgressIdentified(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.1, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (i + 1) * 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + (i + 1) * 0.14);
      });
    } catch {
      // ignore
    }
  }
}

export const sfx = new SoundEffects();

// ============================================================================
// REGIONAL TTS NARRATION ENGINE (Offline First, Web Speech API)
// Supports English, Hindi, Khortha, Nagpuri, and Santali
// ============================================================================
class RegionalVoiceAssistant {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState = false;
  private speechListeners: Array<(isSpeaking: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public addListener(listener: (isSpeaking: boolean) => void): () => void {
    this.speechListeners.push(listener);
    listener(this.isSpeakingState);
    return () => {
      this.speechListeners = this.speechListeners.filter((l) => l !== listener);
    };
  }

  private notify(isSpeaking: boolean) {
    this.isSpeakingState = isSpeaking;
    this.speechListeners.forEach((l) => l(isSpeaking));
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState || Boolean(this.synth?.speaking);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
    this.notify(false);
  }

  /**
   * Speak narration in the specified regional language.
   * Hindi, Khortha, and Nagpuri use Indian Hindi voice synthesis (hi-IN).
   * English uses en-IN or en-US.
   * Santali uses phonetics or available Indian speech voice.
   */
  public speak(text: string, lang: Language, onEndCallback?: () => void): void {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      onEndCallback?.();
      return;
    }

    this.stop();

    if (!text || text.trim().length === 0) {
      onEndCallback?.();
      return;
    }

    // Clean text of non-speakable symbols
    const cleanedText = text
      .replace(/[\u26A0\uFE0F\uD83D\uDD25\uD83D\uDEE1\uFE0F\uD83D\uDEAA\u2620\uFE0F]/g, '')
      .replace(/\(CH4 > 0\.75%\)/g, 'Methane greater than zero point seven five percent')
      .replace(/§/g, 'Section')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    this.currentUtterance = utterance;

    // Determine voice and language code
    let langCode = 'hi-IN';
    let rate = 0.92; // Slightly measured rate for industrial clarity

    switch (lang) {
      case 'en':
        langCode = 'en-IN';
        rate = 0.95;
        break;
      case 'hi':
        langCode = 'hi-IN';
        rate = 0.9;
        break;
      case 'khr': // Khortha (Devanagari phonetics with Hindi engine)
        langCode = 'hi-IN';
        rate = 0.88;
        break;
      case 'nag': // Nagpuri (Devanagari phonetics with Hindi engine)
        langCode = 'hi-IN';
        rate = 0.9;
        break;
      case 'sat': // Santali (Ol Chiki / regional Indian voice)
        langCode = 'hi-IN';
        rate = 0.85;
        break;
      default:
        langCode = 'hi-IN';
    }

    utterance.lang = langCode;
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Try finding matching voice
    const voices = this.synth.getVoices();
    if (voices.length > 0) {
      const match =
        voices.find((v) => v.lang.toLowerCase() === langCode.toLowerCase()) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('hi')) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('en')) ||
        voices[0];
      if (match) {
        utterance.voice = match;
      }
    }

    utterance.onstart = () => {
      this.notify(true);
    };

    utterance.onend = () => {
      this.notify(false);
      onEndCallback?.();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error or cancelled', e);
      this.notify(false);
      onEndCallback?.();
    };

    try {
      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis execution failed:', err);
      this.notify(false);
      onEndCallback?.();
    }
  }
}

export const regionalVoice = new RegionalVoiceAssistant();

// ============================================================================
// SPEECH-TO-TEXT VOICE COMMAND ENGINE (Speech Recognition)
// Allows hands-free answer selection: e.g. "Option A", "Option B", "Sump"
// ============================================================================
export interface VoiceCommandMatch {
  transcript: string;
  matchedOptionId?: string;
  action?: 'SUBMIT' | 'RETRY' | 'NEXT' | 'LISTEN';
}

export class VoiceCommandRecognizer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recognition: any = null;
  private isListeningState = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 3;
      }
    }
  }

  public isSupported(): boolean {
    return Boolean(this.recognition);
  }

  public isListening(): boolean {
    return this.isListeningState;
  }

  public startListening(
    lang: Language,
    onResult: (result: VoiceCommandMatch) => void,
    onError?: (error: string) => void,
    onStatusChange?: (isListening: boolean) => void
  ): () => void {
    if (!this.recognition) {
      onError?.('Voice recognition not supported in this browser.');
      return () => {};
    }

    try {
      this.recognition.abort();
    } catch {
      // ignore
    }

    // Set recognition language
    let langCode = 'hi-IN';
    if (lang === 'en') langCode = 'en-IN';
    else langCode = 'hi-IN'; // Works well for Hindi, Khortha, Nagpuri, and Santali phonetics

    this.recognition.lang = langCode;

    this.recognition.onstart = () => {
      this.isListeningState = true;
      onStatusChange?.(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.recognition.onresult = (event: any) => {
      const results = event.results;
      if (!results || results.length === 0) return;

      const rawTranscript = results[0][0].transcript.toLowerCase().trim();
      const matchResult: VoiceCommandMatch = {
        transcript: rawTranscript,
      };

      // Check Option matching (A, B, C, D)
      if (
        rawTranscript.includes('option a') ||
        rawTranscript.includes('vikalp a') ||
        rawTranscript.includes('vikalp ka') ||
        rawTranscript.includes('pahla') ||
        rawTranscript.includes('first') ||
        rawTranscript === 'a' ||
        rawTranscript.startsWith('a ') ||
        rawTranscript.includes('sump')
      ) {
        matchResult.matchedOptionId = 'opt-a';
      } else if (
        rawTranscript.includes('option b') ||
        rawTranscript.includes('vikalp b') ||
        rawTranscript.includes('vikalp kha') ||
        rawTranscript.includes('doosra') ||
        rawTranscript.includes('second') ||
        rawTranscript === 'b' ||
        rawTranscript.startsWith('b ') ||
        rawTranscript.includes('siren') ||
        rawTranscript.includes('alarm') ||
        rawTranscript.includes('exit') ||
        rawTranscript.includes('escape') ||
        rawTranscript.includes('intake')
      ) {
        matchResult.matchedOptionId = 'opt-b';
      } else if (
        rawTranscript.includes('option c') ||
        rawTranscript.includes('vikalp c') ||
        rawTranscript.includes('vikalp ga') ||
        rawTranscript.includes('teesra') ||
        rawTranscript.includes('third') ||
        rawTranscript === 'c' ||
        rawTranscript.startsWith('c ')
      ) {
        matchResult.matchedOptionId = 'opt-c';
      } else if (
        rawTranscript.includes('option d') ||
        rawTranscript.includes('vikalp d') ||
        rawTranscript.includes('chautha') ||
        rawTranscript.includes('fourth') ||
        rawTranscript === 'd'
      ) {
        matchResult.matchedOptionId = 'opt-d';
      }

      // Check action words
      if (rawTranscript.includes('submit') || rawTranscript.includes('jamakare') || rawTranscript.includes('confirm')) {
        matchResult.action = 'SUBMIT';
      } else if (rawTranscript.includes('retry') || rawTranscript.includes('punah') || rawTranscript.includes('again')) {
        matchResult.action = 'RETRY';
      } else if (rawTranscript.includes('next') || rawTranscript.includes('aage') || rawTranscript.includes('agla')) {
        matchResult.action = 'NEXT';
      }

      onResult(matchResult);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.recognition.onerror = (e: any) => {
      this.isListeningState = false;
      onStatusChange?.(false);
      onError?.(e.error || 'Speech recognition error');
    };

    this.recognition.onend = () => {
      this.isListeningState = false;
      onStatusChange?.(false);
    };

    try {
      this.recognition.start();
    } catch (err) {
      console.warn('Recognition start failed', err);
      this.isListeningState = false;
      onStatusChange?.(false);
    }

    return () => {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.isListeningState = false;
      onStatusChange?.(false);
    };
  }
}

export const voiceRecognizer = new VoiceCommandRecognizer();
