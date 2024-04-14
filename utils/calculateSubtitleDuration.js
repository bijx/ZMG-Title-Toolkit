function calculateSubtitleDuration(text) {
  const baseTime = .0; // base time in seconds
  const timePerCharacter = 0.05; // time per character in seconds
  const minLength = 1.5; // minimum length of subtitle display in seconds
  const maxLength = 7.0; // maximum length of subtitle display in seconds

  // Calculate initial duration
  let duration = baseTime + (text.length * timePerCharacter);

  // Apply minimum and maximum constraints
  duration = Math.max(duration, minLength);
  duration = Math.min(duration, maxLength);

  return duration; // This duration is in seconds
}

export default calculateSubtitleDuration;