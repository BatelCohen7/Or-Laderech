import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Building, 
  Info,
  Users,
  FileText, 
  Vote, 
  AlertTriangle, 
  Book, 
  Database, 
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  TrendingUp,
  User,
  Bell,
  CheckCircle,
  Clock,
  Calendar,
  Layers,
  Shield
} from 'lucide-react';
import { Card, Button, Input, Modal, Badge, LoadingSpinner } from '../components/ui';
import AdminHeader from '../components/AdminHeader';
import AdminSidebar from '../components/AdminSidebar';
import AdminStats from '../components/AdminStats';
import AdminProjectCard from '../components/AdminProjectCard';
import AdminResidentTable from '../components/AdminResidentTable';
import AdminDocumentList from '../components/AdminDocumentList';
import AdminVotingSystem from '../components/AdminVotingSystem';
import AdminObjectionsList from '../components/AdminObjectionsList';
import AdminKnowledgeCenter from '../components/AdminKnowledgeCenter';
import AdminNotifications from '../components/AdminNotifications';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../hooks/useProjects';
import { importService } from '../services/importService';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    description: '',
    city: '',
    address: '',
    stage: 'תכנון ראשוני',
    progress: 0,
    apartments: 0,
    residents_count: 0,
    developer_name: '',
    image_url: '',
    rating: 4.5
  });
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects, loading: projectsLoading, createProject } = useProjects();

  // For demo purposes, we don't redirect from admin dashboard
  // This allows anyone to access the admin dashboard without authentication

  // Update URL when tab changes
  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  // Mock data for residents
  const residents = [
    {
      id: '1',
      full_name: 'ישראל ישראלי',
      id_number: '123456789',
      phone: '050-1234567',
      email: 'israel@example.com',
      building: 'זלמן שזר 1',
      apartment: '15',
      registered: true
    },
    {
      id: '2',
      full_name: 'שרה כהן',
      id_number: '987654321',
      phone: '052-7654321',
      email: 'sara@example.com',
      building: 'זלמן שזר 3',
      apartment: '8',
      registered: false
    },
    {
      id: '3',
      full_name: 'משה לוי',
      id_number: '456789123',
      phone: '054-3456789',
      email: 'moshe@example.com',
      building: 'השבעה 2',
      apartment: '22',
      registered: false
    }
  ];

  // Mock data for documents
  const documents = [
    {
      id: '1',
      title: 'תכנית אדריכלית',
      file_url: 'https://example.com/docs/plan.pdf',
      file_type: 'pdf',
      file_size: '2.5MB',
      status: 'approved',
      uploaded_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'אישור רשות',
      file_url: 'https://example.com/docs/approval.pdf',
      file_type: 'pdf',
      file_size: '1.2MB',
      status: 'pending',
      uploaded_at: new Date().toISOString()
    }
  ];

  // Mock data for votes
  const votes = [
    {
      id: '1',
      title: 'אישור התכניות הסופיות',
      description: 'הצבעה על אישור התכניות האדריכליות הסופיות לפרויקט ההתחדשות',
      deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
      options: [
        { id: 'yes', text: 'בעד', votes: 15, percentage: 83.3 },
        { id: 'no', text: 'נגד', votes: 2, percentage: 11.1 },
        { id: 'abstain', text: 'נמנע', votes: 1, percentage: 5.6 }
      ],
      project_id: '1',
      status: 'active',
      created_at: new Date().toISOString()
    }
  ];

  // Mock data for objections
  const objections = [
    {
      id: '1',
      title: 'התנגדות לגובה הבניין המתוכנן',
      description: 'הבניין המתוכנן בגובה 12 קומות חורג מהתכנית המקורית ופוגע בנוף העירוני ובזכויות השכנים.',
      type: 'planning',
      status: 'under_review',
      submitted_date: new Date().toISOString(),
      last_update: new Date().toISOString(),
      resident_id: '1',
      resident_name: 'ישראל ישראלי',
      project_id: '1'
    }
  ];

  // Mock data for articles
  const articles = [
    {
      id: '1',
      title: 'מדריך למשתמש חדש',
      content: 'מדריך מפורט לשימוש במערכת אור בדרך...',
      category: 'מדריכים',
      tags: ['מדריך', 'התחלה', 'חדש'],
      author: 'צוות אור בדרך',
      published_date: new Date().toISOString(),
      views: 1250,
      status: 'published'
    }
  ];

  // Mock data for notifications
  const notifications = [
    {
      id: '1',
      type: 'resident_registration',
      content: 'דייר חדש נרשם למערכת: שרה כהן',
      timestamp: new Date().toISOString(),
      read: false
    },
    {
      id: '2',
      type: 'document_upload',
      content: 'מסמך חדש הועלה: תכנית אדריכלית מעודכנת',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false
    },
    {
      id: '3',
      type: 'objection',
      content: 'התנגדות חדשה הוגשה: התנגדות לגובה הבניין המתוכנן',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false
    }
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCreateProject = async () => {
    try {
      await createProject(projectFormData);
      toast.success('הפרויקט נוצר בהצלחה');
      setShowNewProjectModal(false);
      setProjectFormData({
        title: '',
        description: '',
        city: '',
        address: '',
        stage: 'תכנון ראשוני',
        progress: 0,
        apartments: 0,
        residents_count: 0,
        developer_name: '',
        image_url: '',
        rating: 4.5
      });
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('שגיאה ביצירת הפרויקט');
    }
  };

  const handleImportResidents = async () => {
    if (!importFile) return;
    setImportLoading(true);
    
    try {
      const result = await importService.importResidentsFromCSV(importFile);
      setImportResult(result);
      toast.success(`ייבוא הושלם: ${result.added} דיירים נוספו, ${result.updated} עודכנו`);
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(`שגיאה בייבוא: ${error.message}`);
    } finally {
      setImportLoading(false);
    }
  };

  const handleExportResidents = async () => {
    setExportLoading(true);
    
    try {
      const csvData = await importService.exportResidentsToCSV();
      
      // Create a blob and download link
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `residents_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('ייצוא הושלם בהצלחה');
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(`שגיאה בייצוא: ${error.message}`);
    } finally {
      setExportLoading(false);
      setShowExportModal(false);
    }
  };

  const handleMarkAllNotificationsAsRead = () => {
    setUnreadNotifications(0);
    toast.success('כל ההתראות סומנו כנקראו (מצב דמו)');
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setUnreadNotifications(prev => Math.max(0, prev - 1));
    toast.success('ההתראה סומנה כנקראה (מצב דמו)');
  };

  const renderOverview = () => {
    const stats = [
      { 
        label: 'פרויקטים פעילים', 
        value: projects.length, 
        icon: <Building className="w-6 h-6 text-gold-600" />, 
        color: 'text-gold-600', 
        bgColor: 'bg-gold-100',
        change: '+2 החודש'
      },
      { 
        label: 'דיירים רשומים', 
        value: 1580, 
        icon: <Users className="w-6 h-6 text-blue-600" />, 
        color: 'text-blue-600', 
        bgColor: 'bg-blue-100',
        change: '+45 החודש'
      },
      { 
        label: 'מסמכים', 
        value: 256, 
        icon: <FileText className="w-6 h-6 text-green-600" />, 
        color: 'text-green-600', 
        bgColor: 'bg-green-100',
        change: '+12 החודש'
      },
      { 
        label: 'משתמשים רשומים', 
        value: 2450, 
        icon: <User className="w-6 h-6 text-purple-600" />, 
        color: 'text-purple-600', 
        bgColor: 'bg-purple-100',
        change: '+78 החודש'
      }
    ];

    return (
      <div className="space-y-8">
        <AdminStats stats={stats} />
        
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">פרויקטים אחרונים</h2>
            <Button 
              variant="primary" 
              icon={Plus}
              onClick={() => setShowNewProjectModal(true)}
            >
              פרויקט חדש
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.slice(0, 4).map(project => (
              <AdminProjectCard
                key={project.id}
                project={project}
                onView={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
          
          {projects.length > 4 && (
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('projects')}
              >
                הצג את כל הפרויקטים
              </Button>
            </div>
          )}
        </Card>
        
        <Card>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">פעילות אחרונה</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 space-x-reverse p-4 hover:bg-neutral-50 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-neutral-800">דייר חדש נרשם</p>
                <p className="text-sm text-neutral-600">שרה כהן נרשמה לפרויקט צפת - שכונת כנען</p>
                <p className="text-xs text-neutral-500 mt-1">לפני שעתיים</p>
              </div>
              <Badge variant="info">חדש</Badge>
            </div>
            
            <div className="flex items-start space-x-4 space-x-reverse p-4 hover:bg-neutral-50 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-neutral-800">מסמך חדש הועלה</p>
                <p className="text-sm text-neutral-600">תכנית אדריכלית מעודכנת הועלתה לפרויקט תל אביב</p>
                <p className="text-xs text-neutral-500 mt-1">לפני 3 שעות</p>
              </div>
              <Badge variant="info">חדש</Badge>
            </div>
            
            <div className="flex items-start space-x-4 space-x-reverse p-4 hover:bg-neutral-50 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Vote className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-neutral-800">הצבעה חדשה נפתחה</p>
                <p className="text-sm text-neutral-600">הצבעה על אישור התכניות הסופיות בפרויקט צפת</p>
                <p className="text-xs text-neutral-500 mt-1">לפני 5 שעות</p>
              </div>
              <Badge variant="info">חדש</Badge>
            </div>
          </div>
        </Card>
        
        <Card>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">סטטוס מערכת</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3 space-x-reverse">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800 mb-1">המערכת פעילה</h4>
                <p className="text-green-700 text-sm">
                  כל המערכות פועלות כראוי במצב דמו.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderProjects = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-neutral-900">ניהול פרויקטים</h2>
          <Button 
            variant="primary" 
            icon={Plus}
            onClick={() => setShowNewProjectModal(true)}
          >
            פרויקט חדש
          </Button>
        </div>
        
        <Card>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="חיפוש פרויקטים..."
                icon={Search}
              />
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <Button variant="outline" icon={Filter}>
                סינון
              </Button>
              <Button variant="outline" icon={Download}>
                ייצוא
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            {projectsLoading ? (
              <div className="text-center py-12">
                <LoadingSpinner size="lg" color="primary" text="טוען פרויקטים..." centered />
              </div>
            ) : projects.length > 0 ? (
              projects.map(project => (
                <AdminProjectCard
                  key={project.id}
                  project={project}
                  onView={() => {}}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Building className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-700 mb-2">אין פרויקטים</h3>
                <p className="text-neutral-600 mb-6">לא נמצאו פרויקטים במערכת</p>
                <Button 
                  variant="primary" 
                  icon={Plus}
                  onClick={() => setShowNewProjectModal(true)}
                >
                  צור פרויקט חדש
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  const renderResidents = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-neutral-900">ניהול דיירים</h2>
          <div className="flex space-x-2 space-x-reverse">
            <Button 
              variant="outline" 
              icon={Upload}
              onClick={() => setShowImportModal(true)}
            >
              ייבוא דיירים
            </Button>
            <Button 
              variant="outline" 
              icon={Download}
              onClick={() => setShowExportModal(true)}
            >
              ייצוא דיירים
            </Button>
            <Button variant="primary" icon={Plus}>
              דייר חדש
            </Button>
          </div>
        </div>
        
        <Card>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="חיפוש דיירים..."
                icon={Search}
              />
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <Button variant="outline" icon={Filter}>
                סינון
              </Button>
            </div>
          </div>
          
          <AdminResidentTable
            residents={residents}
            onEdit={() => {}}
            onView={() => {}}
            onDelete={() => {}}
          />
        </Card>
      </div>
    );
  };

  const renderDocuments = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-neutral-900">ניהול מסמכים</h2>
          <Button variant="primary" icon={Plus}>
            העלאת מסמך
          </Button>
        </div>
        
        <Card>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="חיפוש מסמכים..."
                icon={Search}
              />
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <Button variant="outline" icon={Filter}>
                סינון
              </Button>
            </div>
          </div>
          
          <AdminDocumentList
            documents={documents}
            onApprove={() => {}}
            onReject={() => {}}
            onDelete={() => {}}
          />
        </Card>
      </div>
    );
  };

  const renderVotes = () => {
    return (
      <div className="space-y-6">
        <AdminVotingSystem
          votes={votes}
          projects={projects}
          onCreateVote={() => {}}
          onCloseVote={() => {}}
          onDeleteVote={() => {}}
          onExportResults={() => {}}
        />
      </div>
    );
  };

  const renderObjections = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">התנגדויות ובקשות</h2>
        </div>
        
        <AdminObjectionsList
          objections={objections}
          onApprove={() => {}}
          onReject={() => {}}
          onAddNotes={() => {}}
        />
      </div>
    );
  };

  const renderKnowledge = () => {
    return (
      <div className="space-y-6">
        <AdminKnowledgeCenter
          articles={articles}
          onCreateArticle={() => {}}
          onUpdateArticle={() => {}}
          onDeleteArticle={() => {}}
        />
      </div>
    );
  };

  const renderUsers = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-neutral-900">ניהול משתמשים</h2>
          <Button variant="primary" icon={Plus}>
            משתמש חדש
          </Button>
        </div>
        
        <Card>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="חיפוש משתמשים..."
                icon={Search}
              />
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <Button variant="outline" icon={Filter}>
                סינון
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    שם
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    אימייל
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    תפקיד
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    סטטוס
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900">אור אברהם</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-600">oravraham217@gmail.com</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="primary">מנהל מערכת</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="success">פעיל</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    <div className="flex space-x-2 space-x-reverse">
                      <Button variant="ghost" size="sm">
                        ערוך
                      </Button>
                      <Button variant="ghost" size="sm">
                        מחק
                      </Button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900">ישראל ישראלי</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-600">israel@example.com</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="default">דייר</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="success">פעיל</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    <div className="flex space-x-2 space-x-reverse">
                      <Button variant="ghost" size="sm">
                        ערוך
                      </Button>
                      <Button variant="ghost" size="sm">
                        מחק
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  const renderImportExport = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-neutral-900">ייבוא/ייצוא נתונים</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xl font-bold text-neutral-900 mb-4">ייבוא נתונים</h3>
            <p className="text-neutral-600 mb-6">
              ייבוא נתונים מקובץ CSV. הקובץ צריך להכיל את העמודות הבאות: שם מלא, ת.ז, טלפון, אימייל, בניין, דירה.
            </p>
            <div className="flex space-x-2 space-x-reverse">
              <Button 
                variant="primary" 
                icon={Upload}
                onClick={() => setShowImportModal(true)}
              >
                ייבוא דיירים
              </Button>
              <Button variant="outline" icon={Upload}>
                ייבוא פרויקטים
              </Button>
            </div>
          </Card>
          
          <Card>
            <h3 className="text-xl font-bold text-neutral-900 mb-4">ייצוא נתונים</h3>
            <p className="text-neutral-600 mb-6">
              ייצוא נתונים לקובץ CSV. הקובץ יכיל את כל הנתונים הרלוונטיים.
            </p>
            <div className="flex space-x-2 space-x-reverse">
              <Button 
                variant="primary" 
                icon={Download}
                onClick={() => setShowExportModal(true)}
              >
                ייצוא דיירים
              </Button>
              <Button variant="outline" icon={Download}>
                ייצוא פרויקטים
              </Button>
            </div>
          </Card>
        </div>
        
        <Card>
          <h3 className="text-xl font-bold text-neutral-900 mb-4">גיבוי ושחזור</h3>
          <p className="text-neutral-600 mb-6">
            גיבוי ושחזור של כל נתוני המערכת. הגיבוי כולל את כל הטבלאות והנתונים.
          </p>
          <div className="flex space-x-2 space-x-reverse">
            <Button variant="primary" icon={Download}>
              גיבוי מערכת
            </Button>
            <Button variant="outline" icon={Upload}>
              שחזור מגיבוי
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-neutral-900">הגדרות מערכת</h2>
          <Button variant="primary" icon={CheckCircle}>
            שמור הגדרות
          </Button>
        </div>
        
        <Card>
          <h3 className="text-xl font-bold text-neutral-900 mb-4">הגדרות כלליות</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                שם האתר
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                defaultValue="אור בדרך - המרכז להתחדשות עירונית"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                לוגו האתר (URL)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                defaultValue="/logo.png"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                צבע ראשי
              </label>
              <div className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="color"
                  className="w-10 h-10 rounded-lg border border-cream-300"
                  defaultValue="#D4AF37"
                />
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  defaultValue="#D4AF37"
                />
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-xl font-bold text-neutral-900 mb-4">הגדרות אבטחה</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-neutral-700">אימות דו-שלבי</span>
              <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                <input
                  type="checkbox"
                  id="toggle-2fa"
                  className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border-4 rounded-full appearance-none cursor-pointer border-neutral-300 peer checked:border-gold-500 checked:translate-x-6 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-opacity-50"
                  defaultChecked
                />
                <label
                  htmlFor="toggle-2fa"
                  className="block w-full h-full overflow-hidden rounded-full cursor-pointer bg-neutral-200 peer-checked:bg-gold-200"
                ></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-neutral-700">אימות אימייל בהרשמה</span>
              <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                <input
                  type="checkbox"
                  id="toggle-email-verification"
                  className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border-4 rounded-full appearance-none cursor-pointer border-neutral-300 peer checked:border-gold-500 checked:translate-x-6 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-opacity-50"
                />
                <label
                  htmlFor="toggle-email-verification"
                  className="block w-full h-full overflow-hidden rounded-full cursor-pointer bg-neutral-200 peer-checked:bg-gold-200"
                ></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-neutral-700">נעילת חשבון לאחר 5 ניסיונות כושלים</span>
              <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                <input
                  type="checkbox"
                  id="toggle-account-lockout"
                  className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border-4 rounded-full appearance-none cursor-pointer border-neutral-300 peer checked:border-gold-500 checked:translate-x-6 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-opacity-50"
                  defaultChecked
                />
                <label
                  htmlFor="toggle-account-lockout"
                  className="block w-full h-full overflow-hidden rounded-full cursor-pointer bg-neutral-200 peer-checked:bg-gold-200"
                ></label>
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-xl font-bold text-neutral-900 mb-4">הגדרות מסד נתונים</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3 space-x-reverse">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800 mb-1">מצב דמו פעיל</h4>
                <p className="text-green-700 text-sm">
                  המערכת פועלת במצב דמו ללא צורך בחיבור למסד נתונים.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'projects':
        return renderProjects();
      case 'residents':
        return renderResidents();
      case 'documents':
        return renderDocuments();
      case 'votes':
        return renderVotes();
      case 'objections':
        return renderObjections();
      case 'knowledge':
        return renderKnowledge();
      case 'users':
        return renderUsers();
      case 'import-export':
        return renderImportExport();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-neutral-50">
      <AdminHeader
        unreadNotificationsCount={unreadNotifications}
        onNotificationsClick={() => setShowNotifications(!showNotifications)}
      />
      
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-72 flex-shrink-0">
            <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
          
          <div className="flex-1 pb-12">
            {renderContent()}
          </div>
        </div>
      </div>
      
      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="fixed top-24 left-4 z-50 shadow-luxury">
          <AdminNotifications
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationAsRead}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            onClose={() => setShowNotifications(false)}
          />
        </div>
      )}
      
      {/* New Project Modal */}
      <Modal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        title="יצירת פרויקט חדש"
        size="lg"
      >
        <div className="space-y-6">
          <Input
            label="שם הפרויקט"
            value={projectFormData.title}
            onChange={(e) => setProjectFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">תיאור הפרויקט</label>
            <textarea
              value={projectFormData.description}
              onChange={(e) => setProjectFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-vertical"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="עיר"
              value={projectFormData.city}
              onChange={(e) => setProjectFormData(prev => ({ ...prev, city: e.target.value }))}
              required
            />
            
            <Input
              label="כתובת"
              value={projectFormData.address}
              onChange={(e) => setProjectFormData(prev => ({ ...prev, address: e.target.value }))}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">שלב</label>
              <select
                value={projectFormData.stage}
                onChange={(e) => setProjectFormData(prev => ({ ...prev, stage: e.target.value }))}
                className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                <option value="תכנון ראשוני">תכנון ראשוני</option>
                <option value="הליכי רישוי">הליכי רישוי</option>
                <option value="איסוף חתימות">איסוף חתימות</option>
                <option value="תחילת בנייה">תחילת בנייה</option>
                <option value="בביצוע">בביצוע</option>
                <option value="הושלם">הושלם</option>
              </select>
            </div>
            
            <Input
              label="התקדמות (%)"
              type="number"
              value={projectFormData.progress.toString()}
              onChange={(e) => setProjectFormData(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
              min="0"
              max="100"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="מספר דירות"
              type="number"
              value={projectFormData.apartments.toString()}
              onChange={(e) => setProjectFormData(prev => ({ ...prev, apartments: parseInt(e.target.value) || 0 }))}
              min="0"
            />
            
            <Input
              label="מספר דיירים"
              type="number"
              value={projectFormData.residents_count.toString()}
              onChange={(e) => setProjectFormData(prev => ({ ...prev, residents_count: parseInt(e.target.value) || 0 }))}
              min="0"
            />
          </div>
          
          <Input
            label="שם היזם"
            value={projectFormData.developer_name}
            onChange={(e) => setProjectFormData(prev => ({ ...prev, developer_name: e.target.value }))}
          />
          
          <Input
            label="תמונה (URL)"
            value={projectFormData.image_url}
            onChange={(e) => setProjectFormData(prev => ({ ...prev, image_url: e.target.value }))}
            placeholder="https://example.com/image.jpg"
          />
          
          <div className="flex space-x-4 space-x-reverse">
            <Button
              variant="primary"
              className="flex-1 shadow-sm border border-gold-400/50"
              onClick={handleCreateProject}
              disabled={!projectFormData.title || !projectFormData.city || !projectFormData.address}
            >
              צור פרויקט
            </Button>
            <Button
              variant="outline"
              className="flex-1 shadow-sm border-2"
              onClick={() => setShowNewProjectModal(false)}
            >
              ביטול
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="ייבוא דיירים"
        size="md"
      >
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3 space-x-reverse">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">הנחיות לייבוא</h4>
                <p className="text-blue-700 text-sm">
                  הקובץ צריך להיות בפורמט CSV עם הכותרות הבאות: שם מלא, ת.ז, טלפון, אימייל, בניין, דירה.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-gold-400 transition-colors cursor-pointer">
            <input
              type="file"
              id="import-file"
              className="hidden"
              accept=".csv"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
            />
            <label htmlFor="import-file" className="cursor-pointer">
              <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-700 mb-2">לחץ כאן או גרור קובץ CSV</p>
              <p className="text-sm text-neutral-500">
                {importFile ? `נבחר: ${importFile.name}` : 'לא נבחר קובץ'}
              </p>
            </label>
          </div>
          
          {importResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800 mb-1">ייבוא הושלם בהצלחה</h4>
                  <p className="text-green-700 text-sm">
                    סה"כ: {importResult.total} דיירים, נוספו: {importResult.added}, עודכנו: {importResult.updated}
                  </p>
                  {importResult.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="font-semibold text-red-700">שגיאות:</p>
                      <ul className="list-disc list-inside text-sm text-red-600">
                        {importResult.errors.map((error: string, index: number) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex space-x-4 space-x-reverse">
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleImportResidents}
              disabled={!importFile || importLoading}
              loading={importLoading}
            >
              {importLoading ? 'מייבא...' : 'ייבא דיירים'}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowImportModal(false)}
            >
              סגור
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="ייצוא דיירים"
        size="md"
      >
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3 space-x-reverse">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">הנחיות לייצוא</h4>
                <p className="text-blue-700 text-sm">
                  הקובץ יכיל את כל הדיירים הרשומים במערכת בפורמט CSV.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 space-x-reverse">
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleExportResidents}
              disabled={exportLoading}
              loading={exportLoading}
              icon={Download}
            >
              {exportLoading ? 'מייצא...' : 'ייצא דיירים'}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowExportModal(false)}
            >
              ביטול
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;