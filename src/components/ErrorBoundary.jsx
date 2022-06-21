import React, {Component} from "react";
import {Callout} from "@blueprintjs/core";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Callout title="Error" intent="danger" icon="error">
          <>Something broke! Please refresh and try again.</>
        </Callout>
      )
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
