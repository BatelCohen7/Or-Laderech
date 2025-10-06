import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Info,
  FileText,
  Upload,
  Send, 
  Clock, 
  CheckCircle, 
  X, 
  Download,
  Eye,
  Calendar,
  User,
  Scale,
  Gavel,
  Shield,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { Card, Button, Input, Badge, Modal } from '../ui';
import toast from 'react-hot-toast';

interface Objection {
  id: string;
  title: string;
  type: 'planning' | 'environmental' | 'safety' | 'legal' | 'financial';
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'withdrawn';
  submittedDate?: string;
  lastUpdate: string;
  deadline?: string;
  description: string;
  attachments: string[];
  reviewerNotes?: string;
  legalBasis: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface ObjectionTemplate {
  id: string;
  title: string;
  description: string;
  type: string;
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  successRate: number;
}

const ObjectionsCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my-objections' | 'new-objection' | 'templates' | 'legal-info'>('my-objections');
  const [showNewObjectionModal, setShowNewObjectionModal] = useState(false);
  const [selectedObjection, setSelectedObjection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [newObjection, setNewObjection] = useState({
    title: '',
    type: 'planning',
    description: '',
    legalBasis: '',
    attachments: [] as string[]
  });

  const objections: Objection[] = [
    {
      id: '1',
      title: 'התנגדות לגובה הבניין המתוכנן',
      type: 'planning',
      status: 'under_review',
      submittedDate: '2024-01-15',
      lastUpdate: '2024-01-20',
      deadline: '2024-02-15',
      description: 'הבניין המתוכנן בגובה 12 קומות חורג מהתכנית המקורית ופוגע בנוף העירוני ובזכויות השכנים.',
      attachments: ['תכנית_מקורית.pdf', 'תמונות_נוף.zip'],
      legalBasis: ['חוק התכנון והבנייה', 'תקנות הבנייה'],
      priority: 'high'
    },
    {
      id: '2',
      title: 'בקשה לבדיקה סביבתית מורחבת',
      type: 'environmental',
      status: 'submitted',
      submittedDate: '2024-01-10',
      lastUpdate: '2024-01-10',
      deadline: '2024-02-10',
      description: 'דרישה לביצוע בדיקה סביבתית מקיפה בשל חשש לפגיעה במערכת אקולוגית מקומית.',
      attachments: ['דוח_סביבתי_ראשוני.pdf'],
      legalBasis: ['חוק הגנת הסביבה', 'תקנות איכות הסביבה'],
      priority: 'medium'
    },
    {
      id: '3',
      title: 'התנגדות לתכנית החניות',
      type: 'planning',
      status: 'approved',
      submittedDate: '2024-01-05',
      lastUpdate: '2024-01-18',
      description: 'מספר החניות המתוכנן אינו מספיק ויגרום לעומס תנועה באזור.',
      attachments: ['סקר_תנועה.pdf', 'תכנית_חניות.dwg'],
      reviewerNotes: 'ההתנגדות התקבלה. נדרשת תוספת של 15 חניות.',
      legalBasis: ['תקנות התכנון והבנייה'],
      priority: 'medium'
    }
  ];

  const templates: ObjectionTemplate[] = [
    {
      id: '1',
      title: 'התנגדות לגובה בניין',
      description: 'תבנית להתנגדות על גובה בניין החורג מהמותר',
      type: 'תכנוני',
      estimatedTime: '30 דקות',
      difficulty: 'easy',
      successRate: 75
    },
    {
      id: '2',
      title: 'בקשה לבדיקה סביבתית',
      description: 'תבנית לדרישת בדיקה סביבתית מקיפה',
      type: 'סביבתי',
      estimatedTime: '45 דקות',
      difficulty: 'medium',
      successRate: 65
    },
    {
      id: '3',
      title: 'התנגדות מבחינת בטיחות',
      description: 'תבנית להתנגדות על בסיס בטיחות ובטחון',
      type: 'בטיחות',
      estimatedTime: '60 דקות',
      difficulty: 'hard',
      successRate: 55
    },
    {
      id: '4',
      title: 'התנגדות משפטית כללית',
      description: 'תבנית כללית להתנגדות על בסיס משפטי',
      type: 'משפטי',
      estimatedTime: '90 דקות',
      difficulty: 'hard',
      successRate: 45
    }
  ];

  const legalInfo = [
    {
      title: 'זכויות הדייר בהתחדשות עירונית',
      description: 'מדריך מקיף לזכויות הדייר בתהליכי התחדשות עירונית',
      icon: Shield,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'תהליך הגשת התנגדות',
      description: 'הסבר מפורט על התהליך המשפטי להגשת התנגדות',
      icon: Gavel,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'זמנים ומועדים חשובים',
      description: 'לוחות זמנים חוקיים ומועדים קריטיים',
      icon: Calendar,
      color: 'text-gold-600 bg-gold-100'
    },
    {
      title: 'עזרה משפטית',
      description: 'איך לקבל ייעוץ משפטי ועזרה מקצועית',
      icon: Scale,
      color: 'text-accent-600 bg-accent-100'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-neutral-600 bg-neutral-100';
      case 'submitted': return 'text-blue-600 bg-blue-100';
      case 'under_review': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-accent-600 bg-accent-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'withdrawn': return 'text-neutral-600 bg-neutral-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'טיוטה';
      case 'submitted': return 'הוגש';
      case 'under_review': return 'בבדיקה';
      case 'approved': return 'אושר';
      case 'rejected': return 'נדחה';
      case 'withdrawn': return 'בוטל';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'planning': return 'תכנוני';
      case 'environmental': return 'סביבתי';
      case 'safety': return 'בטיחות';
      case 'legal': return 'משפטי';
      case 'financial': return 'כלכלי';
      default: return type;
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-accent-600 bg-accent-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const filteredObjections = objections.filter(objection => {
    const matchesSearch = objection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         objection.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || objection.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmitObjection = () => {
    console.log('Submitting objection:', newObjection);
    toast.success('ההתנגדות הוגשה בהצלחה (מצב דמו)');
    setNewObjection({ title: '', type: 'planning', description: '', legalBasis: '', attachments: [] });
    setShowNewObjectionModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center space-x-4 space-x-reverse mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">מרכז התנגדויות</h2>
            <p className="text-neutral-600">הגש והתנגדויות ועקוב אחר הטיפול בהן</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{objections.length}</div>
            <div className="text-sm text-blue-700">סה"כ התנגדויות</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {objections.filter(o => o.status === 'under_review').length}
            </div>
            <div className="text-sm text-yellow-700">בבדיקה</div>
          </div>
          <div className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-accent-600">
              {objections.filter(o => o.status === 'approved').length}
            </div>
            <div className="text-sm text-accent-700">אושרו</div>
          </div>
          <div className="bg-gradient-to-r from-gold-50 to-warmGold-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gold-600">67%</div>
            <div className="text-sm text-gold-700">שיעור הצלחה</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 space-x-reverse border-b border-neutral-200">
          {[
            { id: 'my-objections', label: 'ההתנגדויות שלי', icon: FileText },
            { id: 'new-objection', label: 'התנגדות חדשה', icon: Plus },
            { id: 'templates', label: 'תבניות', icon: FileText },
            { id: 'legal-info', label: 'מידע משפטי', icon: Scale }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 space-x-reverse pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* My Objections Tab */}
      {activeTab === 'my-objections' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="חפש התנגדויות..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={Search}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">כל הסטטוסים</option>
                <option value="draft">טיוטה</option>
                <option value="submitted">הוגש</option>
                <option value="under_review">בבדיקה</option>
                <option value="approved">אושר</option>
                <option value="rejected">נדחה</option>
              </select>
            </div>
          </Card>

          {/* Objections List */}
          <div className="space-y-4">
            {filteredObjections.map((objection) => (
              <Card key={objection.id} hover>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 space-x-reverse mb-2">
                        <h3 className="text-lg font-bold text-neutral-900">{objection.title}</h3>
                        <Badge variant={getStatusColor(objection.status).includes('red') ? 'error' : 
                                      getStatusColor(objection.status).includes('yellow') ? 'warning' :
                                      getStatusColor(objection.status).includes('accent') ? 'success' : 'info'}>
                          {getStatusText(objection.status)}
                        </Badge>
                        <Badge variant="default" size="sm">
                          {getTypeText(objection.type)}
                        </Badge>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(objection.priority)}`}>
                          {objection.priority}
                        </span>
                      </div>
                      <p className="text-neutral-700 mb-3">{objection.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-neutral-600">
                        {objection.submittedDate && (
                          <div>
                            <span className="font-medium">הוגש:</span>
                            <div>{new Date(objection.submittedDate).toLocaleDateString('he-IL')}</div>
                          </div>
                        )}
                        <div>
                          <span className="font-medium">עודכן:</span>
                          <div>{new Date(objection.lastUpdate).toLocaleDateString('he-IL')}</div>
                        </div>
                        {objection.deadline && (
                          <div>
                            <span className="font-medium">מועד אחרון:</span>
                            <div className="text-red-600 font-medium">
                              {new Date(objection.deadline).toLocaleDateString('he-IL')}
                            </div>
                          </div>
                        )}
                        <div>
                          <span className="font-medium">קבצים:</span>
                          <div>{objection.attachments.length} מצורפים</div>
                        </div>
                      </div>

                      {objection.reviewerNotes && (
                        <div className="mt-3 p-3 bg-accent-50 rounded-lg border border-accent-200">
                          <div className="flex items-center space-x-2 space-x-reverse mb-1">
                            <CheckCircle className="w-4 h-4 text-accent-600" />
                            <span className="font-medium text-accent-800">הערות הבוחן:</span>
                          </div>
                          <p className="text-accent-700 text-sm">{objection.reviewerNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                    <div className="flex items-center space-x-2 space-x-reverse text-sm text-neutral-600">
                      <Scale className="w-4 h-4" />
                      <span>בסיס משפטי: {objection.legalBasis.join(', ')}</span>
                    </div>
                    <div className="flex space-x-2 space-x-reverse">
                      <Button variant="ghost" size="sm" icon={Eye}>
                        צפה
                      </Button>
                      <Button variant="ghost" size="sm" icon={Download}>
                        הורד
                      </Button>
                      {objection.status === 'draft' && (
                        <Button variant="outline" size="sm">
                          ערוך
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredObjections.length === 0 && (
            <Card className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">אין התנגדויות</h3>
              <p className="text-neutral-600 mb-6">טרם הגשת התנגדויות</p>
              <Button variant="primary" onClick={() => setActiveTab('new-objection')}>
                הגש התנגדות ראשונה
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* New Objection Tab */}
      {activeTab === 'new-objection' && (
        <Card>
          <h3 className="text-xl font-bold text-neutral-900 mb-6">הגש התנגדות חדשה</h3>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3 space-x-reverse">
              <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">חשוב לדעת</h4>
                <p className="text-yellow-700 text-sm">
                  הגשת התנגדות היא תהליך משפטי רשמי. מומלץ להיעזר בייעוץ משפטי לפני ההגשה.
                  ניתן להשתמש בתבניות המוכנות או ליצור התנגדות מותאמת אישית.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Input
              label="כותרת ההתנגדות"
              placeholder="תאר בקצרה את נושא ההתנגדות"
              value={newObjection.title}
              onChange={(e) => setNewObjection(prev => ({ ...prev, title: e.target.value }))}
            />

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">סוג ההתנגדות</label>
              <select
                value={newObjection.type}
                onChange={(e) => setNewObjection(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="planning">תכנוני</option>
                <option value="environmental">סביבתי</option>
                <option value="safety">בטיחות</option>
                <option value="legal">משפטי</option>
                <option value="financial">כלכלי</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">תיאור מפורט</label>
              <textarea
                rows={6}
                placeholder="תאר את ההתנגדות בפירוט, כולל הנימוקים והעובדות הרלוונטיות"
                value={newObjection.description}
                onChange={(e) => setNewObjection(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-vertical"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">בסיס משפטי</label>
              <textarea
                rows={3}
                placeholder="ציין את החוקים, התקנות או הפסיקה הרלוונטיים"
                value={newObjection.legalBasis}
                onChange={(e) => setNewObjection(prev => ({ ...prev, legalBasis: e.target.value }))}
                className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-vertical"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">קבצים מצורפים</label>
              <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-red-400 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-neutral-600 mb-1">גרור קבצים לכאן או לחץ לבחירה</p>
                <p className="text-sm text-neutral-500">PDF, DOC, תמונות - עד 10MB לקובץ</p>
              </div>
            </div>

            <div className="flex space-x-4 space-x-reverse">
              <Button variant="primary" onClick={handleSubmitObjection} className="flex-1">
                הגש התנגדות
              </Button>
              <Button variant="outline" className="flex-1">
                שמור כטיוטה
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-xl font-bold text-neutral-900 mb-4">תבניות התנגדות</h3>
            <p className="text-neutral-600 mb-6">
              השתמש בתבניות המוכנות שלנו כדי להגיש התנגדות מקצועית ויעילה
            </p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((template) => (
              <Card key={template.id} hover>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-neutral-900 mb-2">{template.title}</h4>
                      <p className="text-neutral-600 text-sm mb-3">{template.description}</p>
                      
                      <div className="flex items-center space-x-4 space-x-reverse text-xs text-neutral-500 mb-3">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Clock className="w-3 h-3" />
                          <span>{template.estimatedTime}</span>
                        </div>
                        <Badge variant={getDifficultyColor(template.difficulty).includes('accent') ? 'success' : 
                                      getDifficultyColor(template.difficulty).includes('yellow') ? 'warning' : 'error'} size="sm">
                          {template.difficulty === 'easy' ? 'קל' : 
                           template.difficulty === 'medium' ? 'בינוני' : 'מתקדם'}
                        </Badge>
                        <span className="text-accent-600 font-medium">{template.successRate}% הצלחה</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 space-x-reverse">
                    <Button variant="primary" size="sm" className="flex-1">
                      השתמש בתבנית
                    </Button>
                    <Button variant="outline" size="sm" icon={Eye}>
                      תצוגה מקדימה
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Legal Info Tab */}
      {activeTab === 'legal-info' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-xl font-bold text-neutral-900 mb-4">מידע משפטי</h3>
            <p className="text-neutral-600 mb-6">
              מידע חשוב על זכויותיך המשפטיות ותהליכי ההתנגדות
            </p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {legalInfo.map((info, index) => (
              <Card key={index} hover>
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${info.color}`}>
                    <info.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-neutral-900 mb-2">{info.title}</h4>
                    <p className="text-neutral-600 text-sm mb-4">{info.description}</p>
                    <Button variant="outline" size="sm" icon={Eye}>
                      קרא עוד
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Legal Contact */}
          <Card>
            <div className="text-center py-8">
              <Scale className="w-16 h-16 text-gold-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">זקוק לייעוץ משפטי?</h3>
              <p className="text-neutral-600 mb-6">
                קבל ייעוץ משפטי מקצועי מעורכי דין מומחים בתחום ההתחדשות העירונית
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary">
                  קבע פגישה עם עורך דין
                </Button>
                <Button variant="outline">
                  ייעוץ טלפוני חינם
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ObjectionsCenter;