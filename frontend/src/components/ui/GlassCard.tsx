import React from 'react';
import { cn } from '../../utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative rounded-xl bg-white/5 border border-white/10",
        "backdrop-blur-xl p-6 shadow-xl",
        "hover:border-white/20 transition-all duration-300",
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};
