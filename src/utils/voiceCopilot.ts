// Voice copilot completely removed as requested
class VoiceCopilot {
  public enabled: boolean = false;

  speak(_text: string, _priority: 'normal' | 'urgent' = 'normal'): void {}
  announceTechnique(_name: string, _keyCue?: string): void {}
  announceReaction(_condition: string, _nextTechniqueName: string): void {}
  announceVictory(_techniqueName: string): void {}
  stop(): void {}
}

export const voiceCopilot = new VoiceCopilot();
