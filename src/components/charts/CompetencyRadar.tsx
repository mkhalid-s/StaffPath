import type { StaffPathState } from '../../domain/appState';
import { getCompetencyScores } from '../../lib/intelligence';

interface CompetencyRadarProps {
  state: StaffPathState;
  size?: number;
}

export function CompetencyRadar({ state, size = 280 }: CompetencyRadarProps) {
  const scores = getCompetencyScores(state);
  const center = size / 2;
  const radius = size / 2 - 40;
  const levels = [1, 2, 3, 4, 5];
  const angleStep = (2 * Math.PI) / scores.length;

  function point(index: number, value: number) {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 5) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  }

  const dataPoints = scores.map((_, i) => point(i, scores[i].score));
  const polygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="competency-radar" role="img" aria-label="Competency radar chart">
      {levels.map((level) => (
        <polygon
          key={level}
          points={scores.map((_, i) => { const p = point(i, level); return `${p.x},${p.y}`; }).join(' ')}
          fill="none"
          stroke="var(--line)"
          strokeWidth="1"
        />
      ))}
      {scores.map((_, i) => {
        const outer = point(i, 5);
        return <line key={i} x1={center} y1={center} x2={outer.x} y2={outer.y} stroke="var(--line)" strokeWidth="1" />;
      })}
      <polygon points={polygon} fill="rgba(45,90,61,0.15)" stroke="var(--green)" strokeWidth="2" />
      {dataPoints.map((p, i) => (
        <circle key={scores[i].id} cx={p.x} cy={p.y} r="4" fill="var(--green)" />
      ))}
      {scores.map((item, i) => {
        const label = point(i, 5.8);
        return (
          <text key={item.id} x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle" className="radar-label">
            {item.label}
          </text>
        );
      })}
    </svg>
  );
}
