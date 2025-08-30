import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LANGUAGE_CONSTANTS } from '~/app/constants';
import {en} from './locales/en';
import {bn} from './locales/bn';
// import ar from './locales/ar.json';

/**
 * Initialize i18next for internationalization
 * Supports English, Bengali, and Arabic languages
 */
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    bn: { translation: bn },
    // ar: { translation: ar },
  },
  lng: localStorage.getItem(LANGUAGE_CONSTANTS.STORAGE_KEY) || LANGUAGE_CONSTANTS.DEFAULT_LANGUAGE,
  fallbackLng: LANGUAGE_CONSTANTS.DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
  debug: process.env.NODE_ENV === 'development',
});

export default i18n;