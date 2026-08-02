import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { practiceCatalog } from '../../data/practiceCatalog';
import { appStore } from '../../lib/appStore';
import { PracticePage } from './PracticePage';

describe('PracticePage', () => {
  beforeEach(() => { appStore.reset(); vi.stubGlobal('crypto', { randomUUID: () => 'attempt-1' }); });

  it('contains all 47 curated scenarios', () => {
    expect(Object.values(practiceCatalog).flat()).toHaveLength(47);
    render(<PracticePage />);
    expect(screen.getByText('Design a URL shortener')).toBeInTheDocument();
  });

  it('scores and persists an attempt, then advances', () => {
    render(<PracticePage />);
    fireEvent.change(screen.getByLabelText('Practice response'), { target: { value: 'Requirements, estimates, design, failures.' } });
    fireEvent.change(screen.getByLabelText('Practice reflection'), { target: { value: 'Estimate before components.' } });
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Save attempt to handbook' }));
    expect(appStore.get().practiceAttempts[0]).toMatchObject({ title: 'Design a URL shortener', score: 1, response: 'Requirements, estimates, design, failures.' });
    expect(appStore.get().practiceCursor.design).toBe(1);
  });
});
