import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', system-ui, sans-serif",
          background: '#F7F8FC',
          padding: '2rem',
        }}>
          <div style={{
            maxWidth: '480px',
            textAlign: 'center',
            background: 'white',
            borderRadius: '24px',
            padding: '48px 32px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            border: '1px solid #E8EAED',
          }}>
            <div style={{
              width: '64px', height: '64px',
              background: '#FEF2F2',
              borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '28px',
            }}>⚠️</div>
            <h2 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1A1A2E',
              marginBottom: '12px',
            }}>Something went wrong</h2>
            <p style={{
              color: '#6B7280',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              marginBottom: '24px',
            }}>
              FindSpace encountered an unexpected error. Please refresh the page and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '9999px',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 4px 6px -1px rgba(108,99,255,0.3)',
              }}
            >
              Refresh Page
            </button>
            {this.state.error && (
              <details style={{
                marginTop: '24px',
                textAlign: 'left',
                padding: '12px 16px',
                background: '#F7F8FC',
                borderRadius: '12px',
                fontSize: '0.75rem',
                color: '#6B7280',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '8px' }}>
                  Technical Details
                </summary>
                {this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
