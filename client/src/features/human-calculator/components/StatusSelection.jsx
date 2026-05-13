import { useState } from 'react';
import { statuses } from '../data/statuses';

export default function StatusSelection({ name, onSubmit }) {
  const [selected, setSelected] = useState([]);

  const toggleStatus = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  return (
    <div className="animate-fade-in min-h-screen flex flex-col">
      {/* Scrollable content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 pt-6 pb-40">
        <h2 className="text-lg md:text-xl font-bold text-center text-white mb-1">
          <span className="text-fifa-gold">{name}</span>, আপনার অবস্থা নির্বাচন করুন
        </h2>
        <p className="text-center text-gray-500 mb-5 text-xs">সর্বোচ্চ ২টি নির্বাচন করুন</p>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
          {statuses.map((status) => {
            const isSelected = selected.includes(status.id);
            const isDisabled = selected.length >= 2 && !isSelected;

            return (
              <button
                key={status.id}
                onClick={() => toggleStatus(status.id)}
                disabled={isDisabled}
                className={`relative rounded-2xl p-3 text-center transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'bg-fifa-gold/10 border-2 border-fifa-gold shadow-[0_0_15px_rgba(212,175,55,0.2)] scale-[1.03]'
                    : 'bg-white/[0.04] border border-white/[0.06] active:bg-white/[0.08]'
                } ${isDisabled ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                <span className="text-2xl md:text-3xl block mb-0.5">{status.emoji}</span>
                <span className="text-[11px] md:text-xs font-semibold text-white block">{status.label}</span>
                <span className="text-[9px] md:text-[10px] text-gray-500 block">{status.labelBn}</span>
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-fifa-gold rounded-full flex items-center justify-center text-[10px] text-fifa-darker font-bold shadow-lg">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed bottom bar — above mobile nav (50px) */}
      <div className="fixed bottom-[50px] md:bottom-0 left-0 right-0 z-40">
        <div className="bg-[#1a1a2e] border-t border-white/[0.06] px-4 py-3">
          <div className="max-w-2xl mx-auto">
            {selected.length > 0 && (
              <div className="flex items-center justify-center gap-1.5 mb-2">
                {[0, 1].map((i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all ${i < selected.length ? 'bg-fifa-gold' : 'bg-white/10'}`} />
                ))}
                <span className="text-[10px] text-gray-500 ml-1">{selected.length}/2</span>
              </div>
            )}
            <button
              onClick={() => selected.length > 0 && onSubmit(selected)}
              disabled={selected.length === 0}
              className={`w-full py-3.5 rounded-2xl text-base font-bold transition-all duration-200 active:scale-[0.97] ${
                selected.length > 0
                  ? 'bg-gradient-to-r from-fifa-gold to-yellow-500 text-[#1a1a2e] shadow-[0_4px_20px_rgba(212,175,55,0.3)]'
                  : 'bg-white/[0.04] text-gray-600 border border-white/[0.06]'
              }`}
            >
              {selected.length === 0 && '👆 Select your status'}
              {selected.length === 1 && '🧮 Calculate (or pick 1 more)'}
              {selected.length === 2 && '🧮 Calculate My Life'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
