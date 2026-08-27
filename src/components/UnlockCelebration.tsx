import { useEffect, useState } from 'react';
import { detectNewUnlocks } from '../lib/featureUnlocks';
import { appStore, useStaffPathState } from '../lib/appStore';

export function UnlockCelebration() {
  const state = useStaffPathState();
  const [celebrating, setCelebrating] = useState<ReturnType<typeof detectNewUnlocks>>([]);

  useEffect(() => {
    const newlyUnlocked = detectNewUnlocks(state);
    if (!newlyUnlocked.length) return;
    setCelebrating(newlyUnlocked);
    const ids = newlyUnlocked.map((feature) => feature.id);
    appStore.update((current) => ({
      ...current,
      profile: {
        ...current.profile,
        celebratedUnlocks: [...new Set([...current.profile.celebratedUnlocks, ...ids])],
      },
    }));
    const timer = window.setTimeout(() => setCelebrating([]), 5000);
    return () => window.clearTimeout(timer);
  }, [state]);

  if (!celebrating.length) return null;

  return (
    <div className="unlock-celebration" role="status" aria-live="polite">
      <div className="unlock-celebration-inner">
        <span className="unlock-badge">Unlocked</span>
        {celebrating.map((feature) => (
          <div key={feature.id}>
            <strong>{feature.icon} {feature.label}</strong>
            <p>{feature.requirement}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
