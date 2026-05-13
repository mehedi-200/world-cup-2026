export function speakBangla(text, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'bn-BD';
  u.rate = 0.85;
  u.pitch = 1;
  if (onEnd) u.onend = onEnd;
  // Try to find Bangla voice
  const voices = window.speechSynthesis.getVoices();
  const bnVoice = voices.find((v) => v.lang.startsWith('bn'));
  if (bnVoice) u.voice = bnVoice;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel();
}
