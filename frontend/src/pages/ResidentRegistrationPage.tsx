import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, CheckCircle, User, AlertTriangle, Info } from 'lucide-react';
import ResidentRegistrationForm from '../components/ResidentRegistrationForm';
import { Card } from '../components/ui';
import VisionStatement from '../components/VisionStatement';
import toast from 'react-hot-toast';

const ResidentRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleRegistrationSuccess = (userData: any) => {
    console.log('Registration successful:', userData);
    setRegistrationSuccess(true);
    toast.success('נרשמת בהצלחה! ניתן להתחבר כעת למערכת.');
    
    // Redirect to login page after 2 seconds
    setTimeout(() => {
      navigate('/resident-login');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 space-x-reverse text-neutral-600 hover:text-gold-600 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <span className="font-medium">חזרה לדף הבית</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-luxury-lg">
              <Building className="w-10 h-10 text-white" />
            </div> 
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              הרשמה לאור לדרך
            </h1>
            <p className="text-neutral-700 text-lg mb-1">
              הרשם כדי לקבל עדכונים ולעקוב אחר התקדמות הפרויקטים
            </p>
            <p className="text-gold-600 font-medium">
              אנחנו כאן בשבילך לאורך כל הדרך
            </p>
          </div>

          {/* Success Message */}
          {registrationSuccess && (
            <Card className="mb-8 p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-900 mb-3">נרשמת בהצלחה!</h2>
              <p className="text-neutral-700 mb-2">
                פרטיך נקלטו במערכת. מעבירים אותך לדף ההתחברות...
              </p>
              <div className="w-12 h-12 mx-auto mt-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-500 border-t-transparent"></div>
              </div>
            </Card>
          )}

          {/* Registration Form */}
          {!registrationSuccess && (
            <ResidentRegistrationForm onSuccess={handleRegistrationSuccess} />
          )}

          {/* Already Registered */}
          {!registrationSuccess && (
            <div className="mt-10 text-center">
              <p className="text-neutral-700 mb-4">כבר רשום?</p>
              <Link 
                to="/resident-login" 
                className="inline-flex items-center space-x-2 space-x-reverse px-6 py-3 bg-white border-2 border-gold-400 text-gold-600 rounded-xl hover:bg-gold-50 transition-colors shadow-sm"
              >
                <User className="w-5 h-5" />
                <span>התחבר למערכת</span>
              </Link>
            </div>
          )}

          {/* Project Info */}
          <div className="mt-12">
            <VisionStatement compact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentRegistrationPage;