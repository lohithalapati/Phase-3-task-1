import React, { Component, ErrorInfo, ReactNode } from "react";
import { AppError } from "../types/AppError";
import { ErrorPipeline } from "../pipeline/ErrorPipeline";
import { ErrorFallback } from "../pages/ErrorFallback";
import { ErrorMapper } from "../mapper/ErrorMapper";

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: AppError; resetErrorBoundary: () => void }>;
}

interface State {
  error: AppError | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    error: null,
  };

  public static getDerivedStateFromError(error: unknown): State {
    if (error instanceof AppError) {
      return { error };
    }
    return { error: ErrorMapper.map(error) };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    ErrorPipeline.handle(error, `ErrorBoundary:${errorInfo.componentStack || "unknown"}`);
  }

  private handleReset = (): void => {
    this.setState({ error: null });
  };

  public override render(): ReactNode {
    const { error } = this.state;
    const { children, fallback: CustomFallback } = this.props;

    if (error) {
      if (CustomFallback) {
        return <CustomFallback error={error} resetErrorBoundary={this.handleReset} />;
      }
      return <ErrorFallback error={error} resetErrorBoundary={this.handleReset} />;
    }

    return children;
  }
}