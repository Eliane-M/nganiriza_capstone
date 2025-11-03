import React, { useContext } from 'react';
import { LanguageContext } from '../components/context/LanguageContext.tsx';
export function LanguageSwitcher() {
  const {
    language,
    setLanguage
  } = useContext(LanguageContext);
  const languages = [{
    code: 'en',
    label: 'English'
  }, {
    code: 'fr',
    label: 'Français'
  }, {
    code: 'rw',
    label: 'Kinyarwanda'
  }];
  return <div className="flex space-x-2">
      {languages.map(lang => <button key={lang.code} onClick={() => setLanguage(lang.code)} className={`px-2 py-1 text-xs rounded ${language === lang.code ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
          {lang.label}
        </button>)}
    </div>;
}