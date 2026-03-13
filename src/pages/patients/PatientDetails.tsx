import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClipboardList, FileText, FlaskConical, Stethoscope } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { usePatientStore } from '../../store/patientStore';
import { useConsultationStore } from '../../store/consultationStore';
import { formatDate } from '../../utils/formatDate';

const tabs = [
  { id: 'consultations', label: 'Consultation History', icon: Stethoscope },
  { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
  { id: 'labs', label: 'Lab Results', icon: FlaskConical }
] as const;

type TabId = (typeof tabs)[number]['id'];

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabId>('consultations');
  const patient = usePatientStore(s => (id ? s.getById(id) : undefined));
  const { consultations } = useConsultationStore();

  const patientConsultations = useMemo(
    () => consultations.filter(c => c.patient_id === patient?.patient_id),
    [consultations, patient?.patient_id]
  );

  if (!patient) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-slate-500">
        Patient not found or still loading.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{patient.name}</h1>
          <p className="text-xs text-slate-500">
            ID {patient.patient_id} • Age {patient.age} • {patient.gender}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <ClipboardList className="h-3 w-3" />
          Registered {formatDate(patient.created_at)}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader title="Patient Info" />
          <CardBody>
            <dl className="grid grid-cols-2 gap-2 text-xs">
              <dt className="text-slate-500">Patient ID</dt>
              <dd className="font-mono">{patient.patient_id}</dd>
              <dt className="text-slate-500">Phone</dt>
              <dd>{patient.phone}</dd>
              <dt className="text-slate-500">Preferred Language</dt>
              <dd>
                <Badge>{patient.preferred_language}</Badge>
              </dd>
              <dt className="text-slate-500">Last Visit</dt>
              <dd>{formatDate(patient.last_visit ?? patient.created_at)}</dd>
            </dl>
          </CardBody>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader title="Clinical Timeline" />
          <CardBody>
            {patientConsultations.length === 0 ? (
              <p className="text-xs text-slate-500">
                No consultations recorded yet for this patient.
              </p>
            ) : (
              <ul className="space-y-2 text-xs">
                {patientConsultations.map(c => (
                  <li
                    key={c.id}
                    className="flex items-start justify-between rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/60"
                  >
                    <div>
                      <div className="font-medium">{c.diagnosis || 'Consultation'}</div>
                      <p className="line-clamp-2 text-slate-500">{c.summary}</p>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {formatDate(c.created_at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Clinical Records"
          description="View multilingual consultation history, prescriptions, and lab results for this patient."
        />
        <CardBody>
          <div className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-2 text-xs dark:border-slate-800">
            {tabs.map(t => {
              const Icon = t.icon;
              const active = t.id === activeTab;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={[
                    'inline-flex items-center gap-1 rounded-full px-3 py-1',
                    active
                      ? 'bg-clinical-accent text-white'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                  ].join(' ')}
                >
                  <Icon className="h-3 w-3" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {activeTab === 'consultations' && (
            <div className="space-y-2 text-xs">
              {patientConsultations.length === 0 ? (
                <p className="text-slate-500">
                  No consultation history. Start a new consultation from the Consultation module.
                </p>
              ) : (
                patientConsultations.map(c => (
                  <div
                    key={c.id}
                    className="rounded-lg border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-medium">Symptoms &amp; Diagnosis</span>
                      <span className="text-[11px] text-slate-400">
                        {formatDate(c.created_at)}
                      </span>
                    </div>
                    <p className="mb-1 text-slate-600 dark:text-slate-300">{c.summary}</p>
                    <p className="text-slate-500 dark:text-slate-400">
                      <span className="font-medium">Diagnosis:</span> {c.diagnosis}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <p className="text-xs text-slate-500">
              Prescriptions issued from the Consultation and Pharmacy modules will appear here once
              backend integration is wired.
            </p>
          )}

          {activeTab === 'labs' && (
            <p className="text-xs text-slate-500">
              Lab orders and uploaded results will surface here after connecting to the lab
              workflow backend.
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default PatientDetails;

