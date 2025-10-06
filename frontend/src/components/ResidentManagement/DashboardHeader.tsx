import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Info,
  Bell, 
  ArrowLeft, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut,
  Home,
  CheckCircle,
  Search,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Badge, Button, Modal } from '../ui';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  unreadNotificationsCount?: number;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title,
  subtitle,
  unreadNotificationsCount = 0, 
  onNotificationsClick,
  onSettingsClick,
  onMenuToggle,
  isMobileMenuOpen = false
}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/', { replace: true }); 
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <motion.header 
      className="bg-white shadow-md border-b border-neutral-200 sticky top-0 z-40"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 text-neutral-600 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
              onClick={onMenuToggle}
              aria-label={isMobileMenuOpen ? "סגור תפריט" : "פתח תפריט"}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-lg flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-800">{title}</h1>
              <p className="text-sm text-neutral-600">{subtitle || `שלום, ${user?.full_name || 'משתמש'}`}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            {/* Search */}
            <button className="p-2 text-neutral-600 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors">
              <Search className="w-5 h-5 text-neutral-500" />
            </button>
            
            {/* Notifications */}
            <button 
              className="p-2 text-neutral-600 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors relative"
              onClick={onNotificationsClick}
            >
              <Bell className="w-5 h-5 text-neutral-500" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
            
            {/* Settings */}
            <button 
              className="p-2 text-neutral-600 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
              onClick={onSettingsClick}
            >
              <Settings className="w-5 h-5 text-neutral-500" />
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                className="p-2 text-neutral-600 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User className="w-5 h-5 text-neutral-500" aria-label="תפריט משתמש" />
              </button>
              
              {showUserMenu && (
                <motion.div 
                  className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-3 border-b border-neutral-200">
                    <p className="font-semibold text-neutral-900">{user?.full_name || 'משתמש'}</p>
                    <p className="text-xs text-neutral-600">{user?.email}</p>
                    <Badge variant="primary" className="mt-1 text-xs">
                      {user?.role === 'admin' ? 'מנהל מערכת' : 'דייר'}
                    </Badge>
                  </div>
                  <div className="p-1">
                    <button 
                      className="flex items-center space-x-3 space-x-reverse w-full p-2 text-neutral-700 hover:bg-gold-50 rounded-lg transition-colors text-right"
                      onClick={() => navigate('/')}
                    >
                      <Home className="w-4 h-4 text-neutral-500" />
                      <span>דף הבית</span>
                    </button>
                    <button 
                      className="flex items-center space-x-3 space-x-reverse w-full p-2 text-neutral-700 hover:bg-gold-50 rounded-lg transition-colors text-right"
                      onClick={onSettingsClick}
                    >
                      <Settings className="w-4 h-4 text-neutral-500" />
                      <span>הגדרות</span>
                    </button>
                    <button 
                      className="flex items-center space-x-3 space-x-reverse w-full p-2 text-neutral-700 hover:bg-gold-50 rounded-lg transition-colors text-right"
                    >
                      <HelpCircle className="w-4 h-4 text-neutral-500" />
                      <span>עזרה ותמיכה</span>
                    </button>
                  </div>
                  <div className="p-1 border-t border-neutral-200">
                    <button 
                      className="flex items-center space-x-3 space-x-reverse w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-right"
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowLogoutModal(true);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>התנתקות</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Back to Site */}
            <button 
              onClick={() => navigate('/')}
              className="p-2 text-neutral-600 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
              title="חזרה לאתר"
              aria-label="חזרה לאתר"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-500" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="התנתקות מהמערכת"
        size="sm"
      >
        <div className="space-y-6">
          <div className="text-center">
            <LogOut className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-neutral-900 mb-2">האם אתה בטוח שברצונך להתנתק?</h3>
            <p className="text-neutral-600">התנתקות תחזיר אותך לדף הבית</p>
          </div>
          
          <div className="flex space-x-4 space-x-reverse">
            <Button 
              variant="danger" 
              className="flex-1" 
              onClick={handleLogout}
            >
              התנתק
            </Button>
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => setShowLogoutModal(false)}
            >
              ביטול
            </Button>
          </div>
        </div>
      </Modal>
    </motion.header>
  );
};

export default DashboardHeader;