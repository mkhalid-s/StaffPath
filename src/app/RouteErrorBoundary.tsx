import { Component, type ErrorInfo, type ReactNode } from 'react';

export class RouteErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { if (import.meta.env.DEV) console.error(error, info); }
  render() { return this.state.failed ? <div className="page"><section className="migration-panel"><div><span>WORKSPACE ERROR</span><h2>This section could not be loaded.</h2><p>Your local data was not cleared. Reload to retry the route; if the issue persists, export a backup from Data &amp; backup after returning home.</p><div className="button-row"><button className="button primary" onClick={() => window.location.reload()}>Reload StaffPath</button><a className="button" href="/">Return home</a></div></div></section></div> : this.props.children; }
}
