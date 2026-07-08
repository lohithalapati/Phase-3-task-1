import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-lg bg-gradient-to-r from-surface-glass via-surface-hover to-surface-glass',
        className
      )}
      style={{
        backgroundSize: '1000px 100%',
        backgroundPosition: '0 0',
      }}
    />
  );
}
