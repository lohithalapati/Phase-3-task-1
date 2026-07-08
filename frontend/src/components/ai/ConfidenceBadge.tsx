import { cn } from '@/lib/utils';

interface ConfidenceBadgeProps {
  score: number;
  className?: string;
}

export function ConfidenceBadge({ score, className }: ConfidenceBadgeProps) {
  const getVariant = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="h-2 w-12 bg-surface-glass rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            getVariant(score) === 'success' && 'bg-success',
            getVariant(score) === 'warning' && 'bg-warning',
            getVariant(score) === 'error' && 'bg-error'
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-text-secondary">{score}%</span>
    </div>
  );
}
