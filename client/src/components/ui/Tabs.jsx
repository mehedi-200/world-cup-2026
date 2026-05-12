import React from 'react';

const Tabs = ({ tabs = [], activeKey, onChange }) => {
  return (
    <div className="flex gap-1 bg-white/5 rounded-lg p-1">
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            className={`
              px-4 py-2 text-sm font-medium transition-all cursor-pointer rounded-md
              ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }
            `.trim()}
            onClick={() => onChange?.(tab.key)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
