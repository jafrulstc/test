import { createRoot } from 'react-dom/client';
import { AppProviders } from '~/app/providers/AppProviders';
import App from './App';
/**
 * Application entry point
 * Renders the app with all necessary providers
 */
createRoot(document.getElementById('root')!).render(
  <AppProviders>
    <App />
  </AppProviders>
);