import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from './supabaseClient';
import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';
import ProtectedRoute from './components/ProtectedRoute';

import StudentDashboard from './pages/Student/StudentDashboard';
import StudentProfile from './pages/Student/StudentProfile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import StaffDashboard from './pages/Maintenance Staff/StaffDashboard';
import TicketDetails from './pages/Admin/3 TicketDetails';
import StaffUpdatePage from './pages/Maintenance Staff/StaffUpdatePage';
import InProgressDetails from './pages/Admin/InProgressDetails';
import StudentTracker from './modules/tracking/components/StudentTracker';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    const resetTimeout = () => localStorage.setItem('lastActivity', Date.now());

    const checkTimeout = () => {
      const lastActivity = parseInt(localStorage.getItem('lastActivity'), 10);
      const token = localStorage.getItem('token');
      if (token && Date.now() - lastActivity > SESSION_TIMEOUT) {
        // Session expired
        localStorage.clear();
        supabase.auth.signOut();
        navigate('/auth/login');
      }
    };

    // Listen to user activity
    window.addEventListener('click', resetTimeout);
    window.addEventListener('keypress', resetTimeout);
    window.addEventListener('scroll', resetTimeout);
    window.addEventListener('mousemove', resetTimeout);

    const intervalId = setInterval(checkTimeout, 60 * 1000);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('click', resetTimeout);
      window.removeEventListener('keypress', resetTimeout);
      window.removeEventListener('scroll', resetTimeout);
      window.removeEventListener('mousemove', resetTimeout);
    };
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/auth/signUp" element={<SignUp />} />
      <Route path="/auth/login" element={<Login />} />

      <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/StudentProfile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />

      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/staff/dashboard" element={<ProtectedRoute role="staff"><StaffDashboard /></ProtectedRoute>} />

      <Route path="/admin/ticket/:id" element={<ProtectedRoute role="admin"><TicketDetails /></ProtectedRoute>} />
      <Route path="/admin/inprogress/:id" element={<ProtectedRoute role="admin"><InProgressDetails /></ProtectedRoute>} />
      <Route path="/staff/ticket/:id/update" element={<ProtectedRoute role="staff"><StaffUpdatePage /></ProtectedRoute>} />
      <Route path="/student/complaint/:id/track" element={<ProtectedRoute role="student"><StudentTracker /></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}


