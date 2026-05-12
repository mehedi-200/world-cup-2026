import React from 'react';

const Sidebar = ({ children }) => {
  return (
    <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-fifa-darker/80 backdrop-blur-md border-r border-white/10 overflow-y-auto">
      <div className="p-4">
        {children}
      </div>
    </aside>
  );
};

export default Sidebar;
