import React from 'react';

interface ErrorPageProps {
  onRetry?: () => void;
  onGoHome?: () => void;
}

export const Error401: React.FC<ErrorPageProps> = ({ onGoHome }) => (
  <div role="alert" aria-label="Unauthorized Error" style={{ textAlign: 'center', padding: '48px' }}>
    <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#ef4444' }}>401</h1>
    <h2>Unauthorized</h2>
    <p>You must be logged in to access this resource.</p>
    <button
      aria-label="Go to login page"
      onClick={onGoHome || (() => window.location.href = '/login')}
      style={{ padding: '10px 24px', cursor: 'pointer' }}
    >
      Go to Login
    </button>
  </div>
);

export const Error403: React.FC<ErrorPageProps> = ({ onGoHome }) => (
  <div role="alert" aria-label="Forbidden Error" style={{ textAlign: 'center', padding: '48px' }}>
    <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#f97316' }}>403</h1>
    <h2>Forbidden</h2>
    <p>You do not have permission to access this resource.</p>
    <button
      aria-label="Go to home page"
      onClick={onGoHome || (() => window.location.href = '/')}
      style={{ padding: '10px 24px', cursor: 'pointer' }}
    >
      Go Home
    </button>
  </div>
);

export const Error404: React.FC<ErrorPageProps> = ({ onGoHome }) => (
  <div role="alert" aria-label="Not Found Error" style={{ textAlign: 'center', padding: '48px' }}>
    <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#3b82f6' }}>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you are looking for does not exist.</p>
    <button
      aria-label="Go to home page"
      onClick={onGoHome || (() => window.location.href = '/')}
      style={{ padding: '10px 24px', cursor: 'pointer' }}
    >
      Go Home
    </button>
  </div>
);

export const Error500: React.FC<ErrorPageProps> = ({ onRetry }) => (
  <div role="alert" aria-label="Server Error" style={{ textAlign: 'center', padding: '48px' }}>
    <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#8b5cf6' }}>500</h1>
    <h2>Internal Server Error</h2>
    <p>Something went wrong on our end. Please try again.</p>
    <button
      aria-label="Retry the request"
      onClick={onRetry || (() => window.location.reload())}
      style={{ padding: '10px 24px', cursor: 'pointer' }}
    >
      Try Again
    </button>
  </div>
);
