import { useEffect } from 'react';
import { Activity, CalendarClock, ClipboardList, Users } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar
} from 'recharts';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { usePatientStore } from '../../store/patientStore';
import { useConsultationStore } from '../../store/consultationStore';

const visitsData = [
  { day: 'Mon', visits: 18, followups: 6 },
  { day: 'Tue', visits: 24, followups: 8 },
  { day: 'Wed', visits: 20, followups: 7 },
  { day: 'Thu', visits: 26, followups: 9 },
  { day: 'Fri', visits: 30, followups: 10 }
];

const workloadData = [
  { dept: 'OPD', count: 40 },
  { dept: 'Cardiology', count: 16 },
  { dept: 'Radiology', count: 22 },
  { dept: 'Lab', count: 28 },
  { dept: 'Pharmacy', count: 34 }
];

const DoctorDashboard = () => {
  const { patients, fetchAll } = usePatientStore();
  const { consultations, fetchAll: fetchConsultations } = useConsultationStore();

  useEffect(() => {
    if (!patients.length) fetchAll();
    if (!consultations.length) fetchConsultations();
  }, [patients.length, consultations.length, fetchAll, fetchConsultations]);

  const totalPatientsToday = 24;
  const pendingConsultations = 6;
  const recentConsultations = consultations.slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Doctor Dashboard</h1>
          <p className="text-xs text-slate-500">
            Multilingual clinical cockpit for today&apos;s patient flow and care coordination.
          </p>
        </div>
        <Badge className="flex items-center gap-1">
          <Activity className="h-3 w-3" />
          All systems operational
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Total patients today</p>
                <p className="mt-1 text-2xl font-semibold">{totalPatientsToday}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Pending consultations</p>
                <p className="mt-1 text-2xl font-semibold">{pendingConsultations}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-200">
                <CalendarClock className="h-5 w-5" />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Total registered patients</p>
                <p className="mt-1 text-2xl font-semibold">{patients.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-200">
                <ClipboardList className="h-5 w-5" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Patient visits"
            description="Daily outpatient visits and follow-ups for this week."
          />
          <CardBody>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitsData}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="visits"
                    stroke="#2563eb"
                    fill="url(#colorVisits)"
                    name="Visits"
                  />
                  <Area
                    type="monotone"
                    dataKey="followups"
                    stroke="#10b981"
                    fill="#ecfdf5"
                    name="Follow-ups"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Department workload"
            description="Relative distribution of orders and encounters."
          />
          <CardBody>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workloadData} layout="vertical" margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" />
                  <YAxis dataKey="dept" type="category" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Recent consultations"
          description="Most recent multilingual consultations captured via voice and structured summaries."
        />
        <CardBody>
          {recentConsultations.length === 0 ? (
            <p className="text-xs text-slate-500">
              No consultations recorded yet today. Start a consultation from the Consultation
              module.
            </p>
          ) : (
            <ul className="space-y-2 text-xs">
              {recentConsultations.map(c => (
                <li
                  key={c.id}
                  className="flex items-start justify-between rounded-lg border border-slate-100 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    <p className="font-medium">{c.diagnosis || 'Consultation'}</p>
                    <p className="line-clamp-2 text-slate-500">{c.summary}</p>
                  </div>
                  <span className="ml-4 text-[11px] text-slate-400">
                    {new Date(c.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default DoctorDashboard;

