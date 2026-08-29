import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { communicationLessons } from '../../data/communicationLessons';
import { appStore } from '../../lib/appStore';
import { CommunicationPage } from './CommunicationPage';

describe('CommunicationPage', () => {
  beforeEach(() => appStore.reset());
  it('covers covers the complete responsible nontechnical curriculum', () => {
    expect(communicationLessons).toHaveLength(19);
    render(<CommunicationPage />);
    expect(screen.getByText('Listen like a leader')).toBeInTheDocument();
    expect(screen.getByText('Intentional presence')).toBeInTheDocument();
  });
  it('requires and persists practice evidence', () => {
    render(<CommunicationPage />);
    const complete = screen.getByRole('button', { name: 'Complete with evidence' });
    expect(complete).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Communication practice evidence'), { target: { value: 'Recorded my introduction and removed two fillers.' } });
    fireEvent.click(complete);
    expect(appStore.get().communicationLessons['first-impression'].completedAt).toBeTruthy();
  });
});
