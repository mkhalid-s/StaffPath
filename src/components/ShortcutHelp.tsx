import { SHORTCUTS } from '../lib/keyboardShortcuts';

interface ShortcutHelpProps {
  open: boolean;
  onClose: () => void;
}

export function ShortcutHelp({ open, onClose }: ShortcutHelpProps) {
  if (!open) return null;

  return (
    <div className="shortcut-overlay" role="dialog" aria-modal="true" aria-labelledby="shortcut-title">
      <button className="shortcut-backdrop" onClick={onClose} aria-label="Close shortcuts" />
      <div className="shortcut-panel">
        <header>
          <div>
            <p className="eyebrow">KEYBOARD SHORTCUTS</p>
            <h2 id="shortcut-title">Work faster</h2>
          </div>
          <button onClick={onClose} aria-label="Close">×</button>
        </header>
        <div className="shortcut-list">
          {SHORTCUTS.map((shortcut) => (
            <div key={shortcut.label} className="shortcut-row">
              <kbd>{shortcut.keys}</kbd>
              <div>
                <strong>{shortcut.label}</strong>
                <p>{shortcut.description}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="shortcut-hint">Use Ctrl instead of ⌘ on Windows and Linux.</p>
      </div>
    </div>
  );
}
