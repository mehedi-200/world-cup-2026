import { useState } from 'react';
import { statuses } from '../data/statuses';

export default function StatusSelection({ name, onSubmit }) {
  const [selected, setSelected] = useState([]);

  const toggleStatus = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((s) => s !== id);
      }
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  const handleSubmit = () => {
    if (selected.length > 0) {
      onSubmit(selected);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <h2 className="text-xl md:text-2xl font-bold text-center text-white mb-2">
        <span className="text-fifa-gold">{name}</span>, আপনার বর্তমান জীবনের অবস্থা
        নির্বাচন করুন
      </h2>
      <p className="text-center text-gray-400 mb-8 text-sm">
        সর্বোচ্চ ২টি নির্বাচন করুন
      </p>

      {/* Status Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-8">
        {statuses.map((status) => {
          const isSelected = selected.includes(status.id);
          const isDisabled = selected.length >= 2 && !isSelected;

          return (
            <button
              key={status.id}
              onClick={() => toggleStatus(status.id)}
              disabled={isDisabled}
              className={`
                relative rounded-2xl p-3 md:p-4 text-center transition-all duration-300
                ${
                  isSelected
                    ? 'bg-fifa-gold/10 border-2 border-fifa-gold shadow-[0_0_20px_rgba(212,175,55,0.2)] scale-105'
                    : 'bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] hover:border-white/10'
                }
                ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="text-3xl block mb-1">{status.emoji}</span>
              <span className="text-xs md:text-sm font-medium text-white block">
                {status.label}
              </span>
              <span className="text-[10px] md:text-xs text-gray-400 block">
                {status.labelBn}
              </span>

              {isSelected && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-fifa-gold rounded-full flex items-center justify-center text-xs text-fifa-darker font-bold">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={selected.length === 0}
        className="w-full py-4 rounded-2xl text-lg font-bold
                   bg-gradient-to-r from-fifa-gold to-yellow-600 text-fifa-darker
                   hover:from-yellow-500 hover:to-fifa-gold
                   disabled:opacity-30 disabled:cursor-not-allowed
                   transition-all duration-300 transform hover:scale-[1.02]
                   active:scale-[0.98] glow-gold"
      >
        🧮 Calculate My Life
      </button>
    </div>
  );
}
