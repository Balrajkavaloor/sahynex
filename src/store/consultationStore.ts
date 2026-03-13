import { create } from 'zustand';
import type { Consultation } from '../types/consultation';
import { createConsultation, fetchConsultations } from '../services/consultationService';

interface ConsultationState {
  consultations: Consultation[];
  loading: boolean;
  error?: string;
  currentTranscript: string;
  currentTranslation: string;
  currentSummary: {
    symptoms: string;
    diagnosis: string;
    prescription: string;
    tests: string;
    instructions: string;
  };
  fetchAll: () => Promise<void>;
  saveConsultation: (payload: Omit<Consultation, 'id' | 'created_at'>) => Promise<Consultation>;
  setTranscript: (value: string) => void;
  setTranslation: (value: string) => void;
  setSummaryField: (field: keyof ConsultationState['currentSummary'], value: string) => void;
}

export const useConsultationStore = create<ConsultationState>((set, get) => ({
  consultations: [],
  loading: false,
  error: undefined,
  currentTranscript: '',
  currentTranslation: '',
  currentSummary: {
    symptoms: '',
    diagnosis: '',
    prescription: '',
    tests: '',
    instructions: ''
  },
  fetchAll: async () => {
    set({ loading: true, error: undefined });
    try {
      const data = await fetchConsultations();
      set({ consultations: data, loading: false });
    } catch (e) {
      console.warn('Failed to fetch consultations, falling back to local state only.', e);
      set({ loading: false, error: 'Unable to fetch consultations from server.' });
    }
  },
  saveConsultation: async payload => {
    const optimistic: Consultation = {
      ...payload,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    set(state => ({ consultations: [optimistic, ...state.consultations] }));
    try {
      const saved = await createConsultation(payload);
      set(state => ({
        consultations: state.consultations.map(c => (c.id === optimistic.id ? saved : c))
      }));
      return saved;
    } catch (e) {
      console.warn('Failed to persist consultation, keeping local copy only.', e);
      return optimistic;
    }
  },
  setTranscript: value => set({ currentTranscript: value }),
  setTranslation: value => set({ currentTranslation: value }),
  setSummaryField: (field, value) =>
    set(state => ({
      currentSummary: { ...state.currentSummary, [field]: value }
    }))
}));

