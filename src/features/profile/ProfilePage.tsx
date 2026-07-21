import React from 'react';

export const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border border-neutral-900 p-8 rounded-2xl bg-[#0F0F0F]/60">
        <h2 className="text-2xl font-bold text-white">Profile Node Variables</h2>
        <p className="text-neutral-400 text-xs mt-1">Verify metadata coordinates and node-level authorization tiers.</p>
        
        <div className="mt-8 border-t border-neutral-900/60 pt-6 space-y-4">
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">Operator Role</span>
            <span className="text-sm font-semibold text-neutral-300">
              {localStorage.getItem('user_role') === 'admin' ? 'Administrative Overseer' : 'Standard Pipeline Operator'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};