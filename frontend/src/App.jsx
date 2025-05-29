import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import './index.css'

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

function App() {

  return (
    <BrowserRouter>
    	<main>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>    	      
    </BrowserRouter>
  );
}

export default App;