import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './i18n/i18n';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pledge from './pages/Pledge';
import DailyCheckIn from './pages/DailyCheckIn';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Leaderboard from './pages/Leaderboard';
import Certificates from './pages/Certificates';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import { Toaster } from 'react-hot-toast';
import LoadingSpinner from './components/ui/LoadingSpinner';

function App() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Router>
          <Routes>
            {/* Public Application Layout wrapper (Landing, Auth, etc.) */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
            </Route>

            {/* Protected SaaS Application Layout wrapper */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* These routes will render inside DashboardLayout's <Outlet /> */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pledge" element={<Pledge />} />
              <Route path="/daily-checkin" element={<DailyCheckIn />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
            </Route>

            {/* Fallback for undefined routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
