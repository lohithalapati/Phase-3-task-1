import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const avatarVariants = cva(
  'inline-flex items-center justify-center rounded-full font-semibold text-white',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
      },
      variant: {
        primary: 'bg-primary-neural',
        secondary: 'bg-secondary-purple',
        success: 'bg-success',
        warning: 'bg-warning',
        error: 'bg-error',
      },
    },
    defaultVariants: { size: 'md', variant: 'primary' },
  }
);

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  initials?: string;
  className?: string;
}

export function Avatar({ src, alt, initials, size, variant, className }: AvatarProps) {
  if (src) {
    return <img src={src} alt={alt} className={cn(avatarVariants({ size, variant, className }), 'object-cover')} />;
  }

  return (
    <div className={cn(avatarVariants({ size, variant, className }))}>
      {initials}
    </div>
  );
}
