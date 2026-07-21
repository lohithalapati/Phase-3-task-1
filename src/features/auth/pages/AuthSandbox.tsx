import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useSession } from '../hooks/useSession';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { ResetPasswordPage } from './ResetPasswordPage';
import { VerificationPage } from './VerificationPage';
import { VerificationSuccessPage } from './VerificationSuccessPage';
import { VerificationFailurePage } from './VerificationFailurePage';
import { SessionExpiredPage } from './SessionExpiredPage';
import { UnauthorizedPage } from './UnauthorizedPage';
import { ForbiddenPage } from './ForbiddenPage';
import { LandingAuthPage } from './LandingAuthPage';

export const AuthSandbox: React.FC = () => {
  const { state, login, logout, forceRefresh, clearError } = useAuth();
  const currentUser = useCurrentUser();
  const activeSession = useSession();
  const [activePreviewPage, setActivePreviewPage] = useState<string>('sandbox-dashboard');

  const handleQuickLogin = async (role: 'admin' | 'user') => {
    try {
      if (role === 'admin') {
        await login('admin@enterprise.com', 'SecuredPassword1!');
      } else {
        await login('user@enterprise.com', 'SecuredPassword1!');
      }
    } catch {
      // Ignored for sandbox mock helper
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row antialiased">
      {/* Control Console Sidebar */}
      <aside className="w-full md:w-80 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm">
              Ω
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Enterprise Auth</h2>
              <p className="text-[10px] font-semibold text-slate-400">Security Sandbox & Audit Deck</p>
            </div>
          </div>

          {/* Active Session Telemetry Panel */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 mb-6">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Live Telemetry</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className={`font-bold uppercase ${
                  state.status === 'authenticated' ? 'text-emerald-400' : 'text-amber-400'
                }`}>{state.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">User ID:</span>
                <span className="font-mono text-slate-300 max-w-[120px] truncate">{currentUser.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Role:</span>
                <span className="font-bold text-blue-400 uppercase">{currentUser.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Session ID:</span>
                <span className="font-mono text-slate-500 max-w-[120px] truncate">
                  {activeSession ? activeSession.id : 'N/A'}
                </span>
              </div>
            </div>
            {state.status === 'authenticated' ? (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => { void forceRefresh(); }}
                  className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold rounded text-slate-200 transition"
                >
                  🔄 Force Rotate
                </button>
                <button
                  onClick={() => { void logout(); }}
                  className="flex-1 py-1.5 px-2 bg-red-950/40 hover:bg-red-900/30 text-[10px] font-bold rounded text-red-400 transition border border-red-900/20"
                >
                  🚪 Terminate Lease
                </button>
              </div>
            ) : (
              <div className="mt-4">
                <button
                  onClick={() => { void handleQuickLogin('admin'); }}
                  className="w-full py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-[10px] font-bold rounded text-white transition"
                >
                  ⚡ Admin Bypass Sign In
                </button>
              </div>
            )}
          </div>

          {/* Page Display Selector */}
          <nav className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">View Screen Audits</h3>
            <button
              onClick={() => { setActivePreviewPage('sandbox-dashboard'); clearError(); }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold transition ${
                activePreviewPage === 'sandbox-dashboard' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              📊 Telemetry Console
            </button>
            <button
              onClick={() => { setActivePreviewPage('landing'); clearError(); }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold transition ${
                activePreviewPage === 'landing' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              1. Landing Auth Page
            </button>
            <button
              onClick={() => { setActivePreviewPage('login'); clearError(); }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold transition ${
                activePreviewPage === 'login' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              2. Login Interface
            </button>
            <button
              onClick={() => { setActivePreviewPage('signup'); clearError(); }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold transition ${
                activePreviewPage === 'signup' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              3. Signup Registry
            </button>
            <button
              onClick={() => { setActivePreviewPage('forgot'); clearError(); }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold transition ${
                activePreviewPage === 'forgot' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              4. Forgot Password Card
            </button>
            <button
              onClick={() => { setActivePreviewPage('reset'); clearError(); }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold transition ${
                activePreviewPage === 'reset' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              5. Reset Password Card
            </button>
            <button
              onClick={() => { setActivePreviewPage('verify-pending'); clearError(); }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold transition ${
                activePreviewPage === 'verify-pending' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              6. Email Verification (Pending)
            </button>
            <button
              onClick={() => { setActivePreviewPage('verify-success'); clearError(); }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold transition ${
                activePreviewPage === 'verify-success' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              7. Verification Success
            </button>
            <button
              onClick={() => { setActivePreviewPage('verify-failure'); clearError(); }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold transition ${
                activePreviewPage === 'verify-failure' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              8. Verification Failure
            </button>
            <button
              onClick={() => { setActivePreviewPage('expired'); clearError(); }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold transition ${
                activePreviewPage === 'expired' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              9. Session Expired View
            </button>
            <button
              onClick={() => { setActivePreviewPage('unauthorized'); clearError(); }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold transition ${
                activePreviewPage === 'unauthorized' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              10. Unauthorized Screen (401)
            </button>
            <button
              onClick={() => { setActivePreviewPage('forbidden'); clearError(); }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold transition ${
                activePreviewPage === 'forbidden' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              11. Forbidden Screen (403)
            </button>
          </nav>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-500">Press <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-300 font-mono">Tab</kbd> to audit focus loops.</p>
        </div>
      </aside>

      {/* Interactive Display Area */}
      <main className="flex-1 bg-slate-950 flex flex-col h-full min-w-0">
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/30">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Viewport Audit Frame</span>
          <span className="text-[11px] font-mono text-blue-400">Runtime: React 18 / Vite 5</span>
        </header>

        <div className="flex-1 overflow-y-auto flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950 to-slate-950">
          <div className="w-full max-w-md">
            {activePreviewPage === 'sandbox-dashboard' && (
              <div className="bg-slate-900 border border-slate-850 rounded-xl p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">System Cryptographic Verification State</h3>
                  <p className="text-xs text-slate-400 mt-1">Inspection array showing full reactive authentication state parameters.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Internal Claims Payload</span>
                    <pre className="text-[11px] font-mono bg-slate-950 p-4 rounded-lg border border-slate-800 text-blue-400 overflow-x-auto">
                      {JSON.stringify(state, null, 2)}
                    </pre>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-[11px] text-blue-300 leading-relaxed">
                      💡 **Auditor Tip**: Toggle any of the views in the sidebar to review strict input pattern validators, password complexity masks, and ARIA screen reader properties in the browser.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activePreviewPage === 'landing' && (
              <LandingAuthPage
                onLoginClick={() => setActivePreviewPage('login')}
                onSignupClick={() => setActivePreviewPage('signup')}
              />
            )}

            {activePreviewPage === 'login' && (
              <LoginPage onNavigate={(target) => setActivePreviewPage(target === 'signup' ? 'signup' : 'sandbox-dashboard')} />
            )}

            {activePreviewPage === 'signup' && (
              <SignupPage onNavigate={(target) => setActivePreviewPage(target === 'login' ? 'login' : 'sandbox-dashboard')} />
            )}

            {activePreviewPage === 'forgot' && (
              <ForgotPasswordPage onNavigate={(target) => setActivePreviewPage(target === 'login' ? 'login' : 'sandbox-dashboard')} />
            )}

            {activePreviewPage === 'reset' && (
              <ResetPasswordPage />
            )}

            {activePreviewPage === 'verify-pending' && (
              <VerificationPage onComplete={() => setActivePreviewPage('verify-success')} />
            )}

            {activePreviewPage === 'verify-success' && (
              <VerificationSuccessPage onProceed={() => setActivePreviewPage('sandbox-dashboard')} />
            )}

            {activePreviewPage === 'verify-failure' && (
              <VerificationFailurePage onRetry={() => setActivePreviewPage('verify-pending')} />
            )}

            {activePreviewPage === 'expired' && (
              <SessionExpiredPage onRelogin={() => setActivePreviewPage('login')} />
            )}

            {activePreviewPage === 'unauthorized' && (
              <UnauthorizedPage onReturn={() => setActivePreviewPage('login')} />
            )}

            {activePreviewPage === 'forbidden' && (
              <ForbiddenPage onReturn={() => setActivePreviewPage('sandbox-dashboard')} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
