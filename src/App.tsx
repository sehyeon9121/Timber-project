import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthProvider';
import { ProtectedRoute } from '@/components/organisms/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { MembersPage } from '@/pages/MembersPage';
import { AdminPage } from '@/pages/AdminPage';
import { BoardPage } from '@/pages/BoardPage';
import { BoardPostPage } from '@/pages/BoardPostPage';
import { BoardEditorPage } from '@/pages/BoardEditorPage';
import { NoticesPage } from '@/pages/NoticesPage';
import { EmptyContentPage } from '@/pages/EmptyContentPage';
import { OverviewPage } from '@/pages/OverviewPage';
import { GreetingPage } from '@/pages/GreetingPage';
import { LeadershipPage } from '@/pages/LeadershipPage';
import { VisionPage } from '@/pages/VisionPage';
import { ResearchStrategyPage } from '@/pages/ResearchStrategyPage';
import { siteNavigation } from '@/data/siteNavigation';
import {
  HomePage,
  ResearchPage,
  TeamPage,
  ResearchResultsPage,
  NewsPage,
  PressPage,
  PressDetailPage,
  ActivityDetailPage,
  ContactPage,
  // JoinUsPage,  // ACT INSTITUTE 비활성화
  ClimateSnacksPage,
  ResearchDetailPage,
  ShowcasePage,
} from '@/pages';

function ActivityRedirect() {
  const { id } = useParams();
  return <Navigate to={`/board/activities/${id}`} replace />;
}

function App() {
  const location = useLocation();

  // Handle scroll to section after navigation
  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      // Wait for page to render, then scroll
      const scrollToElement = () => {
        const element = document.getElementById(state.scrollTo!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          // Update URL with hash
          window.history.replaceState(null, '', `${location.pathname}#${state.scrollTo}`);
          // Clear the state to prevent re-scrolling on re-render
          window.history.replaceState(null, '', `${location.pathname}#${state.scrollTo}`);
        } else {
          // Element not found yet, retry
          requestAnimationFrame(scrollToElement);
        }
      };
      requestAnimationFrame(scrollToElement);
    }
  }, [location]);

  return (
    <LanguageProvider>
      <AuthProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about/overview" element={<OverviewPage />} />
        <Route path="/about/greeting" element={<GreetingPage />} />
        <Route path="/about/vision" element={<VisionPage />} />
        <Route path="/research/strategy" element={<ResearchStrategyPage />} />
        <Route path="/about/organization" element={<ShowcasePage />} />
        {siteNavigation.flatMap(group => group.items.filter(item => item.empty).map(item => (
          <Route
            key={item.href}
            path={item.href}
            element={group.membersOnly
              ? <ProtectedRoute><EmptyContentPage title={item.label} /></ProtectedRoute>
              : <EmptyContentPage title={item.label} />}
          />
        )))}
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/research/:id" element={<ResearchDetailPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/team/leadership" element={<LeadershipPage />} />
        <Route path="/team/researchers" element={<TeamPage participantsOnly />} />
        <Route path="/results" element={<ResearchResultsPage />} />
        <Route path="/publications/:category?" element={<Navigate to="/results" replace />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/press" element={<PressPage />} />
        <Route path="/news/press/:id" element={<PressDetailPage />} />
        <Route path="/news/activities" element={<Navigate to="/board" replace />} />
        <Route path="/news/activities/:id" element={<ActivityRedirect />} />
<Route path="/contact" element={<ContactPage />} />
        {/* <Route path="/join-us" element={<JoinUsPage />} /> */}{/* ACT INSTITUTE 라우트 비활성화 */}
        <Route path="/showcase" element={<ShowcasePage />} />
        <Route path="/climate-snacks" element={<ClimateSnacksPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/members" element={<ProtectedRoute><MembersPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute masterOnly><AdminPage /></ProtectedRoute>} />
        <Route path="/board" element={<ProtectedRoute><BoardPage /></ProtectedRoute>} />
        <Route path="/board/activities/:id" element={<ProtectedRoute><ActivityDetailPage /></ProtectedRoute>} />
        <Route path="/board/notices" element={<ProtectedRoute><NoticesPage /></ProtectedRoute>} />
        <Route path="/board/notices/new" element={<ProtectedRoute masterOnly><BoardEditorPage notice /></ProtectedRoute>} />
        <Route path="/board/notices/:id" element={<ProtectedRoute><BoardPostPage notice /></ProtectedRoute>} />
        <Route path="/board/notices/:id/edit" element={<ProtectedRoute masterOnly><BoardEditorPage notice /></ProtectedRoute>} />
        <Route path="/board/new" element={<ProtectedRoute><BoardEditorPage /></ProtectedRoute>} />
        <Route path="/board/:id" element={<ProtectedRoute><BoardPostPage /></ProtectedRoute>} />
        <Route path="/board/:id/edit" element={<ProtectedRoute><BoardEditorPage /></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
