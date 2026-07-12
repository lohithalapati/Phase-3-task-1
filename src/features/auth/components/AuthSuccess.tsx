import React from 'react';

export const AuthSuccess: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-4" role="status">
      <p className="text-xs font-semibold text-emerald-400 leading-tight text-center">{message}</p>
    </div>
  );
};
