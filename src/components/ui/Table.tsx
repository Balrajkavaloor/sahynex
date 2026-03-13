import { ReactNode } from 'react';
import clsx from 'clsx';

export const Table = ({ children }: { children: ReactNode }) => (
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
      {children}
    </table>
  </div>
);

export const THead = ({ children }: { children: ReactNode }) => (
  <thead className="bg-slate-50/60 dark:bg-slate-900/80">
    <tr>{children}</tr>
  </thead>
);

export const Th = ({ className, children }: { className?: string; children: ReactNode }) => (
  <th
    scope="col"
    className={clsx(
      'px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400',
      className
    )}
  >
    {children}
  </th>
);

export const TBody = ({ children }: { children: ReactNode }) => (
  <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
    {children}
  </tbody>
);

export const Tr = ({ children }: { children: ReactNode }) => (
  <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60">{children}</tr>
);

export const Td = ({ className, children }: { className?: string; children: ReactNode }) => (
  <td className={clsx('whitespace-nowrap px-4 py-2 text-sm text-slate-700 dark:text-slate-200', className)}>
    {children}
  </td>
);

