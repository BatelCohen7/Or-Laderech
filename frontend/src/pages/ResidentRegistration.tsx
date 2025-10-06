import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Phone, 
  Mail, 
  Building, 
  Home,
  CheckCircle,
  AlertTriangle,
  Info,
  Shield
} from 'lucide-react';
import { Card, Button, Input, Badge } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { validateField, validateIsraeliId, validateFormData } from '../utils/validation';
import toast from 'react-hot-toast';

const ResidentRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    phone: '',
    email: '',
    building: '',
    apartment: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [isCheckingResident, setIsCheckingResident] = useState(false);
  const [residentFound, setResidentFound] = useState<boolean | null>(null);
  const [residentData, setResidentData] = useState<any>(null);
  const [buildings, setBuildings] = useState<string[]>([
    'זלמן שזר 1',
    'זלמן שזר 3',
    'זלמן שזר 5',
    'השבעה 2',
    'השבעה 4',
    'השבעה 6'
  ]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({});

  // בדיקה אם מספר הזהות קיים במערכת - מצב דמו
  const checkResidentExists = async (id: string) => {
    if (!id || id.length < 5) return;
    
    setIsCheckingResident(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Validate ID number format first
      if (id.length === 9 && /^\d+$/.test(id) && validateIsraeliId(id)) {
        // For demo purposes, we'll just check if the ID is 123456789 (admin) or ends with 1, 2, or 3
        if (id === '123456789') {
          setResidentFound(true);
          setResidentData({
            full_name: 'מנהל מערכת',
            phone: '050-1234567',
            building: 'זלמן שזר 1',
            apartment: '1'
          });
          toast.success('נמצא מנהל מערכת (מצב דמו)');
        } else {
          const lastDigit = id.charAt(id.length - 1);
          const found = ['1', '2', '3'].includes(lastDigit);
          setResidentFound(found);
          
          if (found) {
            setResidentData({
              full_name: `דייר לדוגמה ${lastDigit}`,
              phone: `050-${1000000 + parseInt(lastDigit)}`,
              building: lastDigit === '1' ? 'זלמן שזר 1' : lastDigit === '2' ? 'זלמן שזר 3' : 'השבעה 2',
              apartment: lastDigit + '5'
            });
            toast.success('נמצא דייר במערכת (מצב דמו)');
          }
        }
      } else {
        setResidentFound(false);
      }
    } catch (error) {
      console.error('Error checking resident:', error);
      setResidentFound(false);
    } finally {
      setIsCheckingResident(false);
    }
  };

  // בדיקת מספר הזהות כשהוא משתנה
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.idNumber.length >= 5) {
        checkResidentExists(formData.idNumber);
      } else {
        setResidentFound(null);
        setResidentData(null);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [formData.idNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Mark field as touched
    setFormTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field if it's been touched
    if (formTouched[name]) {
      let error = '';
      if (name === 'confirmPassword') {
        error = validateField(name, value, formData.password);
      } else {
        error = validateField(name, value);
      }
      setFormErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setFormTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field
    let error = '';
    if (name === 'confirmPassword') {
      error = validateField(name, value, formData.password);
    } else {
      error = validateField(name, value);
    }
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    
    // Validate fullName
    const fullNameError = validateField('full_name', formData.fullName);
    if (fullNameError) {
      errors.fullName = fullNameError;
    }
    
    // Validate idNumber
    const idNumberError = validateField('id_number', formData.idNumber);
    if (idNumberError) {
      errors.idNumber = idNumberError;
    }
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setError('נא למלא את כל שדות החובה בצורה תקינה');
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    
    // Validate building
    if (!formData.building) {
      errors.building = 'נא לבחור בניין';
    }
    
    // Validate apartment (optional but if provided should be valid)
    if (formData.apartment && !/^\d+$/.test(formData.apartment)) {
      errors.apartment = 'מספר דירה חייב להיות מספר';
    }
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setError('נא לתקן את השגיאות בטופס');
      return false;
    }
    
    return true;
  };

  const validateStep3 = () => {
    const errors: Record<string, string> = {};
    
    // Validate password
    const passwordError = validateField('password', formData.password);
    if (passwordError) {
      errors.password = passwordError;
    }
    
    // Validate confirmPassword
    const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword, formData.password);
    if (confirmPasswordError) {
      errors.confirmPassword = confirmPasswordError;
    }
    
    // Validate terms
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'יש לאשר את תנאי השימוש';
    }
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setError('נא לתקן את השגיאות בטופס');
      return false;
    }
    
    return true;
  };

  const nextStep = () => {
    setError('');
    
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateStep3()) {
      return;
    }

    setLoading(true);
    
    try {
      // Demo mode - simulate registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a mock user
      const mockUser = {
        id: Date.now().toString(),
        email: formData.email || `${formData.idNumber}@example.com`,
        role: 'resident',
        full_name: formData.fullName,
        phone: formData.phone,
        id_number: formData.idNumber,
        user_type: 'residents'
      };
      
      // Save to localStorage for demo purposes
      localStorage.setItem('auth-user', JSON.stringify(mockUser));
      
      toast.success('נרשמת בהצלחה! (מצב דמו)');
      navigate('/resident-login');
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'שגיאה בהרשמה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-warmGold-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center space-x-2 space-x-reverse text-neutral-600 hover:text-gold-600 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <span className="font-medium">חזרה</span>
            </button>
          </div>

          {/* Registration Card */}
          <Card>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-luxury">
                <Building className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-3">
                הרשמה לפרויקט צפת - שכונת כנען
              </h1>
              <p className="text-neutral-700 text-lg">
                הרשם כדי לקבל עדכונים ולעקוב אחר התקדמות הפרויקט
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${
                  step >= 1 ? 'bg-gold-500 text-white' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  1
                </div>
                <div className="text-xs text-center mt-2">פרטים אישיים</div>
              </div>
              <div className={`flex-1 h-1 ${step >= 2 ? 'bg-gold-500' : 'bg-neutral-200'}`}></div>
              <div className="flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${
                  step >= 2 ? 'bg-gold-500 text-white' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  2
                </div>
                <div className="text-xs text-center mt-2">פרטי נכס</div>
              </div>
              <div className={`flex-1 h-1 ${step >= 3 ? 'bg-gold-500' : 'bg-neutral-200'}`}></div>
              <div className="flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${
                  step >= 3 ? 'bg-gold-500 text-white' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  3
                </div>
                <div className="text-xs text-center mt-2">יצירת חשבון</div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-2 space-x-reverse text-red-700">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Details */}
              {step === 1 && (
                <>
                  <div>
                    <label htmlFor="idNumber" className="block text-sm font-medium text-neutral-700 mb-2">
                      מספר תעודת זהות *
                      {formTouched.idNumber && formErrors.idNumber && (
                        <span className="text-red-500 mr-1 text-xs">{formErrors.idNumber}</span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="idNumber"
                        name="idNumber"
                        placeholder="הכנס מספר ת.ז (9 ספרות)"
                        value={formData.idNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white ${
                          formTouched.idNumber && formErrors.idNumber
                            ? 'border-red-300 focus:ring-red-500'
                            : residentFound === true 
                              ? 'border-green-300 focus:ring-green-500' 
                              : residentFound === false 
                                ? 'border-yellow-300 focus:ring-yellow-500'
                                : 'border-warmGold-300 focus:ring-gold-500'
                        }`}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <User className="w-5 h-5 text-neutral-400" />
                      </div>
                      {isCheckingResident && (
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-gold-500 border-t-transparent"></div>
                        </div>
                      )}
                      {!isCheckingResident && residentFound !== null && (
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          {residentFound ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Info className="w-5 h-5 text-yellow-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {residentFound === true && (
                      <p className="text-sm text-green-600 mt-1">
                        נמצא דייר במערכת. הפרטים ימולאו אוטומטית.
                      </p>
                    )}
                    {residentFound === false && (
                      <p className="text-sm text-yellow-600 mt-1">
                        דייר חדש - יש למלא את כל הפרטים
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-2">
                      שם מלא *
                      {formTouched.fullName && formErrors.fullName && (
                        <span className="text-red-500 mr-1 text-xs">{formErrors.fullName}</span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder="הכנס שם מלא"
                        value={formData.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white ${
                          formTouched.fullName && formErrors.fullName
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-warmGold-300 focus:ring-gold-500'
                        }`}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <User className="w-5 h-5 text-neutral-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                      טלפון *
                      {formTouched.phone && formErrors.phone && (
                        <span className="text-red-500 mr-1 text-xs">{formErrors.phone}</span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="הכנס מספר טלפון"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white ${
                          formTouched.phone && formErrors.phone
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-warmGold-300 focus:ring-gold-500'
                        }`}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <Phone className="w-5 h-5 text-neutral-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                      אימייל
                      {formTouched.email && formErrors.email && (
                        <span className="text-red-500 mr-1 text-xs">{formErrors.email}</span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="הכנס כתובת אימייל"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white ${
                          formTouched.email && formErrors.email
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-warmGold-300 focus:ring-gold-500'
                        }`}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <Mail className="w-5 h-5 text-neutral-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-1">אימות פרטים</h4>
                        <p className="text-blue-700 text-sm">
                          הפרטים שתזין יאומתו מול רשימת הדיירים בפרויקט. רק דיירים רשומים יוכלו להירשם.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Property Details */}
              {step === 2 && (
                <>
                  <div>
                    <label htmlFor="building" className="block text-sm font-medium text-neutral-700 mb-2">
                      בניין *
                      {formTouched.building && formErrors.building && (
                        <span className="text-red-500 mr-1 text-xs">{formErrors.building}</span>
                      )}
                    </label>
                    <select
                      id="building"
                      name="building"
                      value={formData.building}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white ${
                        formTouched.building && formErrors.building
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-cream-300 focus:ring-gold-500'
                      }`}
                      required
                    >
                      <option value="">בחר בניין</option>
                      {buildings.map(building => (
                        <option key={building} value={building}>{building}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="apartment" className="block text-sm font-medium text-neutral-700 mb-2">
                      מספר דירה
                      {formTouched.apartment && formErrors.apartment && (
                        <span className="text-red-500 mr-1 text-xs">{formErrors.apartment}</span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="apartment"
                        name="apartment"
                        placeholder="הכנס מספר דירה"
                        value={formData.apartment}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white ${
                          formTouched.apartment && formErrors.apartment
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-cream-300 focus:ring-gold-500'
                        }`}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <Home className="w-5 h-5 text-neutral-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800 mb-1">חשוב לדעת</h4>
                        <p className="text-yellow-700 text-sm">
                          וודא שהפרטים שהזנת תואמים את הפרטים הרשומים בטאבו. אי התאמה עלולה לעכב את תהליך האימות.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: Account Creation */}
              {step === 3 && (
                <>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                      סיסמה *
                      {formTouched.password && formErrors.password && (
                        <span className="text-red-500 mr-1 text-xs">{formErrors.password}</span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full px-4 py-3 pr-12 pl-12 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white ${
                          formTouched.password && formErrors.password
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-cream-300 focus:ring-gold-500'
                        }`}
                        placeholder="הכנס סיסמה (לפחות 6 תווים)"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <Lock className="w-5 h-5 text-neutral-400" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-gold-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formTouched.password && !formErrors.password && formData.password && (
                      <p className="text-xs text-green-600 mt-1">
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                        הסיסמה תקינה
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                      אימות סיסמה *
                      {formTouched.confirmPassword && formErrors.confirmPassword && (
                        <span className="text-red-500 mr-1 text-xs">{formErrors.confirmPassword}</span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full px-4 py-3 pr-12 pl-12 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white ${
                          formTouched.confirmPassword && formErrors.confirmPassword
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-cream-300 focus:ring-gold-500'
                        }`}
                        placeholder="הכנס סיסמה שוב"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <Lock className="w-5 h-5 text-neutral-400" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-gold-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formTouched.confirmPassword && !formErrors.confirmPassword && formData.confirmPassword && (
                      <p className="text-xs text-green-600 mt-1">
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                        הסיסמאות תואמות
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      required
                      className={`ml-2 h-4 w-4 focus:ring-gold-500 border-cream-300 rounded ${
                        formTouched.agreeToTerms && formErrors.agreeToTerms
                          ? 'border-red-300 focus:ring-red-500'
                          : 'text-gold-600'
                      }`}
                    />
                    <label htmlFor="agreeToTerms" className="text-sm text-neutral-700">
                      אני מסכים ל
                      <a href="#" className="text-gold-600 hover:text-gold-500 font-medium mx-1">תנאי השימוש</a>
                      ו
                      <a href="#" className="text-gold-600 hover:text-gold-500 font-medium mr-1">מדיניות הפרטיות</a>
                    </label>
                  </div>
                  {formTouched.agreeToTerms && formErrors.agreeToTerms && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.agreeToTerms}</p>
                  )}
                  
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-1">כמעט סיימנו!</h4>
                        <p className="text-green-700 text-sm">
                          לאחר ההרשמה, תוכל להתחבר למערכת ולצפות בכל המידע הרלוונטי לפרויקט ההתחדשות העירונית בשכונת כנען.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex space-x-4 space-x-reverse pt-4">
                {step === 3 ? (
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? 'מבצע רישום...' : 'סיים הרשמה'}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    className="flex-1"
                    onClick={nextStep}
                  >
                    המשך
                  </Button>
                )}
                
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={prevStep}
                  >
                    חזור
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-cream-200">
              <div className="text-center">
                <p className="text-neutral-700 mb-4">כבר רשום?</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/resident-login')}
                >
                  התחבר
                </Button>
              </div>
            </div>
          </Card>

          {/* Project Info */}
          <Card className="mt-8">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center space-x-2 space-x-reverse">
              <CheckCircle className="w-5 h-5 text-gold-500" />
              <span>פרויקט התחדשות עירונית - צפת, שכונת כנען</span>
            </h3>
            <div className="space-y-3 text-sm text-neutral-600">
              <div className="flex items-start space-x-2 space-x-reverse">
                <Building className="w-4 h-4 text-gold-600 mt-1" />
                <div>
                  <span className="font-medium">בניינים:</span> זלמן שזר 1, 3, 5 והשבעה 2, 4, 6
                </div>
              </div>
              <div className="flex items-start space-x-2 space-x-reverse">
                <User className="w-4 h-4 text-gold-600 mt-1" />
                <div>
                  <span className="font-medium">דיירים:</span> 632 דיירים
                </div>
              </div>
              <div className="flex items-start space-x-2 space-x-reverse">
                <CheckCircle className="w-4 h-4 text-gold-600 mt-1" />
                <div>
                  <span className="font-medium">סטטוס:</span> בתהליך איסוף חתימות
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start space-x-3 space-x-reverse">
                <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">שים לב</h4>
                  <p className="text-blue-700 text-sm">
                    ההרשמה מיועדת לדיירים בפרויקט בלבד. אם אינך דייר בפרויקט, אנא צור קשר עם המשרד.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResidentRegistration;