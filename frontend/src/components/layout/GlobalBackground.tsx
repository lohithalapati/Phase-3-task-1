import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function GlobalBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const particleCount = 40;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 8 + 12,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-background-primary overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background-primary via-[#0a0d18] to-background-secondary" />
      <div
        className="absolute inset-0 animate-aurora"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 1000px 500px at 20% 40%, rgba(37, 99, 235, 0.18) 0%, transparent 60%),
            radial-gradient(ellipse 800px 600px at 80% 20%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 600px 400px at 50% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.04) 0%, transparent 100%)
          `,
          backgroundSize: '200% 200%',
          animation: 'aurora 80s ease-in-out infinite',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(37, 99, 235, 0.3) 0.5px, transparent 0.5px),
            linear-gradient(90deg, rgba(37, 99, 235, 0.3) 0.5px, transparent 0.5px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 1200px 600px at 50% 10%, rgba(6, 182, 212, 0.06) 0%, transparent 70%),
            radial-gradient(ellipse 900px 700px at 100% 100%, rgba(37, 99, 235, 0.05) 0%, transparent 60%)
          `,
        }}
      />
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full blur-sm"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `rgba(37, 99, 235, ${0.15 + Math.random() * 0.15})`,
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
              boxShadow: `0 0 ${particle.size * 2}px rgba(37, 99, 235, 0.3)`,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-gradient-radial from-primary-neural/15 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-primary-cyan/10 via-transparent to-transparent rounded-full blur-3xl" />
      </div>
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 1000 1000\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'5\' result=\'noise\' seed=\'1\' /%3E%3CfeDisplacementMap in=\'SourceGraphic\' in2=\'noise\' scale=\'1\' /%3E%3C/filter%3E%3Crect width=\'1000\' height=\'1000\' fill=\'white\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
}
