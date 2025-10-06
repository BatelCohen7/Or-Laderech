import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Lock, Home, Building, Layers, CheckCircle, AlertTriangle, Eye, EyeOff, Info } from 'lucide-react';
import { Card, Button, Input } from './ui';
import { validateField, validateFormData } from '../utils/validation';
import toast from 'react-hot-toast';

interface ResidentRegistrationData {
  full_name: string;
  id_number: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  apartment_number?: string;
  floor?: string;
}

interface ResidentRegistrationFormProps {
  onSuccess?: (userData: any) => void;
  className?: string;
}

const ResidentRegistrationForm: React.FC<ResidentRegistrationFormProps> = ({ 
  onSuccess,
  className = ''
}) => {
  const [formData, setFormData] = useState<ResidentRegistrationData>({
    full_name: '',
    id_number: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    apartment_number: '',
    floor: ''
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({});

  // Load form data from localStorage if available
  useEffect(() => {
    const savedForm = localStorage.getItem('resident-registration-form');
    if (savedForm) {
      try {
        const parsedForm = JSON.parse(savedForm);
        setFormData(parsedForm);
      } catch (err) {
        console.error('Error parsing saved form data:', err);
      }
    }
  }, []);

  // Save form data to localStorage when it changes
  useEffect(() => {
    if (Object.values(formData).some(value => value !== '')) {
      localStorage.setItem('resident-registration-form', JSON.stringify(formData));
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    setFormTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field if it's been touched
    if (formTouched[name]) {
      const error = validateField(name, value);
      setFormErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setFormTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    // Mark field as touched
    setFormTouched(prev => ({ ...prev, confirmPassword: true }));
    
    // Validate field if it's been touched
    if (formTouched.confirmPassword) {
      const error = validateField('confirmPassword', value, formData.password);
      setFormErrors(prev => ({ ...prev, confirmPassword: error }));
    }
  };

  const handleConfirmPasswordBlur = () => {
    // Mark field as touched
    setFormTouched(prev => ({ ...prev, confirmPassword: true }));
    
    // Validate field
    const error = validateField('confirmPassword', confirmPassword, formData.password);
    setFormErrors(prev => ({ ...prev, confirmPassword: error }));
  };

  const validateForm = (): boolean => {
    const requiredFields = ['full_name', 'id_number', 'email', 'phone', 'password'];
    const errors = validateFormData(formData, requiredFields);
    
    // Validate confirm password
    const confirmPasswordError = validateField('confirmPassword', confirmPassword, formData.password);
    if (confirmPasswordError) {
      errors.confirmPassword = confirmPasswordError;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // For demo purposes, always succeed
    setTimeout(() => {
      setSuccess(true);
      toast.success('נרשמת בהצלחה! (מצב דמו)');
      
      // Clear form data from localStorage
      localStorage.removeItem('resident-registration-form');
      
      if (onSuccess) {
        onSuccess({
          id: Date.now().toString(),
          full_name: formData.full_name,
          email: formData.email || `${formData.id_number}@example.com`,
          status: 'approved'
        });
      }
    }, 1500);
  };

  if (success) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">נרשמת בהצלחה!</h2>
        <p className="text-neutral-700 mb-6">
          פרטיך נקלטו במערכת. ניתן להתחבר כעת עם האימייל והסיסמה שהגדרת.
        </p>
        <Button variant="primary" onClick={() => window.location.href = '/resident-login'}>
          התחבר למערכת
        </Button>
      </Card>
    );
  }

  return (
    <Card className={`${className} shadow-luxury`}>
      <h2 className="text-2xl font-bold text-neutral-900 mb-8">הרשמה לפרויקט</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3 space-x-reverse">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="שם מלא"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="הכנס שם מלא"
            icon={User}
            required
            error={formTouched.full_name && formErrors.full_name ? formErrors.full_name : ''}
          />
          
          <Input
            label="מספר תעודת זהות"
            name="id_number"
            value={formData.id_number}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="הכנס מספר ת.ז (9 ספרות)"
            icon={User}
            required
            maxLength={9}
            error={formTouched.id_number && formErrors.id_number ? formErrors.id_number : ''}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="אימייל"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="הכנס כתובת אימייל"
            icon={Mail}
            required
            error={formTouched.email && formErrors.email ? formErrors.email : ''}
          />
          
          <Input
            label="טלפון"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="הכנס מספר טלפון"
            icon={Phone}
            required
            error={formTouched.phone && formErrors.phone ? formErrors.phone : ''}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="סיסמה"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="הכנס סיסמה (לפחות 6 תווים)"
            icon={Lock}
            required
            helpText="סיסמה חזקה מכילה אותיות, מספרים וסימנים מיוחדים"
            error={formTouched.password && formErrors.password ? formErrors.password : ''}
            success={formTouched.password && !formErrors.password && formData.password.length >= 6}
          />
          
          <Input
            label="אימות סיסמה"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onBlur={handleConfirmPasswordBlur}
            placeholder="הכנס סיסמה שוב"
            icon={Lock}
            required
            maxLength={30}
            error={formTouched.confirmPassword && formErrors.confirmPassword ? formErrors.confirmPassword : ''}
            success={formTouched.confirmPassword && !formErrors.confirmPassword && confirmPassword && confirmPassword === formData.password}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Input
            label="כתובת"
            name="address"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="הכנס כתובת"
            icon={Building}
            error={formTouched.address && formErrors.address ? formErrors.address : ''}
          />
          
          <Input
            label="מספר דירה"
            name="apartment_number"
            value={formData.apartment_number}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="הכנס מספר דירה"
            icon={Home}
            error={formTouched.apartment_number && formErrors.apartment_number ? formErrors.apartment_number : ''}
          />
          
          <Input
            label="קומה"
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="הכנס קומה"
            icon={Layers}
            error={formTouched.floor && formErrors.floor ? formErrors.floor : ''}
          />
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-start space-x-3 space-x-reverse">
            <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">הערה חשובה</h4>
              <p className="text-blue-700 text-sm">
                הפרטים שתזין ישמשו לצורך זיהוי ואימות בפרויקט. וודא שהפרטים נכונים ומדויקים.
              </p>
            </div>
          </div>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          className="shadow-md"
          loading={loading} 
          disabled={loading || Object.keys(formErrors).filter(key => key !== 'password').some(key => !!formErrors[key])}
        >
          {loading ? 'מבצע רישום...' : 'הרשם לפרויקט'}
        </Button>
      </form>
    </Card>
  );
};

export default ResidentRegistrationForm;