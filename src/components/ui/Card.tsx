import { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Card = ({ className, children, ...props }: CardProps) => (
  <div
    className={clsx(
      'group rounded-2xl border border-slate-200 bg-clinical-card/90 p-4 shadow-soft-card backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const CardHeader = ({ title, description, actions }: CardHeaderProps) => (
  <div className="mb-4 flex items-start justify-between gap-4">
    <div>
      <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
      )}
    </div>
    {actions && <div className="shrink-0">{actions}</div>}
  </div>
);

export const CardBody = ({ children }: { children: ReactNode }) => (
  <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200">{children}</div>
);

