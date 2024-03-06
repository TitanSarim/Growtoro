import { Component } from 'react';

import SomethingWR from './SomethingWR';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo,
    });
    // You can also log error messages to an error reporting service here
    // this.logErrorToMyService(error, errorInfo);
  }

  // eslint-disable-next-line class-methods-use-this
  // logErrorToMyService(error, errorInfo) {
  // Log error messages to your error reporting service
  // You can also access error and errorInfo here if needed
  // }

  render() {
    if (this.state.errorInfo) {
      if (process.env.NODE_ENV === 'production') {
        console.error('Error:', this.state.error);
        console.error('Error Info:', this.state.errorInfo);
        return <SomethingWR />;
      }

      return (
        <div
          style={{
            backgroundColor: 'rgb(255 0 0 / 20%)',
            color: 'red',
            padding: '1rem',
            fontFamily: 'arial',
          }}
        >
          <h2>Something went wrong.</h2>
          <div
            style={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'arial',
            }}
          >
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </div>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorBoundary;
