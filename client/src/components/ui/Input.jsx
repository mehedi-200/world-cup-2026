import React from 'react';

const Input = ({
  label,
  error,
  type = 'text',
  className = '',
  icon,
  ...rest
}) => {
  const inputClasses = `
    w-full bg-white/5 border rounded-lg px-4 py-2.5
    focus:border-primary-500 focus:ring-1 focus:ring-primary-500
    text-gray-100 placeholder:text-gray-500
    outline-none transition-all
    ${error ? 'border-red-500' : 'border-white/10'}
    ${icon ? 'pl-10' : ''}
    ${className}
  `.trim();

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-gray-400 mb-1">{label}</label>
      )}
      <div className={icon ? 'relative' : ''}>
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input type={type} className={inputClasses} {...rest} />
      </div>
      {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
