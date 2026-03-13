import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Plus, UserPlus } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Table, THead, Th, TBody, Tr, Td } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { usePatientStore } from '../../store/patientStore';
import { formatDate } from '../../utils/formatDate';

const PatientList = () => {
  const { patients, loading, fetchAll } = usePatientStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!patients.length) {
      fetchAll();
    }
  }, [patients.length, fetchAll]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">Patients</h1>
        <Button leftIcon={<UserPlus className="h-4 w-4" />} onClick={() => navigate('/patients/new')}>
          Add Patient
        </Button>
      </div>
      <Card>
        <CardHeader
          title="Patient Registry"
          description="Track all registered patients, their preferred languages, and last visit history."
        />
        <CardBody>
          {loading && <p className="text-xs text-slate-500">Loading patients...</p>}
          {!loading && patients.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-xs text-slate-500">
              <p>No patients found yet.</p>
              <Button
                size="sm"
                leftIcon={<Plus className="h-3 w-3" />}
                onClick={() => navigate('/patients/new')}
              >
                Register first patient
              </Button>
            </div>
          )}
          {patients.length > 0 && (
            <Table>
              <THead>
                <Th>QR</Th>
                <Th>Patient ID</Th>
                <Th>Name</Th>
                <Th>Age</Th>
                <Th>Language</Th>
                <Th>Last Visit</Th>
                <Th />
              </THead>
              <TBody>
                {patients.map(p => (
                  <Tr key={p.id}>
                    <Td>
                      <QRCodeSVG value={p.patient_id} size={40} bgColor="transparent" />
                    </Td>
                    <Td className="font-mono text-xs">{p.patient_id}</Td>
                    <Td>{p.name}</Td>
                    <Td>{p.age}</Td>
                    <Td>
                      <Badge>{p.preferred_language}</Badge>
                    </Td>
                    <Td className="text-xs text-slate-500">{formatDate(p.last_visit ?? p.created_at)}</Td>
                    <Td className="text-right">
                      <Link
                        to={`/patients/${p.id}`}
                        className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
                      >
                        View
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default PatientList;

