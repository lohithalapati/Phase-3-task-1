import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * @purpose The primary button component for all user actions.
 * @props Extends standard button attributes.
 * @variants primary: Main CTA. secondary: Alternative action.
 * @sizes sm, md.
 * @accessibility_notes Automatically handles focus-visible state with a ring.
 * @usage <Button variant='primary' size='md'>Click Me</Button>
 */
const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 font-semibold transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-neural focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-primary-neural text-white hover:bg-primary-neural/90 shadow-md hover:shadow-glow hover:scale-[1.03]',
        secondary: 'bg-surface-card border border-surface-border text-text-primary hover:bg-surface-hover hover:border-primary-neural/50',
      },
      size: { 
        sm: 'h-9 px-4 text-sm rounded-lg', 
        md: 'h-10 px-5 text-base rounded-xl' 
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget;
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      
      ripple.className = 'absolute rounded-full bg-white/30 animate-ripple';
      const x = e.clientX - rect.left - 10;
      const y = e.clientY - rect.top - 10;
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        onClick={(e) => {
          createRipple(e);
          props.onClick?.(e);
        }}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';