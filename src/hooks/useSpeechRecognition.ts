import { useEffect, useRef, useState } from 'react';

type SpeechRecognitionType = typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition;

interface UseSpeechRecognitionOptions {
  lang?: string;
}

export const useSpeechRecognition = ({ lang = 'en-US' }: UseSpeechRecognitionOptions = {}) => {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    setSupported(true);
    const recognition = new (SpeechRecognition as SpeechRecognitionType)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = event => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        finalTranscript += result[0].transcript;
      }
      setTranscript(prev => `${prev} ${finalTranscript}`.trim());
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition as SpeechRecognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [lang]);

  const start = () => {
    if (!supported || !recognitionRef.current) return;
    setTranscript('');
    recognitionRef.current.start();
    setListening(true);
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return { supported, listening, transcript, start, stop, setTranscript };
};

