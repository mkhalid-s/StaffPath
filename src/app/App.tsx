import { lazy, Suspense } from 'react';
import { AppShell } from './AppShell';
import { RouteErrorBoundary } from './RouteErrorBoundary';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { OnboardingGuide } from '../features/onboarding/OnboardingGuide';
import { usePathname } from '../lib/router';

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
const CoachPage = lazy(() => import('../features/coach/CoachPage').then((module) => ({ default: module.CoachPage })));
const ResourcesPage = lazy(() => import('../features/resources/ResourcesPage').then((module) => ({ default: module.ResourcesPage })));

export function App() {
  const path = usePathname();
  const pages: Record<string, React.ReactNode> = {
    '/': <DashboardPage />, '/encyclopedia': <EncyclopediaPage />, '/lifecycle': <LifecyclePage />,
    '/roadmap': <RoadmapPage />,
    '/practice': <PracticePage />,
    '/skills': <AssessmentPage />,
    '/communication': <CommunicationPage />,
    '/interviews': <InterviewPage />,
    '/handbook': <HandbookPage />,
    '/journal': <JournalPage />,
    '/settings': <SettingsPage />,
    '/curriculum': <CurriculumPage />,
    '/coach': <CoachPage />,
    '/resources': <ResourcesPage />,
  };
  return <AppShell><OnboardingGuide /><RouteErrorBoundary><Suspense fallback={<div className="page route-loading">Loading workspace…</div>}>{pages[path] || <DashboardPage />}</Suspense></RouteErrorBoundary></AppShell>;
}
