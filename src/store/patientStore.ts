import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { Patient } from '../types/patient';
import { fetchPatients, createPatient, fetchPatientById } from '../services/patientService';

interface PatientState {
  patients: Patient[];
  loading: boolean;
  error?: string;
  fetchAll: () => Promise<void>;
  addPatient: (data: Omit<Patient, 'id' | 'patient_id' | 'created_at'>) => Promise<Patient>;
  getById: (id: string) => Patient | undefined;
  searchPatients: (term: string) => Patient[];
}

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  loading: false,
  error: undefined,
  fetchAll: async () => {
    set({ loading: true, error: undefined });
    try {
      const data = await fetchPatients();
      set({ patients: data, loading: false });
    } catch (e) {
      console.warn('Failed to fetch patients, falling back to local state only.', e);
      set({ loading: false, error: 'Unable to fetch patients from server.' });
    }
  },
  addPatient: async payload => {
    const now = new Date().toISOString();
    const local: Patient = {
      ...payload,
      id: nanoid(),
      patient_id: `PT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      created_at: now,
      last_visit: now
    };

    set(state => ({ patients: [local, ...state.patients] }));

    try {
      const created = await createPatient({
        ...local,
        id: undefined as unknown as string,
        created_at: undefined as unknown as string,
        last_visit: undefined as unknown as string
      } as any);
      set(state => ({
        patients: state.patients.map(p => (p.id === local.id ? created : p))
      }));
      return created;
    } catch (e) {
      console.warn('Failed to persist patient to server, keeping local copy only.', e);
      return local;
    }
  },
  getById: id => {
    const existing = get().patients.find(p => p.id === id || p.patient_id === id);
    if (existing) return existing;

    // Fire and forget remote fetch to hydrate store
    fetchPatientById(id)
      .then(remote => {
        set(state => {
          const already = state.patients.some(p => p.id === remote.id);
          return already ? state : { patients: [remote, ...state.patients] };
        });
      })
      .catch(e => console.warn('Failed to fetch patient by id', e));

    return undefined;
  },
  searchPatients: term => {
    const t = term.trim().toLowerCase();
    if (!t) return [];
    return get().patients.filter(
      p =>
        p.patient_id.toLowerCase().includes(t) ||
        p.name.toLowerCase().includes(t) ||
        p.phone.toLowerCase().includes(t)
    );
  }
}));

