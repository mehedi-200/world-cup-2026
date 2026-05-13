import React, { useState, useEffect } from 'react';
import { timeUntil } from '@/utils/formatDate';

const CountdownTimer = ({ targetDate }) => {
  const [time, setTime] = useState(() => timeUntil(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = timeUntil(targetDate);
      setTime(remaining);

      if (!remaining) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!time) {
    return (
      <div className="text-center">
        <span className="text-fifa-gold font-extrabold text-lg tracking-wide animate-pulse">
          Kickoff!
        </span>
      </div>
    );
  }

  const units = [
    { value: time.days, label: 'Days' },
    { value: time.hours, label: 'Hrs' },
    { value: time.minutes, label: 'Min' },
    { value: time.seconds, label: 'Sec' },
  ];

  return (
    <div className="flex items-center justify-center gap-1.5">
      {units.map((unit, i) => (
        <React.Fragment key={unit.label}>
          {/* Unit box */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 min-w-[40px] text-center shadow-inner">
              <span className="text-lg font-extrabold text-fifa-gold drop-shadow-[0_0_6px_rgba(212,175,55,0.3)]">
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[9px] font-medium text-gray-500 mt-1 uppercase tracking-wider">
              {unit.label}
            </span>
          </div>
          {/* Colon separator (not after last) */}
          {i < units.length - 1 && (
            <span className="text-fifa-gold/50 font-bold text-sm -mt-3">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CountdownTimer;
