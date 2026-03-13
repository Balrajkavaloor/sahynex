import { Pill, CheckCircle2 } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Table, THead, Th, TBody, Tr, Td } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { usePrescriptionStore } from '../../store/prescriptionStore';

const PharmacyDashboard = () => {
  const { prescriptions, markDispensed } = usePrescriptionStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Pill className="h-5 w-5 text-clinical-accent" />
            Pharmacy Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            View electronic prescriptions from doctors and coordinate safe dispensing.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader
          title="Prescriptions"
          description="Active medication orders awaiting dispensing."
        />
        <CardBody>
          {prescriptions.length === 0 ? (
            <p className="text-xs text-slate-500">
              No active prescriptions yet. Once consultations are saved with prescriptions they will
              appear here.
            </p>
          ) : (
            <Table>
              <THead>
                <Th>Patient</Th>
                <Th>Medicine</Th>
                <Th>Dosage / Instructions</Th>
                <Th>Status</Th>
                <Th />
              </THead>
              <TBody>
                {prescriptions.map(p => (
                  <Tr key={p.id}>
                    <Td>{p.patient_name}</Td>
                    <Td>{p.medicine}</Td>
                    <Td>{p.dosage}</Td>
                    <Td>
                      <Badge variant={p.status === 'dispensed' ? 'success' : 'warning'}>
                        {p.status}
                      </Badge>
                    </Td>
                    <Td className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<CheckCircle2 className="h-3 w-3" />}
                        disabled={p.status === 'dispensed'}
                        onClick={() => markDispensed(p.id)}
                      >
                        Mark as dispensed
                      </Button>
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

export default PharmacyDashboard;

