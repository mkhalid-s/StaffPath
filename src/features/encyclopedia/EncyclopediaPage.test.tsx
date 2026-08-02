import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EncyclopediaPage } from './EncyclopediaPage';
import { appStore } from '../../lib/appStore';

describe('EncyclopediaPage', () => {
  it('filters chapters and opens the complete chapter', () => {
    appStore.reset();
    render(<EncyclopediaPage />);
    fireEvent.change(screen.getByLabelText('Search encyclopedia'), { target: { value: 'webhook' } });
    expect(screen.getByText('Idempotent payment webhooks')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Idempotent payment webhooks'));
    expect(screen.getByText('Worked solution')).toBeInTheDocument();
    expect(screen.getByText(/one-minute interview answer/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Mark chapter complete' }));
    expect(appStore.get().completedChapters).toContain('idempotent-webhooks');
  });
});
