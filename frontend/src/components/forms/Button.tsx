import { forwardRef, ButtonHTMLAttributes, useState } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-neural focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden',
  {
    variants: {
      variant: {
        primary: 'bg-primary-neural text-white hover:bg-primary-neural/90 shadow-md hover:shadow-glow hover:scale-105 active:scale-95',
        secondary: 'bg-surface-glass border border-surface-border text-text-primary hover:bg-surface-hover hover:border-primary-cyan/50 hover:shadow-glow/50 active:scale-95',
        tertiary: 'bg-transparent text-text-primary hover:bg-surface-glass border border-surface-border/50 active:scale-95',
        destructive: 'bg-error text-white hover:bg-error/90 shadow-md hover:shadow-glow active:scale-95',
        outline: 'border-2 border-primary-neural text-primary-neural hover:bg-primary-neural/10 active:scale-95',
      },
      size: {
        xs: 'h-8 px-3 text-xs rounded-lg',
        sm: 'h-9 px-4 text-sm rounded-lg',
        md: 'h-10 px-5 text-base rounded-lg',
        lg: 'h-12 px-6 text-lg rounded-xl',
        xl: 'h-14 px-8 text-xl rounded-xl',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples([...ripples, { id, x, y }]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);

      props.onClick?.(e);
    };

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        onClick={handleClick}
        {...props}
      >
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none animate-ping"
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
              width: '20px',
              height: '20px',
              marginLeft: '-10px',
              marginTop: '-10px',
              animation: 'ripple 0.6s ease-out',
            }}
          />
        ))}
        {props.children}
      </button>
    );
  }
);

Button.displayName = 'Button';
