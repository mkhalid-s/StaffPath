import { type ReactNode, useState } from 'react';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { SHOW_SHORTCUTS_EVENT } from '../lib/keyboardShortcuts';
import { FEATURE_BY_PATH, isPathUnlocked, NAVIGATION, getUnlockProgress } from '../lib/featureUnlocks';
import { useStaffPathState } from '../lib/appStore';
import { Link, usePathname } from '../lib/router';

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const path = usePathname();
  const state = useStaffPathState();

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}><span>S</span>StaffPath</Link>
        <nav aria-label="Main navigation">
          {NAVIGATION.map(([to, label, icon]) => {
            const unlocked = isPathUnlocked(state, to);
            const feature = FEATURE_BY_PATH[to];
            const progress = feature ? getUnlockProgress(state, feature.id) : null;
            if (!unlocked) {
              return (
                <span
                  key={to}
                  className="nav-locked"
                  title={`Locked: ${feature?.requirement ?? 'Complete more sessions to unlock'}`}
                  aria-label={`${label} locked. ${feature?.requirement ?? ''}`}
                >
                  <span aria-hidden="true">{icon}</span>
                  <span className="nav-label">{label}</span>
                  <span className="nav-lock" aria-hidden="true">🔒</span>
                  {progress && progress.percent < 100 && (
                    <span className="nav-progress" aria-hidden="true">{progress.current}/{progress.target}</span>
                  )}
                </span>
              );
            }
            return (
              <Link key={to} to={to} className={path === to ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                <span aria-hidden="true">{icon}</span>{label}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <small>PREPARATION SYSTEM</small>
          <strong>Local-first workspace</strong>
          <span>Your learning data stays in this browser.</span>
          <button type="button" className="shortcut-hint-link" onClick={() => window.dispatchEvent(new Event(SHOW_SHORTCUTS_EVENT))}>⌘ ? Shortcuts</button>
        </div>
      </aside>
      <main>
        <ConnectionStatus />
        <header className="mobile-header">
          <Link className="brand" to="/"><span>S</span>StaffPath</Link>
          <button onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation">☰</button>
        </header>
        {children}
      </main>
      {menuOpen && <button className="menu-backdrop" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}
    </div>
  );
}
