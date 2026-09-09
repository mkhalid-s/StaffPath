import { type ReactNode, useEffect, useState } from 'react';
import {
  LayoutDashboard, Map, Target, BookOpen, Zap,
  Search, CreditCard, Link2, TrendingUp, Mic,
  Brain, MessageSquare, Notebook, PenLine, Settings,
  Lock, Menu, Keyboard, Monitor, Moon, Sun,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  dashboard:     LayoutDashboard,
  roadmap:       Map,
  coach:         Target,
  curriculum:    BookOpen,
  practice:      Zap,
  encyclopedia:  Search,
  flashcards:    CreditCard,
  resources:     Link2,
  lifecycle:     TrendingUp,
  interviews:    Mic,
  skills:        Brain,
  communication: MessageSquare,
  handbook:      Notebook,
  journal:       PenLine,
  settings:      Settings,
};

const NAV_GROUPS = [
  { label: 'PREPARE', paths: ['/', '/roadmap', '/coach', '/curriculum'] },
  { label: 'PRACTICE', paths: ['/practice', '/interviews', '/communication', '/flashcards'] },
  { label: 'KNOWLEDGE', paths: ['/encyclopedia', '/resources', '/lifecycle'] },
  { label: 'EVIDENCE', paths: ['/skills', '/handbook', '/journal', '/settings'] },
];
import { ConnectionStatus } from '../components/ConnectionStatus';
import { QuickActionsFab } from '../components/QuickActionsFab';
import { SHOW_SHORTCUTS_EVENT } from '../lib/keyboardShortcuts';
import { FEATURE_BY_PATH, isPathUnlocked, NAVIGATION, getUnlockProgress } from '../lib/featureUnlocks';
import { useStaffPathState } from '../lib/appStore';
import { Link, usePathname } from '../lib/router';
import { getStoredTheme, persistTheme, THEME_CHANGE_EVENT, type ColorTheme } from '../lib/theme';

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ColorTheme>(() => getStoredTheme());
  const path = usePathname();
  const state = useStaffPathState();

  useEffect(() => {
    const sync = () => setTheme(getStoredTheme());
    window.addEventListener(THEME_CHANGE_EVENT, sync);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, sync);
  }, []);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}><span>S</span>StaffPath</Link>
        <nav aria-label="Main navigation">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="nav-group">
              <span className="nav-group-label">{group.label}</span>
              {group.paths.map((to) => {
                const entry = NAVIGATION.find(([p]) => p === to);
                if (!entry) return null;
                const [, label, icon] = entry;
                const unlocked = isPathUnlocked(state, to);
                const feature = FEATURE_BY_PATH[to];
                const progress = feature ? getUnlockProgress(state, feature.id) : null;
                const featureId = feature?.id ?? '';
                const NavIcon = ICON_MAP[featureId];
                const iconEl = NavIcon
                  ? <NavIcon size={15} strokeWidth={1.75} aria-hidden="true" />
                  : <span aria-hidden="true">{icon}</span>;
                if (!unlocked) {
                  return (
                    <span
                      key={to}
                      className="nav-locked"
                      title={`Locked: ${feature?.requirement ?? 'Complete more sessions to unlock'}`}
                      aria-label={`${label} locked. ${feature?.requirement ?? ''}`}
                    >
                      {iconEl}
                      <span className="nav-label">{label}</span>
                      <Lock className="nav-lock" size={12} strokeWidth={2} aria-hidden="true" />
                      {progress && progress.percent < 100 && (
                        <span className="nav-progress" aria-hidden="true">{progress.current}/{progress.target}</span>
                      )}
                    </span>
                  );
                }
                return (
                  <Link key={to} to={to} className={path === to ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                    {iconEl}{label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <small>PREPARATION SYSTEM</small>
          <strong>Local-first workspace</strong>
          <span>Your learning data stays in this browser.</span>
          <div className="sidebar-theme" role="group" aria-label="Color theme">
            <button type="button" className={theme === 'system' ? 'active' : ''} aria-pressed={theme === 'system'} title="Match system theme" onClick={() => persistTheme('system')}><Monitor size={14} strokeWidth={1.75} aria-hidden="true" /><span className="sr-only">System</span></button>
            <button type="button" className={theme === 'light' ? 'active' : ''} aria-pressed={theme === 'light'} title="Light theme" onClick={() => persistTheme('light')}><Sun size={14} strokeWidth={1.75} aria-hidden="true" /><span className="sr-only">Light</span></button>
            <button type="button" className={theme === 'dark' ? 'active' : ''} aria-pressed={theme === 'dark'} title="Dark theme" onClick={() => persistTheme('dark')}><Moon size={14} strokeWidth={1.75} aria-hidden="true" /><span className="sr-only">Dark</span></button>
          </div>
          <button type="button" className="shortcut-hint-link" onClick={() => window.dispatchEvent(new Event(SHOW_SHORTCUTS_EVENT))}><Keyboard size={13} strokeWidth={1.75} aria-hidden="true" /> Shortcuts</button>
        </div>
      </aside>
      <main>
        <ConnectionStatus />
        <header className="mobile-header">
          <Link className="brand" to="/"><span>S</span>StaffPath</Link>
          <button onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation"><Menu size={20} strokeWidth={1.75} /></button>
        </header>
        {children}
        <QuickActionsFab />
      </main>
      {menuOpen && <button className="menu-backdrop" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}
    </div>
  );
}
