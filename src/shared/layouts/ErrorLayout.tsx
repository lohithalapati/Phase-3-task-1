import React from 'react';
import { Outlet } from 'react-router-dom';

export const ErrorLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-[#121212] border border-neutral-900 rounded-2xl shadow-2xl relative text-center">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        <Outlet />
      </div>
    </div>
  );
};