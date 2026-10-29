import { Analytics } from '@vercel/analytics/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
    {/* Vercel Web Analytics: page views only; it does nothing outside a Vercel deployment. */}
    <Analytics />
  </StrictMode>,
);
