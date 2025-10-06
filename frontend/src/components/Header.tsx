import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Info,
  Menu, 
  X, 
  Building, 
  Users, 
  FileText, 
  Crown,
  Home,
  Phone,
  Briefcase,
  Award,
  User,
  Bell,
  Settings,
  LogOut,
  Search,
  ChevronDown,
  ChevronUp,
  Layers,
  HelpCircle,
  BookOpen,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import GlobalSearch from './GlobalSearch';
import toast from 'react-hot-toast'; 

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const domain = import.meta.env.VITE_DOMAIN || 'orbaderech.co.il';

  const isActive = (path: string) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Main navigation items
  const mainNavigation = [
    { 
      path: '/', 
      label: 'דף הבית', 
      icon: Home 
    },
    { 
      path: '/about', 
      label: 'אודות', 
      icon: Award
    },
    {
      path: '/services',
      label: 'שירותים',
      icon: Briefcase
    },
    { 
      path: '/projects', 
      label: 'פרויקטים', 
      icon: Building,
      dropdown: [
        { path: '/projects', label: 'כל הפרויקטים', icon: Building },
        { path: '/tzfat-canaan', label: 'פרויקט צפת - שכונת כנען', icon: Building },
        { path: '/planning-rights', label: 'ניתוח זכויות תכנוניות', icon: FileText }
      ]
    },
    { 
      path: '/contact', 
      label: 'צור קשר', 
      icon: Phone 
    }
  ];

  // User dropdown menu (רק אחרי התחברות)
  const userDropdownItems = [
    { path: '/resident-dashboard', label: 'הפרויקטים שלי', icon: Building, description: 'הפרויקטים שאני מעורב בהם' },
    { path: '/resident-dashboard?tab=communication', label: 'הודעות', icon: FileText, description: 'מרכז ההודעות והתקשורת' },
    { path: '/resident-dashboard?tab=documents', label: 'מסמכים', icon: FileText, description: 'המסמכים שלי' },
    { path: '/resident-dashboard?tab=3d-models', label: 'מודלים תלת-ממדיים', icon: Layers, description: 'צפייה במודלים אינטראקטיביים' },
    { path: '/resident-dashboard?tab=support', label: 'מרכז תמיכה', icon: HelpCircle, description: 'תמיכה ומענה לשאלות' },
    { path: '/resident-dashboard?tab=knowledge', label: 'מרכז ידע', icon: BookOpen, description: 'מידע ומדריכים מקצועיים' },
    { path: '/resident-dashboard?tab=profile', label: 'ניהול אישי', icon: Settings, description: 'הגדרות והפרופיל האישי' }
  ];

  // Admin menu items
  const adminItems = [
    { path: '/admin', label: 'ניהול פרויקטים', icon: Building, description: 'ניהול כל הפרויקטים' },
    { path: '/admin?tab=users', label: 'ניהול משתמשים', icon: Users, description: 'ניהול משתמשי המערכת' },
    { path: '/admin?tab=settings', label: 'הגדרות מערכת', icon: Settings, description: 'הגדרות כלליות' }
  ];

  // Developer menu items
  const developerItems = [
    { path: '/dashboard/developers', label: 'הפרויקטים שלי', icon: Building, description: 'ניהול הפרויקטים שלי' },
    { path: '/dashboard/developers?tab=leads', label: 'פניות', icon: Users, description: 'פניות מדיירים' },
    { path: '/dashboard/developers?tab=profile', label: 'פרופיל עסקי', icon: User, description: 'ניהול הפרופיל העסקי' }
  ];

  // Professional menu items
  const professionalItems = [
    { path: '/dashboard/professionals', label: 'תיק העבודות שלי', icon: FileText, description: 'ניהול תיק העבודות' },
    { path: '/dashboard/professionals?tab=projects', label: 'פרויקטים', icon: Building, description: 'פרויקטים פעילים' },
    { path: '/dashboard/professionals?tab=profile', label: 'פרופיל מקצועי', icon: User, description: 'ניהול הפרופיל המקצועי' }
  ];

  const handleDropdownToggle = (dropdownId: string) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  const handleSignOut = async () => {
    if (isLoggingOut) return; // מניעת לחיצות כפולות

    setIsLoggingOut(true);
    try {
      setActiveDropdown(null); // סגירת התפריט הנפתח

      await signOut();

      // ניקוי נוסף של localStorage במקרה שהפונקציה ב-AuthContext לא עבדה כראוי
      localStorage.removeItem('auth-user');
      localStorage.removeItem('sb-supabase-auth-token');

      // ניווט לדף הבית
      navigate('/', { replace: true });

    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Check if user is admin (simple check for demo)
  const isAdmin = user?.email === 'oravraham217@gmail.com' || user?.role === 'admin';
  const isDeveloper = user?.role === 'developer';
  const isProfessional = user?.role === 'professional';

  // Get user menu items based on user type
  const getUserMenuItems = () => {
    if (isAdmin) return adminItems;
    if (isDeveloper) return developerItems;
    if (isProfessional) return professionalItems;
    return userDropdownItems;
  };

  return (
    <div>
      <header className="bg-white/95 backdrop-blur-lg shadow-md sticky top-0 z-50 border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 space-x-reverse group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-xl flex items-center justify-center shadow-luxury group-hover:shadow-luxury-lg transition-all duration-300">
                  <Crown className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-gold-400 to-warmGold-400 rounded-full"></div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold bg-gradient-to-r from-gold-600 via-warmGold-500 to-gold-700 bg-clip-text text-transparent">
                  אור לדרך
                </div>
                <div className="text-xs text-gold-700 font-medium">שקיפות · ביטחון · תמיכה אנושית</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 space-x-reverse" ref={dropdownRef}>
              {mainNavigation.map((item, index) => {
                const itemId = `nav-${index}`;
                
                if (item.dropdown) {
                  return (
                    <div key={itemId} className="relative">
                      <button
                        onClick={() => handleDropdownToggle(itemId)}
                        className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          activeDropdown === itemId 
                            ? 'text-gold-700 bg-gold-50 border border-gold-200'
                            : 'text-neutral-700 hover:text-gold-600 hover:bg-neutral-50 border border-transparent'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                        {activeDropdown === itemId ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      
                      {activeDropdown === itemId && (
                        <div 
                          className="absolute top-full right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50"
                        >
                          {item.dropdown.map((subItem, subIndex) => (
                            <Link
                              key={`${itemId}-sub-${subIndex}`}
                              to={subItem.path}
                              className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-sm text-neutral-700 hover:bg-gold-50 hover:text-gold-600"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <subItem.icon className="w-4 h-4" />
                              <span>{subItem.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <Link
                    key={itemId}
                    to={item.path}
                    className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'text-gold-600 bg-gold-50'
                        : 'text-neutral-700 hover:text-gold-600 hover:bg-neutral-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Language Switcher */}
              <LanguageSwitcher variant="minimal" className="ml-2" />
              
              {/* Search Button */}
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-neutral-600 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
                aria-label="חיפוש"
              >
                <Search className="w-5 h-5" />
              </button>
            </nav>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-3 space-x-reverse">
              {!user ? (
                /* Before Login - כפתור כניסה פשוט */
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => handleDropdownToggle('login-menu')}
                      className={`flex items-center space-x-2 space-x-reverse px-5 py-2.5 bg-gradient-to-r from-gold-500 to-warmGold-400 text-white rounded-xl hover:shadow-md transition-all duration-300 font-medium shadow-sm border border-gold-400/50 ${
                        activeDropdown === 'login-menu' ? 'shadow-md' : ''
                      }`}
                      aria-label="כניסה למערכת"
                    >
                      <User className="w-4 h-4" />
                      <span className="whitespace-nowrap">כניסה</span>
                      {activeDropdown === 'login-menu' ? (
                        <ChevronUp className="w-4 h-4 mr-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 mr-1" />
                      )}
                    </button>
                    
                    {activeDropdown === 'login-menu' && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-luxury-lg opacity-100 visible border border-neutral-200 overflow-hidden z-50">
                        <div className="py-2">
                          <Link
                            to="/resident-login"
                            className="flex items-center space-x-3 space-x-reverse px-4 py-2 text-sm text-neutral-700 hover:bg-gold-50 hover:text-gold-600"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <User className="w-5 h-5" />
                            <div>
                              <div className="font-medium">כניסת דיירים</div>
                              <div className="text-xs text-neutral-500">כניסה לאזור האישי</div>
                            </div>
                          </Link>
                          <Link
                            to="/register"
                            className="flex items-center space-x-3 space-x-reverse px-4 py-2 text-sm text-neutral-700 hover:bg-gold-50 hover:text-gold-600"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <User className="w-5 h-5" />
                            <div>
                              <div className="font-medium">הרשמה לפרויקט</div>
                              <div className="text-xs text-neutral-500">הרשמה כדייר חדש</div>
                            </div>
                          </Link>
                          <Link
                            to="/login/developers"
                            className="flex items-center space-x-3 space-x-reverse px-4 py-2 text-sm text-neutral-700 hover:bg-gold-50 hover:text-gold-600"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <Building className="w-5 h-5" />
                            <div>
                              <div className="font-medium">כניסת יזמים</div>
                              <div className="text-xs text-neutral-500">כניסה לאזור היזמים</div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* After Login - User Dropdown */
                <div className="relative">
                  <button
                    onClick={() => handleDropdownToggle('user-menu')}
                    className={`flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-lg transition-all duration-200 ${
                      activeDropdown === 'user-menu'
                        ? 'bg-gold-50 text-gold-600'
                        : 'text-neutral-700 hover:bg-neutral-50 hover:text-gold-600'
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{user.full_name || user.email}</span>
                    {activeDropdown === 'user-menu' ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* User Dropdown Menu */}
                  {activeDropdown === 'user-menu' && (
                    <div 
                      className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg opacity-100 visible border border-neutral-200 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-neutral-200">
                        <p className="font-semibold text-neutral-900">{user.full_name || 'משתמש'}</p>
                        <p className="text-sm text-neutral-600">{user.email}</p>
                        <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-100 text-gold-800">
                          {isAdmin ? 'מנהל מערכת' : 
                           isDeveloper ? 'יזם' : 
                           isProfessional ? 'בעל מקצוע' : 'דייר'}
                        </div>
                      </div>
                      
                      <div className="py-2">
                        {getUserMenuItems().map((item, index) => (
                          <div
                            key={item.path}
                          >
                            <Link
                              to={item.path}
                              className="flex items-center space-x-3 space-x-reverse px-4 py-2 text-sm text-neutral-700 hover:bg-gold-50 hover:text-gold-600"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <item.icon className="w-5 h-5" />
                              <div>
                                <div className="font-medium">{item.label}</div>
                                <div className="text-xs text-neutral-500">{item.description}</div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                      
                      {/* Logout */}
                      <div className="border-t border-neutral-200 py-2">
                        <button
                          onClick={handleSignOut}
                          disabled={isLoggingOut}
                          className="flex items-center space-x-3 space-x-reverse w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-70"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>{isLoggingOut ? 'מתנתק...' : 'התנתקות'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2 space-x-reverse">
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-neutral-600 hover:text-gold-600 rounded-lg transition-colors"
                aria-label="חיפוש"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-neutral-600 hover:text-gold-600 rounded-lg transition-colors"
                aria-label={isMobileMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div 
              className="lg:hidden"
              style={{ animation: 'fadeIn 0.3s ease-out' }}
            >
              <div className="px-2 pt-2 pb-6 space-y-1 bg-white border-t border-neutral-200 rounded-b-lg shadow-md">
                  {/* Mobile Navigation Items */}
                  {mainNavigation.map((item, index) => {
                    if (item.dropdown) {
                      return (
                        <div key={`mobile-${index}`} className="space-y-1">
                          <button
                            onClick={() => handleDropdownToggle(`mobile-${index}`)}
                            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                              activeDropdown === `mobile-${index}`
                                ? 'bg-gold-50 text-gold-600'
                                : 'text-neutral-700 hover:bg-neutral-50 hover:text-gold-600'
                            }`}
                          >
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <item.icon className="w-5 h-5" />
                              <span>{item.label}</span>
                            </div>
                            {activeDropdown === `mobile-${index}` ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>
                          
                          {activeDropdown === `mobile-${index}` && (
                            <div 
                              className="pr-6 space-y-1"
                              style={{ animation: 'fadeIn 0.2s ease-out' }}
                            >
                              {item.dropdown.map((subItem, subIndex) => (
                                <Link
                                  key={`mobile-${index}-sub-${subIndex}`}
                                  to={subItem.path}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 hover:text-gold-600"
                                >
                                  <subItem.icon className="w-4 h-4" />
                                  <span>{subItem.label}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }
                    
                    return (
                      <Link
                        key={`mobile-${index}`}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-2 space-x-reverse px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 border ${
                          isActive(item.path)
                            ? 'bg-gold-50 text-gold-700 border-gold-200'
                            : 'text-neutral-700 hover:bg-neutral-50 hover:text-gold-600 border-transparent'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                  
                  {/* Mobile User Section */}
                  <div className="border-t border-neutral-200 pt-4 mt-4">
                    {!user ? (
                      <div>
                        <div className="space-y-2">
                          <Link
                            to="/resident-login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-center space-x-2 space-x-reverse w-full px-4 py-3 bg-gradient-to-r from-gold-500 to-warmGold-400 text-white rounded-xl font-medium shadow-sm border border-gold-400/50"
                          >
                            <User className="w-5 h-5" />
                            <span>כניסת דיירים</span>
                          </Link>
                          <Link
                            to="/register"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-center space-x-2 space-x-reverse w-full px-4 py-3 bg-gradient-to-r from-navy-600 to-navy-700 text-white rounded-xl font-medium shadow-sm"
                          >
                            <User className="w-5 h-5" />
                            <span>הרשמה לפרויקט</span>
                          </Link>
                          <Link
                            to="/login/developers"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-center space-x-2 space-x-reverse w-full px-4 py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-xl font-medium shadow-sm"
                          >
                            <Building className="w-5 h-5" />
                            <span>כניסת יזמים</span>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="px-4 py-2">
                          <div className="font-semibold text-neutral-900">{user.full_name || 'משתמש'}</div>
                          <div className="text-sm text-neutral-600">{user.email}</div>
                          <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-100 text-gold-800">
                            {isAdmin ? 'מנהל מערכת' : 
                             isDeveloper ? 'יזם' : 
                             isProfessional ? 'בעל מקצוע' : 'דייר'}
                          </div>
                        </div>
                        
                        <div className="border-t border-neutral-200 pt-2">
                          {getUserMenuItems().map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center space-x-3 space-x-reverse px-4 py-2 text-sm text-neutral-700 hover:bg-gold-50 hover:text-gold-600"
                            >
                              <item.icon className="w-5 h-5" />
                              <div>
                                <div className="font-medium">{item.label}</div>
                                <div className="text-xs text-neutral-500">{item.description}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        
                        <div className="border-t border-neutral-200 pt-2">
                          <button
                            onClick={handleSignOut}
                            disabled={isLoggingOut}
                            className="flex items-center space-x-3 space-x-reverse w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-70"
                          >
                            <LogOut className="w-5 h-5" />
                            <span>{isLoggingOut ? 'מתנתק...' : 'התנתקות'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
      </header>
      
      {/* Global Search Modal */}
      <GlobalSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </div>
  );
};

export default Header;