export function ShortcutToast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="shortcut-toast" role="status" aria-live="polite">
      {message}
    </div>
  );
}
