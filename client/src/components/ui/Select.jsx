import React from 'react';

const Select = ({
  label,
  error,
  options = [],
  placeholder,
  className = '',
  ...rest
}) => {
  const selectClasses = `
    w-full bg-white/5 border rounded-lg px-4 py-2.5
    focus:border-primary-500 focus:ring-1 focus:ring-primary-500
    text-gray-100 outline-none transition-all
    appearance-none cursor-pointer
    ${error ? 'border-red-500' : 'border-white/10'}
    ${className}
  `.trim();

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-gray-400 mb-1">{label}</label>
      )}
      <div className="relative">
        <select className={selectClasses} {...rest}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>
      {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
    </div>
  );
};

export default Select;
