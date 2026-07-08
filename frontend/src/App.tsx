import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DesignSystemShowcase from './pages/DesignSystemShowcase';
import { GlobalBackground } from './components/layout/GlobalBackground';
import { Toaster } from './components/feedback/Toaster';

export default function App() {
  return (
    <Router>
      <GlobalBackground />
      <Toaster />
      <Routes>
        <Route path='/' element={<DesignSystemShowcase />} />
      </Routes>
    </Router>
  );
}