import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

const DEFAULT_LANGUAGE = 'en';

const resolvePath = (path, dictionary) => {
  if (!dictionary) {
    return undefined;
  }

  const segments = Array.isArray(path)
    ? path
    : String(path)
        .split('.')
        .filter(Boolean);

  return segments.reduce((value, segment) => {
    if (value == null) {
      return undefined;
    }
    const key = typeof segment === 'number' || /^[0-9]+$/.test(segment)
      ? Number(segment)
      : segment;
    return value?.[key];
  }, dictionary);
};

const applyReplacements = (value, replacements) => {
  if (!replacements || typeof value !== 'string') {
    return value;
  }

  return Object.entries(replacements).reduce(
    (text, [placeholder, replacement]) =>
      text.replaceAll(`{${placeholder}}`, replacement ?? ''),
    value
  );
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_LANGUAGE;
    }
    const stored = window.localStorage.getItem('scibridge-language');
    return stored || DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem('scibridge-language', language);
  }, [language]);

  const translate = useCallback(
    (path, fallback, replacements) => {
      const rawValue =
        resolvePath(path, translations[language]) ??
        resolvePath(path, translations[DEFAULT_LANGUAGE]);

      if (Array.isArray(rawValue)) {
        return rawValue.map((entry) =>
          typeof entry === 'string' ? applyReplacements(entry, replacements) : entry
        );
      }

      if (rawValue !== undefined) {
        return applyReplacements(rawValue, replacements);
      }

      if (Array.isArray(fallback)) {
        return fallback.map((entry) =>
          typeof entry === 'string' ? applyReplacements(entry, replacements) : entry
        );
      }

      if (fallback !== undefined) {
        return applyReplacements(fallback, replacements);
      }

      return undefined;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((previous) => (previous === 'en' ? 'vi' : 'en')),
      t: translate
    }),
    [language, translate]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

