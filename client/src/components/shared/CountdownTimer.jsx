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
      <span className="text-fifa-gold font-bold text-lg">Kickoff!</span>
    );
  }

  const units = [
    { value: time.days, label: 'Days' },
    { value: time.hours, label: 'Hours' },
    { value: time.minutes, label: 'Mins' },
    { value: time.seconds, label: 'Secs' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {units.map((unit) => (
        <div key={unit.label} className="bg-white/5 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-fifa-gold">
            {String(unit.value).padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500">{unit.label}</div>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
