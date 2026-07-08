import { ReactNode } from 'react';
import { Glass } from '@/components/ui/Glass';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
  interactive?: boolean;
}

export function Card({ children, className, header, footer, interactive }: CardProps) {
  return (
    <Glass variant="card" interactive={interactive} className={cn('p-6 space-y-4', className)}>
      {header && <div className="border-b border-surface-border pb-4">{header}</div>}
      <div>{children}</div>
      {footer && <div className="border-t border-surface-border pt-4">{footer}</div>}
    </Glass>
  );
}
