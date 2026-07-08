import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold', {
  variants: {
    variant: {
      primary: 'bg-primary-neural/20 text-primary-neural border border-primary-neural/30',
      secondary: 'bg-secondary-purple/20 text-secondary-purple border border-secondary-purple/30',
      success: 'bg-success/20 text-success border border-success/30',
      warning: 'bg-warning/20 text-warning border border-warning/30',
      error: 'bg-error/20 text-error border border-error/30',
      muted: 'bg-surface-glass text-text-muted border border-surface-border',
    },
  },
  defaultVariants: { variant: 'primary' },
});

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({ children, variant, className, icon }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, className }))}>
      {icon}
      {children}
    </div>
  );
}
