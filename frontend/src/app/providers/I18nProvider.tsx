import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '~/shared/services/i18n';

interface I18nProviderProps {
  children: ReactNode;
}

/**
 * Internationalization provider component
 * Wraps the application with i18next provider for multi-language support
 */
export const I18nProvider = ({ children }: I18nProviderProps) => {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};


