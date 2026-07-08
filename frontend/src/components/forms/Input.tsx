import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, icon, ...props }, ref) => (
    <div className="w-full space-y-1">
      {label && <label className="block text-sm font-medium text-text-secondary">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">{icon}</div>}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-lg border border-surface-border bg-surface-glass/50 px-4 py-2 text-text-primary placeholder:text-text-muted transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-neural focus-visible:border-transparent disabled:opacity-50 disabled:cursor-not-allowed',
            icon && 'pl-10',
            error && 'border-error focus-visible:ring-error',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
);

Input.displayName = 'Input';
