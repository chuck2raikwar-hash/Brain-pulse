import * as Haptics from 'expo-haptics';

class AudioHapticService {
  private static instance: AudioHapticService;
  private soundEnabled: boolean = true;
  private hapticsEnabled: boolean = true;

  private constructor() {}

  public static getInstance(): AudioHapticService {
    if (!AudioHapticService.instance) {
      AudioHapticService.instance = new AudioHapticService();
    }
    return AudioHapticService.instance;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setHapticsEnabled(enabled: boolean) {
    this.hapticsEnabled = enabled;
  }

  public isSoundOn(): boolean {
    return this.soundEnabled;
  }

  public isHapticsOn(): boolean {
    return this.hapticsEnabled;
  }

  public playSuccess() {
    if (this.hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  }

  public playError() {
    if (this.hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    }
  }

  public playTap() {
    if (this.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  }

  public playHeavyTap() {
    if (this.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    }
  }
}

export const audioHaptics = AudioHapticService.getInstance();
