import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import {
  HomePage,
  ResearchPage,
  TeamPage,
  PublicationsPage,
  NewsPage,
  ContactPage,
  // JoinUsPage,  // ACT INSTITUTE 비활성화
  ClimateSnacksPage,
  ResearchDetailPage,
  ShowcasePage,
} from '@/pages';

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
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/research/:id" element={<ResearchDetailPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/publications/:category?" element={<PublicationsPage />} />
        <Route path="/news" element={<NewsPage />} />
<Route path="/contact" element={<ContactPage />} />
        {/* <Route path="/join-us" element={<JoinUsPage />} /> */}{/* ACT INSTITUTE 라우트 비활성화 */}
        <Route path="/showcase" element={<ShowcasePage />} />
        <Route path="/climate-snacks" element={<ClimateSnacksPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/members" element={<ProtectedRoute><MembersPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute masterOnly><AdminPage /></ProtectedRoute>} />
        <Route path="/board" element={<ProtectedRoute><BoardPage /></ProtectedRoute>} />
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
