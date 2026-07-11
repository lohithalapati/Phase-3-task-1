import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center text-center px-4">
      <div className="space-y-6 max-w-2xl">
        <span className="px-3 py-1 text-[10px] font-mono tracking-widest text-blue-400 bg-blue-500/5 border border-blue-500/20 rounded-full uppercase">
          NeuralHandoff V5 Platform
        </span>
        <h1 className="text-5xl font-black text-white tracking-tight sm:text-6xl">
          Autonomous Enterprise Handoff Systems
        </h1>
        <p className="text-base text-neutral-400 max-w-md mx-auto">
          Ultra-secure, feature-flagged, and role-authorized orchestration layer for modern operations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link 
            to={ROUTES.PUBLIC.LOGIN} 
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold tracking-wide transition-all duration-200"
          >
            Access Portal
          </Link>
          <Link 
            to={ROUTES.PUBLIC.SIGNUP} 
            className="w-full sm:w-auto px-8 py-3 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 rounded-lg text-sm font-semibold tracking-wide border border-neutral-800 transition-all duration-200"
          >
            Register Workspace
          </Link>
        </div>
      </div>
    </div>
  );
};