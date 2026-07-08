import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  variant?: 'card' | 'surface' | 'overlay';
}

export function Glass({ children, className, interactive = false, variant = 'card' }: GlassProps) {
  const baseStyles = 'backdrop-blur-lg rounded-xl border border-surface-border';
  
  const variants = {
    card: 'bg-surface-card',
    surface: 'bg-surface-glass',
    overlay: 'bg-surface-glass/95',
  };

  const interactiveStyles = interactive
    ? 'transition-all duration-200 hover:bg-surface-hover hover:border-primary-cyan/50 hover:shadow-glow'
    : '';

  return (
    <div className={cn(baseStyles, variants[variant], interactiveStyles, className)}>
      {children}
    </div>
  );
}
