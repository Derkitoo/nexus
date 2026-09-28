// Audio functionality completely removed as requested
class SoundFX {
  public enabled: boolean = false;

  playClick(): void {}
  playRouteNav(): void {}
  playSubmissionChime(): void {}
  playGong(): void {}
  playBuzzer(): void {}
}

export const soundFX = new SoundFX();
