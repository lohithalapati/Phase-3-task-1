import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function Glass({ children, className, interactive = false }: GlassProps) {
  return (
    <div className={cn(
      'relative rounded-xl border border-surface-border bg-surface-card backdrop-blur-xl transition-colors duration-fast',
      interactive && 'hover:border-primary-neural/50',
      className
    )}>
      <div className='relative'>{children}</div>
    </div>
  );
}