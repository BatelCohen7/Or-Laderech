import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import
  {
    Home, FileText, BookOpen, MessageSquare, HelpCircle,
    AlertTriangle, Vote, Settings, Bell, Clock, Calendar,
    User, TrendingUp, Calculator, Building, Layers, Heart
  } from 'lucide-react';
import { Card, Button, Badge, LoadingSpinner } from '../components/ui';
import SimpleDocumentList from '../components/SimpleDocumentList';
import ResidentProfile from '../components/ResidentManagement/ResidentProfile';
import ProjectTimeline from '../components/ResidentManagement/ProjectTimeline';
import CommunicationCenter from '../components/ResidentManagement/CommunicationCenter';
import VotingSystem from '../components/ResidentManagement/VotingSystem';
import EnhancedSupportCenter from '../components/ResidentManagement/EnhancedSupportCenter';
import ObjectionsCenter from '../components/ResidentManagement/ObjectionsCenter';
import KnowledgeCenter from '../components/ResidentManagement/KnowledgeCenter';
import PropertyManagement3D from '../components/ResidentManagement/PropertyManagement3D';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import DashboardHeader from '../components/ResidentManagement/DashboardHeader';
import DashboardSidebar from '../components/ResidentManagement/DashboardSidebar';
import { ProjectsAPI, VotesAPI } from '../services/api';

const ResidentDashboard = () =>
{
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState<any>(null);
  const [residentData, setResidentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [votes, setVotes] = useState<any[]>([]);

  useEffect(() =>
  {
    const fetchData = async () =>
    {
      if (!user || !projectId) return;

      setLoading(true);
      try
      {
        const project = await ProjectsAPI.getOne(projectId);
        setProjectData(project);

        const votesData = await VotesAPI.getByProject(projectId);
        setVotes(votesData);

        // עד שיהיה Residents API אמיתי, נשתמש בנתוני משתמש מחובר
        setResidentData({
          id: user.id || '1',
          full_name: user.full_name || user.email || 'דייר',
          id_number: user.id_number || '123456789',
          apartment_number: '12',
          building: 'בניין A',
          status: 'חתם',
          signature_date: '2023-05-15',
        });

      } catch (error)
      {
        console.error('Error fetching data:', error);
        toast.error('שגיאה בטעינת נתונים');
      } finally
      {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, projectId]);

  const handleTabChange = (tabId: string) =>
  {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    setIsMobileMenuOpen(false);
  };

  const renderOverview = () =>
  {
    if (loading)
    {
      return (
        <Card>
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" color="primary" text="טוען נתונים..." centered />
          </div>
        </Card>
      );
    }

    if (!projectData)
    {
      return (
        <Card>
          <div className="text-center py-12 px-4">
            <Building className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">לא נמצא פרויקט</h3>
            <Button variant="primary" onClick={() => navigate('/resident-login')}>
              התחבר למערכת
            </Button>
          </div>
        </Card>
      );
    }

    const stats = [
      { label: 'התקדמות הפרויקט', value: `${projectData.progressPercent || 0}%`, icon: TrendingUp, change: '+5%', color: 'text-accent-600', bgColor: 'bg-accent-100' },
      { label: 'מסמכים', value: '—', icon: FileText, change: '+0', color: 'text-blue-600', bgColor: 'bg-blue-100' },
      { label: 'הודעות חדשות', value: unreadNotifications, icon: Bell, change: '+0', color: 'text-gold-600', bgColor: 'bg-gold-100' },
      { label: 'הצבעות פעילות', value: votes.length.toString(), icon: Vote, change: 'חדש', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        <Card>
          <h2 className="text-2xl font-bold text-neutral-900">{projectData.title}</h2>
          <p className="text-neutral-600">{projectData.address}</p>
          <div className="mt-4">
            <span className="font-medium">סטטוס:</span> {projectData.stage}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="p-4">
              <p className="text-sm text-neutral-600">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </Card>
          ))}
        </div>

        <Card>
          <h3 className="text-lg font-bold flex items-center space-x-2 space-x-reverse">
            <Heart className="w-5 h-5 text-gold-600" />
            <span>המילה שלנו</span>
          </h3>
          <p className="mt-2 text-neutral-700">
            "המטרה שלי ברורה: שדייר לא ירגיש לבד. שהמסע להתחדשות יהיה ברור, נעים, ועם מישהו שמהצד שלך – גם מקצועית, גם רגשית."
          </p>
        </Card>
      </div>
    );
  };

  const renderTabContent = () =>
  {
    if (loading)
    {
      return (
        <Card>
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" color="primary" text="טוען נתונים..." centered />
          </div>
        </Card>
      );
    }

    switch (activeTab)
    {
      case 'overview': return renderOverview();
      case 'timeline': return <ProjectTimeline />;
      case 'voting': return <VotingSystem projectId={projectId!} />;
      case 'communication': return <CommunicationCenter />;
      case '3d-models': return <PropertyManagement3D />;
      case 'support': return <EnhancedSupportCenter />;
      case 'objections': return <ObjectionsCenter />;
      case 'knowledge': return <KnowledgeCenter />;
      case 'profile': return <ResidentProfile />;
      default:
        return (
          <Card className="text-center py-12">
            <h3 className="text-xl font-semibold text-neutral-700">התוכן יהיה זמין בקרוב</h3>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-neutral-50">
      <DashboardHeader
        title="דשבורד דיירים"
        subtitle={projectData?.title}
        unreadNotificationsCount={unreadNotifications}
        onNotificationsClick={() => toast.success('הודעות נפתחו')}
        onSettingsClick={() => handleTabChange('settings')}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block w-64">
          <DashboardSidebar activeTab={activeTab} onTabChange={handleTabChange} className="sticky top-24" />
        </div>
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <DashboardSidebar activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        )}
        <div className="flex-1 pb-12">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default ResidentDashboard;
