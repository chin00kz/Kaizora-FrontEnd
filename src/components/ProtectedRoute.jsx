import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSystemStatus } from '../context/SystemStatusContext';
import LoadingScreen from './LoadingScreen';

/**
 * Protects routes based on auth state, approval status, and role.
 * Superadmin always bypasses role checks.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, profile, loading } = useAuth();
  const { isWakingUp, isLoading: isSystemLoading } = useSystemStatus();
  const location = useLocation();

  if (loading || isSystemLoading) {
    return <LoadingScreen isWakingUp={isWakingUp} />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If profile is loaded and user is not approved, send to pending screen
  // (Superadmin is always approved)
  if (profile && profile.role !== 'superadmin' && !profile.is_approved) {
    if (location.pathname !== '/pending-approval') {
      return <Navigate to="/pending-approval" replace />;
    }
  }

  // Superadmin bypasses all role restrictions on the frontend too
  if (allowedRoles && profile?.role !== 'superadmin' && !allowedRoles.includes(profile?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
