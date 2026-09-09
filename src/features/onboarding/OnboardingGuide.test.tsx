import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { appStore } from '../../lib/appStore';
import { OnboardingGuide } from './OnboardingGuide';

describe('OnboardingGuide', () => {
  beforeEach(() => {
    appStore.reset();
    appStore.update((current) => ({
      ...current,
      profile: { ...current.profile, onboardingComplete: false, name: '' },
    }));
  });

  it('shows welcome step on first visit', () => {
    render(<OnboardingGuide />);
    expect(screen.getByText('Build judgment. Create leverage.')).toBeInTheDocument();
  });

  it('completes onboarding flow with mode and assessment', () => {
    render(<OnboardingGuide />);
    fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Alex' } });
    fireEvent.click(screen.getByRole('button', { name: /Choose your pace/ }));
    fireEvent.click(screen.getByRole('button', { name: /Moderate/ }));
    fireEvent.click(screen.getByRole('button', { name: /Continue to assessment/ }));
    fireEvent.click(screen.getByRole('button', { name: /Save baseline and continue/ }));
    fireEvent.click(screen.getByRole('button', { name: /Continue to your plan/ }));
    fireEvent.click(screen.getByRole('button', { name: /Start week/ }));
    const state = appStore.get();
    expect(state.profile.onboardingComplete).toBe(true);
    expect(state.profile.name).toBe('Alex');
    expect(state.profile.preparationMode).toBe('moderate');
    expect(state.profile.skillAssessmentComplete).toBe(true);
    expect(state.profile.studyWeek).toBeGreaterThanOrEqual(1);
    expect(state.profile.guidedHelpDismissed).toBe(false);
  });

  it('hides when onboarding is complete', () => {
    appStore.update((current) => ({
      ...current,
      profile: { ...current.profile, onboardingComplete: true },
    }));
    const { container } = render(<OnboardingGuide />);
    expect(container).toBeEmptyDOMElement();
  });
});
