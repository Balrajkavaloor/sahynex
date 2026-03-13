import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const { register, handleSubmit, formState } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' }
  });
  const navigate = useNavigate();

  const onSubmit = () => {
    // Stub auth; in real app call backend then store token
    navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-clinical-bg to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Multilingual Clinical Interaction &amp; Care Workflow
          </h1>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Secure login for hospital staff to access multilingual consultation and care workflows.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Email
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus-within:ring-2 focus-within:ring-clinical-accent dark:border-slate-700 dark:bg-slate-900">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                type="email"
                {...register('email', { required: true })}
                className="w-full bg-transparent outline-none"
                placeholder="doctor@hospital.org"
              />
            </div>
          </div>
          <div className="space-y-1 text-left">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Password
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus-within:ring-2 focus-within:ring-clinical-accent dark:border-slate-700 dark:bg-slate-900">
              <Lock className="h-4 w-4 text-slate-400" />
              <input
                type="password"
                {...register('password', { required: true })}
                className="w-full bg-transparent outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? 'Signing in...' : 'Login'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;

