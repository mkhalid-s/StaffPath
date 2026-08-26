import type { FeatureDefinition } from '../lib/featureUnlocks';
import { getUnlockProgress } from '../lib/featureUnlocks';
import { useStaffPathState } from '../lib/appStore';
import { Link } from '../lib/router';

export function LockedFeaturePage({ feature }: { feature: FeatureDefinition }) {
  const state = useStaffPathState();
  const progress = getUnlockProgress(state, feature.id);

  return (
    <div className="page locked-feature-page">
      <div className="locked-feature-card">
        <span className="locked-icon" aria-hidden="true">🔒</span>
        <p className="eyebrow">FEATURE LOCKED</p>
        <h1>{feature.label}</h1>
        <p>This section unlocks as you build momentum in your preparation journey.</p>
        <div className="unlock-requirement">
          <strong>Unlock requirement</strong>
          <p>{feature.requirement}</p>
        </div>
        <div className="unlock-progress-bar" role="progressbar" aria-valuenow={progress.percent} aria-valuemin={0} aria-valuemax={100}>
          <div className="unlock-progress-fill" style={{ width: `${progress.percent}%` }} />
        </div>
        <p className="unlock-progress-label">{progress.current} of {progress.target} complete</p>
        <div className="button-row">
          <Link className="button primary" to="/roadmap">Continue roadmap →</Link>
          <Link className="button" to="/">Back to Today</Link>
        </div>
      </div>
    </div>
  );
}
