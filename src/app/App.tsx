import { lazy, Suspense, useEffect, useState } from 'react';
import { AppShell } from './AppShell';
import { RouteErrorBoundary } from './RouteErrorBoundary';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { OnboardingGuide } from '../features/onboarding/OnboardingGuide';
import { UnlockCelebration } from '../components/UnlockCelebration';
import { LockedFeaturePage } from '../components/LockedFeaturePage';
import { ShortcutHelp } from '../components/ShortcutHelp';
import { ShortcutToast } from '../components/ShortcutToast';
import { usePathname } from '../lib/router';
import { useStaffPathState } from '../lib/appStore';
import { FEATURE_BY_PATH, isPathUnlocked } from '../lib/featureUnlocks';
import { initKeyboardShortcuts, SHOW_SHORTCUTS_EVENT } from '../lib/keyboardShortcuts';
import { initOfflineSync } from '../lib/offlineQueue';
import { applyTheme, getStoredTheme } from '../lib/theme';

const EncyclopediaPage = lazy(() => import('../features/encyclopedia/EncyclopediaPage').then((module) => ({ default: module.EncyclopediaPage })));
const LifecyclePage = lazy(() => import('../features/lifecycle/LifecyclePage').then((module) => ({ default: module.LifecyclePage })));
const AssessmentPage = lazy(() => import('../features/assessment/AssessmentPage').then((module) => ({ default: module.AssessmentPage })));
const InterviewPage = lazy(() => import('../features/interviews/InterviewPage').then((module) => ({ default: module.InterviewPage })));
const RoadmapPage = lazy(() => import('../features/roadmap/RoadmapPage').then((module) => ({ default: module.RoadmapPage })));
const PracticePage = lazy(() => import('../features/practice/PracticePage').then((module) => ({ default: module.PracticePage })));
const CommunicationPage = lazy(() => import('../features/communication/CommunicationPage').then((module) => ({ default: module.CommunicationPage })));
const HandbookPage = lazy(() => import('../features/handbook/HandbookPage').then((module) => ({ default: module.HandbookPage })));
const JournalPage = lazy(() => import('../features/journal/JournalPage').then((module) => ({ default: module.JournalPage })));
const SettingsPage = lazy(() => import('../features/settings/SettingsPage').then((module) => ({ default: module.SettingsPage })));
const CurriculumPage = lazy(() => import('../features/curriculum/CurriculumPage').then((module) => ({ default: module.CurriculumPage })));
const PackPage = lazy(() => import('../features/pack/PackPage').then((module) => ({ default: module.PackPage })));
const CoachPage = lazy(() => import('../features/coach/CoachPage').then((module) => ({ default: module.CoachPage })));
const ResourcesPage = lazy(() => import('../features/resources/ResourcesPage').then((module) => ({ default: module.ResourcesPage })));
const FlashcardsPage = lazy(() => import('../features/flashcards/FlashcardsPage').then((module) => ({ default: module.FlashcardsPage })));

const pages: Record<string, React.ReactNode> = {
  '/': null,
  '/encyclopedia': <EncyclopediaPage />,
  '/lifecycle': <LifecyclePage />,
  '/roadmap': <RoadmapPage />,
  '/practice': <PracticePage />,
  '/skills': <AssessmentPage />,
  '/communication': <CommunicationPage />,
  '/interviews': <InterviewPage />,
  '/handbook': <HandbookPage />,
  '/journal': <JournalPage />,
  '/settings': <SettingsPage />,
  '/curriculum': <CurriculumPage />,
  '/pack': <PackPage />,
  '/coach': <CoachPage />,
  '/resources': <ResourcesPage />,
  '/flashcards': <FlashcardsPage />,
};

function AppContent() {
  const path = usePathname();
  const state = useStaffPathState();
  const feature = FEATURE_BY_PATH[path];

  if (feature && !isPathUnlocked(state, path)) {
    return <LockedFeaturePage feature={feature} />;
  }

  if (path === '/') return <DashboardPage />;
  return pages[path] || <DashboardPage />;
}

export function App() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const cleanupShortcuts = initKeyboardShortcuts({
      onShowHelp: () => setHelpOpen(true),
      onToast: (message) => {
        setToast(message);
        window.setTimeout(() => setToast(null), 1500);
      },
    });
    const showHelp = () => setHelpOpen(true);
    window.addEventListener(SHOW_SHORTCUTS_EVENT, showHelp);
    const cleanupSync = initOfflineSync();
    const media = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const syncSystemTheme = () => {
      if (getStoredTheme() === 'system') applyTheme('system');
    };
    media?.addEventListener('change', syncSystemTheme);
    return () => {
      cleanupShortcuts();
      cleanupSync();
      window.removeEventListener(SHOW_SHORTCUTS_EVENT, showHelp);
      media?.removeEventListener('change', syncSystemTheme);
    };
  }, []);

  return (
    <AppShell>
      <OnboardingGuide />
      <UnlockCelebration />
      <ShortcutHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
      <ShortcutToast message={toast} />
      <RouteErrorBoundary>
        <Suspense fallback={<div className="page route-loading">Loading workspace…</div>}>
          <AppContent />
        </Suspense>
      </RouteErrorBoundary>
    </AppShell>
  );
}
