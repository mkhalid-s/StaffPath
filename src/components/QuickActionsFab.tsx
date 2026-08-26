import { useEffect, useRef, useState } from 'react';
import { appStore, useStaffPathState } from '../lib/appStore';
import { navigate } from '../lib/router';
import { buildQuickActions, getQuickActionBadgeCount, pickRandomPractice } from '../lib/quickActions';

export function QuickActionsFab() {
  const state = useStaffPathState();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const actions = buildQuickActions(state);
  const badgeCount = getQuickActionBadgeCount(state);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  function runAction(action: ReturnType<typeof buildQuickActions>[number]) {
    if (action.randomPractice) {
      appStore.update((current) => ({
        ...current,
        practiceCursor: pickRandomPractice(current),
      }));
    }
    navigate(action.to);
    setOpen(false);
  }

  if (!actions.length) return null;

  return (
    <div className="quick-actions-fab" ref={panelRef}>
      {open && (
        <div className="quick-actions-menu" role="menu" aria-label="Quick actions">
          <p className="eyebrow">QUICK ACTIONS</p>
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              role="menuitem"
              className="quick-action-item"
              onClick={() => runAction(action)}
            >
              <span className="quick-action-icon" aria-hidden="true">{action.icon}</span>
              <div>
                <strong>{action.title}</strong>
                {action.subtitle && <p>{action.subtitle}</p>}
              </div>
              {action.badge !== undefined && action.badge > 0 && (
                <span className="quick-action-badge">{action.badge}</span>
              )}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        className={`fab-button ${open ? 'open' : ''}`}
        aria-label={open ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="fab-icon" aria-hidden="true">{open ? '×' : '+'}</span>
        {!open && badgeCount > 0 && (
          <span className="fab-badge" aria-label={`${badgeCount} due items`}>{badgeCount}</span>
        )}
      </button>
    </div>
  );
}
