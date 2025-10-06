import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Crown, Shield, Zap, Globe, Info } from 'lucide-react';
import PersonalStory from '../components/PersonalStory';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    userType: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        userType: ''
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'טלפון יוקרתי',
      details: ['050-2871717'],
      description: 'זמינים 24/7 לשירות מקצועי ואישי',
      gradient: 'from-gold-500 to-warmGold-400'
    },
    {
      icon: Mail,
      title: 'אימייל מתקדם',
      details: ['ladereh@gmail.com'],
      description: 'מענה תוך 2 שעות בימי עבודה',
      gradient: 'from-deepGold-500 to-bronze-400'
    },
    {
      icon: MapPin,
      title: 'כתובת יוקרתית',
      details: ['אחוזה 70', 'רעננה, ישראל'],
      description: 'משרדים מתקדמים בלב תל אביב',
      gradient: 'from-bronze-500 to-deepGold-400'
    },
    {
      icon: Clock,
      title: 'שעות פעילות',
      details: ['א\'-ה\': 8:00-20:00', 'ו\': 8:00-15:00'],
      description: 'שירות מורחב ונגישות מקסימלית',
      gradient: 'from-warmGold-600 to-bronze-700'
    }
  ];

  const subjects = [
    'פניה כללית',
    'שאלות לגבי הרשמה',
    'תמיכה טכנית מתקדמת',
    'שאלות לגבי פרויקט',
    'שיתוף פעולה עסקי',
    'בקשה לפגישה יוקרתית',
    'ייעוץ מקצועי',
    'אחר'
  ];

  const userTypes = [
    { value: 'resident', label: 'דייר' },
    { value: 'developer', label: 'יזם' },
    { value: 'professional', label: 'בעל מקצוע' },
    { value: 'authority', label: 'רשות מקומית' },
    { value: 'investor', label: 'משקיע' },
    { value: 'other', label: 'אחר' }
  ];

  const features = [
    {
      icon: Shield,
      title: 'אבטחה מתקדמת',
      description: 'הגנה מלאה על המידע האישי שלך',
      gradient: 'from-bronze-600 to-deepGold-800'
    },
    {
      icon: Zap,
      title: 'מענה מהיר',
      description: 'תגובה תוך שעתיים בימי עבודה',
      gradient: 'from-gold-500 to-warmGold-400'
    },
    {
      icon: Globe,
      title: 'זמינות גלובלית',
      description: 'שירות מקצועי בכל מקום בעולם',
      gradient: 'from-deepGold-500 to-bronze-400'
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warmGold-50 to-cream-50 flex items-center justify-center">
        <div className="bg-white p-12 rounded-3xl shadow-luxury-lg text-center max-w-lg border border-warmGold-200">
          <div className="w-20 h-20 bg-gradient-to-br from-gold-500 to-warmGold-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">תודה רבה!</h2>
          <p className="text-neutral-700 mb-6 text-lg leading-relaxed">
            ההודעה שלך נשלחה בהצלחה למערכת המתקדמת שלנו. 
            נחזור אליך תוך שעתיים בימי עבודה.
          </p>
          <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-xl flex items-center justify-center mx-auto">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cream-50 via-neutral-50 to-cream-100 text-neutral-900 py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-shimmer-gold bg-[length:200%_100%] animate-shimmer opacity-20"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-gold-300 to-warmGold-300 rounded-full opacity-30 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-gold-300 to-warmGold-300 rounded-full opacity-30 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center space-x-3 space-x-reverse bg-gradient-to-r from-gold-100 to-warmGold-100 backdrop-blur-sm border border-gold-200 text-gold-800 px-8 py-4 rounded-full mb-12 shadow-luxury">
              <Crown className="w-6 h-6 text-gold-600" />
              <span className="font-medium text-lg">יצירת קשר יוקרתית ומקצועית</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight text-neutral-900">
              <span className="bg-gradient-to-r from-gold-600 via-warmGold-500 to-gold-700 bg-clip-text text-transparent">צור קשר</span> איתנו
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-700 leading-relaxed max-w-4xl mx-auto mb-4">
              נשמח לעזור לך ולענות על כל שאלה. צוות המומחים שלנו כאן עבורך.
            </p>
            <p className="text-lg text-gold-600 font-medium max-w-3xl mx-auto">
              כי בסוף, מאחורי כל דירה יש אנשים, משפחות וסיפורים. ואנחנו כאן בשבילם.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {contactInfo.map((info, index) => (
              <div key={index} className="group text-center p-8 rounded-2xl hover:bg-gradient-to-br hover:from-cream-50 hover:to-neutral-50 transition-all duration-300 border border-neutral-200 hover:border-gold-300 hover:shadow-luxury transform hover:-translate-y-1">
                <div className={`w-20 h-20 bg-gradient-to-br ${info.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-luxury group-hover:scale-110 transition-transform duration-300`}>
                  <info.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-800 mb-4 group-hover:text-gold-600 transition-colors leading-tight">
                  {info.title}
                </h3>
                <div className="space-y-2 mb-4">
                  {info.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="text-gold-600 font-semibold text-lg">
                      {detail}
                    </div>
                  ))}
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed px-2">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Story */}
      <section className="py-20 bg-gradient-to-br from-cream-50 to-neutral-50 border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <PersonalStory compact />
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-32 bg-gradient-to-br from-cream-50 to-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-8">
                שלח לנו הודעה
              </h2>
              <p className="text-xl text-neutral-700 leading-relaxed max-w-3xl mx-auto">
                מלא את הפרטים ונחזור אליך בהקדם עם שירות יוקרתי ומקצועי
              </p>
            </div>
            
            <div className="bg-white rounded-3xl shadow-luxury-lg p-10 border border-neutral-200">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-neutral-700 mb-3">
                      שם מלא *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border border-warmGold-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white"
                      placeholder="הכנס את שמך המלא"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-3">
                      כתובת אימייל *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border border-warmGold-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-neutral-700 mb-3">
                      מספר טלפון
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border border-warmGold-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white"
                      placeholder="050-1234567"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="userType" className="block text-sm font-semibold text-neutral-700 mb-3">
                      סוג המשתמש
                    </label>
                    <select
                      id="userType"
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border border-warmGold-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white"
                    >
                      <option value="">בחר סוג משתמש</option>
                      {userTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-neutral-700 mb-3">
                    נושא הפניה *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border border-warmGold-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white"
                  >
                    <option value="">בחר נושא</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-neutral-700 mb-3">
                    הודעה *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-4 border border-warmGold-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 resize-vertical bg-neutral-50 focus:bg-white"
                    placeholder="כתב כאן את ההודעה שלך..."
                  />
                </div>
                
                <div className="text-center">
                  <button
                    type="submit" 
                    className="inline-flex items-center space-x-3 space-x-reverse px-12 py-5 bg-gradient-to-r from-gold-500 via-warmGold-400 to-gold-500 text-white rounded-2xl hover:shadow-luxury-lg transition-all duration-500 transform hover:scale-105 shadow-luxury font-bold text-xl overflow-hidden relative border border-gold-400/50"
                  >
                    <div className="absolute inset-0 bg-shimmer-gold bg-[length:200%_100%] animate-shimmer opacity-30"></div>
                    <Send className="w-6 h-6 relative" />
                    <span className="relative">שלח הודעה</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-8">
              למה לבחור בנו?
            </h2>
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
              שירות יוקרתי ומקצועי עם הטכנולוגיה המתקדמת ביותר
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="group text-center p-8 bg-gradient-to-br from-cream-50 to-neutral-50 rounded-3xl hover:shadow-luxury-lg transition-all duration-500 border border-neutral-200 hover:border-gold-300 transform hover:-translate-y-1">
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-luxury`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-800 mb-4 group-hover:text-gold-600 transition-colors leading-tight">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed px-2">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-32 bg-gradient-to-br from-cream-50 to-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-8">
              מיקום המשרדים
            </h2>
            <p className="text-xl text-neutral-700 leading-relaxed">
              בואו לבקר אותנו במשרדים היוקרתיים שלנו בלב תל אביב
            </p>
          </div>
          
          <div className="bg-neutral-200 rounded-3xl overflow-hidden shadow-luxury-lg border border-neutral-200" style={{ height: '400px' }}>
            <div className="w-full h-full flex items-center justify-center text-neutral-600">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-luxury">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-neutral-800">מפה אינטראקטיבית</h3>
                <p className="text-neutral-600 mb-4">
                  כאן תוצג מפה אינטראקטיבית עם מיקום המשרדים היוקרתיים
                </p>
                <div className="mt-4 text-sm text-neutral-700 space-y-1">
                  <div className="font-semibold">רחוב הרצל 123</div>
                  <div>תל אביב-יפו, ישראל</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-8">
              שאלות נפוצות
            </h2>
            <p className="text-xl text-neutral-700 leading-relaxed">
              מענה לשאלות השכיחות ביותר מלקוחותינו
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: 'כמה זמן לוקח לקבל מענה לפניה?',
                answer: 'אנחנו מתחייבים לחזור אליכם תוך שעתיים בימי עבודה. בפניות דחופות, זמן התגובה קצר יותר עם שירות יוקרתי ומקצועי.'
              },
              {
                question: 'האם השירות חינמי לדיירים?',
                answer: 'כן, השירות לדיירים הוא חינמי לחלוטין. דיירים יכולים להירשם, לנהל מסמכים ולעקוב אחר הפרויקט ללא עלות עם רמת שירות יוקרתית.'
              },
              {
                question: 'איך אפשר לקבוע פגישה?',
                answer: 'ניתן לקבוע פגישה באמצעות טלפון, אימייל או באמצעות טופס יצירת הקשר. אנו מציעים פגישות יוקרתיות במשרדים או בזום.'
              },
              {
                question: 'מה כלול בחבילות המנוי ליזמים?',
                answer: 'חבילות המנוי כוללות פרופיל עסקי יוקרתי, קבלת פניות איכותיות, מערכת CRM מתקדמת, דוחות וניתוחים, ותמיכה טכנית מקצועית. יש 3 רמות שונות.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gradient-to-br from-cream-50 to-neutral-50 rounded-2xl shadow-luxury p-8 border border-neutral-200 hover:border-gold-300 transition-all duration-300">
                <h3 className="text-lg font-bold text-neutral-800 mb-4 leading-tight">
                  {faq.question}
                </h3>
                <p className="text-neutral-700 leading-relaxed px-2">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;