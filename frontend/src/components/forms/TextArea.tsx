import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, label, ...props }, ref) => (
    <div className="w-full space-y-1">
      {label && <label className="block text-sm font-medium text-text-secondary">{label}</label>}
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-lg border border-surface-border bg-surface-glass/50 px-4 py-3 text-text-primary placeholder:text-text-muted transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-neural focus-visible:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none',
          error && 'border-error focus-visible:ring-error',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
);

TextArea.displayName = 'TextArea';
