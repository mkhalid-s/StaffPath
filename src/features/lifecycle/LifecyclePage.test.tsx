import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { appStore } from '../../lib/appStore';
import { LifecyclePage } from './LifecyclePage';

const stageTitles = ['Discover', 'Plan', 'Learn', 'Practice', 'Reflect', 'Assess', 'Interview', 'Operate'];

describe('LifecyclePage', () => {
  beforeEach(() => { localStorage.clear(); appStore.reset(); });

  it('renders all 8 lifecycle stages', () => {
    render(<LifecyclePage />);
    for (const title of stageTitles) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    }
  });

  it('shows the readiness gates section with 8 gate items', () => {
    render(<LifecyclePage />);
    expect(screen.getByText('READINESS GATES')).toBeInTheDocument();
    expect(screen.getByText(/Interview readiness/)).toBeInTheDocument();
    expect(screen.getByText('Run a complete 45-min design without losing structure')).toBeInTheDocument();
    expect(screen.getByText('Last 3 mocks average ≥ 4 / 5 with no dimension below 3')).toBeInTheDocument();
    const gateLabels = document.querySelectorAll('.gate-label');
    expect(gateLabels.length).toBe(8);
  });

  it('shows the gates passed counter in the header', () => {
    render(<LifecyclePage />);
    expect(screen.getByText('gates passed')).toBeInTheDocument();
    expect(screen.getByText('0/8')).toBeInTheDocument();
  });

  it('shows all gates as not passed for a new user', () => {
    render(<LifecyclePage />);
    expect(screen.getByText(/Interview readiness — 0%/)).toBeInTheDocument();
  });
});
