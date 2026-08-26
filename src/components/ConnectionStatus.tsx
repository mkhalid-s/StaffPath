import { useOnlineStatus, usePendingQueueCount } from '../lib/offlineQueue';

export function ConnectionStatus() {
  const online = useOnlineStatus();
  const pending = usePendingQueueCount();

  if (online && pending === 0) return null;

  return (
    <div className={`connection-status ${online ? 'syncing' : 'offline'}`} role="status">
      {!online ? (
        <>
          <span className="status-dot" aria-hidden="true" />
          Offline — changes saved locally
          {pending > 0 && ` · ${pending} pending`}
        </>
      ) : (
        <>
          <span className="status-dot" aria-hidden="true" />
          Back online — {pending} item{pending === 1 ? '' : 's'} synced
        </>
      )}
    </div>
  );
}
