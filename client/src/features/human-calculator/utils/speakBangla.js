// Cinematic Bangla voice system
// 1) OpenAI TTS "onyx" via /api/tts (best quality)
// 2) Google TTS via /api/tts/google proxy (no CORS issues)
// 3) Browser Speech Synthesis (last resort)

let currentSession = 0;
let activeAudio = null;

function splitIntoChunks(text) {
  const raw = text.split(/(?<=[।.!?""])\s*/g).filter((s) => s.trim());
  const merged = [];
  for (const chunk of raw) {
    if (merged.length > 0 && chunk.length < 15) {
      merged[merged.length - 1] += ' ' + chunk;
    } else {
      merged.push(chunk);
    }
  }
  return merged;
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Prepare voice: returns { engine, audio?, play(), stop() } ──
export async function prepareVoice(text) {
  stopSpeaking();
  const session = ++currentSession;

  // ── 1) Try OpenAI TTS (human-like) ──
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      await new Promise((resolve, reject) => {
        audio.onloadedmetadata = resolve;
        audio.onerror = reject;
      });

      activeAudio = audio;

      return {
        engine: 'openai',
        audio,
        duration: audio.duration,
        play: () => audio.play(),
        stop: () => {
          try { audio.pause(); } catch {}
          URL.revokeObjectURL(url);
          activeAudio = null;
        },
      };
    }
  } catch {
    // OpenAI unavailable
  }

  // ── 2) Try Google TTS via backend proxy (sentence-by-sentence) ──
  const chunks = splitIntoChunks(text);
  let googleWorks = true;

  // Quick test: can the backend proxy Google TTS?
  try {
    const testRes = await fetch('/api/tts/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: chunks[0].slice(0, 60) }),
    });
    if (!testRes.ok) googleWorks = false;
  } catch {
    googleWorks = false;
  }

  if (googleWorks) {
    return {
      engine: 'google',
      audio: null,
      duration: null,
      play: async () => {
        for (let i = 0; i < chunks.length; i++) {
          if (session !== currentSession) return;
          try {
            await playGoogleChunkViaProxy(chunks[i], session);
          } catch {
            break;
          }
          if (i < chunks.length - 1 && session === currentSession) {
            const last = chunks[i].trim().slice(-1);
            await delay(last === '?' || last === '!' ? 420 : 300);
          }
        }
      },
      stop: () => stopSpeaking(),
    };
  }

  // ── 3) Browser Speech Synthesis ──
  return {
    engine: 'browser',
    audio: null,
    duration: null,
    play: () => playBrowserTTS(text, session),
    stop: () => stopSpeaking(),
  };
}

// ── Google TTS via backend proxy ──
async function playGoogleChunkViaProxy(text, session) {
  if (session !== currentSession) throw new Error('cancelled');

  const res = await fetch('/api/tts/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error('proxy failed');

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.playbackRate = 0.92;
  activeAudio = audio;

  return new Promise((resolve, reject) => {
    audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
    audio.onerror = () => { URL.revokeObjectURL(url); reject('error'); };
    audio.play().catch((e) => { URL.revokeObjectURL(url); reject(e); });
  });
}

// ── Browser Speech Synthesis ──
function playBrowserTTS(text, session) {
  if (!window.speechSynthesis || session !== currentSession) return;

  const doSpeak = () => {
    if (session !== currentSession) return;
    const voices = window.speechSynthesis.getVoices();

    // Find best voice: Bangla > Hindi > any
    const voice =
      voices.find((v) => v.lang.startsWith('bn')) ||
      voices.find((v) => v.lang.startsWith('hi')) ||
      voices.find((v) => v.lang.includes('IN') || v.lang.includes('BD')) ||
      null;

    const u = new SpeechSynthesisUtterance(text);
    u.lang = voice ? voice.lang : 'bn-BD';
    u.rate = 0.85;
    u.pitch = 0.95;
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    doSpeak();
  } else {
    window.speechSynthesis.onvoiceschanged = doSpeak;
  }
}

// ── Stop everything ──
export function stopSpeaking() {
  currentSession++;
  if (activeAudio) {
    try { activeAudio.pause(); activeAudio.currentTime = 0; } catch {}
    activeAudio = null;
  }
  window.speechSynthesis?.cancel();
}
