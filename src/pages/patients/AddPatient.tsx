import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { usePatientStore } from '../../store/patientStore';
import { toast } from 'sonner';

interface AddPatientForm {
  name: string;
  age: number;
  gender: string;
  phone: string;
  preferred_language: string;
}

const AddPatient = () => {
  const { register, handleSubmit, formState, reset } = useForm<AddPatientForm>({
    defaultValues: {
      name: '',
      age: 0,
      gender: 'Male',
      phone: '',
      preferred_language: 'English'
    }
  });
  const addPatient = usePatientStore(s => s.addPatient);
  const navigate = useNavigate();

  const onSubmit = async (values: AddPatientForm) => {
    const created = await addPatient({
      ...values,
      age: Number(values.age)
    } as any);
    toast.success('Patient added', {
      description: `${created.name} (${created.patient_id}) has been registered.`
    });
    reset();
    navigate(`/patients/${created.id}`);
  };

  return (
    <Card>
      <CardHeader
        title="Add Patient"
        description="Register a new patient and capture their preferred language for multilingual consultations."
      />
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Full Name
            </label>
            <input
              {...register('name', { required: true })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-clinical-accent dark:border-slate-700 dark:bg-slate-900"
              placeholder="Patient name"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Age
            </label>
            <input
              type="number"
              {...register('age', { required: true, min: 0 })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-clinical-accent dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Gender
            </label>
            <select
              {...register('gender', { required: true })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-clinical-accent dark:border-slate-700 dark:bg-slate-900"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Phone
            </label>
            <input
              {...register('phone', { required: true })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-clinical-accent dark:border-slate-700 dark:bg-slate-900"
              placeholder="+91 98765 43210"
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Preferred Language
            </label>
            <input
              {...register('preferred_language', { required: true })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-clinical-accent dark:border-slate-700 dark:bg-slate-900"
              placeholder="e.g. Hindi, Tamil, Spanish"
            />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? 'Saving...' : 'Save Patient'}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default AddPatient;

