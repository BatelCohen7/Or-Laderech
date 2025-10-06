import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button } from './ui';
import { ArrowLeft } from 'lucide-react';

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
  const { user } = useAuth();

  // For demo purposes, we'll always show the content
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Demo mode banner */}
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
};

export default ProtectedRoute;