import { HTMLAttributes } from 'react';
import clsx from 'clsx';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default:
    'bg-clinical-accent-soft text-clinical-accent border-transparent',
  success:
    'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-800',
  warning:
    'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800',
  danger:
    'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-800',
  outline:
    'bg-transparent text-slate-700 border-slate-200 dark:text-slate-200 dark:border-slate-600'
};

const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
};

export default Badge;

