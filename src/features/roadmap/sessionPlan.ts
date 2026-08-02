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

export function buildSessionPlan(session: RoadmapSession) {
  return {
    blocks: [
      { minutes: 10, label: 'Recall', prompt: 'Retrieve yesterday’s key idea and name one remaining question.' },
      { minutes: 20, label: 'Learn', prompt: `Build a precise mental model for ${session.tags[0].toLowerCase()}.` },
      { minutes: 20, label: 'Apply', prompt: session.description },
      { minutes: 5, label: 'Communicate', prompt: communicationReps[session.dayOfWeek][1] },
      { minutes: 5, label: 'Reflect', prompt: `Capture a decision, lesson, or artifact for “${session.outcome}”.` },
    ],
    communicationTitle: communicationReps[session.dayOfWeek][0],
  };
}
