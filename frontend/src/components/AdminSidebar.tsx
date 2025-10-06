import React from 'react';
import { 
  Home, 
  Info,
  Building, 
  Users, 
  FileText, 
  Vote, 
  AlertTriangle, 
  Book, 
  User, 
  Database, 
  Settings,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-luxury-lg border border-neutral-200 overflow-hidden sticky top-24">
      <div className="p-6 bg-gradient-to-r from-gold-500 to-warmGold-400 text-white">
        <h2 className="font-bold text-xl">דשבורד ניהול</h2>
      </div>
      <nav className="p-4">
        <motion.button
          onClick={() => onTabChange('overview')}
          className={`flex items-center space-x-3 space-x-reverse w-full p-4 rounded-lg text-right transition-colors ${
            activeTab === 'overview'
              ? 'bg-gold-50 text-gold-700 border border-gold-200 shadow-sm'
              : 'text-neutral-700 hover:bg-neutral-50 hover:text-gold-600 border border-transparent hover:shadow-sm'
          }`}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">סקירה כללית</span>
        </motion.button>
        
        <motion.button
          onClick={() => onTabChange('projects')}
          className={`flex items-center space-x-3 space-x-reverse w-full p-4 rounded-lg text-right transition-colors ${
            activeTab === 'projects'
              ? 'bg-gold-50 text-gold-700 border border-gold-200 shadow-sm'
              : 'text-neutral-700 hover:bg-neutral-50 hover:text-gold-600 border border-transparent hover:shadow-sm'
          }`}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <Building className="w-5 h-5" />
          <span className="font-medium">ניהול פרויקטים</span>
        </motion.button>
        
        <motion.button
          onClick={() => onTabChange('residents')}
          className={`flex items-center space-x-3 space-x-reverse w-full p-4 rounded-lg text-right transition-colors ${
            activeTab === 'residents'
              ? 'bg-gold-50 text-gold-700 border border-gold-200 shadow-sm'
              : 'text-neutral-700 hover:bg-neutral-50 hover:text-gold-600 border border-transparent hover:shadow-sm'
          }`}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <Users className="w-5 h-5" />
          <span className="font-medium">ניהול דיירים</span>
        </motion.button>
        
        <motion.button
          onClick={() => onTabChange('documents')}
          className={`flex items-center space-x-3 space-x-reverse w-full p-4 rounded-lg text-right transition-colors ${
            activeTab === 'documents'
              ? 'bg-gold-50 text-gold-700 border border-gold-200 shadow-sm'
              : 'text-neutral-700 hover:bg-neutral-50 hover:text-gold-600 border border-transparent hover:shadow-sm'
          }`}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <FileText className="w-5 h-5" />
          <span className="font-medium">ניהול מסמכים</span>
        </motion.button>
        
        <motion.button
          onClick={() => onTabChange('votes')}
          className={`flex items-center space-x-3 space-x-reverse w-full p-4 rounded-lg text-right transition-colors ${
            activeTab === 'votes'
              ? 'bg-gold-50 text-gold-700 border border-gold-200 shadow-sm'
              : 'text-neutral-700 hover:bg-neutral-50 hover:text-gold-600 border border-transparent hover:shadow-sm'
          }`}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <Vote className="w-5 h-5" />
          <span className="font-medium">מרכז הצבעות</span>
        </motion.button>
        
        <motion.button
          onClick={() => onTabChange('objections')}
          className={`flex items-center space-x-3 space-x-reverse w-full p-4 rounded-lg text-right transition-colors ${
            activeTab === 'objections'
              ? 'bg-gold-50 text-gold-700 border border-gold-200 shadow-sm'
              : 'text-neutral-700 hover:bg-neutral-50 hover:text-gold-600 border border-transparent hover:shadow-sm'
          }`}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">התנגדויות ובקשות</span>
        </motion.button>
        
        <motion.button
          onClick={() => onTabChange('knowledge')}
          className={`flex items-center space-x-3 space-x-reverse w-full p-4 rounded-lg text-right transition-colors ${
            activeTab === 'knowledge'
              ? 'bg-gold-50 text-gold-700 border border-gold-200 shadow-sm'
              : 'text-neutral-700 hover:bg-neutral-50 hover:text-gold-600 border border-transparent hover:shadow-sm'
          }`}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <Book className="w-5 h-5" />
          <span className="font-medium">מרכז ידע</span>
        </motion.button>
        
        <motion.button
          onClick={() => onTabChange('users')}
          className={`flex items-center space-x-3 space-x-reverse w-full p-4 rounded-lg text-right transition-colors ${
            activeTab === 'users'
              ? 'bg-gold-50 text-gold-700 border border-gold-200 shadow-sm'
              : 'text-neutral-700 hover:bg-neutral-50 hover:text-gold-600 border border-transparent hover:shadow-sm'
          }`}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <User className="w-5 h-5" />
          <span className="font-medium">ניהול משתמשים</span>
        </motion.button>
        
        <motion.button
          onClick={() => onTabChange('import-export')}
          className={`flex items-center space-x-3 space-x-reverse w-full p-4 rounded-lg text-right transition-colors ${
            activeTab === 'import-export'
              ? 'bg-gold-50 text-gold-700 border border-gold-200 shadow-sm'
              : 'text-neutral-700 hover:bg-neutral-50 hover:text-gold-600 border border-transparent hover:shadow-sm'
          }`}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <Database className="w-5 h-5" />
          <span className="font-medium">ייבוא/ייצוא</span>
        </motion.button>
        
        <motion.button
          onClick={() => onTabChange('settings')}
          className={`flex items-center space-x-3 space-x-reverse w-full p-4 rounded-lg text-right transition-colors ${
            activeTab === 'settings'
              ? 'bg-gold-50 text-gold-700 border border-gold-200 shadow-sm'
              : 'text-neutral-700 hover:bg-neutral-50 hover:text-gold-600 border border-transparent hover:shadow-sm'
          }`}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">הגדרות מערכת</span>
        </motion.button>
        
        <div className="border-t border-cream-200 my-2 pt-2">
          <motion.button
            onClick={handleLogout}
            className="flex items-center space-x-3 space-x-reverse w-full p-4 rounded-lg text-right text-red-600 hover:bg-red-50 transition-colors"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">התנתקות</span>
          </motion.button>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;