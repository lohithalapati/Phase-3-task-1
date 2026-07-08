import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-surface-card group-[.toaster]:text-text-primary group-[.toaster]:border group-[.toaster]:border-surface-border group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-lg',
          description: 'group-[.toast]:text-text-muted',
          actionButton: 'group-[.toast]:bg-primary-neural group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-surface-glass group-[.toast]:text-text-primary',
        },
        duration: 4000,
      }}
    />
  );
}
