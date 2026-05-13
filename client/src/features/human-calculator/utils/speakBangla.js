// Google Translate TTS for clear Bangla voice
// Falls back to browser Speech Synthesis if blocked

let audioEl = null;

export function speakBangla(text, onEnd) {
  stopSpeaking();

  // Try Google TTS first (much clearer voice)
  try {
    const encoded = encodeURIComponent(text.slice(0, 200));
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=bn&q=${encoded}`;

    audioEl = new Audio(url);
    audioEl.playbackRate = 0.95;
    if (onEnd) audioEl.onended = onEnd;
    audioEl.onerror = () => fallbackSpeak(text, onEnd);
    audioEl.play().catch(() => fallbackSpeak(text, onEnd));
  } catch {
    fallbackSpeak(text, onEnd);
  }
}

function fallbackSpeak(text, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'bn-BD';
  u.rate = 0.9;
  u.pitch = 1.05;
  if (onEnd) u.onend = onEnd;

  const trySpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    const bnVoice = voices.find(v => v.lang.startsWith('bn')) ||
                    voices.find(v => v.lang.includes('IN') || v.lang.includes('BD'));
    if (bnVoice) u.voice = bnVoice;
    window.speechSynthesis.speak(u);
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    trySpeak();
  } else {
    window.speechSynthesis.onvoiceschanged = trySpeak;
  }
}

export function stopSpeaking() {
  if (audioEl) {
    audioEl.pause();
    audioEl.currentTime = 0;
    audioEl = null;
  }
  window.speechSynthesis?.cancel();
}
