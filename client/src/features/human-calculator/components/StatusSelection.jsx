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

  const handleSubmit = () => {
    if (selected.length > 0) onSubmit(selected);
  };

  return (
    <div className="animate-fade-in">
      {/* Scrollable content */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-28">
        {/* Header */}
        <h2 className="text-lg md:text-xl font-bold text-center text-white mb-1">
          <span className="text-fifa-gold">{name}</span>, আপনার বর্তমান জীবনের অবস্থা নির্বাচন করুন
        </h2>
        <p className="text-center text-gray-500 mb-6 text-xs">সর্বোচ্চ ২টি নির্বাচন করুন</p>

        {/* Status Grid */}
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

      {/* Fixed bottom button — always visible */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-fifa-dark via-fifa-dark/95 to-transparent">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleSubmit}
            disabled={selected.length === 0}
            className={`w-full py-4 rounded-2xl text-lg font-bold transition-all duration-300 active:scale-[0.97] ${
              selected.length > 0
                ? 'bg-gradient-to-r from-fifa-gold to-yellow-500 text-fifa-darker shadow-lg shadow-fifa-gold/20'
                : 'bg-white/[0.06] text-gray-500 cursor-not-allowed'
            }`}
          >
            {selected.length === 0
              ? '👆 Select your status'
              : selected.length === 1
                ? '🧮 Calculate My Life (or pick one more)'
                : '🧮 Calculate My Life'}
          </button>
          {selected.length > 0 && (
            <p className="text-center text-gray-500 text-[10px] mt-1.5">{selected.length}/2 selected</p>
          )}
        </div>
      </div>
    </div>
  );
}
