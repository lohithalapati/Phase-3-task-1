import React from 'react';
import { useCurrentUser } from '../../features/auth';

export const DashboardIndex: React.FC = () => {
  const user = useCurrentUser();
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to Enterprise Core</h2>
        <p className="text-slate-600 mb-8">Your security clearance has been verified.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
            <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Active Identity</h3>
            <p className="text-blue-900 font-medium truncate">{user.email}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-5">
            <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Clearance Level</h3>
            <p className="text-emerald-900 font-medium capitalize">{user.role}</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-5">
            <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Session Status</h3>
            <p className="text-amber-900 font-medium">Encrypted & Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};
