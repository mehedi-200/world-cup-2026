import React from 'react';

const Input = ({
  label,
  error,
  type = 'text',
  className = '',
  icon,
  ...rest
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">{label}</label>
      )}
      <div className={icon ? 'relative' : ''}>
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </span>
        )}
        <input
          type={type}
          className={`
            w-full bg-white/[0.04] border rounded-xl px-4 py-3
            focus:border-fifa-gold/50 focus:ring-1 focus:ring-fifa-gold/30 focus:bg-white/[0.06]
            text-gray-100 placeholder:text-gray-600
            outline-none transition-all duration-200
            ${error ? 'border-red-500/50 bg-red-500/5' : 'border-white/[0.08] hover:border-white/[0.15]'}
            ${icon ? 'pl-10' : ''}
            ${className}
          `.trim()}
          {...rest}
        />
      </div>
      {error && (
        <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
