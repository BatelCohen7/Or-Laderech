import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, LoadingSpinner } from '../components/ui';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: string;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredUserType,
  adminOnly = false
}) => {
  const { user, loading, isConfigured } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // בדיקה אם המשתמש הוא מנהל (לפי אימייל או תפקיד)
  const isAdmin = user?.email === 'oravraham217@gmail.com' || 
                 user?.email === 'admin@orbaderech.co.il' || 
                 user?.id_number === '123456789' || 
                 user?.role === 'admin' || 
                 user?.user_type === 'authorities' ||
                 user?.user_type === 'admin';

  // Redirect to admin dashboard if user is admin
  useEffect(() => {
    if (user && isAdmin && location.pathname !== '/admin' && !location.pathname.includes('/admin/')) {
      navigate('/admin');
    }
  }, [user, isAdmin, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center p-8">
          <LoadingSpinner size="lg" color="primary" className="mx-auto mb-4" />
          <p className="text-neutral-600">טוען...</p>
        </div>
      </div>
    );
  }

  // For demo purposes, allow access to admin pages without authentication
  if (adminOnly) {
    return <>{children}</>;
  }

  // For development - allow access to dashboard with demo content
  const appEnv = import.meta.env.VITE_APP_ENV || 'development';
  if ((!isConfigured || !user) && appEnv === 'development') {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="bg-yellow-50 border-b border-yellow-200 p-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-center text-yellow-800">
              <span className="text-sm">
                🔧 מצב דמו: מציג תוכן לדוגמה
              </span>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  if (!user) {
    // For demo purposes, we'll show demo content instead of redirecting
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="bg-yellow-50 border-b border-yellow-200 p-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-center text-yellow-800">
              <span className="text-sm">
                🔧 מצב דמו: מציג תוכן לדוגמה ללא התחברות
              </span>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  // Check if user has the required role
  // Map role to user_type for backward compatibility
  const userType = user.user_type || (
    user.role === 'admin' ? 'authorities' : 
    user.role === 'resident' ? 'residents' :
    user.role === 'developer' ? 'developers' :
    user.role === 'professional' ? 'professionals' : user.role
  );
                  
  // Special case: admin can access any route
  if (isAdmin) {
    return <>{children}</>;
  }
  
  if (requiredUserType && userType !== requiredUserType) {
    // For demo purposes, we'll show demo content instead of redirecting
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="bg-yellow-50 border-b border-yellow-200 p-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-center text-yellow-800">
              <span className="text-sm">
                🔧 מצב דמו: מציג תוכן לדוגמה (הרשאות לא מתאימות)
              </span>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;