import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  Search,
  Info,
  Book, 
  Phone, 
  Mail, 
  MessageSquare, 
  FileText, 
  Video, 
  ExternalLink,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Send,
  Download,
  Star,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Tag,
  Calendar,
  Globe,
  Shield,
  Zap,
  Award,
  Lightbulb,
  Settings,
  Headphones, 
  Eye
} from 'lucide-react';
import { Card, Button, Input, Badge, Modal } from '../ui';
import toast from 'react-hot-toast';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
  tags: string[];
  lastUpdated: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created: string;
  lastUpdate: string;
  assignedTo?: string;
  category: string;
}

interface GuideItem {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'article' | 'interactive';
  duration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  downloads: number;
  rating: number;
  icon: React.ComponentType<any>;
}

const EnhancedSupportCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'tickets' | 'guides' | 'live-chat'>('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium',
    category: 'general'
  });

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'מתי תתחיל הבנייה בפועל?',
      answer: 'הבנייה תתחיל לאחר קבלת כל האישורים הנדרשים ואיסוף חתימות של 80% מהדיירים. הערכה נוכחית היא יוני 2024. התהליך כולל קבלת היתר בנייה, אישור תכניות סופיות ותיאום עם כל הגורמים הרלוונטיים.',
      category: 'לוחות זמנים',
      helpful: 15,
      notHelpful: 2,
      tags: ['בנייה', 'לוח זמנים', 'אישורים'],
      lastUpdated: '2024-01-20'
    },
    {
      id: '2',
      question: 'איך אוכל לעקוב אחר התקדמות הפרויקט?',
      answer: 'ניתן לעקוב אחר התקדמות הפרויקט דרך הדשבורד האישי, שם תמצא ציר זמן מעודכן, מסמכים רלוונטיים והודעות מהיזם. המערכת מעודכנת בזמן אמת ותקבל התראות על כל שינוי חשוב.',
      category: 'מעקב פרויקט',
      helpful: 23,
      notHelpful: 1,
      tags: ['מעקב', 'דשבורד', 'עדכונים'],
      lastUpdated: '2024-01-18'
    },
    {
      id: '3',
      question: 'מה קורה אם אני לא מסכים לפרויקט?',
      answer: 'דיירים שלא מסכימים לפרויקט יכולים להגיש התנגדות רשמית או לבחור באפשרות של פיצוי כספי במקום השתתפות בפרויקט. יש מספר אפשרויות חוקיות זמינות ומומלץ להיוועץ עם יועץ משפטי.',
      category: 'זכויות דיירים',
      helpful: 8,
      notHelpful: 5,
      tags: ['התנגדות', 'זכויות', 'פיצוי'],
      lastUpdated: '2024-01-15'
    },
    {
      id: '4',
      question: 'איך מחושב הפיצוי לדייר?',
      answer: 'הפיצוי מחושב על בסיס שמאי מקרקעין מוסמך, לפי גודל הדירה, מיקומה, מצבה ושווי השוק הנוכחי. החישוב לוקח בחשבון גם את הפוטנציאל העתידי של הנכס ושיפורים שבוצעו.',
      category: 'פיצויים',
      helpful: 12,
      notHelpful: 3,
      tags: ['פיצוי', 'שמאות', 'חישוב'],
      lastUpdated: '2024-01-12'
    },
    {
      id: '5',
      question: 'מה כלול בדירה החדשה?',
      answer: 'הדירה החדשה כוללת גימורים סטנדרטיים, מערכות חשמל ואינסטלציה חדשות, חימום תת רצפתי, מיזוג אוויר מרכזי ומרפסת. ניתן לשדרג לגימורים יוקרתיים בתשלום נוסף.',
      category: 'מפרט טכני',
      helpful: 18,
      notHelpful: 1,
      tags: ['דירה חדשה', 'גימורים', 'מפרט'],
      lastUpdated: '2024-01-10'
    }
  ];

  const supportTickets: SupportTicket[] = [
    {
      id: '1',
      subject: 'בעיה בגישה למסמכים',
      status: 'in_progress',
      priority: 'medium',
      created: '2024-01-20',
      lastUpdate: '2024-01-21',
      assignedTo: 'תמיכה טכנית',
      category: 'טכני'
    },
    {
      id: '2',
      subject: 'שאלה לגבי חניות',
      status: 'resolved',
      priority: 'low',
      created: '2024-01-18',
      lastUpdate: '2024-01-19',
      assignedTo: 'יועץ פרויקט',
      category: 'כללי'
    },
    {
      id: '3',
      subject: 'בקשה לפגישה עם היזם',
      status: 'open',
      priority: 'high',
      created: '2024-01-22',
      lastUpdate: '2024-01-22',
      category: 'פגישות'
    }
  ];

  const guides: GuideItem[] = [
    {
      id: '1',
      title: 'מדריך למשתמש חדש',
      description: 'למד איך להשתמש במערכת ולנצל את כל האפשרויות',
      type: 'pdf',
      duration: '15 דקות',
      difficulty: 'beginner',
      downloads: 1250,
      rating: 4.8,
      icon: FileText
    },
    {
      id: '2',
      title: 'סרטוני הדרכה',
      description: 'צפה בסרטונים קצרים שמסבירים את התהליכים',
      type: 'video',
      duration: '25 דקות',
      difficulty: 'beginner',
      downloads: 890,
      rating: 4.6,
      icon: Video
    },
    {
      id: '3',
      title: 'מדריך זכויות הדייר',
      description: 'כל מה שצריך לדעת על זכויות וחובות בפרויקט',
      type: 'pdf',
      duration: '30 דקות',
      difficulty: 'intermediate',
      downloads: 2100,
      rating: 4.9,
      icon: Book
    },
    {
      id: '4',
      title: 'כלי אינטראקטיבי לחישוב זכויות',
      description: 'חשב את הזכויות שלך בצורה אינטראקטיבית',
      type: 'interactive',
      duration: '10 דקות',
      difficulty: 'intermediate',
      downloads: 567,
      rating: 4.7,
      icon: Globe
    }
  ];

  const categories = ['כל הקטגוריות', 'לוחות זמנים', 'מעקב פרויקט', 'זכויות דיירים', 'פיצויים', 'מפרט טכני'];

  const filteredFAQ = useMemo(() => {
    return faqItems.filter(item => {
      const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === '' || selectedCategory === 'כל הקטגוריות' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-600 bg-red-100';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-accent-600 bg-accent-100';
      case 'closed': return 'text-neutral-600 bg-neutral-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'פתוח';
      case 'in_progress': return 'בטיפול';
      case 'resolved': return 'נפתר';
      case 'closed': return 'סגור';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-700 bg-red-200';
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-accent-600 bg-accent-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const handleTicketSubmit = () => {
    console.log('Submitting ticket:', newTicket);
    toast.success('הפנייה נשלחה בהצלחה (מצב דמו)');
    setNewTicket({ subject: '', description: '', priority: 'medium', category: 'general' });
    setShowTicketModal(false);
  };

  const handleFAQFeedback = (faqId: string, isHelpful: boolean) => {
    console.log(`FAQ ${faqId} marked as ${isHelpful ? 'helpful' : 'not helpful'}`);
    toast.success(isHelpful ? 'תודה על המשוב החיובי (מצב דמו)' : 'תודה על המשוב (מצב דמו)');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center space-x-4 space-x-reverse mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">מרכז תמיכה מתקדם</h2>
            <p className="text-neutral-600">מענה מקצועי לכל שאלה ובעיה</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{faqItems.length}</div>
            <div className="text-sm text-blue-700">שאלות נפוצות</div>
          </div>
          <div className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-accent-600">
              {supportTickets.filter(t => t.status === 'resolved').length}
            </div>
            <div className="text-sm text-accent-700">פניות נפתרו</div>
          </div>
          <div className="bg-gradient-to-r from-gold-50 to-warmGold-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gold-600">4.8</div>
            <div className="text-sm text-gold-700">דירוג שביעות רצון</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">2 דק'</div>
            <div className="text-sm text-purple-700">זמן מענה ממוצע</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 space-x-reverse border-b border-neutral-200">
          {[
            { id: 'faq', label: 'שאלות נפוצות', icon: HelpCircle },
            { id: 'contact', label: 'יצירת קשר', icon: Phone },
            { id: 'tickets', label: 'הפניות שלי', icon: FileText },
            { id: 'guides', label: 'מדריכים', icon: Book },
            { id: 'live-chat', label: 'צ\'אט חי', icon: MessageSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 space-x-reverse pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="חפש בשאלות נפוצות..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={Search}
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                <p className="text-neutral-600 mb-4">support@orladerech.co.il</p>
                ))}
              </select>
            </div>
          </Card>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQ.map((item) => (
              <Card key={item.id}>
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
                  className="w-full p-4 text-right hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-neutral-900 text-lg">{item.question}</h4>
                    <span className="text-neutral-400 text-xl">
                      {expandedFAQ === item.id ? '−' : '+'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse mt-2">
                    <Badge variant="info" size="sm">{item.category}</Badge>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
                
                {expandedFAQ === item.id && (
                  <div className="px-4 pb-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 mb-4">
                      <p className="text-neutral-700 leading-relaxed">{item.answer}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">
                        עודכן: {new Date(item.lastUpdated).toLocaleDateString('he-IL')}
                      </span>
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <span className="text-neutral-500">האם זה עזר?</span>
                        <button 
                          onClick={() => handleFAQFeedback(item.id, true)}
                          className="flex items-center space-x-1 space-x-reverse text-accent-600 hover:text-accent-700 transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{item.helpful}</span>
                        </button>
                        <button 
                          onClick={() => handleFAQFeedback(item.id, false)}
                          className="flex items-center space-x-1 space-x-reverse text-red-600 hover:text-red-700 transition-colors"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span>{item.notHelpful}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {filteredFAQ.length === 0 && (
            <Card className="text-center py-12">
              <Search className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">לא נמצאו תוצאות</h3>
              <p className="text-neutral-600 mb-6">נסה לחפש במילים אחרות או בחר קטגוריה אחרת</p>
              <Button variant="primary" onClick={() => setActiveTab('contact')}>
                פנה אלינו ישירות
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hover className="text-center">
              <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">טלפון</h3>
              <p className="text-neutral-600 mb-4">03-1234567</p>
              <p className="text-sm text-neutral-500 mb-4">א'-ה' 8:00-18:00</p>
              <Button variant="outline" size="sm">התקשר עכשיו</Button>
            </Card>
            
            <Card hover className="text-center">
              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">אימייל</h3>
              <p className="text-neutral-600 mb-4">support@orbaderech.co.il</p>
              <p className="text-sm text-neutral-500 mb-4">מענה תוך 2 שעות</p>
              <Button variant="outline" size="sm">שלח מייל</Button>
            </Card>
            
            <Card hover className="text-center">
              <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">צ'אט חי</h3>
              <p className="text-neutral-600 mb-4">זמין כעת</p>
              <p className="text-sm text-neutral-500 mb-4">מענה מיידי</p>
              <Button variant="primary" size="sm" onClick={() => setShowChatModal(true)}>
                התחל צ'אט
              </Button>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">פעולות מהירות</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="justify-start" 
                icon={FileText}
                onClick={() => setShowTicketModal(true)}
              >
                פתח פנייה חדשה
              </Button>
              <Button variant="outline" className="justify-start" icon={Calendar}>
                קבע פגישה
              </Button>
              <Button variant="outline" className="justify-start" icon={Download}>
                הורד מדריכים
              </Button>
              <Button variant="outline" className="justify-start" icon={Video}>
                צפה בהדרכות
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-neutral-900">הפניות שלי</h3>
              <Button variant="primary" onClick={() => setShowTicketModal(true)}>
                פנייה חדשה
              </Button>
            </div>
            
            <div className="space-y-4">
              {supportTickets.map((ticket) => (
                <div key={ticket.id} className="border border-neutral-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-neutral-900">{ticket.subject}</h4>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {getStatusText(ticket.status)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-neutral-600">
                    <div>
                      <span className="font-medium">נפתח:</span>
                      <div>{new Date(ticket.created).toLocaleDateString('he-IL')}</div>
                    </div>
                    <div>
                      <span className="font-medium">עודכן:</span>
                      <div>{new Date(ticket.lastUpdate).toLocaleDateString('he-IL')}</div>
                    </div>
                    <div>
                      <span className="font-medium">קטגוריה:</span>
                      <div>{ticket.category}</div>
                    </div>
                    {ticket.assignedTo && (
                      <div>
                        <span className="font-medium">מטופל ע"י:</span>
                        <div>{ticket.assignedTo}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Guides Tab */}
      {activeTab === 'guides' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-xl font-bold text-neutral-900 mb-6">מדריכים ומשאבים</h3>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <Card key={guide.id} hover>
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                    <guide.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-neutral-900 mb-2">{guide.title}</h4>
                    <p className="text-neutral-600 text-sm mb-3">{guide.description}</p>
                    <div className="flex items-center space-x-4 space-x-reverse text-xs text-neutral-500 mb-3">
                      <span>{guide.duration}</span>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span>{guide.rating}</span>
                      </div>
                      <span>{guide.downloads} הורדות</span>
                    </div>
                    <div className="flex space-x-2 space-x-reverse">
                      <Button variant="primary" size="sm" icon={Eye}>
                        צפה
                      </Button>
                      {guide.type !== 'interactive' && (
                        <Button variant="outline" size="sm" icon={Download}>
                          הורד
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Live Chat Tab */}
      {activeTab === 'live-chat' && (
        <Card className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-700 mb-2">צ'אט חי</h3>
          <p className="text-neutral-600 mb-6">התחבר לנציג שירות לקוחות לקבלת מענה מיידי</p>
          <Button variant="primary" onClick={() => setShowChatModal(true)}>
            התחל שיחה
          </Button>
        </Card>
      )}

      {/* New Ticket Modal */}
      <Modal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        title="פתח פנייה חדשה"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="נושא הפנייה"
            placeholder="תאר בקצרה את הנושא"
            value={newTicket.subject}
            onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">רמת דחיפות</label>
              <select
                value={newTicket.priority}
                onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">נמוכה</option>
                <option value="medium">בינונית</option>
                <option value="high">גבוהה</option>
                <option value="urgent">דחופה</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">קטגוריה</label>
              <select
                value={newTicket.category}
                onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="general">כללי</option>
                <option value="technical">טכני</option>
                <option value="billing">חיוב</option>
                <option value="legal">משפטי</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">תיאור הבעיה</label>
            <textarea
              rows={4}
              placeholder="תאר את הבעיה או השאלה בפירוט"
              value={newTicket.description}
              onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            />
          </div>
          
          <div className="flex space-x-4 space-x-reverse">
            <Button variant="primary" onClick={handleTicketSubmit} className="flex-1">
              שלח פנייה
            </Button>
            <Button variant="outline" onClick={() => setShowTicketModal(false)} className="flex-1">
              ביטול
            </Button>
          </div>
        </div>
      </Modal>

      {/* Chat Modal */}
      <Modal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        title="צ'אט חי עם נציג שירות"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-blue-900 mb-1">מתחבר לנציג...</h3>
            <p className="text-blue-700 text-sm">זמן המתנה משוער: פחות מדקה</p>
          </div>
          
          <div className="text-center">
            <p className="text-neutral-600 mb-4">
              בינתיים, אתה יכול לעיין בשאלות הנפוצות או לפתוח פנייה
            </p>
            <div className="flex space-x-2 space-x-reverse justify-center">
              <Button variant="outline" onClick={() => {
                setShowChatModal(false);
                setActiveTab('faq');
              }}>
                שאלות נפוצות
              </Button>
              <Button variant="outline" onClick={() => {
                setShowChatModal(false);
                setShowTicketModal(true);
              }}>
                פתח פנייה
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EnhancedSupportCenter;