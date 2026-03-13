import { useState } from 'react';

interface TranslationResult {
  translatedText: string;
  targetLanguage: string;
}

export const useTranslation = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);

  const translate = async (text: string, targetLanguage = 'en') => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      // Placeholder for real translation API call
      // For now we simply echo the text, but this hook is ready to be wired to backend.
      await new Promise(resolve => setTimeout(resolve, 400));
      const output: TranslationResult = {
        translatedText: text,
        targetLanguage
      };
      setResult(output);
      return output;
    } finally {
      setLoading(false);
    }
  };

  return { loading, result, translate };
};

