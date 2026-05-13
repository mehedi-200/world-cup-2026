import { useMemo } from 'react';

const PARTICLE_COLORS = [
  'rgba(212, 175, 55, 0.15)',
  'rgba(212, 175, 55, 0.1)',
  'rgba(255, 255, 255, 0.08)',
  'rgba(255, 255, 255, 0.05)',
  'rgba(100, 149, 237, 0.08)',
  'rgba(100, 149, 237, 0.06)',
];

export default function ParticleBackground() {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.floor(Math.random() * 5) + 2,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      delay: `${(Math.random() * 5).toFixed(1)}s`,
      duration: `${(Math.random() * 4 + 3).toFixed(1)}s`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full animate-float"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
