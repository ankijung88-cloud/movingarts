"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateText = void 0;
const axios_1 = __importDefault(require("axios"));
// Simple in-memory cache to minimize API calls
const translationCache = {};
const translateText = async (req, res) => {
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
        const response = await axios_1.default.get('https://api.mymemory.translated.net/get', {
            params: {
                q: text,
                langpair: `${source}|${target === 'en' ? 'en' : target}`
            }
        });
        const translatedText = response.data.responseData.translatedText;
        translationCache[cacheKey] = translatedText;
        res.json({ translatedText });
    }
    catch (error) {
        console.error('Translation error:', error);
        // Fallback to original text if API fails
        res.json({ translatedText: text });
    }
};
exports.translateText = translateText;
