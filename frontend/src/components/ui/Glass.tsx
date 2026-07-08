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
      'relative rounded-xl border border-surface-border bg-surface-card backdrop-blur-xl transition-all duration-medium',
      interactive && 'hover:scale-[1.02] hover:shadow-glow hover:border-primary-neural/50',
      className
    )}>
      <div className='absolute -inset-px rounded-xl opacity-20 pointer-events-none' style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.0) 100%)'
      }} />
      <div className='relative'>{children}</div>
    </div>
  );
}