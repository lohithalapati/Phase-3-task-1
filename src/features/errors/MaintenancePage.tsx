import React from 'react';

export const MaintenancePage: React.FC = () => {
  return (
    <div className="space-y-4">
      <span className="px-3 py-1 text-[10px] font-mono tracking-widest text-yellow-400 bg-yellow-500/5 border border-yellow-500/20 rounded-full uppercase">
        Offline Status
      </span>
      <h1 className="text-4xl font-black text-yellow-500 tracking-tight">System Under Maintenance</h1>
      <h2 className="text-sm font-bold text-neutral-300">Pipeline Synchronization In Progress</h2>
      <p className="text-xs text-neutral-500 max-w-xs mx-auto">
        We are calibrating database index limits and upgrading cluster instances. Operations resume shortly.
      </p>
    </div>
  );
};