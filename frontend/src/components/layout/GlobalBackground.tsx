export function GlobalBackground() {
  return (
    <div className='fixed inset-0 -z-50 h-full w-full bg-background-primary overflow-hidden'>
      {/* Base gradient */}
      <div className='absolute inset-0 bg-gradient-to-br from-background-primary via-[#0a0d18] to-background-secondary' />
      
      {/* Aurora effect - CSS only */}
      <div 
        className='absolute inset-0 pointer-events-none'
        style={{
          background: 'radial-gradient(ellipse 800px 500px at 40% 30%, rgba(37, 99, 235, 0.08), transparent), radial-gradient(ellipse 600px 400px at 70% 60%, rgba(6, 182, 212, 0.06), transparent)',
          animation: 'aurora 120s ease-in-out infinite',
        }}
      />
      
      {/* Subtle grid pattern */}
      <div 
        className='absolute inset-0 opacity-10'
        style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(37, 99, 235, 0.05) 25%, rgba(37, 99, 235, 0.05) 26%, transparent 27%, transparent 74%, rgba(37, 99, 235, 0.05) 75%, rgba(37, 99, 235, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(37, 99, 235, 0.05) 25%, rgba(37, 99, 235, 0.05) 26%, transparent 27%, transparent 74%, rgba(37, 99, 235, 0.05) 75%, rgba(37, 99, 235, 0.05) 76%, transparent 77%, transparent)`,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}