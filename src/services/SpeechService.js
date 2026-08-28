// SpeechService.js - Modular Speech Recognition and Synthesis Service

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechSynthesis = window.speechSynthesis;

/**
 * Checks if the browser supports Speech Recognition.
 * @returns {boolean}
 */
export const isSpeechRecognitionSupported = () => {
  return typeof SpeechRecognition !== 'undefined';
};

/**
 * Checks if the browser supports Speech Synthesis.
 * @returns {boolean}
 */
export const isSpeechSynthesisSupported = () => {
  return typeof SpeechSynthesis !== 'undefined';
};

/**
 * Speech Recognition Wrapper Service
 */
export class SpeechRecognitionManager {
  constructor({ onResult, onStatusChange, onError }) {
    this.recognition = null;
    this.onResult = onResult; // Callback: (transcript) => {}
    this.onStatusChange = onStatusChange; // Callback: ('listening' | 'idle') => {}
    this.onError = onError; // Callback: (errorType) => {}
    this.isListening = false;

    if (isSpeechRecognitionSupported()) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.onStatusChange('listening');
      };

      this.recognition.onresult = (event) => {
        if (event.results && event.results[0]) {
          const text = event.results[0][0].transcript;
          this.onResult(text);
        }
      };

      this.recognition.onerror = (event) => {
        // Handle common Web Speech errors
        // "not-allowed" = permission blocked
        // "no-speech" = silence timeout
        this.onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.onStatusChange('idle');
      };
    }
  }

  start() {
    if (!this.recognition) {
      this.onError('unsupported');
      return;
    }
    if (this.isListening) return;

    try {
      this.recognition.start();
    } catch (e) {
      console.error('Failed to start SpeechRecognition:', e);
      this.onError('start-failed');
    }
  }

  stop() {
    if (!this.recognition || !this.isListening) return;
    try {
      this.recognition.stop();
    } catch (e) {
      console.error('Failed to stop SpeechRecognition:', e);
    }
  }
}

/**
 * Speech Synthesis Wrapper Service
 */
export class SpeechSynthesisManager {
  constructor({ onStart, onEnd, onError }) {
    this.synthesis = SpeechSynthesis;
    this.onStart = onStart; // Callback: () => {}
    this.onEnd = onEnd; // Callback: () => {}
    this.onError = onError; // Callback: (error) => {}
    this.utterance = null;
  }

  speak(text, preferredVoiceName = 'Default') {
    if (!this.synthesis) {
      this.onError('unsupported');
      return;
    }

    // Cancel any active speech output
    this.synthesis.cancel();

    try {
      this.utterance = new SpeechSynthesisUtterance(text);
      this.utterance.lang = 'en-US';
      
      // Select a natural sounding English voice or user preferred choice if available
      const voices = this.synthesis.getVoices();
      let selectedVoice = null;
      if (preferredVoiceName && preferredVoiceName !== 'Default') {
        selectedVoice = voices.find(v => v.name.toLowerCase().includes(preferredVoiceName.toLowerCase()));
      }
      if (!selectedVoice) {
        selectedVoice = voices.find(
          (v) => v.lang.startsWith('en-') && (v.name.includes('Google') || v.name.includes('Natural'))
        ) || voices.find((v) => v.lang.startsWith('en-'));
      }
      
      if (selectedVoice) {
        this.utterance.voice = selectedVoice;
      }

      // Voice settings
      this.utterance.rate = 1.0; // speed
      this.utterance.pitch = 1.0; // tone

      this.utterance.onstart = () => {
        this.onStart();
      };

      this.utterance.onend = () => {
        this.onEnd();
      };

      this.utterance.onerror = (e) => {
        // Ignore "interrupted" since we trigger it intentionally by canceling previous runs
        if (e.error !== 'interrupted') {
          this.onError(e.error);
        }
      };

      this.synthesis.speak(this.utterance);
    } catch (e) {
      console.error('Failed to speak text:', e);
      this.onError(e.message);
    }
  }

  stop() {
    if (!this.synthesis) return;
    this.synthesis.cancel();
  }
}
