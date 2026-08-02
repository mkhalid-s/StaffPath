export interface LegacyPreparationState {
  name?: string;
  completed?: number[];
  communication?: number[];
  journal?: Array<{ artifact?: string }>;
  practiceAttempts?: unknown[];
  elapsed?: Record<string, number>;
}

export interface PreparationSummary {
  name: string;
  sessions: number;
  communicationReps: number;
  artifacts: number;
  practiceAttempts: number;
  focusHours: number;
}
