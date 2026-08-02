import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { appStore } from '../../lib/appStore';
import { InterviewPage } from './InterviewPage';
describe('InterviewPage', () => {
  beforeEach(() => appStore.reset());
  it('runs a prompt and saves criterion-level mock evidence', () => { render(<InterviewPage />); expect(screen.getByText('Design a URL shortener')).toBeInTheDocument(); fireEvent.change(screen.getByLabelText('Requirements score'), { target: { value: '4' } }); fireEvent.click(screen.getByText('Save mock interview')); expect(appStore.get().mockInterviews).toHaveLength(1); expect(appStore.get().mockInterviews[0]).toMatchObject({ prompt: 'Design a URL shortener', criteria: { Requirements: 4 } }); });
  it('adds a mistake to spaced review', () => { render(<InterviewPage />); fireEvent.click(screen.getByText(/Mistake journal/)); fireEvent.change(screen.getByPlaceholderText('What were you trying to answer?'), { target: { value: 'How does outbox work?' } }); fireEvent.click(screen.getByText('Add to review queue')); expect(appStore.get().mistakes[0].reviewCount).toBe(0); });
});
