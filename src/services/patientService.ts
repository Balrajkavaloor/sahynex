import { api } from './api';
import type { Patient } from '../types/patient';

export const fetchPatients = async (): Promise<Patient[]> => {
  const res = await api.get<Patient[]>('/patients');
  return res.data;
};

export const createPatient = async (
  payload: Omit<Patient, 'id' | 'created_at' | 'last_visit'>
): Promise<Patient> => {
  const res = await api.post<Patient>('/patients', payload);
  return res.data;
};

export const fetchPatientById = async (id: string): Promise<Patient> => {
  const res = await api.get<Patient>(`/patients/${id}`);
  return res.data;
};

