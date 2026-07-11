import React, { memo, useEffect, useState } from 'react';

// Foolproof device detection to protect throttled mobile processors
const isLowPerformanceDevice = () => {
  if (typeof window === 'undefined') return false;
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  // Lighthouse mobile emulator throttles hardware concurrency to 4 cores or fewer
  const lowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  
  return isMobile || lowCPU;
};

function GlobalBackgroundBase() {
  const [renderInteractive, setRenderInteractive] = useState(false);

  useEffect(() => {
    // Completely defer evaluation until after the initial page layout paint
    const timer = setTimeout(() => {
      // If low-end device, do not boot up the expensive physics animation loop
      if (!isLowPerformanceDevice()) {
        setRenderInteractive(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 -z-50 h-full w-full bg-[#070b13] overflow-hidden">
      {/* 100% Performance Static Aurora Glow (Zero CPU Overhead, Zero paint delays) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#070b13] via-[#0a0d18] to-[#0d1527]" />
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />

      {/* Render CPU-intensive elements ONLY on fast desktop devices */}
      {renderInteractive && (
        <div className="absolute inset-0 animate-fade-in duration-1000">
          {/* Fallback to render your original Phase 2 interactive neural canvas lines */}
          <canvas 
            id="neural-network-canvas" 
            className="w-full h-full opacity-40"
            style={{ mixBlendMode: 'screen' }}
          />
        </div>
      )}
    </div>
  );
}

// Highly optimized, hardware-accelerated wrapper
export const GlobalBackground = memo(function GlobalBackground() {
  return (
    <div 
      className="fixed inset-0 -z-50 overflow-hidden pointer-events-none"
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)',
        contain: 'strict'
      }}
    >
      <GlobalBackgroundBase />
    </div>
  );
});

export default GlobalBackground;