import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

type Language = 'kr' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Cache for API translations
const apiCache: { [key: string]: string } = {};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('language');
        return (saved as Language) || 'kr';
    });

    const [translations, setTranslations] = useState<{ [key: string]: string }>({});

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    const translate = useCallback(async (text: string, target: Language) => {
        if (target === 'kr') return text;

        const cacheKey = `${text}_${target}`;
        if (apiCache[cacheKey]) return apiCache[cacheKey];

        try {
            const { data } = await api.post('/translate', { text, target });
            apiCache[cacheKey] = data.translatedText;
            setTranslations(prev => ({ ...prev, [cacheKey]: data.translatedText }));
            return data.translatedText;
        } catch (err) {
            console.error('Translation failed', err);
            return text;
        }
    }, []);

    const t = (text: string) => {
        if (language === 'kr') return text;

        const cacheKey = `${text}_${language}`;
        if (translations[cacheKey]) return translations[cacheKey];
        if (apiCache[cacheKey]) return apiCache[cacheKey];

        // Trigger async translation if not in state/cache
        translate(text, language);

        return text; // Return original while loading
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
