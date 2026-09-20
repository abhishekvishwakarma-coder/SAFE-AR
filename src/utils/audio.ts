// Sound effects helper - Touch and interactive sounds removed per user specification
class SoundEffects {
  // Positive verification chime (disabled)
  playSuccess(): void {
    // Touch sound removed
  }

  // Warning or error buzzer (disabled)
  playWarning(): void {
    // Touch sound removed
  }

  // AR Reticle Lock / Target Ping / Touch sound (disabled)
  playTargetLock(): void {
    // Touch sound removed
  }

  // Emergency Alarm pulse (disabled)
  playAlarmBurst(): void {
    // Touch sound removed
  }
}

export const sfx = new SoundEffects();

