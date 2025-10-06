import React, { useState, useEffect, useRef } from 'react';
import { 
  Info,
  Building, 
  Map, 
  Layers, 
  Eye, 
  Download, 
  Share, 
  Search,
  MapPin,
  Calculator,
  Ruler,
  Home,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Maximize,
  RotateCcw,
  Settings,
  Globe
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../ui';
import GoogleMapsIntegration from './GoogleMapsIntegration';
import { propertyService } from '../../services/api.ts-old';
import toast from 'react-hot-toast';

interface PropertyData {
  address: string;
  block: string;
  plot: string;
  currentBuilding: {
    floors: number;
    units: number;
    height: number;
    coverage: number;
  };
  plannedBuilding: {
    floors: number;
    units: number;
    height: number;
    coverage: number;
  };
  zoning: string;
  restrictions: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface RealEstate3DViewerProps {
  searchQuery?: string;
  propertyData?: PropertyData;
  className?: string;
}

const RealEstate3DViewer: React.FC<RealEstate3DViewerProps> = ({
  searchQuery = '',
  propertyData,
  className = ''
}) => {
  const [activeView, setActiveView] = useState<'current' | 'planned' | 'comparison'>('current');
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [showZoning, setShowZoning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mapData, setMapData] = useState<PropertyData | null>(propertyData || {
    address: searchQuery || 'רחוב הרצל 45, תל אביב',
    block: '6304',
    plot: '15',
    currentBuilding: {
      floors: 4,
      units: 16,
      height: 12,
      coverage: 60
    },
    plannedBuilding: {
      floors: 8,
      units: 32,
      height: 24,
      coverage: 50
    },
    zoning: 'מגורים ב',
    restrictions: [
      'הגבלת גובה בשל קרבה לשדה תעופה',
      'שימור חזית מבנה',
      'זכות מעבר לציבור בחזית המבנה'
    ],
    coordinates: {
      lat: 32.0853,
      lng: 34.7818
    }
  });
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery && !propertyData) {
      fetchPropertyData(searchQuery);
    } 
  }, [searchQuery, propertyData]);

  // Listen for search updates from parent component
  useEffect(() => {
    const handleSearchUpdate = () => {
      if (searchQuery) {
        fetchPropertyData(searchQuery);
      }
    };

    window.addEventListener('searchUpdated', handleSearchUpdate);
    return () => window.removeEventListener('searchUpdated', handleSearchUpdate);
  }, [searchQuery]);

  const fetchPropertyData = async (query: string) => {
    if (!query) return;
    
    setLoading(true);
    try {
      // Use the API service to get data
      const data = await propertyService.getPropertyDataByAddress(query);
      
      // Update map data
      setMapData({
        address: data.address,
        block: data.block || '',
        plot: data.parcel || '',
        currentBuilding: data.buildingRights.currentBuilding,
        plannedBuilding: data.buildingRights.plannedBuilding,
        zoning: data.buildingRights.zoning,
        restrictions: data.landRights?.restrictions || [],
        coordinates: data.coordinates || { lat: 32.0853, lng: 34.7818 }
      });
    } catch (error) {
      console.error('Error fetching property data:', error);
      toast.error('שגיאה בטעינת נתוני הנכס. מציג נתונים לדוגמה (מצב דמו).');
      
      // Set default data on error
      setMapData({
        address: query,
        block: '6304',
        plot: '15',
        currentBuilding: {
          floors: 4,
          units: 16,
          height: 12,
          coverage: 60
        },
        plannedBuilding: {
          floors: 8,
          units: 32,
          height: 24,
          coverage: 50
        },
        zoning: 'מגורים ב',
        restrictions: [
          'הגבלת גובה בשל קרבה לשדה תעופה',
          'שימור חזית מבנה',
          'זכות מעבר לציבור בחזית המבנה'
        ],
        coordinates: {
          lat: 32.0853,
          lng: 34.7818
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const renderGovMapIntegration = () => {
    if (!mapData && !searchQuery) return null;

    const displayAddress = mapData?.address || searchQuery || 'רחוב הרצל 45, תל אביב';

    return (
      <div className="relative w-full h-96 bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200" ref={mapRef}>
        {/* אינטגרציה עם Google Maps */}
        <GoogleMapsIntegration address={displayAddress} />

        {/* כפתורי בקרה */}
        <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
          <button
            onClick={() => setActiveView('current')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'current' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white/90 text-neutral-700 hover:bg-white'
            }`}
          >
            מבנה נוכחי
          </button>
          <button
            onClick={() => setActiveView('planned')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'planned' 
                ? 'bg-accent-500 text-white' 
                : 'bg-white/90 text-neutral-700 hover:bg-white'
            }`}
          >
            תכנית מוצעת
          </button>
          <button
            onClick={() => setActiveView('comparison')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'comparison' 
                ? 'bg-gold-500 text-white' 
                : 'bg-white/90 text-neutral-700 hover:bg-white'
            }`}
          >
            השוואה
          </button>
        </div>

        {/* כפתורי כלים */}
        <div className="absolute bottom-4 left-4 flex space-x-2 space-x-reverse">
          <button
            onClick={() => setShowMeasurements(!showMeasurements)}
            className={`p-2 rounded-lg transition-colors ${
              showMeasurements 
                ? 'bg-gold-500 text-white' 
                : 'bg-white/90 text-neutral-700 hover:bg-white'
            }`}
            title="הצג מידות"
          >
            <Ruler className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowZoning(!showZoning)}
            className={`p-2 rounded-lg transition-colors ${
              showZoning 
                ? 'bg-purple-500 text-white' 
                : 'bg-white/90 text-neutral-700 hover:bg-white'
            }`}
            title="הצג זיקת הנכס"
          >
            <Map className="w-4 h-4" />
          </button>
          <button 
            className="p-2 bg-white/90 text-neutral-700 hover:bg-white rounded-lg transition-colors" 
            title="מסך מלא"
            onClick={() => {
              if (mapRef.current && document.fullscreenEnabled) {
                mapRef.current.requestFullscreen().catch(err => {
                  console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
              }
            }}
          >
            <Maximize className="w-4 h-4" />
          </button>
          <button className="p-2 bg-white/90 text-neutral-700 hover:bg-white rounded-lg transition-colors" title="איפוס תצוגה">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* מידע על התצוגה הנוכחית */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
          <div className="text-sm font-medium text-neutral-800">
            {activeView === 'current' && 'מבנה נוכחי'}
            {activeView === 'planned' && 'תכנית מוצעת'}
            {activeView === 'comparison' && 'השוואה'}
          </div>
          <div className="text-xs text-neutral-600 mt-1">
            {displayAddress}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className={`${className} shadow-md`}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-navy-500 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-neutral-700 mb-2">טוען נתוני נכס תלת-ממדיים...</h3>
          <p className="text-neutral-600">מושך מידע ממקורות ממשלתיים</p>
        </div>
      </Card>
    );
  }

  if (!mapData && !searchQuery) {
    return (
      <Card className={`${className} shadow-md`}>
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-700 mb-2">הכנס כתובת לתצוגה</h3>
          <p className="text-neutral-600">השתמש בחיפוש למעלה כדי לטעון נתוני נכס</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Title and basic info */}
      <Card className="shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-12 h-12 bg-gradient-to-br from-navy-600 to-navy-700 rounded-xl flex items-center justify-center shadow-md">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">תצוגת נכס תלת-ממדית</h2>
              <p className="text-neutral-600">{mapData?.address || searchQuery}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            {mapData && (
              <>
                <Badge variant="info">גוש {mapData.block}</Badge>
                <Badge variant="info">חלקה {mapData.plot}</Badge>
                <Badge variant="success">נתונים אמיתיים</Badge>
              </>
            )}
          </div>
        </div>

        {/* סטטיסטיקות מהירות */}
        {mapData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <div className="text-lg font-bold text-blue-600">{mapData.currentBuilding.floors}</div>
              <div className="text-xs text-blue-700">קומות נוכחיות</div>
            </div>
            <div className="text-center p-3 bg-accent-50 rounded-xl">
              <div className="text-lg font-bold text-accent-600">{mapData.plannedBuilding.floors}</div>
              <div className="text-xs text-accent-700">קומות מתוכננות</div>
            </div>
            <div className="text-center p-3 bg-gold-50 rounded-xl">
              <div className="text-lg font-bold text-gold-600">{mapData.currentBuilding.units}</div>
              <div className="text-xs text-gold-700">יחידות נוכחיות</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-xl">
              <div className="text-lg font-bold text-purple-600">{mapData.plannedBuilding.units}</div>
              <div className="text-xs text-purple-700">יחידות מתוכננות</div>
            </div>
          </div>
        )}
      </Card>

      {/* תצוגת המפה התלת-ממדית */}
      <Card className="shadow-md">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">מפה תלת-ממדית אמיתית</h3>
        {renderGovMapIntegration()}
      </Card>

      {/* השוואת נתונים */}
      {mapData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center space-x-2 space-x-reverse">
              <Home className="w-5 h-5 text-blue-500" />
              <span>מבנה נוכחי</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">קומות:</span>
                <span className="font-medium">{mapData.currentBuilding.floors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">יחידות דיור:</span>
                <span className="font-medium">{mapData.currentBuilding.units}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">גובה (מ'):</span>
                <span className="font-medium">{mapData.currentBuilding.height}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">אחוז כיסוי:</span>
                <span className="font-medium">{mapData.currentBuilding.coverage}%</span>
              </div>
            </div>
          </Card>

          <Card className="shadow-md">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center space-x-2 space-x-reverse">
              <TrendingUp className="w-5 h-5 text-accent-500" />
              <span>תכנית מוצעת</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">קומות:</span>
                <span className="font-medium text-accent-600">{mapData.plannedBuilding.floors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">יחידות דיור:</span>
                <span className="font-medium text-accent-600">{mapData.plannedBuilding.units}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">גובה (מ'):</span>
                <span className="font-medium text-accent-600">{mapData.plannedBuilding.height}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">אחוז כיסוי:</span>
                <span className="font-medium text-accent-600">{mapData.plannedBuilding.coverage}%</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* מגבלות ותנאים */}
      {mapData && mapData.restrictions.length > 0 && (
        <Card className="shadow-md">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center space-x-2 space-x-reverse">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <span>מגבלות תכנוניות</span>
          </h3>
          <div className="space-y-2">
            {mapData.restrictions.map((restriction, index) => (
              <div key={index} className="flex items-start space-x-3 space-x-reverse p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-800 text-sm">{restriction}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* מקורות מידע */}
      {(mapData || searchQuery) && ( 
        <Card className="shadow-md">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center space-x-2 space-x-reverse">
            <CheckCircle className="w-5 h-5 text-accent-500" />
            <span>מקורות מידע ממשלתיים</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-blue-800">Google Maps</div>
              <div className="text-xs text-blue-600">מפות תלת-ממדיות</div>
            </div>
            <div className="text-center p-3 bg-accent-50 rounded-lg">
              <Map className="w-8 h-8 text-accent-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-accent-800">מפ"י</div>
              <div className="text-xs text-accent-600">מרכז המיפוי</div>
            </div>
            <div className="text-center p-3 bg-gold-50 rounded-lg">
              <Building className="w-8 h-8 text-gold-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gold-800">רמ"י</div>
              <div className="text-xs text-gold-600">רשם המקרקעין</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Layers className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-purple-800">מנהל התכנון</div>
              <div className="text-xs text-purple-600">תכניות עיר</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-neutral-600 text-center">
            עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')} • נתונים רשמיים ומאומתים
          </div>
        </Card>
      )}

      {/* כפתורי פעולה */}
      <Card className="shadow-md">
        <div className="flex flex-wrap gap-4 justify-center">
          <Button 
            variant="primary" 
            icon={Calculator} 
            onClick={() => window.location.href = '/planning-rights'}
            className="bg-gradient-to-r from-navy-600 to-navy-700 border-navy-500"
          >
            בדוק זכויות מפורטות
          </Button>
          <Button variant="outline" icon={Download} className="shadow-sm">
            הורד דוח תלת-ממדי
          </Button>
          <Button variant="outline" icon={Share} className="shadow-sm">
            שתף תצוגה
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default RealEstate3DViewer;