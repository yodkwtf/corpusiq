import { Component } from "react";
import { AlertTriangle } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Dashboard error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-md rounded-2xl bg-surface p-8 text-center shadow-card dark:bg-surface-dark">
          <AlertTriangle className="mx-auto mb-3 text-warn-500" size={32} aria-hidden="true" />
          <h2 className="mb-2 text-lg font-semibold">Something went wrong with this view</h2>
          <p className="mb-4 text-sm text-text-secondary dark:text-text-secondary-dark">
            Your inputs are safe. Try adjusting them or starting over.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="btn-primary"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
