import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, Building, FileText, MapPin, Eye, EyeOff, ArrowLeft, Sparkles, Shield, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, isConfigured, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    idNumber: '',
    companyName: '',
    licenseNumber: '',
    cityName: '',
    agreeToTerms: false
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || `/dashboard/${user.user_type}`;
      navigate(from, { replace: true });
    }
  }, [user, navigate, location.state]);

  const userTypeConfig = {
    residents: {
      title: 'דיירים',
      icon: Users,
      description: 'כניסה לאזור הדיירים',
      gradient: 'from-gold-500 to-warmGold-400',
      bgGradient: 'from-gold-50 to-cream-50',
      fields: ['email', 'password', 'firstName', 'lastName', 'phone', 'idNumber']
    },
    developers: {
      title: 'יזמים',
      icon: Building,
      description: 'כניסה לאזור היזמים',
      gradient: 'from-gold-600 to-warmGold-500',
      bgGradient: 'from-gold-50 to-cream-50',
      fields: ['email', 'password', 'firstName', 'lastName', 'companyName', 'phone']
    },
    professionals: {
      title: 'בעלי מקצוע',
      icon: FileText,
      description: 'כניסה לאזור בעלי המקצוע',
      gradient: 'from-gold-500 to-warmGold-600',
      bgGradient: 'from-gold-50 to-cream-50',
      fields: ['email', 'password', 'firstName', 'lastName', 'phone', 'licenseNumber']
    },
    authorities: {
      title: 'רשויות מקומיות',
      icon: MapPin,
      description: 'כניסה לאזור הרשויות',
      gradient: 'from-warmGold-600 to-gold-700',
      bgGradient: 'from-warmGold-50 to-cream-50',
      fields: ['email', 'password', 'firstName', 'lastName', 'cityName', 'phone']
    }
  };

  const config = userTypeConfig[userType as keyof typeof userTypeConfig];

  if (!config) {
    return <div>סוג משתמש לא נמצא</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check if this is admin login
    const isAdminEmail = formData.email.includes('admin');
    const isAdminId = formData.idNumber === '123456789'; 
    const isAdmin = isAdminEmail || isAdminId;

    // Use default password if empty
    const actualPassword = formData.password || 'demo123';

    try {
      if (isLogin) {
        await signIn(formData.email, actualPassword);
        // Navigate to the redirect URL or default dashboard
        
        // Check if user is admin
        if (isAdmin) {
          navigate('/admin', { replace: true });
        } else {
          const from = location.state?.from?.pathname || `/dashboard/${userType}`;
          navigate(from, { replace: true });
        }
        if (isAdmin) {
          navigate('/admin', { replace: true });
        } else {
          const from = location.state?.from?.pathname || `/dashboard/${userType}`;
          navigate(from, { replace: true });
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error('הסיסמאות אינן תואמות');
          setLoading(false);
          return;
        }

        // Combine first and last name
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();

        // Map user_type to role for the existing users table
        const role = userType === 'residents' ? 'resident' : 
                    userType === 'developers' ? 'developer' : 
                    userType === 'professionals' ? 'professional' : 
                    userType === 'authorities' ? 'admin' : userType;

        const userData = {
          role: role, // Using role instead of user_type
          full_name: fullName,
          phone: formData.phone,
          id_number: formData.idNumber,
          company_name: formData.companyName,
          license_number: formData.licenseNumber,
          city_name: formData.cityName,
        };

        await signUp(formData.email, formData.password, userData);
        // After signup, navigate to the appropriate dashboard
        navigate(`/dashboard/${userType}`, { replace: true });
      }
    } catch (error) {
      // Error is already handled in auth context
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} py-12 relative overflow-hidden`}>
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-gold-200 to-warmGold-300 rounded-full opacity-20 animate-bounce-gentle"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-warmGold-200 to-gold-300 rounded-full opacity-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-md mx-auto">
          {/* Development Notice */}
          {!isConfigured && (
            <div className="bg-gradient-to-r from-gold-100 to-warmGold-100 border border-gold-300 rounded-xl p-4 mb-6 shadow-luxury">
              <div className="text-neutral-800 text-sm text-center flex items-center justify-center space-x-2 space-x-reverse">
                <Shield className="w-4 h-4" />
                <span>🔧 מצב פיתוח: ניתן להתחבר עם כל אימייל וסיסמה</span>
              </div>
            </div>
          )}

          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 space-x-reverse text-neutral-600 hover:text-gold-600 mb-8 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <span className="font-medium">חזרה לדף הבית</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-20 h-20 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-luxury`}>
              <config.icon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-3">
              {isLogin ? 'כניסה' : 'הרשמה'} - {config.title}
            </h1>
            <p className="text-neutral-700 text-lg">
              {config.description}
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-luxury-lg p-8 border border-cream-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                  אימייל *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white"
                  placeholder="example@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                  סיסמה *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 pl-12 bg-neutral-50 focus:bg-white"
                    placeholder="הכנס סיסמה"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-gold-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  * סיסמת מנהל: <strong>a770770a</strong>, <strong>admin</strong>, <strong>770770</strong> או <strong>77770</strong>
                  <br/>* ניתן גם להשאיר את שדה הסיסמה ריק
                </div>
              </div>

              {/* Registration Fields */}
              {!isLogin && (
                <>
                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                      אימות סיסמה *
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white"
                      placeholder="הכנס סיסמה שוב"
                    />
                  </div>

                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">
                      שם פרטי *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white"
                      placeholder="הכנס שם פרטי"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">
                      שם משפחה *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white"
                      placeholder="הכנס שם משפחה"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                      טלפון
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white"
                      placeholder="050-1234567"
                    />
                  </div>

                  {/* Dynamic Fields Based on User Type */}
                  {userType === 'residents' && (
                    <div>
                      <label htmlFor="idNumber" className="block text-sm font-medium text-neutral-700 mb-2">
                        מספר תעודת זהות
                      </label>
                      <input
                        type="text"
                        id="idNumber"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white"
                        placeholder="הכנס מספר ת.ז"
                      />
                    </div>
                  )}

                  {userType === 'developers' && (
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-neutral-700 mb-2">
                        שם החברה *
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white"
                        placeholder="הכנס שם חברה"
                      />
                    </div>
                  )}

                  {userType === 'professionals' && (
                    <div>
                      <label htmlFor="licenseNumber" className="block text-sm font-medium text-neutral-700 mb-2">
                        מספר רישיון
                      </label>
                      <input
                        type="text"
                        id="licenseNumber"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white"
                        placeholder="הכנס מספר רישיון (אם יש)"
                      />
                    </div>
                  )}

                  {userType === 'authorities' && (
                    <div>
                      <label htmlFor="cityName" className="block text-sm font-medium text-neutral-700 mb-2">
                        שם הרשות המקומית *
                      </label>
                      <input
                        type="text"
                        id="cityName"
                        name="cityName"
                        value={formData.cityName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white"
                        placeholder="הכנס שם רשות מקומית"
                      />
                    </div>
                  )}

                  {/* Terms Agreement */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      required
                      className="ml-2 h-4 w-4 text-gold-600 focus:ring-gold-500 border-cream-300 rounded"
                    />
                    <label htmlFor="agreeToTerms" className="text-sm text-neutral-700">
                      אני מסכים ל
                      <a href="#" className="text-gold-600 hover:text-gold-500 font-medium">תנאי השימוש</a>
                      {' '}ו
                      <a href="#" className="text-gold-600 hover:text-gold-500 font-medium">מדיניות הפרטיות</a>
                    </label>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 bg-gradient-to-r ${config.gradient} text-white rounded-xl hover:shadow-luxury-lg transition-all duration-300 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isLogin ? 'מתחבר...' : 'נרשם...'}
                  </div>
                ) : (
                  isLogin ? 'התחבר' : 'הרשם'
                )}
              </button>
            </form>

            {/* Toggle Login/Register */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-neutral-600 hover:text-gold-600 transition-colors duration-200 font-medium"
              >
                {isLogin ? 'אין לך חשבון? הרשם כאן' : 'יש לך חשבון? התחבר כאן'}
              </button>
            </div>

            {/* Forgot Password */}
            {isLogin && (
              <div className="mt-4 text-center">
                <a href="#" className="text-sm text-gold-600 hover:text-gold-500 transition-colors duration-200 font-medium">
                  שכחת סיסמה?
                </a>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="mt-8 bg-white rounded-2xl shadow-luxury p-6 border border-cream-200">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center space-x-2 space-x-reverse">
              <Sparkles className="w-5 h-5 text-gold-500" />
              <span>מה תקבל כ{config.title.slice(0, -1)}?</span>
            </h3>
            <ul className="space-y-3 text-sm text-neutral-600">
              {userType === 'residents' && (
                <>
                  <li className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span>מעקב אישי אחר הפרויקט</span>
                  </li>
                  <li className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span>ניהול מסמכים דיגיטלי</span>
                  </li>
                  <li className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span>מערכת הצבעות מתקדמת</span>
                  </li>
                  <li className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span>הודעות ועדכונים</span>
                  </li>
                </>
              )}
              {userType === 'developers' && (
                <>
                  <li className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span>פרופיל עסקי מתקדם</span>
                  </li>
                  <li className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span>קבלת פניות איכותיות</span>
                  </li>
                  <li className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span>מערכת ניהול פרויקטים</span>
                  </li>
                  <li className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span>דוחות וניתוחים</span>
                  </li>
                </>
              )}
              {userType === 'professionals' && (
                <>
                  <li className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span>הצגת תיק עבודות</span>
                  </li>
                  <li className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span>חיבור לפרויקטים</span>
                  </li>
                  <li className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span>ניהול לקוחות</span>
                  </li>
                  <li className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span>דירוגים וחוות דעת</span>
                  </li>
                </>
              )}
              {userType === 'authorities' && (
                <>
                  <li className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span>צפייה בפרויקטים לפי עיר</span>
                  </li>
                  <li className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span>חתימות דיגיטליות</span>
                  </li>
                  <li className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span>מעקב התקדמות</span>
                  </li>
                  <li className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span>דוחות מפורטים</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;