import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Building, FileText, Users, MapPin, ArrowLeft, Clock, Star, CheckCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Button } from './ui';

interface SearchResult {
  id: string;
  title: string;
  type: 'project' | 'service' | 'page' | 'property' | 'document';
  description: string;
  url: string;
  icon: React.ComponentType<any>;
  meta?: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Mock search results
  const mockResults = [
    {
      id: '1',
      title: 'פרויקט התחדשות נווה שאנן',
      type: 'project',
      description: 'פרויקט התחדשות עירונית בתל אביב',
      url: '/projects',
      icon: Building,
      meta: 'תל אביב • 75% התקדמות'
    },
    {
      id: '2',
      title: 'פרויקט התחדשות שכונת כנען',
      type: 'project',
      description: 'פרויקט התחדשות עירונית בצפת',
      url: '/tzfat-canaan',
      icon: Building,
      meta: 'צפת • 35% התקדמות'
    },
    {
      id: '3',
      title: 'ניתוח זכויות תכנוניות',
      type: 'service',
      description: 'בדיקת זכויות בנייה מתקדמת',
      url: '/planning-rights',
      icon: FileText,
      meta: 'שירות מקצועי'
    },
    {
      id: '4',
      title: 'שירותי דיירים',
      type: 'service',
      description: 'פתרונות מתקדמים לדיירים',
      url: '/services',
      icon: Users,
      meta: '15,000+ דיירים מרוצים'
    },
    {
      id: '5',
      title: 'רחוב הרצל 45, תל אביב',
      type: 'property',
      description: 'נכס עם פוטנציאל התחדשות גבוה',
      url: '/planning-rights',
      icon: MapPin,
      meta: 'גוש 6304 חלקה 15'
    },
    {
      id: '6',
      title: 'תכנית אדריכלית מעודכנת',
      type: 'document',
      description: 'תכנית אדריכלית לפרויקט צפת',
      url: '/resident-dashboard?tab=documents',
      icon: FileText,
      meta: 'עודכן לפני 3 ימים'
    }
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (error) {
        console.error('Error parsing recent searches:', error);
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updatedSearches = [
      query,
      ...recentSearches.filter(s => s !== query)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const filtered = mockResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
      
      // Save to recent searches
      if (searchQuery.trim().length > 2) {
        saveRecentSearch(searchQuery);
      }
    }, 300);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'project': return 'פרויקט';
      case 'service': return 'שירות';
      case 'page': return 'עמוד';
      case 'property': return 'נכס';
      case 'document': return 'מסמך';
      default: return '';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-blue-100 text-blue-700';
      case 'service': return 'bg-gold-100 text-gold-700';
      case 'page': return 'bg-neutral-100 text-neutral-700';
      case 'property': return 'bg-warmGold-100 text-warmGold-700';
      case 'document': return 'bg-green-100 text-green-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 pt-20 px-4"
        >
          <div 
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl border border-neutral-200 overflow-hidden"
          >
            {/* Search Header */}
            <div className="p-4 border-b border-neutral-200">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="חפש פרויקטים, שירותים, כתובות..."
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pr-11 pl-11 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-base"
                />
                <button
                  onClick={onClose}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-[calc(90vh-8rem)] overflow-y-auto">
              {loading && (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-neutral-600">מחפש...</p>
                </div>
              )}

              {!loading && query.length >= 2 && results.length === 0 && (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-700 mb-2">לא נמצאו תוצאות</h3>
                  <p className="text-neutral-600">נסה לחפש במילים אחרות</p>
                </div>
              )}

              {!loading && query.length < 2 && (
                <div className="p-4">
                  {recentSearches.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-neutral-500 mb-2">חיפושים אחרונים</h3>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearch(search)}
                            className="flex items-center space-x-1 space-x-reverse px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm transition-colors"
                          >
                            <Clock className="w-3.5 h-3.5 text-neutral-500" />
                            <span>{search}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <h3 className="text-sm font-medium text-neutral-500 mb-2">חיפושים פופולריים</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSearch('פרויקט צפת')}
                      className="flex items-center space-x-1 space-x-reverse px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 text-gold-500" />
                      <span>פרויקט צפת</span>
                    </button>
                    <button
                      onClick={() => handleSearch('זכויות תכנוניות')}
                      className="flex items-center space-x-1 space-x-reverse px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 text-gold-500" />
                      <span>זכויות תכנוניות</span>
                    </button>
                    <button
                      onClick={() => handleSearch('תל אביב')}
                      className="flex items-center space-x-1 space-x-reverse px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 text-gold-500" />
                      <span>תל אביב</span>
                    </button>
                  </div>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="divide-y divide-neutral-200">
                  {results.map((result, index) => (
                    <div
                      key={result.id}
                      className="transition-all duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Link
                        to={result.url}
                        onClick={onClose}
                        className="flex items-center p-4 hover:bg-neutral-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mr-4">
                          <result.icon className="w-5 h-5 text-neutral-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 space-x-reverse mb-1">
                            <h4 className="font-medium text-neutral-900 truncate">{result.title}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}>
                              {getTypeLabel(result.type)}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-600 line-clamp-1">{result.description}</p>
                          {result.meta && (
                            <p className="text-xs text-neutral-500 mt-0.5">{result.meta}</p>
                          )}
                        </div>
                        <ArrowLeft className="w-4 h-4 text-neutral-400 ml-2" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50">
              <div className="text-xs text-neutral-600 mb-3 font-medium">פעולות מהירות:</div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/planning-rights"
                  onClick={onClose}
                  className="flex items-center space-x-1 space-x-reverse px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-700 hover:border-gold-300 hover:text-gold-600 transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>ניתוח זכויות תכנוניות</span>
                </Link>
                <Link
                  to="/projects"
                  onClick={onClose}
                  className="flex items-center space-x-1 space-x-reverse px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-700 hover:border-gold-300 hover:text-gold-600 transition-colors"
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>פרויקטים פעילים</span>
                </Link>
                <Link
                  to="/contact"
                  onClick={onClose}
                  className="flex items-center space-x-1 space-x-reverse px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-700 hover:border-gold-300 hover:text-gold-600 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>צור קשר</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;