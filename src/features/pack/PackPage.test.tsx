import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { appStore } from '../../lib/appStore';
import { PackPage } from './PackPage';

describe('PackPage', () => {
  beforeEach(() => { localStorage.clear(); appStore.reset(); });

  it('starts as a picker and becomes a study path when a pack is selected', () => {
    render(<PackPage />);
    expect(screen.getByText(/Pick the loop you are actually interviewing for/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Google Pack/ }));
    expect(appStore.get().profile.selectedCompanyPack).toBe('google');
    expect(screen.getByText('Chapters this pack rewrites')).toBeInTheDocument();
    expect(screen.getByText('Pack scenarios')).toBeInTheDocument();
    expect(screen.getByText(/Design a distributed cron service/)).toBeInTheDocument();
  });
});
