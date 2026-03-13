import { Toaster as SonnerToaster } from 'sonner';

export const Toaster = () => (
  <SonnerToaster
    position="top-right"
    richColors
    toastOptions={{
      classNames: {
        toast:
          'rounded-xl border border-slate-200 bg-white text-slate-900 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50',
        title: 'text-sm font-semibold',
        description: 'text-xs text-slate-500 dark:text-slate-400',
        actionButton:
          'bg-clinical-accent text-white rounded-lg text-xs px-2 py-1 font-medium hover:bg-blue-600',
        cancelButton:
          'bg-slate-100 text-slate-700 rounded-lg text-xs px-2 py-1 font-medium hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
      }
    }}
  />
);

