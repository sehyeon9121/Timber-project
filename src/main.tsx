import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';

// GitHub Pages에서는 /leeseunglab 경로 사용, 커스텀 도메인에서는 루트 경로 사용
const isGitHubPages = window.location.hostname.includes('github.io');
const basename = isGitHubPages ? '/leeseunglab' : '/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
