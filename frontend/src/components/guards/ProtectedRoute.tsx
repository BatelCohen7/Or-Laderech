import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'resident' | 'committee' | 'admin_root';
}

/**
 * Route Guard Component
 * 
 * Enforces RBAC:
 * - Resident routes require resident role
 * - Committee routes require committee role
 * - Unauthorized -> redirect to login
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const location = useLocation();
  const { user, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // No user -> redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole) {
    const userRole = user.role?.toLowerCase();
    const roleMap: Record<string, string> = {
      resident: 'resident',
      committee: 'committee',
      admin_root: 'admin_root',
      admin: 'admin_root', // Legacy support
    };

    const normalizedUserRole = roleMap[userRole] || userRole;

    if (normalizedUserRole !== requiredRole) {
      // Redirect to appropriate dashboard based on role
      if (normalizedUserRole === 'resident') {
        return <Navigate to="/resident/dashboard" replace />;
      } else if (normalizedUserRole === 'committee' || normalizedUserRole === 'admin_root') {
        return <Navigate to="/committee/dashboard" replace />;
      } else {
        return <Navigate to="/login" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
