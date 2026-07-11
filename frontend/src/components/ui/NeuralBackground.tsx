import React, { useEffect, useRef, useState } from 'react';

export const NeuralBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // CRITICAL: Defer canvas initialization until AFTER page is fully interactive
    const deferredInit = setTimeout(() => {
      const isMobile = window.innerWidth < 768;
      const lowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
      
      // Skip rendering entirely on mobile/low-power devices
      if (isMobile || lowCPU) {
        return;
      }
      
      setShouldRender(true);
    }, 3000); // Wait 3 seconds after page load

    return () => clearTimeout(deferredInit);
  }, []);

  useEffect(() => {
    if (!shouldRender || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{x: number; y: number; vx: number; vy: number}> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }

    const animate = () => {
      ctx.fillStyle = '#030014';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 163, 255, 0.3)';
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    return () => cancelAnimationFrame(animationId);
  }, [shouldRender]);

  return (
    <div className="fixed inset-0 -z-50 bg-[#030014]">
      <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-blue-900/10 blur-[100px] rounded-full" />
      {shouldRender && <canvas ref={canvasRef} className="absolute inset-0" />}
    </div>
  );
};
