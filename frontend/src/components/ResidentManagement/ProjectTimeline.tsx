import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, AlertTriangle, Users, FileText, Building, MapPin, Info } from 'lucide-react';
import { Card, Badge } from '../ui';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'in_progress' | 'pending' | 'delayed';
  type: 'milestone' | 'meeting' | 'document' | 'approval';
  details?: string;
  participants?: string[];
  documents?: string[];
}

const ProjectTimeline: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  
  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      title: 'סקר ראשוני הושלם',
      description: 'הסקר הטכני של המבנה הושלם בהצלחה על ידי מהנדס מוסמך',
      date: '2024-01-15',
      status: 'completed',
      type: 'milestone',
      details: 'הסקר כלל בדיקת מצב המבנה, זיהוי בעיות קונסטרוקטיביות והערכת עלויות השיפוץ',
      participants: ['מהנדס בניין', 'נציג היזם', 'נציג הדיירים'],
      documents: ['דוח סקר טכני', 'תמונות המבנה', 'המלצות לשיפוץ']
    },
    {
      id: '2',
      title: 'הגשת בקשה לועדת התכנון',
      description: 'הוגשה בקשה רשמית לועדת התכנון המקומית לאישור הפרויקט',
      date: '2024-02-01',
      status: 'in_progress',
      type: 'approval',
      details: 'הבקשה כוללת תכניות אדריכליות מפורטות ודוח השפעה על הסביבה',
      participants: ['אדריכל הפרויקט', 'יועץ תכנון', 'נציג העירייה'],
      documents: ['תכניות אדריכליות', 'דוח השפעה סביבתית', 'טפסי בקשה']
    },
    {
      id: '3',
      title: 'ישיבת דיירים - הצבעה על התכניות',
      description: 'ישיבה לדיון והצבעה על התכניות הסופיות של הפרויקט',
      date: '2024-03-15',
      status: 'pending',
      type: 'meeting',
      details: 'בישיבה יוצגו התכניות הסופיות ויתקיים דיון פתוח עם הדיירים',
      participants: ['כל הדיירים', 'נציג היזם', 'אדריכל הפרויקט'],
      documents: ['סדר יום', 'תכניות מעודכנות', 'הסכם דיירים']
    },
    {
      id: '4',
      title: 'תחילת עבודות הבנייה',
      description: 'תחילת עבודות הבנייה בפועל לאחר קבלת כל האישורים',
      date: '2024-06-01',
      status: 'pending',
      type: 'milestone',
      details: 'תחילת עבודות ההריסה והכנת השטח לבנייה החדשה',
      participants: ['קבלן ראשי', 'מפקח בנייה', 'נציג היזם'],
      documents: ['היתר בנייה', 'חוזה קבלנות', 'תכנית בטיחות']
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-accent-600" />;
      case 'in_progress':
        return <Clock className="w-6 h-6 text-yellow-600" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-neutral-400" />;
      case 'delayed':
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      default:
        return <Clock className="w-6 h-6 text-neutral-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'pending': return 'default';
      case 'delayed': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'הושלם';
      case 'in_progress': return 'בתהליך';
      case 'pending': return 'ממתין';
      case 'delayed': return 'מתעכב';
      default: return 'לא ידוע';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <Building className="w-4 h-4" />;
      case 'meeting': return <Users className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'approval': return <CheckCircle className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center space-x-4 space-x-reverse mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">ציר זמן הפרויקט</h2>
            <p className="text-neutral-600">מעקב אחר התקדמות הפרויקט בזמן אמת</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-gold-50 to-warmGold-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-800">התקדמות כללית</h3>
            <span className="text-2xl font-bold text-gold-600">25%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-gold-500 to-warmGold-400 h-3 rounded-full transition-all duration-500" style={{ width: '25%' }}></div>
          </div>
          <div className="flex justify-between text-sm text-neutral-600 mt-2">
            <span>התחלה</span>
            <span>השלמה</span>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card>
        <h3 className="text-xl font-bold text-neutral-900 mb-6">אירועים ואבני דרך</h3>
        <div className="space-y-6">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="relative">
              {/* Timeline Line */}
              {index < timelineEvents.length - 1 && (
                <div className="absolute right-6 top-12 w-0.5 h-16 bg-neutral-200"></div>
              )}
              
              <div 
                className={`flex items-start space-x-4 space-x-reverse p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  selectedEvent === event.id 
                    ? 'border-gold-300 bg-gold-50' 
                    : 'border-neutral-200 hover:border-gold-200 hover:bg-neutral-50'
                }`}
                onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
              >
                {/* Status Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  event.status === 'completed' ? 'bg-accent-100' :
                  event.status === 'in_progress' ? 'bg-yellow-100' :
                  event.status === 'delayed' ? 'bg-red-100' : 'bg-neutral-100'
                }`}>
                  {getStatusIcon(event.status)}
                </div>

                {/* Event Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-neutral-800">{event.title}</h4>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Badge variant={getStatusColor(event.status) as any}>
                        {getStatusText(event.status)}
                      </Badge>
                      <div className="flex items-center space-x-1 space-x-reverse text-neutral-500">
                        {getTypeIcon(event.type)}
                        <span className="text-xs">{new Date(event.date).toLocaleDateString('he-IL')}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-neutral-600 mb-2">{event.description}</p>
                  
                  {/* Expanded Details */}
                  {selectedEvent === event.id && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-neutral-200">
                      <div className="space-y-4">
                        {event.details && (
                          <div>
                            <h5 className="font-semibold text-neutral-800 mb-2">פרטים נוספים:</h5>
                            <p className="text-neutral-700 text-sm">{event.details}</p>
                          </div>
                        )}
                        
                        {event.participants && event.participants.length > 0 && (
                          <div>
                            <h5 className="font-semibold text-neutral-800 mb-2">משתתפים:</h5>
                            <div className="flex flex-wrap gap-2">
                              {event.participants.map((participant, idx) => (
                                <span key={idx} className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs">
                                  {participant}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {event.documents && event.documents.length > 0 && (
                          <div>
                            <h5 className="font-semibold text-neutral-800 mb-2">מסמכים קשורים:</h5>
                            <div className="space-y-1">
                              {event.documents.map((doc, idx) => (
                                <div key={idx} className="flex items-center space-x-2 space-x-reverse text-sm text-gold-600 hover:text-gold-700 cursor-pointer">
                                  <FileText className="w-4 h-4" />
                                  <span>{doc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Next Steps */}
      <Card>
        <h3 className="text-xl font-bold text-neutral-900 mb-4">הצעדים הבאים</h3>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">ישיבת דיירים הבאה</h4>
              <p className="text-blue-800 text-sm mb-2">15 במרץ 2024, 19:00</p>
              <p className="text-blue-700 text-sm">בישיבה יוצגו התכניות הסופיות ויתקיים דיון פתוח עם הדיירים לגבי פרטי הפרויקט.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProjectTimeline;