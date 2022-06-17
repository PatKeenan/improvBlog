import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    };
  }
  componentDidCatch() {
    // You can use your own error logging service here
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
