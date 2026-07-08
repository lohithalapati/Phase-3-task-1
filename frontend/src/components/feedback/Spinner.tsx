import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const spinnerVariants = cva('inline-block animate-spin rounded-full border-2 border-surface-border', {
  variants: {
    size: {
      sm: 'h-4 w-4 border-t-primary-neural',
      md: 'h-6 w-6 border-t-primary-neural',
      lg: 'h-8 w-8 border-t-primary-neural',
      xl: 'h-10 w-10 border-t-primary-neural',
    },
    variant: {
      primary: 'border-t-primary-neural',
      secondary: 'border-t-secondary-purple',
      success: 'border-t-success',
      error: 'border-t-error',
    },
  },
  defaultVariants: { size: 'md', variant: 'primary' },
});

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export function Spinner({ size, variant, className }: SpinnerProps) {
  return <div className={cn(spinnerVariants({ size, variant }), className)} />;
}
