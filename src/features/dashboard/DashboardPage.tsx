import React from 'react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border border-neutral-900 p-8 rounded-2xl bg-[#0F0F0F]/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <h2 className="text-3xl font-black text-white">Telemetry Engine</h2>
        <p className="text-neutral-400 text-sm mt-1">Real-time analytical framework infrastructure.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-5 border border-neutral-900 rounded-xl bg-[#0A0A0A]/40">
            <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">Network Nodes</span>
            <p className="text-2xl font-bold text-white mt-1">37 Active</p>
          </div>
          <div className="p-5 border border-neutral-900 rounded-xl bg-[#0A0A0A]/40">
            <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">Response Latency</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">11ms</p>
          </div>
          <div className="p-5 border border-neutral-900 rounded-xl bg-[#0A0A0A]/40">
            <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">Encryption Level</span>
            <p className="text-2xl font-bold text-blue-400 mt-1">AES-GCM 256</p>
          </div>
        </div>
      </div>
    </div>
  );
};