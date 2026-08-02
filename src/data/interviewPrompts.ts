import { practiceCatalog } from './practiceCatalog';
import type { MockInterviewRecord } from '../domain/appState';

export const interviewPrompts: Record<MockInterviewRecord['type'], string[]> = {
  'system-design': practiceCatalog.design.filter((item) => !item.title.includes('AI') && !item.title.includes('RAG')).map((item) => item.title),
  'ai-design': ['Design an enterprise RAG platform', 'Design an AI coding assistant', 'Design a model router', 'Design a semantic cache', 'Design an AI gateway with guardrails', 'Design a customer-support agent with human escalation'],
  behavioral: ['Tell me about a time you influenced a decision without authority.', 'Tell me about a failure you owned and what changed afterward.', 'Describe a difficult technical disagreement and how it was resolved.', 'Tell me about a strategy you drove across multiple teams.', 'Describe how you grew another engineer’s scope or capability.', 'Tell me about a time you traded delivery speed against long-term risk.', 'Describe a decision you made with incomplete information.', 'Tell me about a time you changed direction after receiving evidence.'],
  coding: ['Implement an LRU cache and explain concurrency trade-offs.', 'Implement a token-bucket rate limiter.', 'Schedule jobs with dependencies and detect cycles.', 'Merge overlapping intervals and discuss streaming input.', 'Find top-K frequent events under a memory limit.', 'Design a bounded concurrent work queue with cancellation.', 'Implement cursor pagination with stable ordering.', 'Reconcile two event streams with duplicates and late arrival.'],
};
