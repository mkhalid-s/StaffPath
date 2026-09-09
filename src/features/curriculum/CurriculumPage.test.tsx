import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { appStore } from '../../lib/appStore';
import { CurriculumPage } from './CurriculumPage';

describe('CurriculumPage', () => {
  beforeEach(() => { localStorage.clear(); appStore.reset(); });

  it('explains how the map connects to roadmap and packs', () => {
    render(<CurriculumPage />);
    expect(screen.getByText('HOW TO STUDY')).toBeInTheDocument();
    expect(screen.getByText('A 12-week knowledge map')).toBeInTheDocument();
    expect(screen.getByText(/Curriculum tells you what to learn/)).toBeInTheDocument();
  });

  it('shows all 12 modules initially with the All filter', () => {
    render(<CurriculumPage />);
    expect(screen.getAllByText(/^WEEK \d+ · /)).toHaveLength(12);
  });

  it('reduces visible modules when filtering by level', () => {
    render(<CurriculumPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Basic' }));
    expect(screen.getAllByText(/^WEEK \d+ · /).length).toBeLessThan(12);
    expect(screen.getByText('System design foundations')).toBeInTheDocument();
  });

  it('links each module into encyclopedia, practice, and roadmap', () => {
    render(<CurriculumPage />);
    expect(screen.getAllByRole('link', { name: /Start with / }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Open roadmap week / }).length).toBe(12);
  });
});
