import React from 'react';
import Button from './Button';

const DefaultIcon = () => (
  <svg
    className="w-12 h-12 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
    <path
      strokeLinecap="round"
      strokeWidth="1.5"
      d="M8 12h.01M12 12h.01M16 12h.01"
    />
  </svg>
);

const EmptyState = ({ title, description, icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-3 text-gray-500">
        {icon || <DefaultIcon />}
      </div>
      {title && (
        <h3 className="text-lg font-medium text-gray-300">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-gray-500 mt-1 max-w-sm">{description}</p>
      )}
      {action && (
        <div className="mt-4">
          <Button variant="primary" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
