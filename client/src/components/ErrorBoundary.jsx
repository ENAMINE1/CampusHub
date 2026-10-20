// Catches errors thrown while rendering the pages below it and shows a fallback instead of a blank screen.
// It has to be a class: React only offers error boundaries through class lifecycle methods.
import { Component } from 'react';
import ErrorState from './ui/ErrorState.jsx';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // In production this is where you would report to a logging service.
    console.error('Page crashed:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorState message="This page hit an unexpected error. Try another page." />
      );
    }
    return this.props.children;
  }
}
