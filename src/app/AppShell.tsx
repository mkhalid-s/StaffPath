import { type ReactNode, useState } from 'react';
import { Link, usePathname } from '../lib/router';

const navigation = [
  ['/', 'Today', '⌁'],
  ['/coach', 'Coach', '✦'],
  ['/roadmap', 'Roadmap', '□'],
  ['/curriculum', 'Curriculum', '◫'],
  ['/practice', 'Practice Lab', '△'],
  ['/encyclopedia', 'Encyclopedia', '⌕'],
  ['/resources', 'Resources', '↗'],
  ['/lifecycle', 'Lifecycle', '↻'],
  ['/interviews', 'Interview Studio', '◉'],
  ['/skills', 'Skills', '◇'],
  ['/communication', 'Communication', '◌'],
  ['/handbook', 'Handbook', '▤'],
  ['/journal', 'Journal', '≡'],
  ['/settings', 'Data & backup', '⚙'],
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const path = usePathname();
  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}><span>S</span>StaffPath</Link>
        <nav aria-label="Main navigation">
          {navigation.map(([to, label, icon]) => (
            <Link key={to} to={to} className={path === to ? 'active' : ''} onClick={() => setMenuOpen(false)}>
              <span aria-hidden="true">{icon}</span>{label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <small>PREPARATION SYSTEM</small>
          <strong>Local-first workspace</strong>
          <span>Your learning data stays in this browser.</span>
        </div>
      </aside>
      <main>
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
