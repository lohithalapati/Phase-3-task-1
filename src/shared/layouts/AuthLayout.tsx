import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A]">
      <div className="max-w-md w-full space-y-8 p-10 bg-[#121212] border border-neutral-900 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="flex flex-col items-center">
          <span className="text-xl font-black tracking-widest text-blue-500">NEURALHANDOFF</span>
          <span className="text-xs font-mono tracking-widest text-neutral-600 uppercase mt-1">Enterprise Platform</span>
        </div>
        <div className="relative z-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};