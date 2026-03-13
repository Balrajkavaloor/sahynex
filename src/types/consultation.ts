export interface Consultation {
  id: string;
  patient_id: string;
  transcript: string;
  summary: string;
  diagnosis: string;
  created_at: string;
  prescription?: string;
  tests?: string;
  instructions?: string;
}

