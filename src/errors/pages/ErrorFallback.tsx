import React, { useEffect } from "react";
import { AppError } from "../types/AppError";

interface ErrorFallbackProps {
  error: AppError;
  resetErrorBoundary: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.ctrlKey) {
        resetErrorBoundary();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resetErrorBoundary]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6 select-none"
    >
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-xl transition-all duration-300">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-lg">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              System Interrupted
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Error Core Code: {error.code}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-4 mb-6 border border-gray-150 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 break-words">
            {error.message}
          </p>
          {error.context && Object.keys(error.context).length > 0 && (
            <details className="mt-2 text-xs text-gray-500 cursor-pointer">
              <summary className="outline-none hover:text-gray-700 dark:hover:text-gray-300">
                Show Technical Context Metadata
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded overflow-x-auto text-left leading-relaxed">
                {JSON.stringify(error.context, null, 2)}
              </pre>
            </details>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={resetErrorBoundary}
            className="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-950 dark:focus:ring-white text-sm"
          >
            Attempt Safe Recovery <kbd className="ml-2 text-xs opacity-60">Ctrl + Enter</kbd>
          </button>

          <button
            onClick={() => { window.location.href = "/"; }}
            className="w-full py-2.5 px-4 bg-transparent border border-gray-300 dark:border-gray-750 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors text-sm"
          >
            Return to Dashboard Home
          </button>
        </div>
      </div>
    </div>
  );
};