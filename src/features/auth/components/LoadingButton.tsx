import React from 'react';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({ children, loading, disabled, ...props }) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30 flex justify-center items-center gap-2"
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-200 border-t-white" />
      )}
      <span>{children}</span>
    </button>
  );
};
