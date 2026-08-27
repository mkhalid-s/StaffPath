import type { RoadmapSession } from '../../data/roadmap';

const communicationReps = [
  ['Explain it simply', "Record a two-minute explanation of today's idea without jargon."],
  ['Lead with the outcome', 'State the recommendation first, then give only the context needed.'],
  ['Practice active listening', 'Summarize another viewpoint fairly before responding.'],
  ['Tell a concise story', 'Use context, tension, action, and result in under three minutes.'],
  ['Handle an objection', 'Name the concern, test your understanding, then address the trade-off.'],
  ['Ask a stronger question', 'Write one open question that would reveal a hidden assumption.'],
  ['Teach back', "Present this week's insight, pause deliberately, and invite questions."],
] as const;

const BASE_MINUTES = 60;
const BASE_BLOCKS = [
  { minutes: 10, label: 'Recall', prompt: 'Retrieve yesterday’s key idea and name one remaining question.' },
  { minutes: 20, label: 'Learn', prompt: '' },
  { minutes: 20, label: 'Apply', prompt: '' },
  { minutes: 5, label: 'Communicate', prompt: '' },
  { minutes: 5, label: 'Reflect', prompt: '' },
] as const;

function scaleMinutes(minutes: number, dailyMinutes: number): number {
  return Math.max(1, Math.round((minutes / BASE_MINUTES) * dailyMinutes));
}

export function buildSessionPlan(session: RoadmapSession, dailyMinutes = BASE_MINUTES) {
  const [commTitle, commPrompt] = communicationReps[session.dayOfWeek];
  const prompts = [
    'Retrieve yesterday’s key idea and name one remaining question.',
    `Build a precise mental model for ${session.tags[0].toLowerCase()}.`,
    session.description,
    commPrompt,
    `Capture a decision, lesson, or artifact for “${session.outcome}”.`,
  ];
  const blocks = BASE_BLOCKS.map((block, index) => ({
    minutes: scaleMinutes(block.minutes, dailyMinutes),
    label: block.label,
    prompt: prompts[index],
  }));
  const total = blocks.reduce((sum, block) => sum + block.minutes, 0);
  if (total !== dailyMinutes) blocks[1].minutes += dailyMinutes - total;
  return { blocks, communicationTitle: commTitle, totalMinutes: dailyMinutes };
}
