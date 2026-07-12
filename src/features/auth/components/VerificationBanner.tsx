import React from 'react';

export const VerificationBanner: React.FC = () => {
  return (
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6 flex items-start gap-3">
      <div className="text-amber-400 mt-0.5">⚠️</div>
      <div>
        <h4 className="text-xs font-semibold text-amber-300">Account verification required</h4>
        <p className="text-[11px] text-amber-200/80 mt-1 leading-relaxed">
          Please verify your email address to unlock unrestricted access to enterprise platform modules.
        </p>
      </div>
    </div>
  );
};
