import React from 'react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border border-neutral-900 p-8 rounded-2xl bg-[#0F0F0F]/60">
        <h2 className="text-2xl font-bold text-white">System Configurations</h2>
        <p className="text-neutral-400 text-xs mt-1">Manage global properties, multi-tenant boundaries, and core feature definitions.</p>
        
        <div className="mt-8 border-t border-neutral-900/60 pt-6 space-y-4">
          <div className="flex items-center justify-between p-4 border border-neutral-900 rounded-xl bg-[#0A0A0A]/40">
            <div>
              <p className="text-xs font-semibold text-neutral-200">OAuth Provider Hooks</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">Allow seamless Google Identity system integrations</p>
            </div>
            <div className="h-2 w-8 bg-blue-500/20 rounded-full border border-blue-500/40" />
          </div>
        </div>
      </div>
    </div>
  );
};