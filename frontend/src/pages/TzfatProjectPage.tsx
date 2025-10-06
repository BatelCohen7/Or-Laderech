import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Info,
  Building, 
  Users, 
  FileText, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Star,
  ArrowLeft,
  Eye,
  Download,
  Phone,
  Mail,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Layers,
  AlertTriangle,
  User,
  Shield
} from 'lucide-react';
import { Card, Button, Badge, Modal, LoadingSpinner } from '../components/ui';
import PersonalStory from '../components/PersonalStory';
import TzfatCanaanProjectCard from '../components/TzfatCanaanProjectCard';

const TzfatProjectPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'gallery' | 'faq' | 'contact'>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const projectData = {
    name: 'פרויקט התחדשות עירונית - צפת, שכונת כנען',
    description: 'פרויקט התחדשות עירונית מקיף בשכונת כנען בצפת, הכולל שיפוץ ושדרוג של 63 בניינים ברחובות זלמן שזר והשבעה. הפרויקט כולל תוספת יחידות דיור, שיפור תשתיות, הוספת מעליות, חיזוק מבנים וחידוש חזיתות.',
    address: 'רחובות זלמן שזר 1, 3, 5 והשבעה 2, 4, 6, שכונת כנען, צפת',
    buildings: 63,
    apartments: 632,
    residents: 1580,
    developer: 'חגג\' צים',
    architect: 'אדר\' יעקב כהן',
    startDate: '2024-01-01',
    estimatedCompletion: '2027-12-31',
    status: 'איסוף חתימות',
    progress: 35,
    signingProgress: 42,
    amidars: 120,
    complexes: 7,
    images: [
      'https://images.pexels.com/photos/2360673/pexels-photo-2360673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    timeline: [
      {
        title: 'תחילת הפרויקט',
        description: 'התחלת תהליך ההתחדשות העירונית בשכונת כנען',
        date: '2024-01-01',
        status: 'completed'
      },
      {
        title: 'סקר דיירים ראשוני',
        description: 'ביצוע סקר ראשוני בקרב דיירי השכונה',
        date: '2024-02-15',
        status: 'completed'
      },
      {
        title: 'הצגת תכניות ראשוניות',
        description: 'הצגת תכניות ראשוניות לדיירים ולעיריית צפת',
        date: '2024-03-20',
        status: 'completed'
      },
      {
        title: 'תחילת איסוף חתימות',
        description: 'התחלת תהליך איסוף חתימות מדיירי הבניינים',
        date: '2024-04-01',
        status: 'in_progress'
      },
      {
        title: 'הגשת בקשה לוועדה המקומית',
        description: 'הגשת תכניות מפורטות לוועדה המקומית לתכנון ובנייה',
        date: '2024-09-01',
        status: 'pending'
      },
      {
        title: 'קבלת היתר בנייה',
        description: 'קבלת היתר בנייה מהוועדה המקומית',
        date: '2025-03-01',
        status: 'pending'
      },
      {
        title: 'תחילת עבודות',
        description: 'תחילת עבודות הבנייה בשטח',
        date: '2025-06-01',
        status: 'pending'
      },
      {
        title: 'סיום פרויקט',
        description: 'סיום עבודות הבנייה ומסירת דירות לדיירים',
        date: '2027-12-31',
        status: 'pending'
      }
    ],
    faq: [
      {
        question: 'מה כולל פרויקט ההתחדשות בשכונת כנען?',
        answer: 'הפרויקט כולל שיפוץ ושדרוג של 63 בניינים ברחובות זלמן שזר והשבעה, תוספת יחידות דיור, שיפור תשתיות, הוספת מעליות, חיזוק מבנים וחידוש חזיתות. בנוסף, יתווספו שטחים ציבוריים ירוקים ומתקני משחקים.'
      },
      {
        question: 'כמה זמן צפוי הפרויקט להימשך?',
        answer: 'הפרויקט צפוי להימשך כ-3.5 שנים מרגע תחילת העבודות. כרגע אנחנו בשלב איסוף החתימות, ולאחר מכן נעבור לשלב התכנון המפורט והגשת הבקשות לוועדות התכנון. העבודות בשטח צפויות להתחיל במהלך 2025.'
      },
      {
        question: 'האם אצטרך לפנות את הדירה במהלך העבודות?',
        answer: 'כן, במהלך העבודות יהיה צורך בפינוי זמני של הדיירים. היזם יספק דיור חלופי או פיצוי כספי לשכירת דירה חלופית למשך תקופת הבנייה. כל הפרטים מעוגנים בהסכם הדיירים.'
      },
      {
        question: 'מה אני מקבל כדייר בפרויקט?',
        answer: 'כל דייר יקבל דירה חדשה ומשודרגת, גדולה יותר מהדירה הנוכחית (תוספת של כ-12 מ"ר), מרפסת, חניה, מחסן, ומעלית בבניין. בנוסף, הבניין יחוזק לפי תקן רעידות אדמה עדכני ויקבל חזית מודרנית.'
      },
      {
        question: 'כמה חתימות דרושות כדי שהפרויקט יצא לפועל?',
        answer: 'על פי חוק, נדרשות חתימות של לפחות 80% מבעלי הדירות בכל בניין. אנו שואפים להגיע ל-100% הסכמה כדי להבטיח שכל הדיירים יהיו מרוצים ומעורבים בתהליך.'
      },
      {
        question: 'מה קורה אם אני לא מעוניין להצטרף לפרויקט?',
        answer: 'אנו מעודדים את כל הדיירים להצטרף לפרויקט כדי ליהנות מהיתרונות שהוא מציע. עם זאת, אם אינך מעוניין, ניתן לשקול אפשרויות אחרות כמו פיצוי כספי. מומלץ להתייעץ עם עורך דין המתמחה בהתחדשות עירונית.'
      }
    ],
    contact: {
      projectManager: 'אור אברהם',
      phone: '050-1234567',
      email: 'oravraham217@gmail.com',
      office: 'רחוב ירושלים 10, צפת',
      hours: 'א\'-ה\' 9:00-17:00'
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-warmGold-50 flex items-center justify-center">
        <LoadingSpinner size="lg" color="primary" text="טוען פרטי פרויקט..." centered />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cream-50 via-neutral-50 to-cream-100 text-neutral-900 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-shimmer-gold bg-[length:200%_100%] animate-shimmer opacity-20"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-gold-300 to-warmGold-300 rounded-full opacity-30 blur-3xl animate-pulse"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center space-x-3 space-x-reverse mb-6">
              <Link 
                to="/" 
                className="p-2 text-neutral-700 hover:text-gold-600 hover:bg-white/50 rounded-lg transition-colors flex items-center space-x-2 space-x-reverse"
              >
                <ArrowLeft className="w-6 h-6" />
                <span className="font-medium">חזרה לדף הבית</span>
              </Link>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-neutral-900">
              {projectData.name}
            </h1>
            
            <div className="flex items-center space-x-4 space-x-reverse text-neutral-700 mb-8">
              <div className="flex items-center space-x-2 space-x-reverse">
                <MapPin className="w-5 h-5 text-gold-600" />
                <span>צפת, שכונת כנען</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Building className="w-5 h-5 text-gold-600" />
                <span>{projectData.buildings} בניינים</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Users className="w-5 h-5 text-gold-600" />
                <span>{projectData.apartments} דירות</span>
              </div>
            </div>
            
            <p className="text-xl text-neutral-700 leading-relaxed mb-12 max-w-4xl">
              {projectData.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/resident-login">
                <Button variant="primary" size="lg" icon={Eye} className="shadow-md border border-gold-400/50">
                  כניסה לאזור דיירים
                </Button>
              </Link>
              <Link to="/resident-registration">
                <Button variant="outline" size="lg" className="border-gold-400 text-gold-700 shadow-sm">
                  הרשמה לפרויקט
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-cream-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8 space-x-reverse overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 space-x-reverse py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-gold-500 text-gold-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>סקירה כללית</span>
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center space-x-2 space-x-reverse py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'timeline'
                  ? 'border-gold-500 text-gold-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>ציר זמן</span>
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center space-x-2 space-x-reverse py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'gallery'
                  ? 'border-gold-500 text-gold-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>גלריה</span>
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex items-center space-x-2 space-x-reverse py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'faq'
                  ? 'border-gold-500 text-gold-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>שאלות נפוצות</span>
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex items-center space-x-2 space-x-reverse py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'contact'
                  ? 'border-gold-500 text-gold-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>יצירת קשר</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Project Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">פרטי הפרויקט</h2>
                  <p className="text-neutral-700 leading-relaxed mb-8">
                    פרויקט ההתחדשות העירונית בשכונת כנען בצפת הוא אחד הפרויקטים המשמעותיים ביותר בעיר בשנים האחרונות. 
                    הפרויקט מתמקד ב-63 בניינים ברחובות זלמן שזר והשבעה, ומטרתו לשדרג את איכות החיים של התושבים, 
                    לחזק את המבנים מפני רעידות אדמה, ולהוסיף יחידות דיור חדשות לשכונה.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-500 mb-1">כתובת</h3>
                        <p className="text-neutral-800 font-medium">{projectData.address}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-neutral-500 mb-1">יזם</h3>
                        <p className="text-neutral-800 font-medium">{projectData.developer}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-neutral-500 mb-1">אדריכל</h3>
                        <p className="text-neutral-800 font-medium">{projectData.architect}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-500 mb-1">תחילת פרויקט</h3>
                        <p className="text-neutral-800 font-medium">{new Date(projectData.startDate).toLocaleDateString('he-IL')}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-neutral-500 mb-1">סיום משוער</h3>
                        <p className="text-neutral-800 font-medium">{new Date(projectData.estimatedCompletion).toLocaleDateString('he-IL')}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-neutral-500 mb-1">סטטוס</h3>
                        <Badge variant="warning">{projectData.status}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bars */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-neutral-700">התקדמות כללית</span>
                        <span className="text-sm font-bold text-gold-600">{projectData.progress}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-gold-500 to-warmGold-400 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${projectData.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-neutral-700">איסוף חתימות</span>
                        <span className="text-sm font-bold text-gold-600">{projectData.signingProgress}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-accent-500 to-accent-400 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${projectData.signingProgress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-neutral-600 mt-1">
                        <span>0%</span>
                        <span>יעד: 80%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div>
                <Card>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">נתונים מספריים</h2>
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-gradient-to-r from-gold-50 to-warmGold-50 rounded-xl">
                      <div className="text-4xl font-bold text-gold-600 mb-2">{projectData.buildings}</div>
                      <div className="text-sm text-gold-700">בניינים</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                      <div className="text-4xl font-bold text-blue-600 mb-2">{projectData.apartments}</div>
                      <div className="text-sm text-blue-700">דירות</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                      <div className="text-4xl font-bold text-purple-600 mb-2">{projectData.amidars}</div>
                      <div className="text-sm text-purple-700">דירות עמידר</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl">
                      <div className="text-4xl font-bold text-accent-600 mb-2">{projectData.complexes}</div>
                      <div className="text-sm text-accent-700">מתחמים</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Project Benefits */}
            <Card>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">יתרונות הפרויקט</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-r from-gold-50 to-warmGold-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-xl flex items-center justify-center mb-4">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">דירות חדשות ומשודרגות</h3>
                  <p className="text-neutral-700">
                    דירות חדשות וגדולות יותר, עם מפרט טכני עשיר ומודרני, מרפסות, חניות ומחסנים.
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">חיזוק מבנים ובטיחות</h3>
                  <p className="text-neutral-700">
                    חיזוק המבנים לפי תקן רעידות אדמה עדכני, שיפור מערכות כיבוי אש ובטיחות.
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">עלייה בערך הנכס</h3>
                  <p className="text-neutral-700">
                    עלייה משמעותית בערך הנכס, שיפור איכות החיים ופיתוח השכונה כולה.
                  </p>
                </div>
              </div>
            </Card>

            {/* Call to Action */}
            <Card>
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">רוצה להיות חלק מהפרויקט?</h2>
                <p className="text-neutral-700 mb-8 max-w-2xl mx-auto">
                  הצטרף לפרויקט ההתחדשות העירונית בשכונת כנען והבטח את עתיד הנכס שלך. 
                  הרשם עכשיו כדי לקבל עדכונים שוטפים ולעקוב אחר התקדמות הפרויקט.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/resident-registration">
                    <Button variant="primary" size="lg">
                      הרשם עכשיו
                    </Button>
                  </Link>
                  <Link to="/resident-login">
                    <Button variant="outline" size="lg">
                      כניסה לאזור דיירים
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <Card>
            <h2 className="text-2xl font-bold text-neutral-900 mb-8">ציר זמן הפרויקט</h2>
            <div className="space-y-8">
              {projectData.timeline.map((event, index) => (
                <div key={index} className="relative">
                  {/* Timeline Line */}
                  {index < projectData.timeline.length - 1 && (
                    <div className="absolute right-6 top-12 w-0.5 h-16 bg-neutral-200"></div>
                  )}
                  
                  <div className="flex items-start space-x-4 space-x-reverse">
                    {/* Status Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      event.status === 'completed' ? 'bg-accent-100' :
                      event.status === 'in_progress' ? 'bg-yellow-100' :
                      'bg-neutral-100'
                    }`}>
                      {event.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 text-accent-600" />
                      ) : event.status === 'in_progress' ? (
                        <Clock className="w-6 h-6 text-yellow-600" />
                      ) : (
                        <Calendar className="w-6 h-6 text-neutral-400" />
                      )}
                    </div>
                    
                    {/* Event Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-neutral-900">{event.title}</h3>
                        <Badge variant={
                          event.status === 'completed' ? 'success' :
                          event.status === 'in_progress' ? 'warning' :
                          'default'
                        }>
                          {event.status === 'completed' ? 'הושלם' :
                           event.status === 'in_progress' ? 'בתהליך' :
                           'ממתין'}
                        </Badge>
                      </div>
                      <p className="text-neutral-700 mb-2">{event.description}</p>
                      <div className="text-sm text-neutral-500">
                        {new Date(event.date).toLocaleDateString('he-IL')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <Card>
            <h2 className="text-2xl font-bold text-neutral-900 mb-8">גלריית תמונות</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectData.images.map((image, index) => (
                <div key={index} className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                  <img 
                    src={image} 
                    alt={`תמונה ${index + 1} של פרויקט צפת שכונת כנען`}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/property-3d/1?address=רחוב זלמן שזר, צפת">
                <Button variant="outline" icon={Layers}>
                  צפה במודל תלת-ממדי
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <Card>
            <h2 className="text-2xl font-bold text-neutral-900 mb-8">שאלות נפוצות</h2>
            <div className="space-y-4">
              {projectData.faq.map((item, index) => (
                <div key={index} className="border border-neutral-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-4 text-right hover:bg-neutral-50 transition-colors flex items-center justify-between"
                  >
                    <h3 className="font-semibold text-neutral-900 text-lg">{item.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-neutral-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-500" />
                    )}
                  </button>
                  
                  {expandedFaq === index && (
                    <div className="p-4 bg-neutral-50 border-t border-neutral-200">
                      <p className="text-neutral-700 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-gold-50 to-warmGold-50 rounded-xl">
              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">יש לך שאלה נוספת?</h3>
                  <p className="text-neutral-700 mb-4">
                    אם לא מצאת תשובה לשאלתך, אנחנו כאן לעזור. צור קשר עם צוות הפרויקט ונשמח לענות על כל שאלה.
                  </p>
                  <Button variant="primary" icon={Phone} onClick={() => setActiveTab('contact')}>
                    צור קשר
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <Card>
            <h2 className="text-2xl font-bold text-neutral-900 mb-8">יצירת קשר</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-6">צוות הפרויקט</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-100 to-warmGold-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gold-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-1">מנהל הפרויקט</h4>
                      <p className="text-neutral-700">{projectData.contact.projectManager}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-100 to-warmGold-100 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-gold-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-1">טלפון</h4>
                      <p className="text-neutral-700">{projectData.contact.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-100 to-warmGold-100 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-gold-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-1">אימייל</h4>
                      <p className="text-neutral-700">{projectData.contact.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-100 to-warmGold-100 rounded-full flex items-center justify-center">
                      <Building className="w-6 h-6 text-gold-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-1">משרד</h4>
                      <p className="text-neutral-700">{projectData.contact.office}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-100 to-warmGold-100 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-gold-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-1">שעות פעילות</h4>
                      <p className="text-neutral-700">{projectData.contact.hours}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-6">טופס יצירת קשר</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">שם מלא</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      placeholder="הכנס את שמך המלא"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">טלפון</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      placeholder="הכנס מספר טלפון"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">אימייל</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      placeholder="הכנס כתובת אימייל"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">הודעה</label>
                    <textarea
                      className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-vertical"
                      placeholder="כתוב את הודעתך כאן..."
                      rows={4}
                    ></textarea>
                  </div>
                  
                  <Button variant="primary" className="w-full">
                    שלח הודעה
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Personal Story */}
      {activeTab === 'overview' && (
        <div className="mt-8">
          <PersonalStory compact />
        </div>
      )}
    </div>
  );
};

export default TzfatProjectPage;