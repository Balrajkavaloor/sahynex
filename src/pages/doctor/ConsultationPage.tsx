import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Mic,
  MicOff,
  Sparkles,
  Stethoscope,
  Save,
  Beaker,
  Pill,
  Languages
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useConsultationStore } from '../../store/consultationStore';
import { usePatientStore } from '../../store/patientStore';
import { usePrescriptionStore } from '../../store/prescriptionStore';
import { toast } from 'sonner';
import { processConsultationText } from '../../services/consultationService';

interface SummaryFormValues {
  symptoms: string;
  diagnosis: string;
  prescription: string;
  tests: string;
  instructions: string;
}

const ConsultationPage = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const { patients, fetchAll } = usePatientStore();
  const {
    currentSummary,
    currentTranslation,
    setSummaryField,
    setTranscript,
    setTranslation,
    saveConsultation
  } = useConsultationStore();
  const [translating, setTranslating] = useState(false);
  const addPrescription = usePrescriptionStore(s => s.addPrescription);
  const { supported, listening, transcript, start, stop } = useSpeechRecognition({
    lang: 'hi-IN'
  });

  const { register, handleSubmit, reset } = useForm<SummaryFormValues>({
    defaultValues: currentSummary
  });

  useEffect(() => {
    if (!patients.length) fetchAll();
  }, [patients.length, fetchAll]);

  useEffect(() => {
    setTranscript(transcript);
  }, [transcript, setTranscript]);

  const selectedPatient = useMemo(
    () => patients.find(p => p.id === selectedPatientId),
    [patients, selectedPatientId]
  );

  const handleTranslate = async () => {
    if (!selectedPatient) {
      toast.error('Select a patient first', {
        description: 'Choose a patient before translating the conversation.'
      });
      return;
    }
    if (!transcript) {
      toast.warning('No speech captured', {
        description: 'Speak into the microphone before translating.'
      });
      return;
    }
    try {
      setTranslating(true);
      const processed = await processConsultationText(selectedPatient.patient_id, transcript);

      // Update translated text and summary from backend response
      setTranslation(processed.translated_text);
      setSummaryField('symptoms', processed.summary.symptoms.join(', '));
      setSummaryField('diagnosis', processed.summary.diagnosis);
      setSummaryField('prescription', processed.summary.prescriptions.join('\n'));
      setSummaryField('tests', processed.summary.tests.join('\n'));
      setSummaryField('instructions', processed.summary.instructions);

      reset({
        symptoms: processed.summary.symptoms.join(', '),
        diagnosis: processed.summary.diagnosis,
        prescription: processed.summary.prescriptions.join('\n'),
        tests: processed.summary.tests.join('\n'),
        instructions: processed.summary.instructions
      });

      toast.success('Conversation translated', {
        description: 'English translation and AI summary loaded from backend.'
      });
    } catch (error: any) {
      const msg =
        error?.response?.data?.detail?.error ??
        error?.response?.data?.detail ??
        'Unable to translate conversation. Please try again.';
      toast.error('Translation failed', { description: msg });
    } finally {
      setTranslating(false);
    }
  };

  const onSubmit = async (values: SummaryFormValues) => {
    if (!selectedPatient) {
      toast.error('Select a patient first');
      return;
    }
    try {
      const text = transcript || values.symptoms;
      const processed = await processConsultationText(selectedPatient.patient_id, text);

      // Update local summary fields from backend AI response
      setSummaryField('symptoms', processed.summary.symptoms.join(', '));
      setSummaryField('diagnosis', processed.summary.diagnosis);
      setSummaryField('prescription', processed.summary.prescriptions.join('\n'));
      setSummaryField('tests', processed.summary.tests.join('\n'));
      setSummaryField('instructions', processed.summary.instructions);

      await saveConsultation({
        patient_id: selectedPatient.patient_id,
        transcript: processed.transcript,
        summary: processed.summary.symptoms.join(', '),
        diagnosis: processed.summary.diagnosis,
        prescription: processed.summary.prescriptions.join('\n'),
        tests: processed.summary.tests.join('\n'),
        instructions: processed.summary.instructions
      });

      const prescriptionText =
        values.prescription || processed.summary.prescriptions.join('\n');

      if (prescriptionText.trim()) {
        addPrescription({
          patient_id: selectedPatient.patient_id,
          patient_name: selectedPatient.name,
          medicine: prescriptionText,
          dosage: values.instructions || processed.summary.instructions || 'As directed'
        });
      }
      toast.success('Consultation saved', {
        description: `Consultation for ${selectedPatient.name} recorded via backend AI.`
      });
    } catch (error: any) {
      const msg =
        error?.response?.data?.detail?.error ??
        error?.response?.data?.detail ??
        'Unable to process consultation. Please try again.';
      toast.error('Consultation failed', { description: msg });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Stethoscope className="h-5 w-5 text-clinical-accent" />
            Consultation
          </h1>
          <p className="text-xs text-slate-500">
            Capture multilingual voice consultations, auto-translate to English, and generate
            structured clinical summaries.
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Languages className="h-3 w-3" />
          Multilingual enabled
        </Badge>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Card>
            <CardHeader
              title="Patient info"
              description="Select the patient for this consultation and confirm their language preferences."
            />
            <CardBody>
              <div className="grid gap-3 md:grid-cols-3 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-slate-600 dark:text-slate-300">
                    Patient
                  </label>
                  <select
                    value={selectedPatientId}
                    onChange={e => setSelectedPatientId(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-clinical-accent dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="">Select patient</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.patient_id})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-slate-600 dark:text-slate-300">
                    Preferred language
                  </label>
                  <input
                    disabled
                    value={selectedPatient?.preferred_language ?? ''}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-slate-600 dark:text-slate-300">
                    Patient ID
                  </label>
                  <input
                    disabled
                    value={selectedPatient?.patient_id ?? ''}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Voice consultation"
              description="Record the patient conversation in their native language. Speech is captured via the browser Web Speech API."
              actions={
                !supported ? (
                  <Badge variant="warning">Web Speech API not supported in this browser</Badge>
                ) : (
                  <Badge variant={listening ? 'success' : 'default'}>
                    {listening ? 'Listening...' : 'Ready'}
                  </Badge>
                )
              }
            />
            <CardBody>
              <div className="mb-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  leftIcon={<Mic className="h-3 w-3" />}
                  onClick={start}
                  disabled={!supported || listening}
                >
                  Start recording
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  leftIcon={<MicOff className="h-3 w-3" />}
                  onClick={stop}
                  disabled={!listening}
                >
                  Stop recording
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  leftIcon={<Sparkles className="h-3 w-3" />}
                  onClick={handleTranslate}
                  disabled={translating}
                >
                  {translating ? 'Translating...' : 'Translate to English'}
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-2 text-xs">
                <div>
                  <p className="mb-1 font-medium text-slate-600 dark:text-slate-300">
                    Patient speech (original)
                  </p>
                  <textarea
                    value={transcript}
                    onChange={e => setTranscript(e.target.value)}
                    className="h-40 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-clinical-accent dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Spoken content captured from microphone will appear here..."
                  />
                </div>
                <div>
                  <p className="mb-1 font-medium text-slate-600 dark:text-slate-300">
                    Translated text (English)
                  </p>
                  <textarea
                    value={currentTranslation}
                    readOnly
                    className="h-40 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Once translated, English text appears here."
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <Card className="xl:col-span-1">
          <CardHeader
            title="AI summary"
            description="Structured clinical note derived from the consultation. Fully editable before saving."
          />
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-slate-600 dark:text-slate-300">Symptoms</label>
                <textarea
                  {...register('symptoms')}
                  onChange={e => setSummaryField('symptoms', e.target.value)}
                  className="h-16 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-clinical-accent dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="font-medium text-slate-600 dark:text-slate-300">Diagnosis</label>
                <textarea
                  {...register('diagnosis')}
                  onChange={e => setSummaryField('diagnosis', e.target.value)}
                  className="h-16 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-clinical-accent dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="font-medium text-slate-600 dark:text-slate-300">
                  Prescription
                </label>
                <textarea
                  {...register('prescription')}
                  onChange={e => setSummaryField('prescription', e.target.value)}
                  className="h-16 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-clinical-accent dark:border-slate-700 dark:bg-slate-900"
                  placeholder="e.g. Tab Azithromycin 500mg once daily for 3 days"
                />
              </div>
              <div className="space-y-1">
                <label className="font-medium text-slate-600 dark:text-slate-300">Tests</label>
                <textarea
                  {...register('tests')}
                  onChange={e => setSummaryField('tests', e.target.value)}
                  className="h-16 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-clinical-accent dark:border-slate-700 dark:bg-slate-900"
                  placeholder="e.g. CBC, LFT, Chest X-ray"
                />
              </div>
              <div className="space-y-1">
                <label className="font-medium text-slate-600 dark:text-slate-300">
                  Instructions
                </label>
                <textarea
                  {...register('instructions')}
                  onChange={e => setSummaryField('instructions', e.target.value)}
                  className="h-16 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-clinical-accent dark:border-slate-700 dark:bg-slate-900"
                  placeholder="e.g. maintain hydration, follow up in 3 days or earlier if symptoms worsen"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  type="submit"
                  size="sm"
                  leftIcon={<Save className="h-3 w-3" />}
                >
                  Save consultation
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  leftIcon={<Pill className="h-3 w-3" />}
                  onClick={handleSubmit(onSubmit)}
                >
                  Generate prescription
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  leftIcon={<Beaker className="h-3 w-3" />}
                  onClick={handleSubmit(onSubmit)}
                >
                  Order tests
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ConsultationPage;

