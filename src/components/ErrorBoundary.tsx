import React, { Component } from 'react';
import type { ReactNode } from 'react';
import type { ErrorInfo } from 'react';
import { Container, Title, Text, Button, Stack, Alert, Code } from '@mantine/core';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service
    this.logErrorToService(error, errorInfo);

    // Call custom error handler
    this.props.onError?.(error, errorInfo);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In production, send to error monitoring service (Sentry, LogRocket, etc.)
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
      console.error('Error logged to monitoring service:', error, errorInfo);
    } else {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Container size="md" style={{ paddingTop: '2rem' }}>
          <Stack gap="lg">
            <Alert
              icon={<IconAlertTriangle size={16} />}
              title="Something went wrong"
              color="red"
              variant="light"
            >
              An unexpected error occurred. Our team has been notified.
            </Alert>

            <div>
              <Title order={2} mb="md">
                Application Error
              </Title>
              <Text color="dimmed" mb="lg">
                We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
              </Text>

              <Stack gap="sm">
                <Button
                  leftSection={<IconRefresh size={16} />}
                  onClick={this.handleRetry}
                  variant="filled"
                >
                  Try Again
                </Button>
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                >
                  Reload Page
                </Button>
              </Stack>
            </div>

            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div>
                <Title order={4} mb="sm">
                  Error Details (Development Only)
                </Title>
                <Code block>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </Code>
              </div>
            )}
          </Stack>
        </Container>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook for error reporting
export const useErrorHandler = () => {
  const handleError = React.useCallback((error: Error, errorInfo?: any) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error reported:', error, errorInfo);
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }, []);

  return handleError;
};
