import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalLayout from './components/layout/GlobalLayout';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <GlobalLayout>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </GlobalLayout>
    </Router>
  );
}

export default App;
