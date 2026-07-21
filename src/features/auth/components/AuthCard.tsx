import React from 'react';

export const AuthCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700/50 backdrop-blur-md rounded-2xl p-8 shadow-xl shadow-slate-950/20">
      {children}
    </div>
  );
};
