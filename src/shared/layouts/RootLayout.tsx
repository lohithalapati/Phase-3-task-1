import React from 'react';
import { Outlet } from 'react-router-dom';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-100 selection:bg-blue-500/30 selection:text-blue-200">
      <Outlet />
    </div>
  );
};