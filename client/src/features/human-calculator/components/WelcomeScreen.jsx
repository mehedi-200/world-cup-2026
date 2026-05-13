import { useState } from 'react';
import ParticleBackground from './ParticleBackground';

export default function WelcomeScreen({ onStart }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onStart(name.trim());
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <ParticleBackground />

      <form onSubmit={handleSubmit} className="relative z-10 max-w-sm w-full mx-auto text-center animate-fade-in">
        <div className="text-6xl mb-4">🧮</div>

        <h1 className="text-4xl md:text-5xl font-black mb-2 animate-neon-pulse text-gradient leading-tight">
          Human Calculatore
        </h1>

        <p className="text-sm text-gray-400 mb-1 tracking-wide">AI-Powered Life Status Analyzer</p>
        <p className="text-sm text-fifa-gold/70 mb-8 font-medium">স্যার, আপনার নামটি লিখুন।</p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="আপনার নাম লিখুন..."
          className="w-full px-5 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-white text-lg text-center placeholder-gray-600 focus:outline-none focus:border-fifa-gold/40 focus:ring-2 focus:ring-fifa-gold/20 transition-all duration-300 mb-4"
          autoFocus
        />

        <button
          type="submit"
          disabled={!name.trim()}
          className={`w-full py-4 rounded-2xl text-base font-bold transition-all duration-200 active:scale-[0.97] ${
            name.trim()
              ? 'bg-gradient-to-r from-fifa-gold to-yellow-500 text-[#1a1a2e] shadow-[0_4px_20px_rgba(212,175,55,0.3)]'
              : 'bg-white/[0.04] text-gray-600 border border-white/[0.06] cursor-not-allowed'
          }`}
        >
          🚀 বিশ্লেষণ শুরু করুন
        </button>

        <p className="mt-6 text-[10px] text-gray-600">100% accurate* (*not really)</p>
      </form>
    </div>
  );
}
