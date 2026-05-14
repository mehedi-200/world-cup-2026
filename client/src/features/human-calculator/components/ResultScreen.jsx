import { useEffect, useState, useRef } from 'react';
import { prepareVoice, stopSpeaking } from '../utils/speakBangla';
import { generateShareImage, downloadImage } from '../utils/generateShareImage';
import ShareCard from './ShareCard';

// Estimated typing speed when we can't get exact audio duration
const FALLBACK_MS_PER_CHAR = 75;

export default function ResultScreen({ result, onReplay }) {
  const [displayedText, setDisplayedText] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const cleanupRef = useRef(null);

  const isSpecial = result.isSpecial;
  const fullText = result.voiceText;

  useEffect(() => {
    setDisplayedText('');
    setTypingDone(false);
    setLoading(true);

    let cancelled = false;
    let typingTimer = null;

    const init = async () => {
      const voice = await prepareVoice(fullText);
      if (cancelled) { voice.stop(); return; }

      setLoading(false);

      if (voice.engine === 'openai' && voice.audio) {
        // ─── OPENAI: audio timeupdate drives the text (perfect sync) ───
        const audio = voice.audio;

        const onTimeUpdate = () => {
          if (cancelled) return;
          const progress = audio.currentTime / audio.duration;
          const chars = Math.min(fullText.length, Math.ceil(progress * fullText.length));
          setDisplayedText(fullText.slice(0, chars));
        };

        const onEnded = () => {
          if (cancelled) return;
          setDisplayedText(fullText);
          setTypingDone(true);
        };

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('ended', onEnded);
        audio.play().catch(() => {});

        cleanupRef.current = () => {
          audio.removeEventListener('timeupdate', onTimeUpdate);
          audio.removeEventListener('ended', onEnded);
          voice.stop();
        };
      } else {
        // ─── GOOGLE/BROWSER: estimated typing speed synced with voice ───
        let i = 0;
        voice.play();

        typingTimer = setInterval(() => {
          if (cancelled) return;
          if (i < fullText.length) {
            i++;
            setDisplayedText(fullText.slice(0, i));
          } else {
            clearInterval(typingTimer);
            setTypingDone(true);
          }
        }, FALLBACK_MS_PER_CHAR);

        cleanupRef.current = () => {
          clearInterval(typingTimer);
          voice.stop();
        };
      }
    };

    init();

    return () => {
      cancelled = true;
      if (typingTimer) clearInterval(typingTimer);
      if (cleanupRef.current) cleanupRef.current();
      stopSpeaking();
    };
  }, [fullText]);

  const handleShare = async () => {
    const shareData = { title: 'Human Calculator AI', text: result.shareText };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(result.shareText);
        alert('Copied to clipboard!');
      }
    } catch {
      try {
        await navigator.clipboard.writeText(result.shareText);
        alert('Copied to clipboard!');
      } catch {}
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const dataUrl = await generateShareImage('share-card');
      if (dataUrl) downloadImage(dataUrl);
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // ─── Brief loading while audio prepares ───
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-8 h-8 border-2 border-fifa-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Preparing cinematic verdict…</p>
        </div>
      </div>
    );
  }

  // ─── SPECIAL CASE: Happy + Married ───
  if (isSpecial) {
    return (
      <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-8">
        <div className="relative z-20 max-w-lg w-full mx-auto text-center animate-screen-shake">
          <div className="absolute inset-0 rounded-3xl bg-red-500/5 animate-glitch pointer-events-none" />

          <div className="bg-white/[0.03] backdrop-blur-xl border border-red-500/30 rounded-3xl p-6 md:p-8 glow-red">
            <div className="text-7xl mb-4 animate-scale-in">💔</div>

            <h2 className="text-2xl md:text-3xl font-black text-red-400 mb-2 animate-trophy-enter">
              {result.title}
            </h2>
            <p className="text-sm text-red-500/70 font-semibold uppercase tracking-wider mb-6">
              {result.subtitle}
            </p>

            {/* Synced typing text */}
            <div className="min-h-[80px] mb-6">
              <p className="text-base md:text-lg text-red-200/90 leading-relaxed text-left">
                {displayedText}
                {!typingDone && (
                  <span className="inline-block w-0.5 h-5 bg-red-400 ml-0.5 animate-blink-cursor align-middle" />
                )}
              </p>
            </div>

            {typingDone && (
              <div className="space-y-2.5 animate-fade-in">
                <button
                  onClick={onReplay}
                  className="w-full py-3.5 rounded-2xl text-base font-bold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-[0_4px_20px_rgba(239,68,68,0.3)] active:scale-[0.97] transition-all duration-200"
                >
                  🔄 আবার চেষ্টা কর
                </button>
                <div className="flex gap-2.5">
                  <button onClick={handleShare} className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-white/[0.06] border border-white/[0.08] text-white active:scale-[0.97] transition-all duration-200">
                    📤 শেয়ার
                  </button>
                  <button onClick={handleDownload} disabled={isDownloading} className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-white/[0.06] border border-white/[0.08] text-white active:scale-[0.97] disabled:opacity-50 transition-all duration-200">
                    {isDownloading ? '⏳...' : '📥 ডাউনলোড'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <ShareCard result={result} />
      </div>
    );
  }

  // ─── NORMAL CASE: Cinematic roast ───
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="relative z-20 max-w-lg w-full mx-auto text-center animate-slide-up">
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 glow-gold">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-1 animate-trophy-enter">
            {result.title}
          </h2>
          <p className="text-sm text-gray-500 mb-6">{result.subtitle}</p>

          {/* Synced typing text */}
          <div className="min-h-[100px] mb-6">
            <p className="text-base md:text-lg text-gray-200 leading-relaxed text-left">
              {displayedText}
              {!typingDone && (
                <span className="inline-block w-0.5 h-5 bg-fifa-gold ml-0.5 animate-blink-cursor align-middle" />
              )}
            </p>
          </div>

          <p className="text-xs text-gray-600 mb-6">
            Result for: <span className="text-fifa-gold">{result.userName}</span>
          </p>

          {typingDone && (
            <div className="space-y-2.5 animate-fade-in">
              <button
                onClick={onReplay}
                className="w-full py-3.5 rounded-2xl text-base font-bold bg-gradient-to-r from-fifa-gold to-yellow-500 text-[#1a1a2e] shadow-[0_4px_20px_rgba(212,175,55,0.3)] active:scale-[0.97] transition-all duration-200"
              >
                🔄 আবার চেষ্টা কর
              </button>
              <div className="flex gap-2.5">
                <button onClick={handleShare} className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-white/[0.06] border border-white/[0.08] text-white active:scale-[0.97] transition-all duration-200">
                  📤 শেয়ার
                </button>
                <button onClick={handleDownload} disabled={isDownloading} className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-white/[0.06] border border-white/[0.08] text-white active:scale-[0.97] disabled:opacity-50 transition-all duration-200">
                  {isDownloading ? '⏳...' : '📥 ডাউনলোড'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ShareCard result={result} />
    </div>
  );
}
