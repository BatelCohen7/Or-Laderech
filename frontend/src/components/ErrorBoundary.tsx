import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, Button, LoadingSpinner } from './ui';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    console.error('Error caught by ErrorBoundary:', _);
    return { hasError: true, error: _, errorInfo: null, };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    window.location.reload();
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleGoHome = () => {
    window.location.href = '/';
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-cream-50 to-warmGold-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">אופס! משהו השתבש</h2>
              <p className="text-neutral-700 mb-6">
                אירעה שגיאה בלתי צפויה. אנו מתנצלים על אי הנוחות.
              </p>
              
              {this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-right">
                  <p className="text-red-700 font-medium mb-2">שגיאה:</p>
                  <p className="text-red-600 text-sm">{this.state.error.toString()}</p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="primary" 
                  icon={RefreshCw}
                  onClick={this.handleReload}
                >
                  רענן את הדף
                </Button>
                <Button 
                  variant="outline"
                  onClick={this.handleGoHome}
                >
                  חזור לדף הבית
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;