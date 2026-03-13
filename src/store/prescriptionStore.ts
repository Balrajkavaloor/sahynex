import { create } from 'zustand';

export interface Prescription {
  id: string;
  patient_id: string;
  patient_name: string;
  medicine: string;
  dosage: string;
  status: 'pending' | 'dispensed';
}

interface PrescriptionState {
  prescriptions: Prescription[];
  addPrescription: (p: Omit<Prescription, 'id' | 'status'>) => void;
  markDispensed: (id: string) => void;
}

export const usePrescriptionStore = create<PrescriptionState>((set) => ({
  prescriptions: [],
  addPrescription: (p) =>
    set((state) => ({
      prescriptions: [
        {
          ...p,
          id: crypto.randomUUID(),
          status: 'pending',
        },
        ...state.prescriptions,
      ],
    })),
  markDispensed: (id) =>
    set((state) => ({
      prescriptions: state.prescriptions.map((pr) =>
        pr.id === id ? { ...pr, status: 'dispensed' } : pr
      ),
    })),
}));

