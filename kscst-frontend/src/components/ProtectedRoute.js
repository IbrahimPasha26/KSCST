import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user.role?.toUpperCase(); // Normalize role
  const normalizedAllowedRoles = allowedRoles.map((role) => role.toUpperCase());

  if (!normalizedAllowedRoles.includes(userRole)) {
    // Wrong role, redirect to appropriate dashboard or login
    if (userRole === 'TRAINEE') {
      return <Navigate to="/trainee/dashboard" replace />;
    } else if (userRole === 'TRAINER') {
      return <Navigate to="/trainer/dashboard" replace />;
    } else if (userRole === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Unknown role, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authorized, render children
  return children;
}

export default ProtectedRoute;