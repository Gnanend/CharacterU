import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main Application Layout wrapper */}
          <Route path="/" element={<MainLayout />}>
            {/* Main Routing Endpoints */}
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="register" element={<Register />} />
            
            {/* Fallback for undefined routes */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
