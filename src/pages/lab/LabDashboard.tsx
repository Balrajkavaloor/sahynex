import { useState } from 'react';
import { Beaker, UploadCloud } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Table, THead, Th, TBody, Tr, Td } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

interface LabTest {
  id: string;
  patient: string;
  testType: string;
  status: 'pending' | 'in_progress' | 'completed';
}

const initialTests: LabTest[] = [
  { id: 'LAB-1023', patient: 'Rahul Sharma', testType: 'CBC', status: 'pending' },
  { id: 'LAB-1024', patient: 'Anita Patel', testType: 'LFT', status: 'in_progress' },
  { id: 'LAB-1025', patient: 'Carlos Gomez', testType: 'Chest X-ray', status: 'pending' }
];

const LabDashboard = () => {
  const [tests, setTests] = useState<LabTest[]>(initialTests);
  const [uploadFor, setUploadFor] = useState<LabTest | null>(null);

  const openUpload = (test: LabTest) => setUploadFor(test);
  const closeUpload = () => setUploadFor(null);

  const handleUpload = () => {
    if (!uploadFor) return;
    setTests(prev =>
      prev.map(t => (t.id === uploadFor.id ? { ...t, status: 'completed' } : t))
    );
    closeUpload();
  };

  const statusVariant = (status: LabTest['status']) => {
    if (status === 'completed') return 'success';
    if (status === 'in_progress') return 'warning';
    return 'default';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Beaker className="h-5 w-5 text-clinical-accent" />
            Lab Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Manage lab orders from clinicians, track statuses, and upload structured results.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader
          title="Pending tests"
          description="Incoming test orders from clinical consultations."
        />
        <CardBody>
          {tests.length === 0 ? (
            <p className="text-xs text-slate-500">No lab tests currently in the queue.</p>
          ) : (
            <Table>
              <THead>
                <Th>Test ID</Th>
                <Th>Patient</Th>
                <Th>Test type</Th>
                <Th>Status</Th>
                <Th />
              </THead>
              <TBody>
                {tests.map(t => (
                  <Tr key={t.id}>
                    <Td className="font-mono text-xs">{t.id}</Td>
                    <Td>{t.patient}</Td>
                    <Td>{t.testType}</Td>
                    <Td>
                      <Badge variant={statusVariant(t.status)}>{t.status}</Badge>
                    </Td>
                    <Td className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<UploadCloud className="h-3 w-3" />}
                        onClick={() => openUpload(t)}
                        disabled={t.status === 'completed'}
                      >
                        Upload result
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          )}
        </CardBody>
      </Card>

      <Modal
        open={!!uploadFor}
        onClose={closeUpload}
        title="Upload lab result"
        description={
          uploadFor
            ? `Attach results for ${uploadFor.testType} - ${uploadFor.patient}`
            : undefined
        }
      >
        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-medium text-slate-600 dark:text-slate-300">
              Result summary
            </label>
            <textarea
              className="h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-clinical-accent dark:border-slate-700 dark:bg-slate-900"
              placeholder="Structured interpretation of lab findings..."
            />
          </div>
          <div className="space-y-1">
            <label className="font-medium text-slate-600 dark:text-slate-300">
              Attach report (optional)
            </label>
            <input
              type="file"
              className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-full file:border-0 file:bg-clinical-accent-soft file:px-3 file:py-1 file:text-xs file:font-medium file:text-clinical-accent hover:file:bg-blue-100"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={closeUpload}>
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleUpload}>
              Mark as completed
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LabDashboard;

