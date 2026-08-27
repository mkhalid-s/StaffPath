import { encyclopediaChapters } from '../data/encyclopediaChapters';
import { practiceCatalog } from '../data/practiceCatalog';
import type { StaffPathState } from '../domain/appState';

export interface CompetencyDefinition {
  id: string;
  title: string;
  description: string;
  evidencePrompt: string;
}

export const COMPETENCIES: CompetencyDefinition[] = [
  { id: 'technical-foundations', title: 'Technical foundations', description: 'Networking, data, distributed systems and engineering fundamentals', evidencePrompt: 'Name a system you debugged or designed that required deep fundamentals.' },
  { id: 'system-design', title: 'System design', description: 'Requirements, estimation, architecture, trade-offs and evolution', evidencePrompt: 'Describe an architecture decision you made and the trade-offs you weighed.' },
  { id: 'production', title: 'Production engineering', description: 'Reliability, security, observability, operations and cost', evidencePrompt: 'Share an incident, SLO, or operational improvement you led.' },
  { id: 'business', title: 'Business and product', description: 'Customer outcomes, metrics, prioritization and commercial context', evidencePrompt: 'Explain how you connected a technical choice to a business outcome.' },
  { id: 'execution', title: 'Cross-team execution', description: 'Planning, dependencies, migrations, risk and delivery', evidencePrompt: 'Describe a multi-team delivery you coordinated through ambiguity.' },
  { id: 'influence', title: 'Influence and strategy', description: 'Alignment, decisions, technical direction and authority-free leadership', evidencePrompt: 'Share a time you changed direction without formal authority.' },
  { id: 'communication', title: 'Communication', description: 'Listening, writing, speaking, facilitation and difficult conversations', evidencePrompt: 'Describe a high-stakes conversation or presentation you facilitated.' },
  { id: 'mentoring', title: 'Mentoring and leverage', description: 'Coaching, delegation, standards and growing organizational capability', evidencePrompt: 'Explain how you multiplied impact through others.' },
];

const competencyToChapters: Record<string, string[]> = {
  'technical-foundations': ['cap-pacelc-consistency', 'consensus-coordination', 'distributed-transactions'],
  'system-design': ['requirements-quality-attributes', 'load-balancing-rate-limits', 'capacity-estimation'],
  'production': ['slo-observability-incidents', 'resilience-patterns', 'cache-stampede'],
  'business': ['capacity-estimation', 'technical-strategy-decisions'],
  'execution': ['safe-delivery-migrations', 'distributed-transactions'],
  'influence': ['technical-strategy-decisions', 'influence-conflict-feedback'],
  'communication': ['influence-conflict-feedback', 'api-protocol-selection'],
  'mentoring': ['influence-conflict-feedback', 'technical-strategy-decisions'],
};

const competencyToPractice: Record<string, string[]> = {
  'technical-foundations': ['problem'],
  'system-design': ['design'],
  'production': ['problem', 'sdlc'],
  'business': ['people'],
  'execution': ['sdlc', 'people'],
  'influence': ['people'],
  'communication': ['people'],
  'mentoring': ['people'],
};

export interface Recommendation {
  type: 'chapter' | 'practice' | 'communication' | 'roadmap';
  title: string;
  reason: string;
  to: string;
  priority: number;
}

export function findWeakestCompetencies(state: StaffPathState, limit = 3): string[] {
  return COMPETENCIES
    .map((comp) => ({ id: comp.id, score: state.assessments[comp.id]?.score }))
    .filter((item): item is { id: string; score: number } => item.score !== undefined)
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((item) => item.id);
}

export function buildPersonalizedRecommendations(state: StaffPathState): Recommendation[] {
  const weak = findWeakestCompetencies(state, 4);
  const recommendations: Recommendation[] = [];

  for (const competencyId of weak) {
    const comp = COMPETENCIES.find((item) => item.id === competencyId);
    const score = state.assessments[competencyId]?.score ?? 1;
    if (!comp) continue;

    const chapterIds = competencyToChapters[competencyId] || [];
    const chapter = encyclopediaChapters.find((item) => chapterIds.includes(item.id) && !state.completedChapters.includes(item.id));
    if (chapter) {
      recommendations.push({
        type: 'chapter',
        title: `Study: ${chapter.title}`,
        reason: `Strengthen ${comp.title.toLowerCase()} (current: ${score}/5).`,
        to: `/encyclopedia?chapter=${chapter.id}`,
        priority: 100 - score * 10,
      });
    }

    const tracks = competencyToPractice[competencyId] || ['design'];
    const track = tracks[0] as keyof typeof practiceCatalog;
    const scenario = practiceCatalog[track][state.practiceCursor[track] % practiceCatalog[track].length];
    recommendations.push({
      type: 'practice',
      title: `Practice: ${scenario.title}`,
      reason: `Apply ${comp.title.toLowerCase()} in a realistic scenario.`,
      to: '/practice',
      priority: 90 - score * 10,
    });
  }

  if (scoreBelow(state, 'communication', 3)) {
    recommendations.push({
      type: 'communication',
      title: 'Complete a communication rep',
      reason: 'Communication is a gap area — daily reps build interview fluency.',
      to: '/communication',
      priority: 70,
    });
  }

  return recommendations
    .sort((a, b) => b.priority - a.priority)
    .filter((item, index, list) => list.findIndex((other) => other.title === item.title) === index)
    .slice(0, 5);
}

function scoreBelow(state: StaffPathState, id: string, threshold: number): boolean {
  return (state.assessments[id]?.score ?? 1) < threshold;
}

export function suggestedStartingWeek(state: StaffPathState): number {
  const average = COMPETENCIES.reduce((sum, comp) => sum + (state.assessments[comp.id]?.score ?? 1), 0) / COMPETENCIES.length;
  if (average >= 4) return 7;
  if (average >= 3) return 4;
  if (average >= 2) return 2;
  return 1;
}

export { buildWhatsNextActions, identifyFocusAreas, analyzeLearningPatterns } from './intelligence';
