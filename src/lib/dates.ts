// Day keys are local-calendar dates (YYYY-MM-DD), not UTC days — the UTC day
// flips mid-afternoon for users west of UTC, which would mis-bucket streaks,
// heatmap cells, and due-date comparisons for evening sessions.
export function localDayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Stored values mix date-only keys (journal.date, practice attempts) and full
// ISO timestamps (completedAt). Date-only values are already day keys; a full
// timestamp is converted to the local calendar.
export function dayKeyOf(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return localDayKey(new Date(value));
}
