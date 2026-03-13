import { Bell, Moon, Search, Sun, User2 } from 'lucide-react';
import { useTheme } from '../../store/themeStore';
import { InputHTMLAttributes } from 'react';

interface TopbarProps {
  onSearchChange?: (value: string) => void;
}

const SearchInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 shadow-sm ring-1 ring-transparent transition focus-within:ring-clinical-accent/60 dark:border-slate-700 dark:bg-slate-900/95">
    <Search className="h-4 w-4 text-slate-400" />
    <input
      {...props}
      className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
      placeholder="Search patient by name or ID"
    />
  </div>
);

const Topbar = ({ onSearchChange }: TopbarProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="w-80 max-w-md">
        <SearchInput onChange={e => onSearchChange?.(e.target.value)} />
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 inline-flex h-2 w-2 rounded-full bg-rose-500" />
        </button>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-clinical-accent-soft text-clinical-accent">
            <User2 className="h-4 w-4" />
          </div>
          <div className="hidden text-xs sm:block">
            <div className="font-medium leading-tight">Dr. Arjun Mehta</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Internal Medicine
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

