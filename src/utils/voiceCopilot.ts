// Web Speech API Voice Copilot for BJJ Nexus Tactical GPS
// Allows hands-free audio announcements on the mat during partner drills

class VoiceCopilot {
  public enabled: boolean = false;
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoice();
      };
      this.initVoice();
    }
  }

  private initVoice() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Prioritize French natural voices (e.g. Thomas, Amelie, or default fr-FR)
    this.voice = voices.find((v) => v.lang.startsWith('fr') && (v.name.includes('Natural') || v.name.includes('Siri') || v.name.includes('Google'))) ||
                 voices.find((v) => v.lang.startsWith('fr')) ||
                 null;
  }

  speak(text: string, priority: 'normal' | 'urgent' = 'normal') {
    if (!this.enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      if (priority === 'urgent') {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.05; // Slightly brisk like a professional GPS prompt
      utterance.pitch = 1.0;
      if (this.voice) {
        utterance.voice = this.voice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // SpeechSynthesis suppressed by browser policy
    }
  }

  announceTechnique(name: string, keyCue?: string) {
    if (!this.enabled) return;
    const text = keyCue 
      ? `${name}. Point clé : ${keyCue}.`
      : `${name}. En position.`;
    this.speak(text, 'urgent');
  }

  announceReaction(condition: string, nextTechniqueName: string) {
    if (!this.enabled) return;
    const text = `${condition}. Transition vers : ${nextTechniqueName}.`;
    this.speak(text, 'urgent');
  }

  announceVictory(techniqueName: string) {
    if (!this.enabled) return;
    this.speak(`Finalisation réussie en ${techniqueName} !`, 'urgent');
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const voiceCopilot = new VoiceCopilot();
