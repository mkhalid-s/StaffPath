import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { appStore } from '../../lib/appStore';
import { AssessmentPage } from './AssessmentPage';
describe('AssessmentPage', () => {
  beforeEach(() => { localStorage.clear(); appStore.reset(); });
  it('persists competency score and evidence', () => { render(<AssessmentPage />); fireEvent.change(screen.getByLabelText('System design score'), { target: { value: '4' } }); fireEvent.change(screen.getByLabelText('System design evidence'), { target: { value: 'Led a multi-region design review' } }); expect(appStore.get().assessments['system-design'].score).toBe(4); expect(appStore.get().assessments['system-design'].evidence).toContain('multi-region'); });
});
