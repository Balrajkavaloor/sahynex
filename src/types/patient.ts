export interface Patient {
  id: string;
  patient_id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  preferred_language: string;
  created_at: string;
  last_visit?: string;
}

