import React from 'react';

export default function DashboardLayout({ sidebar, children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {sidebar}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}