function calculateSubtitleDuration(text) {
  const baseTime = .0; // base time in seconds
  const timePerCharacter = 0.2; // time per character in seconds
  const minLength = 2; // minimum length of subtitle display in seconds
  const maxLength = 10.0; // maximum length of subtitle display in seconds

  // Calculate initial duration
  let duration = baseTime + (text.length * timePerCharacter);

  // Apply minimum and maximum constraints
  duration = Math.max(duration, minLength);
  duration = Math.min(duration, maxLength);

  return Math.floor(duration * 100) / 100;
}

export default calculateSubtitleDuration;