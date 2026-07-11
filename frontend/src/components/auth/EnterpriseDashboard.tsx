import React, { useEffect, useState } from 'react';

export default function EnterpriseDashboard() {
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowToast(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#070b13] p-8 text-white font-sans relative">
      {/* Top Navbar */}
      <div className="w-full flex items-center justify-between pb-6 border-b border-[#1e293b]/30 mb-8">
        <span className="font-extrabold text-lg text-[#3b82f6] tracking-tight">NeuralHandoff V5</span>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        <div style={{ contain: "content" }} className="w-full bg-[#0c121e]/60 min-h-[120px] border border-[#1e293b]/40 rounded-xl p-8 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-slate-100">Enterprise Dashboard Infrastructure Complete</h2>
        </div>
      </div>

      {/* SSO Toast Success Alert (Screenshot 2 Top Right) */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#ecfdf5] border border-[#a7f3d0] px-5 py-3.5 rounded-xl shadow-lg animate-fade-in animate-slide-in">
          <svg className="w-5 h-5 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-[#065f46] text-sm font-semibold tracking-wide">SSO Authentication Successful</span>
        </div>
      )}
    </div>
  );
}