import { api } from './api';
import type { Patient } from '../types/patient';

export const fetchPatients = async (): Promise<Patient[]> => {
  const res = await api.get('/patients');
  return res.data.data as Patient[];
};

export const createPatient = async (
  payload: Omit<Patient, 'id' | 'created_at' | 'last_visit'>
): Promise<Patient> => {
  const res = await api.post('/patients', payload);
  return res.data.data as Patient;
};

export const fetchPatientById = async (id: string): Promise<Patient> => {
  const res = await api.get(`/patients/${id}`);
  return res.data.data as Patient;
};

