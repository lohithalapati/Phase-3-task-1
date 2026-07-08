import { ReactNode } from 'react';
import { GlobalBackground } from './GlobalBackground';
import { Toaster } from '@/components/feedback/Toaster';

interface AppShellProps {
  children: ReactNode;
  sidebar?: ReactNode;
  navbar?: ReactNode;
}

export function AppShell({ children, sidebar, navbar }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary">
      <GlobalBackground />
      
      <div className="relative z-10 flex h-screen flex-col">
        {navbar && <div className="border-b border-surface-border">{navbar}</div>}
        
        <div className="flex flex-1 overflow-hidden">
          {sidebar && <aside className="w-64 border-r border-surface-border overflow-y-auto">{sidebar}</aside>}
          
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
