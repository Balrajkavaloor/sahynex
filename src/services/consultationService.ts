import { api } from './api';
import type { Consultation } from '../types/consultation';

export const fetchConsultations = async (): Promise<Consultation[]> => {
  const res = await api.get<Consultation[]>('/consultations');
  return res.data;
};

export const createConsultation = async (
  payload: Omit<Consultation, 'id' | 'created_at'>
): Promise<Consultation> => {
  const res = await api.post<Consultation>('/consultations', payload);
  return res.data;
};

