import React from 'react';
import { Language } from '@/types';

interface Props {
  currentLang: Language;
  onToggle: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<Props> = ({ currentLang, onToggle }) => {
  return (
    <div className="flex bg-white/20 p-1 rounded-lg">
      <button
        onClick={() => onToggle(Language.ENGLISH)}
        className={`px-3 py-1 rounded-md text-sm transition-colors ${
          currentLang === Language.ENGLISH ? 'bg-white text-primary shadow' : 'text-white/80 hover:text-white'
        }`}
      >
        ENG
      </button>
      <button
        onClick={() => onToggle(Language.URDU)}
        className={`px-3 py-1 rounded-md text-sm font-urdu transition-colors ${
          currentLang === Language.URDU ? 'bg-white text-primary shadow' : 'text-white/80 hover:text-white'
        }`}
      >
        اردو
      </button>
    </div>
  );
};