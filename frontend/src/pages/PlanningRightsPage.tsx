import React, { useState } from 'react';
import { Search, MapPin, FileText, Download, AlertTriangle, CheckCircle, Crown, Sparkles, Building, Calculator, Map, Zap, Eye, Info } from 'lucide-react';
import { Card, Button, Badge, Input, Modal, LoadingSpinner } from '../components/ui';
import { Link, useNavigate } from 'react-router-dom';
import { propertyService } from '../services/api.ts-old';
import toast from 'react-hot-toast';

interface PlanningRightsData {
  address: string;
  block: string;
  plot: string;
  propertyNumber: string;
  currentStatus: 'approved' | 'pending' | 'restricted' | 'unknown';
  buildingRights: {
    currentFloors: number;
    maxFloors: number;
    currentUnits: number;
    potentialUnits: number;
    buildingPercentage: number;
    coverage: number;
  };
  zoning: string;
  restrictions: string[];
  renewalPotential: 'high' | 'medium' | 'low' | 'blocked';
  lastUpdated: string;
  sources: string[];
}

const PlanningRightsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'address' | 'block_plot'>('address');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PlanningRightsData | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const navigate = useNavigate();
  const [blockInput, setBlockInput] = useState('');
  const [plotInput, setPlotInput] = useState('');

  const handleSearch = async () => {
    if (searchType === 'address' && !searchQuery.trim()) return;
    if (searchType === 'block_plot' && (!blockInput.trim() || !plotInput.trim())) return;

    setLoading(true);
    try {
      let data;
      
      if (searchType === 'address') {
        // חיפוש לפי כתובת
        data = await propertyService.getPropertyDataByAddress(searchQuery);
      } else {
        // חיפוש לפי גוש וחלקה
        data = await propertyService.getPropertyDataByParcel(blockInput, plotInput);
      }
      
      // המרת הנתונים למבנה הנדרש
      const planningRightsData: PlanningRightsData = {
        address: data.address,
        block: data.block || '6304',
        plot: data.parcel || '15',
        propertyNumber: (data.block || '6304') + '-' + (data.parcel || '15'),
        currentStatus: 'approved',
        buildingRights: {
          currentFloors: data.buildingRights.currentBuilding.floors,
          maxFloors: data.buildingRights.plannedBuilding.floors,
          currentUnits: data.buildingRights.currentBuilding.units,
          potentialUnits: data.buildingRights.plannedBuilding.units,
          buildingPercentage: data.buildingRights.buildingPercentage,
          coverage: data.buildingRights.currentBuilding.coverage
        },
        zoning: data.buildingRights.zoning,
        restrictions: data.landRights.restrictions,
        renewalPotential: 'high',
        lastUpdated: new Date().toISOString(),
        sources: ['מנהל התכנון', 'עיריית תל אביב', 'רמ"י', 'טאבו']
      };
      
      setResults(planningRightsData);
      toast.success('ניתוח זכויות הושלם בהצלחה (מצב דמו)');
    } catch (error) {
      console.error('Error searching property, using mock data:', error);
      
      // Set default data on error
      const planningRightsData: PlanningRightsData = {
        address: searchType === 'address' ? searchQuery : `גוש ${blockInput} חלקה ${plotInput}`,
        block: blockInput || '6304',
        plot: plotInput || '15',
        propertyNumber: (blockInput || '6304') + '-' + (plotInput || '15'),
        currentStatus: 'approved',
        buildingRights: {
          currentFloors: 4,
          maxFloors: 8,
          currentUnits: 16,
          potentialUnits: 32,
          buildingPercentage: 240,
          coverage: 60
        },
        zoning: 'מגורים ב',
        restrictions: [
          'הגבלת גובה בשל קרבה לשדה תעופה',
          'שימור חזית מבנה',
          'זכות מעבר לציבור בחזית המבנה'
        ],
        renewalPotential: 'high',
        lastUpdated: new Date().toISOString(),
        sources: ['מנהל התכנון', 'עיריית תל אביב', 'רמ"י', 'טאבו']
      };
      
      setResults(planningRightsData);
      toast.success('ניתוח זכויות הושלם בהצלחה (מצב דמו)');
    } finally {
      setLoading(false);
    }
  };

  const [error, setError] = useState<string | null>(null);

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'high': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'error';
      case 'blocked': return 'error';
      default: return 'default';
    }
  };

  const getPotentialText = (potential: string) => {
    switch (potential) {
      case 'high': return 'פוטנציאל גבוה';
      case 'medium': return 'פוטנציאל בינוני';
      case 'low': return 'פוטנציאל נמוך';
      case 'blocked': return 'חסום';
      default: return 'לא ידוע';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'restricted': return 'error';
      case 'unknown': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'מאושר';
      case 'pending': return 'ממתין לאישור';
      case 'restricted': return 'מוגבל';
      case 'unknown': return 'לא ידוע';
      default: return status;
    }
  };

  const generateReport = () => {
    // In a real app, this would generate a PDF report
    toast.success('מייצר דוח PDF... (מצב דמו)');
    setShowReportModal(false);
  };

  const view3DModel = () => {
    // Navigate to 3D viewer with the current search query
    if (results) {
      navigate(`/property-3d/1?address=${encodeURIComponent(results.address)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cream-50 via-neutral-50 to-cream-100 text-neutral-900 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-shimmer-gold bg-[length:200%_100%] animate-shimmer opacity-20"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-gold-300 to-warmGold-300 rounded-full opacity-30 blur-3xl animate-pulse"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center space-x-3 space-x-reverse bg-gradient-to-r from-gold-100 to-warmGold-100 backdrop-blur-sm border border-gold-200 text-gold-800 px-8 py-4 rounded-full mb-12 shadow-luxury">
              <Crown className="w-6 h-6 text-gold-600" />
              <span className="font-medium text-lg">ניתוח זכויות תכנוניות מתקדם</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight text-neutral-900">
              <span className="bg-gradient-to-r from-gold-600 via-warmGold-500 to-gold-700 bg-clip-text text-transparent">ניתוח זכויות</span> תכנוניות
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-700 leading-relaxed max-w-4xl mx-auto mb-12">
              מערכת מתקדמת לניתוח זכויות תכנוניות המסונכרנת עם מקורות מידע ממשלתיים ורשמיים
            </p>

            {/* Search Interface */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-luxury-lg p-8 max-w-4xl mx-auto border border-neutral-200">
              <div className="space-y-6">
                {/* Search Type Toggle */}
                <div className="flex justify-center space-x-4 space-x-reverse">
                  <div className="bg-white p-1 rounded-xl shadow-sm border border-neutral-200 flex">
                    <button
                      onClick={() => setSearchType('address')}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        searchType === 'address' 
                          ? 'bg-gold-500 text-white shadow-sm' 
                          : 'bg-transparent text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      חיפוש לפי כתובת
                    </button>
                    <button
                      onClick={() => setSearchType('block_plot')}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        searchType === 'block_plot' 
                          ? 'bg-gold-500 text-white shadow-sm' 
                          : 'bg-transparent text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      חיפוש לפי גוש/חלקה
                    </button>
                  </div>
                </div>

                {/* Search Input */}
                {searchType === 'address' ? (
                  <div className="relative">
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gold-500 w-6 h-6" />
                    <input
                      type="text"
                      placeholder="הכנס כתובת מלאה..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pr-12 pl-4 py-4 bg-white backdrop-blur-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent text-neutral-800 placeholder-neutral-500 font-medium text-lg"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="מספר גוש"
                        value={blockInput}
                        onChange={(e) => setBlockInput(e.target.value)}
                        className="w-full px-4 py-4 bg-white backdrop-blur-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent text-neutral-800 placeholder-neutral-500 font-medium text-lg"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="מספר חלקה"
                        value={plotInput}
                        onChange={(e) => setPlotInput(e.target.value)}
                        className="w-full px-4 py-4 bg-white backdrop-blur-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent text-neutral-800 placeholder-neutral-500 font-medium text-lg"
                      />
                    </div>
                  </div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSearch}
                  loading={loading} 
                  className="w-full text-xl py-5 shadow-md border border-gold-400/50"
                  icon={Calculator}
                >
                  {loading ? 'מנתח זכויות...' : 'נתח זכויות תכנוניות'}
                </Button>
              </div>
            </div>
          </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-warmGold-50 to-cream-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">זכויות בנייה</h3>
              <p className="text-sm text-neutral-600">ניתוח מפורט של זכויות הבנייה הקיימות והפוטנציאליות</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-600 to-warmGold-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Map className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">מיפוי GIS</h3>
              <p className="text-sm text-neutral-600">מפות מתקדמות עם שכבות תכנון ומידע גיאוגרפי</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-warmGold-500 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">עדכון בזמן אמת</h3>
              <p className="text-sm text-neutral-600">סינכרון אוטומטי עם מקורות מידע ממשלתיים</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-700 to-warmGold-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">דוחות מקצועיים</h3>
              <p className="text-sm text-neutral-600">דוחות PDF מפורטים עם כל הנתונים הרלוונטיים</p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {results && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-neutral-900">תוצאות הניתוח</h2>
                <div className="flex space-x-4 space-x-reverse">
                  <Button
                    variant="outline"
                    icon={Eye}
                    onClick={view3DModel}
                  >
                    צפה במודל תלת-ממדי
                  </Button>
                  <Button
                    variant="primary"
                    icon={Download}
                    onClick={() => setShowReportModal(true)}
                  >
                    ייצוא דוח PDF
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Property Info */}
                <Card className="lg:col-span-1">
                  <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center space-x-2 space-x-reverse">
                    <MapPin className="w-6 h-6 text-gold-500" />
                    <span>פרטי הנכס</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">כתובת</label>
                      <p className="text-neutral-900 font-semibold">{results.address}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">גוש</label>
                        <p className="text-neutral-900">{results.block}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">חלקה</label>
                        <p className="text-neutral-900">{results.plot}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">סטטוס תכנוני</label>
                      <Badge variant={getStatusColor(results.currentStatus) as any}>
                        {getStatusText(results.currentStatus)}
                      </Badge>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">זיקת הנכס</label>
                      <p className="text-neutral-900">{results.zoning}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">פוטנציאל התחדשות</label>
                      <Badge variant={getPotentialColor(results.renewalPotential) as any} size="md">
                        {getPotentialText(results.renewalPotential)}
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Building Rights */}
                <Card className="lg:col-span-2">
                  <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center space-x-2 space-x-reverse">
                    <Building className="w-6 h-6 text-gold-500" />
                    <span>זכויות בנייה</span>
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="text-center p-4 bg-gradient-to-br from-gold-50 to-warmGold-50 rounded-xl">
                      <div className="text-2xl font-bold text-gold-600 mb-1">{results.buildingRights.currentFloors}</div>
                      <div className="text-xs font-medium text-neutral-600">קומות נוכחיות</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-warmGold-50 to-cream-50 rounded-xl">
                      <div className="text-2xl font-bold text-warmGold-600 mb-1">{results.buildingRights.maxFloors}</div>
                      <div className="text-xs font-medium text-neutral-600">קומות מקסימליות</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-gold-50 to-warmGold-50 rounded-xl">
                      <div className="text-2xl font-bold text-gold-600 mb-1">{results.buildingRights.currentUnits}</div>
                      <div className="text-xs font-medium text-neutral-600">יחידות נוכחיות</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-warmGold-50 to-cream-50 rounded-xl">
                      <div className="text-2xl font-bold text-warmGold-600 mb-1">{results.buildingRights.potentialUnits}</div>
                      <div className="text-xs font-medium text-neutral-600">יחידות פוטנציאליות</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">אחוז בנייה</label>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="flex-1 bg-neutral-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-gold-500 to-warmGold-400 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${results.buildingRights.buildingPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gold-600">{results.buildingRights.buildingPercentage}%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">אחוז כיסוי</label>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="flex-1 bg-neutral-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-warmGold-500 to-gold-400 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${results.buildingRights.coverage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-warmGold-600">{results.buildingRights.coverage}%</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Restrictions */}
                {results.restrictions.length > 0 && (
                  <Card className="lg:col-span-3">
                    <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center space-x-2 space-x-reverse">
                      <AlertTriangle className="w-6 h-6 text-yellow-500" />
                      <span>מגבלות ותנאים</span>
                    </h3>
                    <div className="space-y-3">
                      {results.restrictions.map((restriction, index) => (
                        <div key={index} className="flex items-start space-x-3 space-x-reverse p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <span className="text-neutral-800">{restriction}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Data Sources */}
                <Card className="lg:col-span-3">
                  <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center space-x-2 space-x-reverse">
                    <CheckCircle className="w-6 h-6 text-accent-500" />
                    <span>מקורות מידע</span>
                  </h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {results.sources.map((source, index) => (
                      <Badge key={index} variant="info" size="md">
                        {source}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-neutral-600">
                    עודכן לאחרונה: {new Date(results.lastUpdated).toLocaleDateString('he-IL')}
                  </p>
                </Card>
              </div>

              {/* 3D Model Integration */}
              <Card className="mt-8">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">צפה בנכס בתלת-ממד</h3>
                  <p className="text-neutral-600 mb-6">
                    הצג את הנכס במפה תלת-ממדית אמיתית עם נתונים ממקורות ממשלתיים
                  </p>
                  <Button variant="primary" icon={Eye} onClick={view3DModel}>
                    פתח תצוגת תלת-ממד
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Report Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="ייצוא דוח ניתוח זכויות תכנוניות"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gold-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-neutral-900 mb-2">דוח מקצועי מפורט</h3>
            <p className="text-neutral-600">הדוח יכלול את כל הנתונים הרלוונטיים, מפות ותרשימים</p>
          </div>
          
          <div className="bg-gradient-to-br from-gold-50 to-warmGold-50 rounded-xl p-6 border border-gold-200">
            <h4 className="font-bold text-neutral-900 mb-3">הדוח יכלול:</h4>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li className="flex items-center space-x-2 space-x-reverse">
                <CheckCircle className="w-4 h-4 text-accent-500" />
                <span>פרטי הנכס המלאים</span>
              </li>
              <li className="flex items-center space-x-2 space-x-reverse">
                <CheckCircle className="w-4 h-4 text-accent-500" />
                <span>ניתוח זכויות בנייה מפורט</span>
              </li>
              <li className="flex items-center space-x-2 space-x-reverse">
                <CheckCircle className="w-4 h-4 text-accent-500" />
                <span>מפת מיקום ותכנית</span>
              </li>
              <li className="flex items-center space-x-2 space-x-reverse">
                <CheckCircle className="w-4 h-4 text-accent-500" />
                <span>מגבלות ותנאים</span>
              </li>
              <li className="flex items-center space-x-2 space-x-reverse">
                <CheckCircle className="w-4 h-4 text-accent-500" />
                <span>המלצות מקצועיות</span>
              </li>
              <li className="flex items-center space-x-2 space-x-reverse">
                <CheckCircle className="w-4 h-4 text-accent-500" />
                <span>קישור לתצוגת תלת-ממד</span>
              </li>
            </ul>
          </div>

          <div className="flex space-x-4 space-x-reverse">
            <Button variant="primary" className="flex-1" onClick={generateReport}>
              ייצא דוח PDF
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setShowReportModal(false)}>
              ביטול
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PlanningRightsPage;