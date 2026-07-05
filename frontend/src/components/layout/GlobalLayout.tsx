import { ReactNode } from 'react';

export default function GlobalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-[#030712] overflow-hidden">
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-neural-blue/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-aurora-violet/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-neural-cyan/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-4000" />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
