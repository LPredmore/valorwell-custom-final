/**
 * Enhanced Error Boundary with logging and user-friendly fallbacks
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/utils/loggingService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  context?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const context = {
      component: 'ErrorBoundary',
      boundaryContext: this.props.context,
      retryCount: this.state.retryCount,
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    };

    logger.error('Error caught by error boundary', context, error);

    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    const newRetryCount = this.state.retryCount + 1;
    
    logger.info('Error boundary retry attempted', {
      component: 'ErrorBoundary',
      retryCount: newRetryCount,
      maxRetries: this.maxRetries,
      context: this.props.context
    });

    if (newRetryCount <= this.maxRetries) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: newRetryCount
      });
    }
  };

  handleReportIssue = () => {
    const errorReport = {
      error: {
        message: this.state.error?.message,
        stack: this.state.error?.stack,
        name: this.state.error?.name
      },
      errorInfo: this.state.errorInfo,
      context: this.props.context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount
    };

    // Copy to clipboard for user to report
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => {
        logger.info('Error report copied to clipboard', { component: 'ErrorBoundary' });
        alert('Error report copied to clipboard. Please share this with support.');
      })
      .catch((err) => {
        logger.error('Failed to copy error report to clipboard', {}, err);
        alert('Failed to copy error report. Please manually report the issue.');
      });
  };

  render() {
    if (this.state.hasError) {
      // If custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const canRetry = this.state.retryCount < this.maxRetries;
      const errorMessage = this.state.error?.message || 'An unexpected error occurred';

      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>
                {this.props.context ? 
                  `An error occurred in ${this.props.context}` : 
                  'An unexpected error has occurred'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                <strong>Error:</strong> {errorMessage}
              </div>
              
              {this.state.retryCount > 0 && (
                <div className="text-sm text-muted-foreground">
                  Retry attempts: {this.state.retryCount}/{this.maxRetries}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex gap-2">
              {canRetry && (
                <Button 
                  onClick={this.handleRetry}
                  variant="default"
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}
              
              <Button 
                onClick={this.handleReportIssue}
                variant="outline"
                className="flex-1"
              >
                <Bug className="w-4 h-4 mr-2" />
                Report Issue
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  context?: string
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary context={context}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}