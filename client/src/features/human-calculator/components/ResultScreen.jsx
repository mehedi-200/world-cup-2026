import { useEffect, useState } from 'react';
import { speakBangla, stopSpeaking } from '../utils/speakBangla';
import { generateShareImage, downloadImage } from '../utils/generateShareImage';
import ShareCard from './ShareCard';

export default function ResultScreen({ result, onReplay, onShare }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Auto-play Bangla voice
    speakBangla(result.voiceText);

    // Show confetti for fireworks/confetti animation
    if (result.animation === 'fireworks' || result.animation === 'confetti') {
      setShowConfetti(true);
    }

    return () => stopSpeaking();
  }, [result]);

  const getAnimationClass = () => {
    switch (result.animation) {
      case 'shake':
        return 'animate-screen-shake';
      case 'glow':
        return 'glow-gold';
      default:
        return '';
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Human Calculator Result',
      text: result.shareText,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(result.shareText);
        alert('Result copied to clipboard!');
      }
    } catch {
      // User cancelled or error
      try {
        await navigator.clipboard.writeText(result.shareText);
        alert('Result copied to clipboard!');
      } catch {
        // Clipboard also failed
      }
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const dataUrl = await generateShareImage('share-card');
      if (dataUrl) {
        downloadImage(dataUrl);
      }
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-8">
      {/* Confetti overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {Array.from({ length: 30 }).map((_, i) => (
            <span
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${(Math.random() * 2).toFixed(1)}s`,
                animationDuration: `${(Math.random() * 2 + 2).toFixed(1)}s`,
                fontSize: `${Math.random() * 12 + 8}px`,
                color: ['#D4AF37', '#FFD700', '#8B1538', '#fff', '#60A5FA'][
                  Math.floor(Math.random() * 5)
                ],
              }}
            >
              {['*', '+', '.', 'o', '*'][Math.floor(Math.random() * 5)]}
            </span>
          ))}
        </div>
      )}

      {/* Main Result Card */}
      <div
        className={`relative z-20 max-w-lg w-full mx-auto text-center animate-slide-up ${getAnimationClass()}`}
      >
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">
          {/* Status badge */}
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                result.status === 'legendary'
                  ? 'bg-fifa-gold/20 text-fifa-gold'
                  : result.status === 'rare'
                    ? 'bg-purple-500/20 text-purple-400'
                    : result.status === 'impossible'
                      ? 'bg-red-500/20 text-red-400'
                      : result.status === 'warning'
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-green-500/20 text-green-400'
              }`}
            >
              {result.status}
            </span>
          </div>

          {/* Title with scale animation */}
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3 animate-trophy-enter">
            {result.title}
          </h2>

          {/* Subtitle in Bangla */}
          <p className="text-base md:text-lg text-gray-300 mb-4 leading-relaxed">
            {result.subtitle}
          </p>

          {/* Achievement badge */}
          {result.achievement && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fifa-gold/10 border border-fifa-gold/30 mb-4 animate-fade-in">
              <span className="text-xl">{result.achievement.badge}</span>
              <span className="text-fifa-gold font-semibold text-sm">
                {result.achievement.label}
              </span>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  result.achievement.rarity === 'legendary'
                    ? 'bg-fifa-gold/20 text-fifa-gold'
                    : result.achievement.rarity === 'epic'
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                {result.achievement.rarity}
              </span>
            </div>
          )}

          {/* Funny line */}
          <p className="text-sm text-gray-500 italic mt-4 mb-6">
            "{result.funnyLine}"
          </p>

          {/* Name attribution */}
          <p className="text-xs text-gray-600 mb-6">
            Result for: <span className="text-fifa-gold">{result.userName}</span>
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Replay */}
            <button
              onClick={onReplay}
              className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold
                         bg-white/[0.06] border border-white/10 text-white
                         hover:bg-white/[0.1] transition-all duration-300"
            >
              🔄 আবার চেষ্টা করুন
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold
                         bg-fifa-maroon/80 border border-fifa-maroon text-white
                         hover:bg-fifa-maroon transition-all duration-300"
            >
              📤 শেয়ার করুন
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold
                         bg-gradient-to-r from-fifa-gold to-yellow-600 text-fifa-darker
                         hover:from-yellow-500 hover:to-fifa-gold
                         disabled:opacity-50 transition-all duration-300 glow-gold"
            >
              {isDownloading ? '⏳ তৈরি হচ্ছে...' : '📥 ডাউনলোড'}
            </button>
          </div>
        </div>
      </div>

      {/* Hidden ShareCard for html2canvas */}
      <ShareCard result={result} />
    </div>
  );
}
