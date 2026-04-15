import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Protects routes based on auth state, approval status, and role.
 * Superadmin always bypasses role checks.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    );
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
