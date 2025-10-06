import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home, FileText, Users, Settings, Crown, TrendingUp, Bell, LogOut } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import SimpleDocumentList from '../components/SimpleDocumentList';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { userType } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Redirect if user type doesn't match
  useEffect(() => {
    if (user && user.user_type !== userType) {
      navigate(`/dashboard/${user.user_type}`, { replace: true });
    }
  }, [user, userType, navigate]);

  const mockDocuments = [
    {
      id: '1',
      title: 'תכנית אדריכלית',
      type: 'pdf',
      status: 'approved' as const,
      uploadDate: '2024-01-15',
      fileSize: 2048000
    },
    {
      id: '2',
      title: 'אישור רשות',
      type: 'pdf',
      status: 'pending' as const,
      uploadDate: '2024-01-20',
      fileSize: 1024000
    }
  ];

  const tabs = [
    { id: 'overview', label: 'סקירה', icon: Home },
    { id: 'documents', label: 'מסמכים', icon: FileText },
    { id: 'users', label: 'משתמשים', icon: Users },
    { id: 'settings', label: 'הגדרות', icon: Settings }
  ];

  const userTypeConfig = {
    residents: { title: 'דשבורד דיירים', color: 'from-gold-500 to-warmGold-400' },
    developers: { title: 'דשבורד יזמים', color: 'from-gold-600 to-warmGold-500' },
    professionals: { title: 'דשבורד בעלי מקצוע', color: 'from-gold-500 to-warmGold-600' },
    authorities: { title: 'דשבורד רשויות', color: 'from-warmGold-600 to-gold-700' }
  };

  const config = userTypeConfig[userType as keyof typeof userTypeConfig] || userTypeConfig.residents;

  const stats = [
    { label: 'פרויקטים פעילים', value: '3', icon: Home, change: '+1' },
    { label: 'מסמכים', value: '12', icon: FileText, change: '+3' },
    { label: 'הודעות חדשות', value: '5', icon: Bell, change: '+2' },
    { label: 'התקדמות כללית', value: '67%', icon: TrendingUp, change: '+5%' }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('התנתקת בהצלחה');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('שגיאה בהתנתקות');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warmGold-50 to-cream-50">
      {/* Header */}
      <div className="bg-white shadow-luxury border-b border-cream-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className={`w-12 h-12 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center shadow-luxury`}>
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">{config.title}</h1>
                <p className="text-neutral-600">ברוך הבא, {user?.full_name || user?.email || 'משתמש'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button className="relative p-2 text-neutral-600 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="התנתק"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-cream-200">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8 space-x-reverse">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 space-x-reverse py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-gold-500 text-gold-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} hover>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                      <p className="text-sm text-gold-600 mt-1 font-semibold">
                        {stat.change} מהחודש הקודם
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-100 to-warmGold-100 rounded-xl flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-gold-600" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <h3 className="text-xl font-bold text-neutral-900 mb-6">פעילות אחרונה</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-800">הועלה מסמך חדש</p>
                    <p className="text-sm text-neutral-600">תכנית אדריכלית מעודכנת</p>
                    <p className="text-xs text-neutral-500 mt-1">לפני 2 שעות</p>
                  </div>
                  <Badge variant="success">חדש</Badge>
                </div>
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-800">הודעה מהיזם</p>
                    <p className="text-sm text-neutral-600">עדכון לגבי מועד תחילת עבודות</p>
                    <p className="text-xs text-neutral-500 mt-1">לפני 4 שעות</p>
                  </div>
                  <Badge variant="info">הודעה</Badge>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'documents' && (
          <SimpleDocumentList
            documents={mockDocuments}
            onView={(doc) => toast.success(`צפייה ב: ${doc.title}`)}
            onDownload={(doc) => toast.success(`הורדת: ${doc.title}`)}
          />
        )}

        {activeTab !== 'overview' && activeTab !== 'documents' && (
          <Card className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {tabs.find(tab => tab.id === activeTab)?.icon && 
                React.createElement(tabs.find(tab => tab.id === activeTab)!.icon, { 
                  className: "w-8 h-8 text-neutral-400" 
                })
              }
            </div>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h3>
            <p className="text-neutral-600">התוכן יהיה זמין בקרוב</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;