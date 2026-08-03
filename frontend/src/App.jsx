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
import CertificatePage from './pages/Certificate';
import VerifyCertificate from './pages/VerifyCertificate';
import AdminDashboardHome from './pages/AdminDashboardHome';
import AdminUsers from './pages/AdminUsers';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminCourses from './pages/AdminCourses';
import DailyCheckIn from './pages/DailyCheckIn';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Leaderboard from './pages/Leaderboard';
import Certificates from './pages/Certificates';
import Learning from './pages/Learning';
import CourseDetails from './pages/CourseDetails';
import LessonViewer from './pages/LessonViewer';
import LessonQuiz from './pages/LessonQuiz';
import Mentor from './pages/Mentor';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProtectedAdminRoute from './components/auth/ProtectedAdminRoute';
import DashboardLayout from './layouts/DashboardLayout';
import { Toaster } from 'react-hot-toast';
import LoadingSpinner from './components/ui/LoadingSpinner';

import { useLocation } from 'react-router-dom';

function RouteLogger() {
  const location = useLocation();
  console.log("Matched pathname:", location.pathname);
  return null;
}

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
          <RouteLogger />
          <Routes>
            {/* Public Application Layout wrapper (Landing, Auth, etc.) */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
              <Route path="verify/:certificateId" element={<VerifyCertificate />} />
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
              <Route path="/certificates" element={<CertificatePage />} />
              <Route path="/achievements" element={<Certificates />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/learning" element={<Learning />} />
              <Route path="/learning/course/:slug" element={<CourseDetails />} />
              <Route path="/learning/lesson/:lessonId" element={<LessonViewer />} />
              <Route path="/learning/lesson/:lessonId/quiz" element={<LessonQuiz />} />
              <Route path="/mentor" element={<Mentor />} />
              <Route path="/admin/dashboard" element={
                <ProtectedAdminRoute>
                  <AdminDashboardHome />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedAdminRoute>
                  <AdminUsers />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedAdminRoute>
                  <AdminAnalytics />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/courses" element={
                <ProtectedAdminRoute>
                  <AdminCourses />
                </ProtectedAdminRoute>
              } />
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
