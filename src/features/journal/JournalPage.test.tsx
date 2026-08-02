import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { appStore } from '../../lib/appStore';
import { JournalPage } from './JournalPage';

describe('JournalPage', () => {
  beforeEach(() => { appStore.reset(); vi.stubGlobal('crypto', { randomUUID: () => 'journal-1' }); });
  it('captures learning, application, artifact, and tags', () => {
    render(<JournalPage />);
    fireEvent.change(screen.getByLabelText('Journal learning'), { target: { value: 'Retries need idempotency.' } });
    fireEvent.change(screen.getByLabelText('Journal application'), { target: { value: 'Review webhook handler.' } });
    fireEvent.change(screen.getByLabelText('Journal artifact'), { target: { value: 'adr-12.md' } });
    fireEvent.change(screen.getByLabelText('Journal tags'), { target: { value: 'reliability, payments' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save reflection' }));
    expect(appStore.get().journal[0]).toMatchObject({ id: 'journal-1', artifact: 'adr-12.md', tags: ['reliability', 'payments'] });
  });
});
