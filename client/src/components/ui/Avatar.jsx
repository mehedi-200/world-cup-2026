import React from 'react';

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-lg',
};

const Avatar = ({ src, alt = '', size = 'md', fallback = '?' }) => {
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClass} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`
        ${sizeClass} rounded-full bg-primary-600
        flex items-center justify-center
        text-white font-medium
      `.trim()}
    >
      {fallback.charAt(0).toUpperCase()}
    </div>
  );
};

export default Avatar;
