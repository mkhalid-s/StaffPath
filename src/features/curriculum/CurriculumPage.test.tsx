import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { appStore } from '../../lib/appStore';
import { CurriculumPage } from './CurriculumPage';

describe('CurriculumPage', () => {
  beforeEach(() => { localStorage.clear(); appStore.reset(); });

  it('renders the authoritative coverage map heading', () => {
    render(<CurriculumPage />);
    expect(screen.getByText('AUTHORITATIVE COVERAGE MAP')).toBeInTheDocument();
    expect(screen.getByText('Basic → advanced → mastery')).toBeInTheDocument();
  });

  it('shows all 12 modules initially with the All filter', () => {
    render(<CurriculumPage />);
    const weekLabels = screen.getAllByText(/^WEEK \d+$/);
    expect(weekLabels).toHaveLength(12);
  });

  it('reduces visible modules when filtering by level', () => {
    render(<CurriculumPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Basic' }));
    const weekLabels = screen.getAllByText(/^WEEK \d+$/);
    expect(weekLabels.length).toBeGreaterThan(0);
    expect(weekLabels.length).toBeLessThan(12);
  });

  it('shows 0/12 weeks complete for a new user', () => {
    render(<CurriculumPage />);
    expect(screen.getByText('0/12')).toBeInTheDocument();
    expect(screen.getByText('weeks complete')).toBeInTheDocument();
  });
});
