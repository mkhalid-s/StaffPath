import type { ActivityDay } from '../../lib/intelligence';

interface TimeHeatmapProps {
  data: ActivityDay[];
}

function intensityClass(total: number): string {
  if (total === 0) return 'heat-0';
  if (total === 1) return 'heat-1';
  if (total === 2) return 'heat-2';
  return 'heat-3';
}

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function TimeHeatmap({ data }: TimeHeatmapProps) {
  const weeks: ActivityDay[][] = [];
  for (let i = 0; i < data.length; i += 7) weeks.push(data.slice(i, i + 7));

  return (
    <div className="time-heatmap" role="img" aria-label="Activity heatmap for the last 28 days">
      <div className="heatmap-header">
        {dayLabels.map((label) => <span key={label}>{label}</span>)}
      </div>
      {weeks.map((week, weekIndex) => (
        <div className="heatmap-row" key={weekIndex}>
          {week.map((day) => (
            <div
              key={day.date}
              className={`heatmap-cell ${intensityClass(day.total)}`}
              title={`${day.date}: ${day.sessions} session${day.sessions === 1 ? '' : 's'}, ${day.practice} practice, ${day.journal} journal`}
            />
          ))}
        </div>
      ))}
      <div className="heatmap-legend">
        <span>Less</span>
        <div className="heatmap-cell heat-0" />
        <div className="heatmap-cell heat-1" />
        <div className="heatmap-cell heat-2" />
        <div className="heatmap-cell heat-3" />
        <span>More</span>
      </div>
    </div>
  );
}
