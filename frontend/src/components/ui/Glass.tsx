import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  variant?: 'card' | 'surface' | 'overlay';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
}

export function Glass({
  children,
  className,
  interactive = false,
  variant = 'card',
  elevation = 'md',
}: GlassProps) {
  const baseStyles =
    'backdrop-blur-lg rounded-[20px] border border-surface-border transition-all duration-300';

  const variants = {
    card: 'bg-surface-card',
    surface: 'bg-surface-glass',
    overlay: 'bg-surface-glass/95',
  };

  const elevations = {
    none: 'shadow-none',
    sm: 'shadow-lg',
    md: 'shadow-xl',
    lg: 'shadow-2xl',
  };

  const interactiveStyles = interactive
    ? 'cursor-pointer hover:bg-surface-hover hover:border-primary-cyan/50 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]'
    : '';

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        elevations[elevation],
        interactiveStyles,
        className
      )}
    >
      {children}
    </div>
  );
}
