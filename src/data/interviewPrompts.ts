import { encyclopediaChapters } from './encyclopediaChapters';
import type { MockInterviewRecord } from '../domain/appState';

const systemDesignQuestions = encyclopediaChapters
  .filter((c) => c.category !== 'AI' && c.category !== 'Leadership')
  .map((c) => c.interviewQuestion);

const aiDesignQuestions = encyclopediaChapters
  .filter((c) => c.category === 'AI')
  .map((c) => c.interviewQuestion);

const leadershipQuestions = encyclopediaChapters
  .filter((c) => c.category === 'Leadership')
  .map((c) => c.interviewQuestion);

export const interviewPrompts: Record<MockInterviewRecord['type'], string[]> = {
  'system-design': systemDesignQuestions,
  'ai-design': aiDesignQuestions,
  behavioral: [
    // Core Staff behavioral questions
    'Tell me about a time you influenced a major technical decision without direct authority.',
    'Tell me about a failure you owned — what you did, what changed, and what you would do differently.',
    'Describe the most difficult technical disagreement you have navigated and how it was resolved.',
    'Tell me about a multi-team technical strategy you drove from diagnosis to adoption.',
    'Describe how you have grown another engineer\'s scope or capability in a lasting way.',
    'Tell me about a time you traded delivery speed against long-term reliability or technical quality.',
    'Describe a high-stakes decision you made with incomplete information.',
    'Tell me about a time you changed technical direction after receiving evidence that contradicted your plan.',
    // Staff-specific probes
    'Describe a time you had to say no to a stakeholder request and preserve the relationship.',
    'Tell me about a platform or foundational investment you drove that others benefited from.',
    'Describe the most complex cross-functional alignment you have led.',
    'Tell me about a time you identified and addressed a systemic problem others had normalized.',
    'Describe a time you had to reduce the scope of an initiative without losing its strategic value.',
    'Tell me about a technical mentor relationship you built and what made it effective.',
    'Describe a production incident you led — from first alert to postmortem action items.',
    'Tell me about a time your technical judgment turned out to be wrong and what you did about it.',
    ...leadershipQuestions,
  ],
  coding: [
    'Implement an LRU cache and explain the concurrency trade-offs at different scales.',
    'Implement a token-bucket rate limiter that works correctly under concurrent requests.',
    'Schedule jobs with dependencies, detect cycles, and handle late arrivals.',
    'Merge overlapping intervals and discuss how the approach changes with streaming input.',
    'Find the top-K frequent events under a strict memory limit.',
    'Design a bounded concurrent work queue with cancellation and timeout support.',
    'Implement cursor-based pagination with stable ordering across concurrent writes.',
    'Reconcile two event streams with duplicates, reordering, and late arrivals.',
    'Implement a consistent-hash ring with virtual nodes and support for node addition.',
    'Design an in-memory key-value store with TTL expiry and atomic compare-and-swap.',
    'Implement a sliding-window rate limiter using a sorted set of timestamps.',
    'Write a trie-based autocomplete with ranked suggestions and prefix compression.',
    'Implement a thread-safe publish-subscribe bus with backpressure.',
    'Build a least-recently-used cache with O(1) get, put, and delete using a doubly-linked list.',
    'Implement a distributed counter that converges correctly across concurrent increments.',
    'Detect a cycle in a distributed dependency graph with millions of nodes.',
  ],
};
