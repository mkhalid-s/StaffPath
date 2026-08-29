import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { appStore } from '../../lib/appStore';
import { CoachPage } from './CoachPage';

describe('CoachPage', () => {
  beforeEach(() => { localStorage.clear(); appStore.reset(); });

  it('renders the coach heading', () => {
    render(<CoachPage />);
    expect(screen.getByText('Your preparation coach')).toBeInTheDocument();
  });

  it('shows the next best actions section', () => {
    render(<CoachPage />);
    expect(screen.getByText('Do less, deliberately.')).toBeInTheDocument();
  });

  it('renders the coach search form and accepts input', () => {
    render(<CoachPage />);
    const input = screen.getByLabelText('Coach question');
    fireEvent.change(input, { target: { value: 'duplicate payment processing' } });
    expect(input).toHaveValue('duplicate payment processing');
  });

  it('falls back to buildCoachActions without crashing for a new user', () => {
    expect(() => render(<CoachPage />)).not.toThrow();
    expect(screen.getByText('Your preparation coach')).toBeInTheDocument();
  });
});
