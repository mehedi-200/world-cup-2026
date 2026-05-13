import { useState } from 'react';
import ParticleBackground from './ParticleBackground';

export default function WelcomeScreen({ onStart }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4">
      <ParticleBackground />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-w-md w-full mx-auto text-center animate-fade-in"
      >
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-black mb-2 animate-neon-pulse text-gradient">
          Human Calculatore
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-400 mb-1 tracking-wide">
          AI-Powered Life Status Analyzer
        </p>

        {/* Bangla instruction */}
        <p className="text-base text-fifa-gold/80 mb-8 font-medium">
          স্যার, আপনার নামটি লিখুন।
        </p>

        {/* Input */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="আপনার নাম লিখুন..."
          className="w-full px-6 py-4 rounded-2xl bg-white/[0.06] border border-white/10
                     text-white text-xl text-center placeholder-gray-500
                     focus:outline-none focus:border-fifa-gold/50 focus:ring-2 focus:ring-fifa-gold/20
                     transition-all duration-300 mb-6 backdrop-blur-sm"
          autoFocus
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full py-4 rounded-2xl text-lg font-bold
                     bg-gradient-to-r from-fifa-gold to-yellow-600 text-fifa-darker
                     hover:from-yellow-500 hover:to-fifa-gold
                     disabled:opacity-30 disabled:cursor-not-allowed
                     transition-all duration-300 transform hover:scale-[1.02]
                     active:scale-[0.98] glow-gold"
        >
          🚀 বিশ্লেষণ শুরু করুন
        </button>

        {/* Footer hint */}
        <p className="mt-6 text-xs text-gray-600">
          100% accurate* (*not really)
        </p>
      </form>
    </div>
  );
}
