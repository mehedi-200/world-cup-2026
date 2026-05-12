import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-fifa-darker border-t border-white/10 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-500 text-sm">
          FIFA World Cup 2026 &mdash; Built for fun &amp; learning
        </p>
        <p className="text-gray-600 text-xs mt-2">
          &copy; {new Date().getFullYear()} WC 2026. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
