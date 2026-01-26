import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider } from '@/contexts/LanguageContext';
import {
  HomePage,
  ResearchPage,
  TeamPage,
  PublicationsPage,
  NewsPage,
  BigQuestionsPage,
  BigQuestionDetailPage,
  ContactPage,
  JoinUsPage,
  ClimateSnacksPage,
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
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/publications/:category?" element={<PublicationsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/big-questions" element={<BigQuestionsPage />} />
        <Route path="/big-questions/:id" element={<BigQuestionDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/join-us" element={<JoinUsPage />} />
        <Route path="/climate-snacks" element={<ClimateSnacksPage />} />
        </Routes>
      </AnimatePresence>
    </LanguageProvider>
  );
}

export default App;
