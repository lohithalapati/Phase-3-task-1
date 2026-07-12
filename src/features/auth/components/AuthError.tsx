import React from 'react';

export const AuthError: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4" role="alert">
      <p className="text-xs font-semibold text-red-400 leading-tight text-center">{message}</p>
    </div>
  );
};
