import { ReactNode } from 'react';
import { GlobalBackground } from './GlobalBackground';
import { Toaster } from '@/components/feedback/Toaster';

interface GlobalLayoutProps {
  children: ReactNode;
}

export function GlobalLayout({ children }: GlobalLayoutProps) {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary">
      <GlobalBackground />
      <div className="relative z-10">
        <main>{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
