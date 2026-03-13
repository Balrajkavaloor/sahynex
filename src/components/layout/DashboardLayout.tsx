import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { usePatientStore } from '../../store/patientStore';
import { useEffect, useState } from 'react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { searchPatients } = usePatientStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!search) return;
    const results = searchPatients(search);
    if (results.length === 1) {
      navigate(`/patients/${results[0].id}`);
    }
  }, [search, navigate, searchPatients]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar onSearchChange={setSearch} />
        <main className="flex-1 overflow-y-auto bg-clinical-bg p-6 dark:bg-slate-950">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

