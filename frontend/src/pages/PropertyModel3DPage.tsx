import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Building, Search, MapPin, Calculator, Info } from 'lucide-react';
import { Card, Button, Badge, Input, LoadingSpinner } from '../components/ui';
import toast from 'react-hot-toast';
import RealEstate3DViewer from '../components/3D/RealEstate3DViewer';

const PropertyModel3DPage = () => {
  const { propertyId } = useParams();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'address' | 'block_plot'>('address');
  const [blockInput, setBlockInput] = useState('');
  const [plotInput, setPlotInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize search query from URL parameters
    const addressParam = searchParams.get('address');
    if (addressParam) {
      setSearchQuery(addressParam);
    }
  }, [searchParams]);

  const handleSearch = () => {
    setLoading(true);
    if (searchType === 'address' && searchQuery.trim()) {
      // עדכון ה-URL עם הכתובת החדשה
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('address', searchQuery);
      window.history.replaceState({}, '', `${window.location.pathname}?${newSearchParams.toString()}`);
      
      // אירוע לעדכון התצוגה התלת-ממדית
      const event = new Event('searchUpdated');
      window.dispatchEvent(event);
      
      // הודעת הצלחה
      toast.success('הכתובת נטענה בהצלחה (מצב דמו)');
    } else if (searchType === 'block_plot' && blockInput && plotInput) {
      // עדכון ה-URL עם הגוש והחלקה
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('block', blockInput);
      newSearchParams.set('plot', plotInput);
      window.history.replaceState({}, '', `${window.location.pathname}?${newSearchParams.toString()}`);
      
      // אירוע לעדכון התצוגה התלת-ממדית
      const event = new Event('searchUpdated');
      window.dispatchEvent(event);
      
      // הודעת הצלחה
      toast.success('גוש וחלקה נטענו בהצלחה (מצב דמו)');
    } else {
      toast.error('יש להזין כתובת או גוש וחלקה (מצב דמו)');
      setLoading(false);
      return;
    }
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-neutral-200">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link 
                to="/" 
                className="p-2 text-neutral-500 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-navy-600 to-navy-700 rounded-xl flex items-center justify-center shadow-luxury">
                <Building className="w-6 h-6 text-white" /> 
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-800">תצוגת נכס תלת-ממדית</h1>
                <p className="text-neutral-600">מפות אמיתיות ממקורות ממשלתיים</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Badge variant="success">נתונים אמיתיים</Badge>
              <Badge variant="primary">Google Maps</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Search Interface */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-6">
          <Card className="shadow-md">
            <h3 className="text-lg font-semibold text-neutral-800 mb-6">חיפוש נכס לתצוגה תלת-ממדית</h3>
            
            {/* Search Type Toggle */}
            <div className="flex justify-center space-x-4 space-x-reverse mb-8">
              <div className="bg-neutral-100 p-1 rounded-xl shadow-sm border border-neutral-200 flex">
                <button
                  onClick={() => setSearchType('address')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    searchType === 'address' 
                      ? 'bg-navy-600 text-white shadow-sm' 
                      : 'bg-transparent text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  חיפוש לפי כתובת
                </button>
                <button
                  onClick={() => setSearchType('block_plot')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    searchType === 'block_plot' 
                      ? 'bg-navy-600 text-white shadow-sm' 
                      : 'bg-transparent text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  חיפוש לפי גוש/חלקה
                </button>
              </div>
            </div>

            {/* Search Input */}
            {searchType === 'address' ? (
              <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    aria-label="חיפוש כתובת"
                    type="text"
                    placeholder="הכנס כתובת מלאה..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-12 pl-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={handleSearch} 
                  icon={MapPin}
                  className="bg-gradient-to-r from-navy-600 to-navy-700 border-navy-500"
                >
                  הצג במפה תלת-ממדית
                </Button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <input
                    aria-label="מספר גוש"
                    type="text"
                    placeholder="מספר גוש"
                    value={blockInput}
                    onChange={(e) => setBlockInput(e.target.value)}
                    className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="relative flex-1">
                  <input
                    aria-label="מספר חלקה"
                    type="text"
                    placeholder="מספר חלקה"
                    value={plotInput}
                    onChange={(e) => setPlotInput(e.target.value)}
                    className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-navy-600 to-navy-700 border-navy-500"
                  icon={MapPin}
                >
                  הצג במפה
                </Button>
              </div>
            )}

            {/* Quick Examples */}
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600 mb-3">דוגמאות לחיפוש:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button 
                  onClick={() => {
                    setSearchQuery('רחוב דיזנגוף 123, תל אביב');
                    setSearchType('address');
                    setTimeout(handleSearch, 100);
                  }}
                  className="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-full text-sm hover:bg-neutral-200 transition-colors border border-neutral-200/50"
                >
                  רחוב דיזנגוף 123, תל אביב
                </button>
                <button
                  onClick={() => {
                    setSearchQuery('רחוב הרצל 45, תל אביב');
                    setSearchType('address');
                    setTimeout(handleSearch, 100);
                  }}
                  className="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-full text-sm hover:bg-neutral-200 transition-colors border border-neutral-200/50"
                >
                  רחוב הרצל 45, תל אביב
                </button>
                <button
                  onClick={() => {
                    setBlockInput('6304');
                    setPlotInput('15');
                    setSearchType('block_plot');
                    setTimeout(handleSearch, 100);
                  }}
                  className="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-full text-sm hover:bg-neutral-200 transition-colors border border-neutral-200/50"
                >
                  גוש 6304 חלקה 15
                </button>
                <button
                  onClick={() => {
                    setSearchQuery('רחוב ירושלים 8, צפת');
                    setSearchType('address');
                    setTimeout(handleSearch, 100);
                  }}
                  className="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-full text-sm hover:bg-neutral-200 transition-colors border border-neutral-200/50"
                >
                  רחוב ירושלים 8, צפת
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" color="primary" text="טוען מודל תלת-ממדי..." centered />
          </div>
        ) : (
        <RealEstate3DViewer 
          searchQuery={searchQuery || searchParams.get('address') || ''}
          className="max-w-7xl mx-auto"
        />
        )}

        {/* Integration Notice */}
        <Card className="mt-10 max-w-4xl mx-auto shadow-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gradient-to-br from-navy-600 to-navy-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">רוצה ניתוח מפורט יותר?</h3>
            <p className="text-neutral-600 mb-6">
              השתמש במודול בדיקת הזכויות התכנוניות לקבלת ניתוח מקיף ומפורט
            </p>
            <Link to="/planning-rights">
              <Button variant="primary" icon={Calculator} className="bg-gradient-to-r from-navy-600 to-navy-700 border-navy-500">
                בדוק זכויות תכנוניות מפורטות
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PropertyModel3DPage;