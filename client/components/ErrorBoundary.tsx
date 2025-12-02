import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

const MAX_RETRY_COUNT = 3;

/**
 * Enhanced ErrorBoundary component with retry mechanism and better error reporting
 * 
 * @example
 * <ErrorBoundary onError={(error) => console.error(error)}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    retryCount: 0,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console with context
    console.error('🔴 ErrorBoundary caught an error:', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      retryCount: this.state.retryCount,
    });

    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you could send this to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
  }

  public componentDidUpdate(prevProps: Props) {
    // Reset error state when resetKeys change
    if (this.props.resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = this.props.resetKeys.some(
        (key, index) => key !== prevProps.resetKeys![index]
      );
      
      if (hasResetKeyChanged && this.state.hasError) {
        this.handleReset();
      }
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    });
  };

  private handleRetry = () => {
    if (this.state.retryCount < MAX_RETRY_COUNT) {
      this.setState((prevState) => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));
    } else {
      // Max retries reached, just reload
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private getErrorMessage = (): string => {
    const { error } = this.state;
    if (!error) return 'An unknown error occurred';

    // Provide user-friendly messages for common errors
    if (error.message.includes('ChunkLoadError') || error.message.includes('Failed to fetch')) {
      return 'Network connection issue. Please check your internet and try again.';
    }
    if (error.message.includes('timeout')) {
      return 'The request took too long. Please try again.';
    }
    if (error.message.includes('Cannot read properties of undefined')) {
      return 'Something went wrong while loading the content.';
    }

    return 'An unexpected error occurred. We\'re working to fix it.';
  };

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const canRetry = this.state.retryCount < MAX_RETRY_COUNT;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black px-4 py-12">
          <div className="text-center max-w-lg w-full">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-pulse"></div>
                <div className="relative bg-red-500/10 p-6 rounded-full border border-red-500/30">
                  <AlertCircle className="w-16 h-16 text-red-400" />
                </div>
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Oops! Something went wrong
            </h1>

            {/* User-friendly error message */}
            <p className="text-lg text-gray-300 mb-2">
              {this.getErrorMessage()}
            </p>

            {/* Retry count indicator */}
            {this.state.retryCount > 0 && canRetry && (
              <p className="text-sm text-gray-400 mb-6">
                Retry attempt {this.state.retryCount} of {MAX_RETRY_COUNT}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              {canRetry ? (
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                  aria-label="Try again"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              ) : (
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                  aria-label="Reload page"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Page
                </button>
              )}
              
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 border border-white/20 transition-all duration-300 hover:scale-105"
                aria-label="Go to homepage"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>

            {/* Developer info (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left bg-black/50 border border-red-500/30 rounded-lg overflow-hidden">
                <summary className="px-4 py-3 text-gray-300 cursor-pointer hover:bg-white/5 transition-colors flex items-center gap-2">
                  <Bug className="w-4 h-4 text-red-400" />
                  <span className="font-medium">Developer Info</span>
                </summary>
                <div className="px-4 py-3 border-t border-red-500/30">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-red-400 mb-2">Error:</h3>
                    <pre className="text-xs text-gray-300 bg-black/50 p-3 rounded overflow-auto">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.error.stack && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-red-400 mb-2">Stack Trace:</h3>
                      <pre className="text-xs text-gray-300 bg-black/50 p-3 rounded overflow-auto max-h-48">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  {this.state.errorInfo && (
                    <div>
                      <h3 className="text-sm font-semibold text-red-400 mb-2">Component Stack:</h3>
                      <pre className="text-xs text-gray-300 bg-black/50 p-3 rounded overflow-auto max-h-48">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Help text */}
            <p className="mt-6 text-sm text-gray-500">
              If this problem persists, please contact support with the error details.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

