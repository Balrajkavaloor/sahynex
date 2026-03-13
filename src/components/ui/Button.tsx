import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clinical-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ring-offset-clinical-bg dark:ring-offset-slate-950',
  {
    variants: {
      variant: {
        primary:
          'bg-clinical-accent text-white shadow-sm hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500',
        outline:
          'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
        ghost:
          'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
        danger:
          'bg-rose-500 text-white shadow-sm hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500'
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4',
        lg: 'h-10 px-5 text-base',
        icon: 'h-9 w-9'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = ({ className, variant, size, leftIcon, rightIcon, children, ...props }: ButtonProps) => {
  return (
    <button className={clsx(buttonVariants({ variant, size }), className)} {...props}>
      {leftIcon && <span className="mr-2 h-4 w-4">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2 h-4 w-4">{rightIcon}</span>}
    </button>
  );
};

export default Button;

