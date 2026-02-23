import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

type Language = 'kr' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Cache for API translations (Persistent for the session)
const apiCache: { [key: string]: string } = {};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('language');
        return (saved as Language) || 'kr';
    });

    const [translations, setTranslations] = useState<{ [key: string]: string }>({});
    const pendingRequests = useRef<Set<string>>(new Set());

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    const translate = useCallback(async (text: string, target: Language) => {
        if (target === 'kr' || !text) return;

        const cacheKey = `${text}_${target}`;
        if (apiCache[cacheKey] || pendingRequests.current.has(cacheKey)) return;

        pendingRequests.current.add(cacheKey);

        try {
            console.log(`Translating: "${text}" to ${target}`);
            const { data } = await api.post('/translate', { text, target });

            if (data.translatedText) {
                apiCache[cacheKey] = data.translatedText;
                setTranslations(prev => ({ ...prev, [cacheKey]: data.translatedText }));
            }
        } catch (err: any) {
            console.error(`Translation failed for: "${text}"`, err.response?.data || err.message);
        } finally {
            pendingRequests.current.delete(cacheKey);
        }
    }, []);

    const t = (text: string) => {
        if (language === 'kr' || !text) return text;

        const cacheKey = `${text}_${language}`;

        // Return from state if available
        if (translations[cacheKey]) return translations[cacheKey];

        // Return from static cache if available
        if (apiCache[cacheKey]) return apiCache[cacheKey];

        // Trigger translation if not already pending
        if (!pendingRequests.current.has(cacheKey)) {
            translate(text, language);
        }

        return text; // Return original while translating
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
