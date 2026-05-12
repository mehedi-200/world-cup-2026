import React from 'react';

const PageLayout = ({ title, subtitle, children, action }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {(title || action) && (
        <div className={`mb-6 ${action ? 'flex justify-between items-start' : ''}`}>
          <div>
            {title && (
              <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
            )}
            {subtitle && (
              <p className="text-gray-400 text-sm">{subtitle}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0 ml-4">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default PageLayout;
