import { StrictMode, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { store, persistor } from '~/app/store';
import { ThemeProvider } from './ThemeProvider';
import { I18nProvider } from './I18nProvider';
import { ToastProvider } from './ToastProvider';
import '~/shared/services/i18n';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Query client configuration for TanStack React Query
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Root provider component that wraps the entire application
 * with all necessary providers in the correct order
 */
export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <I18nProvider>
                <ThemeProvider>
                  <ToastProvider>{children}</ToastProvider>
                </ThemeProvider>
              </I18nProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </StrictMode>
  );
};