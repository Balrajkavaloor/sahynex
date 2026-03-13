import { api } from './api';
import type { Consultation } from '../types/consultation';

export const fetchConsultations = async (): Promise<Consultation[]> => {
  // Backend currently has no list endpoint; return empty to avoid 404s.
  return [];
};

export interface ProcessedConsultation {
  transcript: string;
  translated_text: string;
  summary: {
    symptoms: string[];
    diagnosis: string;
    prescriptions: string[];
    tests: string[];
    instructions: string;
  };
}

export const processConsultationText = async (
  patientId: string,
  conversation: string
): Promise<ProcessedConsultation> => {
  const res = await api.post('/consultations/process-text', {
    patient_id: patientId,
    conversation
  });
  return res.data.data as ProcessedConsultation;
};

export const createConsultation = async (
  payload: Omit<Consultation, 'id' | 'created_at'>
): Promise<Consultation> => {
  // Kept for compatibility with local store; not wired to backend.
  return {
    ...(payload as Consultation),
    id: crypto.randomUUID(),
    created_at: new Date().toISOString()
  };
};

