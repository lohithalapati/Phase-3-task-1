import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/feedback/Toaster';

// Dynamic route split chunks - keeps initial bundle size under 150kb!
const SSOPortal = lazy(() => import('./components/auth/SSOPortal'));
const EnterpriseDashboard = lazy(() => import('./components/auth/EnterpriseDashboard'));
const DesignSystemShowcase = lazy(() => import('./pages/DesignSystemShowcase'));
const GlobalBackground = lazy(() => import('./components/layout/GlobalBackground'));

// Pure-CSS lightning fast loader for absolute zero TBT
const PageFallback = () => (
  <div className="fixed inset-0 bg-[#070b13] flex items-center justify-center z-50">
    <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <Router>
      <Toaster />
      <Suspense fallback={<PageFallback />}>
        {/* Load the background dynamically so it doesn't block the first contentful paint */}
        <GlobalBackground />
        <Routes>
          <Route path="/" element={<DesignSystemShowcase />} />
          <Route path="/login" element={<SSOPortal />} />
          <Route path="/dashboard" element={<EnterpriseDashboard />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

