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
  Settings,
  Calendar,
  MessageSquare,
  HelpCircle,
  Layers
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  activeTab, 
  onTabChange,
  className = ''
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.email === 'oravraham217@gmail.com';

  const tabs = [
    { 
      id: 'overview', 
      label: 'סקירה כללית', 
      icon: Home, 
      description: 'מבט כללי על הפרויקט והפעילות',
      badge: null
    },
    { 
      id: 'timeline', 
      label: 'ציר זמן הפרויקט', 
      icon: Calendar, 
      description: 'מעקב אחר התקדמות הפרויקט',
      badge: null
    },
    { 
      id: 'voting', 
      label: 'מערכת הצבעות', 
      icon: Vote, 
      description: 'השתתפות בהצבעות והחלטות',
      badge: { count: 2, variant: 'error' }
    },
    { 
      id: 'communication', 
      label: 'מרכז תקשורת', 
      icon: MessageSquare, 
      description: 'הודעות ותקשורת עם כל הגורמים',
      badge: { count: 5, variant: 'warning' }
    },
    { 
      id: 'documents', 
      label: 'מסמכים', 
      icon: FileText, 
      description: 'ניהול מסמכים דיגיטלי',
      badge: { count: 3, variant: 'info' }
    },
    { 
      id: '3d-models', 
      label: 'מודלים תלת-ממדיים', 
      icon: Layers, 
      description: 'צפייה במודלים אינטראקטיביים',
      badge: { count: 3, variant: 'success' }
    },
    { 
      id: 'support', 
      label: 'מרכז תמיכה', 
      icon: HelpCircle, 
      description: 'תמיכה ומענה לשאלות',
      badge: null
    },
    { 
      id: 'objections', 
      label: 'התנגדויות', 
      icon: AlertTriangle, 
      description: 'הגשת והתנגדויות',
      badge: null
    },
    { 
      id: 'knowledge', 
      label: 'מרכז ידע', 
      icon: Book, 
      description: 'מידע ומדריכים',
      badge: null
    },
    { 
      id: 'profile', 
      label: 'הפרופיל שלי', 
      icon: User, 
      description: 'ניהול הפרופיל האישי',
      badge: null
    },
    { 
      id: 'settings', 
      label: 'הגדרות', 
      icon: Settings, 
      description: 'הגדרות המערכת',
      badge: null
    }
  ];

  // Admin tabs
  const adminTabs = [
    { 
      id: 'overview', 
      label: 'סקירה כללית', 
      icon: Home 
    },
    { 
      id: 'projects', 
      label: 'ניהול פרויקטים', 
      icon: Building 
    },
    { 
      id: 'residents', 
      label: 'ניהול דיירים', 
      icon: Users 
    },
    { 
      id: 'documents', 
      label: 'ניהול מסמכים', 
      icon: FileText 
    },
    { 
      id: 'votes', 
      label: 'מרכז הצבעות', 
      icon: Vote 
    },
    { 
      id: 'objections', 
      label: 'התנגדויות ובקשות', 
      icon: AlertTriangle 
    },
    { 
      id: 'knowledge', 
      label: 'מרכז ידע', 
      icon: Book 
    },
    { 
      id: 'users', 
      label: 'ניהול משתמשים', 
      icon: User 
    },
    { 
      id: 'settings', 
      label: 'הגדרות מערכת', 
      icon: Settings 
    }
  ];

  const displayTabs = isAdmin ? adminTabs : tabs;

  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-card border border-neutral-200 overflow-hidden ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 bg-gradient-to-r from-gold-500 to-warmGold-400 text-white">
        <h2 className="font-bold text-lg">{isAdmin ? 'ניהול מערכת' : 'תפריט ראשי'}</h2>
      </div>
      <nav className="p-3">
        {displayTabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center justify-between w-full p-3 rounded-lg text-right transition-colors ${
              activeTab === tab.id
                ? 'bg-gold-50 text-gold-700 border border-gold-200'
                : 'text-neutral-700 hover:bg-neutral-50 hover:text-gold-600 border border-transparent'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3 space-x-reverse">
              <tab.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{tab.label}</span>
            </div>
            
            {tab.badge && (
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                tab.badge.variant === 'error' ? 'bg-red-100 text-red-700' :
                tab.badge.variant === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                tab.badge.variant === 'info' ? 'bg-blue-100 text-blue-700' :
                tab.badge.variant === 'success' ? 'bg-green-100 text-green-700' :
                'bg-neutral-100 text-neutral-700'
              }`}>
                {tab.badge.count}
              </span>
            )}
          </motion.button>
        ))}
      </nav>
    </motion.div>
  );
};

export default DashboardSidebar;