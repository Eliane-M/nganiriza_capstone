import React, { createContext } from 'react';
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}
export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {}
});