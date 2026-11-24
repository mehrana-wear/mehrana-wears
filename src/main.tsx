import { Component, ErrorInfo, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: Readonly<ErrorBoundaryProps>;
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error?.message || 'Unexpected rendering error' };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#2D2D2D] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-[#E8E2D8] rounded-3xl p-8 text-center shadow-lg space-y-4">
            <h1 className="font-serif text-2xl font-bold text-[#2D2D2D]">
              Mehrana <span className="font-normal lowercase text-[#8A9A5B]">wear</span>
            </h1>
            <p className="text-sm text-[#5F584E]">
              Something went wrong while loading the store.
            </p>
            {this.state.message && (
              <p className="text-xs text-[#A68F7A] bg-[#FAF7F2] rounded-xl p-3 break-words">
                {this.state.message}
              </p>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-[#3F4C27] text-white text-xs font-bold rounded-full hover:bg-[#323D1F] transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
);
