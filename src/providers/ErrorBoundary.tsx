import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Unhandled Global Runtime Error]:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div style={errorStyles.container}>
            <div style={errorStyles.box}>
              <h1 style={errorStyles.title}>Something went wrong</h1>
              <p style={errorStyles.message}>
                An unexpected framework runtime error occurred. Please refresh or contact support if the issue persists.
              </p>
              {this.state.error && <pre style={errorStyles.stack}>{this.state.error.message}</pre>}
              <button onClick={() => window.location.reload()} style={errorStyles.button}>
                Reload Application
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

const errorStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#0A0A0A',
    color: '#F5F5F5',
    fontFamily: 'system-ui, sans-serif',
  },
  box: {
    maxWidth: '500px',
    padding: '2rem',
    borderRadius: '12px',
    backgroundColor: '#161616',
    border: '1px solid #2A2A2A',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '1rem',
  },
  message: {
    color: '#A3A3A3',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
    lineHeight: 1.5,
  },
  stack: {
    textAlign: 'left' as const,
    backgroundColor: '#1E1E1E',
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    color: '#F43F5E',
    overflowX: 'auto' as const,
    marginBottom: '1.5rem',
  },
  button: {
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
  },
};

