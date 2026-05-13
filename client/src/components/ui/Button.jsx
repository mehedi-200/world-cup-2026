import React from 'react';

const variantClasses = {
  primary: 'bg-primary-600 hover:bg-primary-500 active:bg-primary-700 text-white shadow-lg shadow-primary-600/20',
  secondary: 'bg-white/[0.06] hover:bg-white/[0.12] active:bg-white/[0.04] text-gray-200 border border-white/10',
  danger: 'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-600/20',
  ghost: 'bg-transparent hover:bg-white/[0.06] active:bg-white/[0.04] text-gray-300',
  gold: 'bg-gradient-to-r from-fifa-gold to-yellow-500 hover:from-yellow-500 hover:to-fifa-gold text-fifa-dark font-bold shadow-lg shadow-fifa-gold/20 hover:shadow-fifa-gold/30',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm font-medium rounded-xl gap-2',
  lg: 'px-6 py-3 text-base font-semibold rounded-xl gap-2',
};

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  children,
  className = '',
  ...rest
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`
        inline-flex items-center justify-center
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-fifa-gold/50 focus:ring-offset-1 focus:ring-offset-fifa-dark
        ${variantClasses[variant] || variantClasses.primary}
        ${sizeClasses[size] || sizeClasses.md}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.97]'}
        ${className}
      `.trim()}
      disabled={isDisabled}
      {...rest}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
};

export default Button;
