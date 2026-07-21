import React from 'react';

export const RouteLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#0A0A0A] flex flex-col items-center justify-center z-50">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-neutral-900"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
      </div>
      <p className="mt-4 text-xs font-mono tracking-widest text-neutral-500 uppercase animate-pulse">
        Loading Route Node...
      </p>
    </div>
  );
};