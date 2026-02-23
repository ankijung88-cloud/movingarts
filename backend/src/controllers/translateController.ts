import { Request, Response } from 'express';
import axios from 'axios';

// Simple in-memory cache to minimize API calls
const translationCache: { [key: string]: string } = {};

export const translateText = async (req: Request, res: Response) => {
    const { text, target } = req.body;
    const source = 'ko'; // Default source is Korean

    if (!text || !target) {
        return res.status(400).json({ message: 'Text and target language are required.' });
    }

    if (target === source) {
        return res.json({ translatedText: text });
    }

    const cacheKey = `${text}_${target}`;
    if (translationCache[cacheKey]) {
        return res.json({ translatedText: translationCache[cacheKey] });
    }

    try {
        // Using MyMemory API (Free up to 1000 words/day)
        const response = await axios.get('https://api.mymemory.translated.net/get', {
            params: {
                q: text,
                langpair: `${source}|${target === 'en' ? 'en' : target}`
            }
        });

        const translatedText = response.data.responseData.translatedText;
        translationCache[cacheKey] = translatedText;

        res.json({ translatedText });
    } catch (error) {
        console.error('Translation error:', error);
        // Fallback to original text if API fails
        res.json({ translatedText: text });
    }
};
