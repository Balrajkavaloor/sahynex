import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import ConsultationPage from './pages/doctor/ConsultationPage';
import PatientList from './pages/patients/PatientList';
import AddPatient from './pages/patients/AddPatient';
import PatientDetails from './pages/patients/PatientDetails';
import LabDashboard from './pages/lab/LabDashboard';
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard';
import DashboardLayout from './components/layout/DashboardLayout';
import { ThemeProvider } from './store/themeStore';
import { Toaster } from './components/ui/Toaster';

const App = () => {
  const isAuthenticated = true; // TODO: Replace with real auth state

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-clinical-bg text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />}
          >
            <Route index element={<DoctorDashboard />} />
            <Route path="patients" element={<PatientList />} />
            <Route path="patients/new" element={<AddPatient />} />
            <Route path="patients/:id" element={<PatientDetails />} />
            <Route path="consultation" element={<ConsultationPage />} />
            <Route path="lab" element={<LabDashboard />} />
            <Route path="pharmacy" element={<PharmacyDashboard />} />
            <Route path="records" element={<DoctorDashboard />} />
          </Route>
        </Routes>
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default App;

