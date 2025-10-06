import React, { useState } from 'react';
import { User, Edit, Save, X, Home, Phone, Mail, Car as IdCard, Calendar, MapPin, Globe, Info } from 'lucide-react';
import { Card, Button, Input } from '../ui';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../LanguageSwitcher';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface ResidentData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  apartmentNumber: string;
  buildingAddress: string;
  ownershipPercentage: number;
  moveInDate: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences: {
    notifications: boolean;
    smsUpdates: boolean;
    emailUpdates: boolean;
    language: string;
  };
}

const ResidentProfile: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Split full name into first and last name
  const getNameParts = () => {
    if (!user?.full_name) return ['', ''];
    const parts = user.full_name.split(' ');
    return [parts[0], parts.slice(1).join(' ')];
  };
  
  const [firstName, lastName] = getNameParts();
  
  const [residentData, setResidentData] = useState<ResidentData>({
    id: user?.id || '1',
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    idNumber: user?.id_number || '',
    apartmentNumber: '12',
    buildingAddress: 'רחוב הרצל 45, תל אביב',
    ownershipPercentage: 8.5,
    moveInDate: '2018-03-15',
    emergencyContact: {
      name: 'שרה כהן',
      phone: '052-9876543',
      relationship: 'בת זוג'
    },
    preferences: {
      notifications: true,
      smsUpdates: true,
      emailUpdates: true,
      language: language
    }
  });

  const [editData, setEditData] = useState<ResidentData>(residentData);
  const [editFirstName, setEditFirstName] = useState(firstName);
  const [editLastName, setEditLastName] = useState(lastName);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(residentData);
    setEditFirstName(firstName);
    setEditLastName(lastName);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Combine first and last name 
      const fullName = `${editFirstName} ${editLastName}`.trim();
      
      // Update user profile
      await updateProfile({
        full_name: fullName,
        phone: editData.phone,
        email: editData.email
      });
      
      // Update local state
      setResidentData({
        ...editData,
        fullName
      });
      
      setIsEditing(false);
      toast.success('הפרופיל עודכן בהצלחה (מצב דמו)');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('שגיאה בעדכון הפרופיל (מצב דמו)');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData(residentData);
    setEditFirstName(firstName);
    setEditLastName(lastName);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ResidentData] as any,
          [child]: value
        }
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">{t('profile')}</h2>
              <p className="text-neutral-600">נהל את הפרטים האישיים שלך</p>
            </div>
          </div>
          {!isEditing ? (
            <Button variant="outline" icon={Edit} onClick={handleEdit} disabled={loading}>
              {t('edit')}
            </Button>
          ) : (
            <div className="flex space-x-2 space-x-reverse">
              <Button variant="primary" icon={Save} onClick={handleSave} loading={loading}>
                {t('save')}
              </Button>
              <Button variant="ghost" icon={X} onClick={handleCancel} disabled={loading}>
                {t('cancel')}
              </Button>
            </div>
          )}
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center space-x-2 space-x-reverse">
              <User className="w-5 h-5 text-gold-600" />
              <span>פרטים אישיים</span>
            </h3>
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">שם פרטי</label>
                    <input
                      type="text"
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">שם משפחה</label>
                    <input
                      type="text"
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white"
                    />
                  </div>
                  <Input
                    label="אימייל"
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  <Input
                    label="טלפון"
                    value={editData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">שם מלא</label>
                    <p className="text-neutral-900 font-semibold">{residentData.fullName || `${firstName} ${lastName}`.trim()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">אימייל</label>
                    <p className="text-neutral-900">{residentData.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">טלפון</label>
                    <p className="text-neutral-900">{residentData.phone}</p>
                  </div>
                  {user?.id_number && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">מספר תעודת זהות</label>
                      <p className="text-neutral-900">{user.id_number}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center space-x-2 space-x-reverse">
              <Home className="w-5 h-5 text-gold-600" />
              <span>פרטי הדירה</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">מספר דירה</label>
                <p className="text-neutral-900 font-semibold">{residentData.apartmentNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">כתובת הבניין</label>
                <p className="text-neutral-900">{residentData.buildingAddress}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">אחוז בעלות</label>
                <p className="text-neutral-900">{residentData.ownershipPercentage}%</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">תאריך כניסה</label>
                <p className="text-neutral-900">{new Date(residentData.moveInDate).toLocaleDateString('he-IL')}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center space-x-2 space-x-reverse">
          <Phone className="w-5 h-5 text-gold-600" />
          <span>איש קשר לחירום</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isEditing ? (
            <>
              <Input
                label="שם"
                value={editData.emergencyContact.name}
                onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
              />
              <Input
                label="טלפון"
                value={editData.emergencyContact.phone}
                onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
              />
              <Input
                label="קרבה משפחתית"
                value={editData.emergencyContact.relationship}
                onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
              />
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">שם</label>
                <p className="text-neutral-900">{residentData.emergencyContact.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">טלפון</label>
                <p className="text-neutral-900">{residentData.emergencyContact.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">קרבה משפחתית</label>
                <p className="text-neutral-900">{residentData.emergencyContact.relationship}</p>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Language and Notification Preferences */}
      <Card>
        <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center space-x-2 space-x-reverse">
          <Globe className="w-5 h-5 text-gold-600" />
          <span>{t('language.settings')}</span>
        </h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-3">{t('language.current')}</label>
          <LanguageSwitcher variant="buttons" />
        </div>
        
        <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center space-x-2 space-x-reverse">
          <Mail className="w-5 h-5 text-gold-600" />
          <span>העדפות התראות</span>
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">התראות במערכת</span>
            <input
              type="checkbox"
              checked={isEditing ? editData.preferences.notifications : residentData.preferences.notifications}
              onChange={(e) => isEditing && handleInputChange('preferences.notifications', e.target.checked)}
              disabled={!isEditing}
              className="h-4 w-4 text-gold-600 focus:ring-gold-500 border-neutral-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">עדכונים ב-SMS</span>
            <input
              type="checkbox"
              checked={isEditing ? editData.preferences.smsUpdates : residentData.preferences.smsUpdates}
              onChange={(e) => isEditing && handleInputChange('preferences.smsUpdates', e.target.checked)}
              disabled={!isEditing}
              className="h-4 w-4 text-gold-600 focus:ring-gold-500 border-neutral-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">עדכונים באימייל</span>
            <input
              type="checkbox"
              checked={isEditing ? editData.preferences.emailUpdates : residentData.preferences.emailUpdates}
              onChange={(e) => isEditing && handleInputChange('preferences.emailUpdates', e.target.checked)}
              disabled={!isEditing}
              className="h-4 w-4 text-gold-600 focus:ring-gold-500 border-neutral-300 rounded"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResidentProfile;