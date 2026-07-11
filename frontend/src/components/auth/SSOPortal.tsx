import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SSOPortal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard', { state: { showToast: true } });
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#070b13] p-4 relative font-sans">
      <div style={{ contain: "content" }} className="w-full max-w-[420px] min-h-[460px] bg-[#0c121e]/80 border border-[#1e293b]/50 rounded-2xl p-10 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1 font-sans">NeuralHandoff</h1>
          <p className="text-[#64748b] text-[13px] font-medium tracking-wide">Enterprise Single Sign-On Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Work Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@enterprise.com"
              required
              className="w-full px-4 py-3 bg-[#080d16] border border-[#1e293b]/80 rounded-xl text-white placeholder-[#334155] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-all duration-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-[#080d16] border border-[#1e293b]/80 rounded-xl text-white placeholder-[#334155] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-all duration-200 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#2563eb] to-[#4f46e5] hover:from-[#1d4ed8] hover:to-[#4338ca] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/15 text-sm flex items-center justify-center"
          >
            {isLoading ? "Signing in..." : "Sign In with SSO"}
          </button>
        </form>
      </div>
    </div>
  );
}