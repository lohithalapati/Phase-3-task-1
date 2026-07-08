import { Card } from '@/components/data/Card';
import { Badge } from '@/components/data/Badge';
import { cn } from '@/lib/utils';

interface PromptCardProps {
  title: string;
  description: string;
  category: string;
  usage: number;
  className?: string;
}

export function PromptCard({ title, description, category, usage, className }: PromptCardProps) {
  return (
    <Card className={cn('cursor-pointer group', className)} interactive>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-text-primary group-hover:text-primary-neural transition-colors">{title}</h3>
          <Badge variant="secondary" className="text-xs">{category}</Badge>
        </div>
        <p className="text-sm text-text-muted">{description}</p>
        <div className="flex items-center justify-between pt-2 border-t border-surface-border">
          <span className="text-xs text-text-subtle">{usage} uses</span>
          <span className="text-xs text-primary-neural">Try it →</span>
        </div>
      </div>
    </Card>
  );
}
