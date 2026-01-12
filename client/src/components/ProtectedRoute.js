import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
  // Get role from localStorage
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  // Check if user is logged in
  if (!token) {
    return <Navigate to="/auth/login" />;
  }

  // Check role if specified
  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
}
