import React from 'react';

export const AuthLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-600 border-t-white" role="status">
        <span className="sr-only">Processing dynamic authentication contract payload...</span>
      </div>
    </div>
  );
};
