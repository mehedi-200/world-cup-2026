import React from 'react';

const variantClasses = {
  success: 'bg-green-500/15 text-green-400 border border-green-500/20',
  warning: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  danger: 'bg-red-500/15 text-red-400 border border-red-500/20',
  info: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  neutral: 'bg-white/[0.06] text-gray-400 border border-white/[0.08]',
  gold: 'bg-fifa-gold/15 text-fifa-gold border border-fifa-gold/20',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px] font-semibold tracking-wide',
  md: 'px-2.5 py-1 text-xs font-medium',
};

const Badge = ({ variant = 'neutral', size = 'md', children, className = '' }) => {
  return (
    <span
      className={`
        rounded-full inline-flex items-center gap-1 whitespace-nowrap
        ${variantClasses[variant] || variantClasses.neutral}
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `.trim()}
    >
      {children}
    </span>
  );
};

export default Badge;
