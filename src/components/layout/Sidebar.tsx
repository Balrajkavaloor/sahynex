import { NavLink } from 'react-router-dom';
import {
  Activity,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Link2,
  Pill,
  Users
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/consultation', label: 'Consultation', icon: Link2 },
  { to: '/lab', label: 'Lab', icon: FlaskConical },
  { to: '/pharmacy', label: 'Pharmacy', icon: Pill },
  { to: '/records', label: 'Records', icon: FileText }
];

const Sidebar = () => {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-clinical-accent-soft text-clinical-accent">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">Clinical Flow</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Multilingual Care System</div>
        </div>
      </div>
      <nav className="space-y-1 text-sm">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                isActive
                  ? 'bg-clinical-accent text-white shadow-soft-card'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              ].join(' ')
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-xl bg-clinical-accent-soft p-3 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        <div className="mb-1 font-semibold">System Status</div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          All hospital integrations healthy. Voice and translation services online.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;

