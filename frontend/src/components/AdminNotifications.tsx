import React from 'react';
import { Bell, User, FileText, AlertTriangle, Vote, Settings, CheckCircle, Info } from 'lucide-react';
import { Button } from './ui';

interface Notification {
  id: string;
  type: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface AdminNotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

const AdminNotifications: React.FC<AdminNotificationsProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose
}) => {
  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return `לפני ${diffDay} ימים`;
    } else if (diffHour > 0) {
      return `לפני ${diffHour} שעות`;
    } else if (diffMin > 0) {
      return `לפני ${diffMin} דקות`;
    } else {
      return 'עכשיו';
    }
  };
  
  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'resident_registration': return <User className="w-5 h-5 text-blue-500" />;
      case 'document_upload': return <FileText className="w-5 h-5 text-green-500" />;
      case 'objection': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'vote_ended': return <Vote className="w-5 h-5 text-purple-500" />;
      case 'system': return <Settings className="w-5 h-5 text-neutral-500" />;
      default: return <Bell className="w-5 h-5 text-gold-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-luxury-lg border border-neutral-200 w-80">
      <div className="p-4 border-b border-cream-200 flex items-center justify-between">
        <h3 className="font-bold text-neutral-900 flex items-center">
          <Bell className="w-4 h-4 text-gold-500 mr-2" />
          <span>התראות</span>
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onMarkAllAsRead}
          disabled={notifications.filter(n => !n.read).length === 0}
        >
          סמן הכל כנקרא
        </Button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            <Bell className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p>אין התראות חדשות</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-4 border-b border-cream-100 hover:bg-cream-50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
              onClick={() => onMarkAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${!notification.read ? 'font-semibold text-neutral-900' : 'text-neutral-700'}`}>
                    {notification.content}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {formatTimeAgo(notification.timestamp)}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-3 border-t border-cream-200 text-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-gold-600 hover:bg-gold-50"
          onClick={onClose}
        >
          סגור
        </Button>
      </div>
    </div>
  );
};

export default AdminNotifications;