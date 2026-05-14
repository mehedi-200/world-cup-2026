import { useState, useEffect, useRef } from 'react';
import { statuses } from '../data/statuses';

export default function StatusSelection({ name, onSubmit }) {
  const [selected, setSelected] = useState([]);
  const triggered = useRef(false);

  const toggleStatus = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  // Auto-trigger when exactly 2 selected
  useEffect(() => {
    if (selected.length === 2 && !triggered.current) {
      triggered.current = true;
      const timer = setTimeout(() => onSubmit(selected), 400);
      return () => clearTimeout(timer);
    }
    if (selected.length < 2) {
      triggered.current = false;
    }
  }, [selected, onSubmit]);

  return (
    <div className="animate-fade-in min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
          <span className="text-fifa-gold">{name}</span>, choose your reality
        </h2>
        <p className="text-gray-500 mb-8 text-sm">Pick any 2 — result auto-generates</p>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {statuses.map((status) => {
            const isSelected = selected.includes(status.id);
            const isDisabled = selected.length >= 2 && !isSelected;

            return (
              <button
                key={status.id}
                onClick={() => toggleStatus(status.id)}
                disabled={isDisabled}
                className={`relative rounded-3xl p-6 text-center transition-all duration-300 active:scale-95 ${
                  isSelected
                    ? 'bg-fifa-gold/15 border-2 border-fifa-gold shadow-[0_0_25px_rgba(212,175,55,0.25)] scale-[1.03]'
                    : 'bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07]'
                } ${isDisabled ? 'opacity-25 cursor-not-allowed' : ''}`}
              >
                <span className="text-5xl block mb-2">{status.emoji}</span>
                <span className="text-base font-bold text-white block">{status.label}</span>
                <span className="text-xs text-gray-500 block">{status.labelBn}</span>
                {isSelected && (
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-fifa-gold rounded-full flex items-center justify-center text-sm text-fifa-darker font-bold shadow-lg animate-scale-in">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selection indicator */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i < selected.length ? 'bg-fifa-gold scale-110' : 'bg-white/10'
              }`}
            />
          ))}
          <span className="text-xs text-gray-600 ml-1">{selected.length}/2</span>
        </div>
      </div>
    </div>
  );
}
