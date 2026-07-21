import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_permissions');
    navigate(ROUTES.PUBLIC.LOGIN);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen w-screen bg-[#0A0A0A] text-neutral-100 overflow-hidden font-sans">
      <aside className="w-64 bg-[#0F0F0F] border-r border-neutral-900 flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="flex items-center space-x-3 px-2">
            <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm font-bold tracking-wider text-white">WORKSPACE NODE</span>
          </div>
          
          <nav className="space-y-1">
            <Link 
              to={ROUTES.PROTECTED.DASHBOARD} 
              className={`flex items-center px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                isActive(ROUTES.PROTECTED.DASHBOARD) 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/50 border border-transparent'
              }`}
            >
              Telemetry Dashboard
            </Link>
            <Link 
              to={ROUTES.PROTECTED.PROFILE} 
              className={`flex items-center px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                isActive(ROUTES.PROTECTED.PROFILE) 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/50 border border-transparent'
              }`}
            >
              User Profile
            </Link>
            <Link 
              to={ROUTES.PROTECTED.SETTINGS} 
              className={`flex items-center px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                isActive(ROUTES.PROTECTED.SETTINGS) 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/50 border border-transparent'
              }`}
            >
              System Config
            </Link>
          </nav>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-neutral-900/40 border border-neutral-900 rounded-xl">
            <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">Active Identity</p>
            <p className="text-xs font-semibold text-neutral-300 mt-1 truncate">
              {localStorage.getItem('user_role') === 'admin' ? 'Admin Operator' : 'Standard Node'}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-xs font-bold tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all duration-200 uppercase"
          >
            Purge Session
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-neutral-900 flex items-center justify-between px-8 bg-[#0F0F0F]/50 backdrop-blur-md">
          <div className="flex items-center space-x-2 text-xs font-mono text-neutral-500">
            <span>NETWORK</span>
            <span>/</span>
            <span className="text-blue-400 uppercase tracking-wider">
              {location.pathname.replace('/dashboard', 'root').replace('/', '') || 'overview'}
            </span>
          </div>
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
        </header>

        <section className="flex-1 overflow-y-auto p-8 bg-[#0A0A0A]">
          <div className="max-w-6xl mx-auto space-y-6">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
};