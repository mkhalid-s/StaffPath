import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { appStore } from '../../lib/appStore';
import { getRoadmapFocusSessionId } from '../../lib/studyWeek';
import { RoadmapPage } from './RoadmapPage';

describe('RoadmapPage', () => {
  beforeEach(() => appStore.reset());

  it('renders the complete 90-session journey', () => {
    render(<RoadmapPage />);
    expect(screen.getByText('Present your capstone')).toBeInTheDocument();
    expect(screen.getByText('Understand the Staff role')).toBeInTheDocument();
    expect(screen.getByText('Evidence & interview readiness')).toBeInTheDocument();
  });

  it('persists reflection, artifact, communication and completion evidence', () => {
    render(<RoadmapPage />);
    const sessionId = String(getRoadmapFocusSessionId(appStore.get()));
    fireEvent.change(screen.getByLabelText('Session reflection'), { target: { value: 'Scope is broader than code.' } });
    fireEvent.change(screen.getByLabelText('Session artifact'), { target: { value: 'staff-motivation.md' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Complete session' }));
    expect(appStore.get().roadmap[sessionId]).toMatchObject({ reflection: 'Scope is broader than code.', artifact: 'staff-motivation.md', communicationComplete: true });
    expect(appStore.get().roadmap[sessionId].completedAt).toBeTruthy();
  });
});
