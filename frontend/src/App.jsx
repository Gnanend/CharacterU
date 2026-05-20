import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Application Layout wrapper */}
        <Route path="/" element={<MainLayout />}>
          {/* Main Routing Endpoints */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          
          {/* Fallback for undefined routes */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
