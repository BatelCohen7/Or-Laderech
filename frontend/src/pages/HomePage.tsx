import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  Users, 
  FileText, 
  ArrowLeft, 
  CheckCircle, 
  Star,
  TrendingUp,
  Shield,
  Clock,
  Award,
  Crown,
  Target,
  Phone,
  User,
  MessageSquare,
  Vote,
  HelpCircle,
  BookOpen,
  Settings,
  AlertTriangle,
  LogIn,
  Layers,
  ChevronRight,
  Search,
  MapPin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, Badge } from '../components/ui';
import AccessibilityWidget from '../components/AccessibilityWidget';
import PersonalStory from '../components/PersonalStory';
import ProfessionalsSection from '../components/ProfessionalsSection';
import VisionStatement from '../components/VisionStatement';
import TzfatCanaanProjectCard from '../components/TzfatCanaanProjectCard';

const HomePage = () => {
  const { user } = useAuth();
  
  const userTypes = [
    { 
      title: 'דיירים',
      subtitle: 'פתרונות יוקרתיים לדיירים',
      description: 'ניהול מסמכים חכם, מעקב פרויקט בזמן אמת והתחייבות לבלעדיות מלאה',
      icon: Users,
      path: user ? '/resident-dashboard' : '/resident-login',
      gradient: 'from-gold-400 via-warmGold-400 to-gold-500',
      features: ['מעקב אישי מתקדם', 'ניהול מסמכים AI', 'בלעדיות מובטחת', 'ייעוץ משפטי 24/7']
    },
    {
      title: 'יזמים',
      subtitle: 'פלטפורמה עסקית יוקרתית',
      description: 'פרופיל עסקי יוקרתי, מערכת CRM חכמה וקבלת פניות איכותיות מדיירים',
      icon: Building,
      path: user ? '/dashboard/developers' : '/login/developers',
      gradient: 'from-warmGold-400 via-gold-500 to-warmGold-500',
      features: ['פרופיל עסקי פרימיום', 'CRM חכם ומתקדם', 'פניות איכותיות', 'אנליטיקס מתקדם']
    },
    {
      title: 'בעלי מקצוע',
      subtitle: 'רשת מקצועית אקסקלוסיבית',
      description: 'הצגת תיק עבודות מקצועי, חיבור לפרויקטים איכותיים וניהול לקוחות חכם',
      icon: FileText,
      path: user ? '/dashboard/professionals' : '/login/professionals',
      gradient: 'from-gold-500 via-warmGold-400 to-gold-600',
      features: ['תיק עבודות דיגיטלי', 'פרויקטים איכותיים', 'ניהול לקוחות חכם', 'דירוגים מקצועיים']
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'אבטחה ברמה בנקאית',
      description: 'הגנה מתקדמת על מידע רגיש עם הצפנה צבאית ואימות דו-שלבי',
      gradient: 'from-warmGold-500 to-gold-700',
      stats: '256-bit SSL'
    },
    {
      icon: TrendingUp,
      title: 'טכנולוגיה חדשנית',
      description: 'בינה מלאכותית, אוטומציה חכמה ואנליטיקס מתקדם לחוויה מושלמת',
      gradient: 'from-gold-500 to-warmGold-400',
      stats: 'AI Powered'
    },
    {
      icon: Target,
      title: 'דיוק ויעילות',
      description: 'מערכת מתקדמת לניהול פרויקטים עם דיוק של 99.9% ויעילות מקסימלית',
      gradient: 'from-gold-500 to-warmGold-700',
      stats: '99.9% דיוק'
    }
  ];

  const stats = [
    { number: '₪2.5B+', label: 'שווי פרויקטים', sublabel: 'בניהול הפלטפורמה' },
    { number: '15,000+', label: 'דיירים מרוצים', sublabel: 'ברחבי הארץ' },
    { number: '500+', label: 'שותפים עסקיים', sublabel: 'יזמים ובעלי מקצוע' },
    { number: '98.7%', label: 'שביעות רצון', sublabel: 'מהלקוחות שלנו' }
  ];

  const testimonials = [
    {
      name: 'עו"ד רחל כהן',
      role: 'דיירת ויועצת משפטית',
      company: 'פרויקט גבעתיים',
      content: 'הפלטפורמה הכי מקצועית שעבדתי איתה. רמת השירות, הטכנולוגיה והאמינות פשוט יוצאות דופן. הרגשתי בטוחה לחלוטין לאורך כל התהליך.',
      rating: 5,
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'אדר\' יוסי לוי',
      role: 'יזם ומפתח נדל"ן',
      company: 'לוי דיוולופמנט',
      content: 'אור בדרך שינתה לי את כל הגישה לעבודה. הפלטפורמה מחברת אותי ללקוחות איכותיים ומאפשרת לי לנהל פרויקטים ברמה שלא הכרתי קודם.',
      rating: 5,
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'ד"ר מירי שפירא',
      role: 'אדריכלית ראשית',
      company: 'שפירא אדריכלות',
      content: 'כאדריכלית עם 20 שנות ניסיון, אני יכולה להגיד שזו הפלטפורמה הכי מתקדמת ומקצועית שראיתי. הטכנולוגיה והשירות ברמה עולמית.',
      rating: 5,
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  // פיצ'רים חדשים שפיתחנו
  const newFeatures = [
    {
      icon: Vote,
      title: 'מערכת הצבעות מתקדמת',
      description: 'השתתפות בהצבעות דיגיטליות עם שקיפות מלאה',
      color: 'text-purple-600 bg-purple-100',
      path: '/resident-dashboard?tab=voting'
    },
    {
      icon: MessageSquare,
      title: 'מרכז תקשורת חכם',
      description: 'תקשורת מתקדמת עם כל הגורמים בפרויקט',
      color: 'text-blue-600 bg-blue-100',
      path: '/resident-dashboard?tab=communication'
    },
    {
      icon: HelpCircle,
      title: 'מרכז תמיכה מתקדם',
      description: 'תמיכה 24/7 עם AI ומומחים אנושיים',
      color: 'text-green-600 bg-green-100',
      path: '/resident-dashboard?tab=support'
    },
    {
      icon: AlertTriangle,
      title: 'מערכת התנגדויות',
      description: 'הגשת התנגדויות דיגיטליות עם ליווי משפטי',
      color: 'text-red-600 bg-red-100',
      path: '/resident-dashboard?tab=objections'
    },
    {
      icon: BookOpen,
      title: 'מרכז ידע מקיף',
      description: 'מדריכים, סרטונים ומידע מקצועי',
      color: 'text-indigo-600 bg-indigo-100',
      path: '/resident-dashboard?tab=knowledge'
    },
    {
      icon: Layers,
      title: 'מודלים תלת-ממדיים',
      description: 'צפייה במודלים אינטראקטיביים של הפרויקט',
      color: 'text-blue-600 bg-blue-100',
      path: '/resident-dashboard?tab=3d-models'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-cream-50 via-neutral-50 to-cream-100">
        {/* Background elements */}
        <div className="absolute inset-0 bg-shimmer-gold bg-[length:200%_100%] animate-shimmer opacity-20"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-gold-300 to-warmGold-300 rounded-full opacity-30 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-warmGold-300 to-gold-300 rounded-full opacity-30 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            {/* Content */}
            <div className="space-y-8 text-neutral-800">
              {/* Premium tag */}
              <div className="inline-flex items-center space-x-3 space-x-reverse bg-gold-100 backdrop-blur-sm border border-gold-200 text-gold-800 px-6 py-3 rounded-full shadow-md">
                <Crown className="w-5 h-5 text-gold-600" />
                <span className="font-medium">הפלטפורמה היוקרתית המובילה בישראל</span>
              </div>
              
              {/* Main heading */}
              <div>
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight text-neutral-900">
                  <span className="text-gradient-gold">אור לדרך</span>
                  <br/>
                  <span className="text-3xl lg:text-5xl text-neutral-800">
                    עתיד ההתחדשות העירונית
                  </span>
                </h1>
                
                <p className="text-xl text-neutral-700 leading-relaxed max-w-xl">
                  פלטפורמה מתקדמת המחברת בין דיירים, יזמים ובעלי מקצוע
                  <br />לקידום פרויקטי התחדשות עירונית איכותיים ויעילים
                </p>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {!user && (
                  <Link
                    to="/register"
                    className="group relative px-6 py-3.5 bg-gradient-to-r from-navy-600 to-navy-700 text-white rounded-xl hover:shadow-luxury transition-all duration-300 font-medium text-lg shadow-md overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-shimmer-gold bg-[length:200%_100%] animate-shimmer opacity-30"></div>
                    <span className="relative flex items-center justify-center space-x-2 space-x-reverse">
                      <User className="w-5 h-5" />
                      <span>הרשמה לפרויקט</span>
                    </span>
                  </Link>
                )}
                
                <Link
                  to="/planning-rights"
                  className="group px-6 py-3.5 border-2 border-gold-400 text-gold-700 rounded-xl hover:bg-gold-50 backdrop-blur-sm transition-all duration-300 font-medium text-lg"
                >
                  <span className="flex items-center justify-center space-x-2 space-x-reverse">
                    <Search className="w-5 h-5" />
                    <span>בדיקת זכויות תכנוניות</span>
                  </span>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="inline-flex items-center space-x-2 space-x-reverse bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-neutral-800 text-sm font-medium shadow-sm border border-neutral-200/50">
                  <CheckCircle className="w-4 h-4 text-gold-600" />
                  <span>ללא עלות לדיירים</span>
                </div>
                <div className="inline-flex items-center space-x-2 space-x-reverse bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-neutral-800 text-sm font-medium shadow-sm border border-neutral-200/50">
                  <CheckCircle className="w-4 h-4 text-gold-600" />
                  <span>מעל 15,000 דיירים מרוצים</span>
                </div>
                <div className="inline-flex items-center space-x-2 space-x-reverse bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-neutral-800 text-sm font-medium shadow-sm border border-neutral-200/50">
                  <CheckCircle className="w-4 h-4 text-gold-600" />
                  <span>טכנולוגיה מתקדמת</span>
                </div>
              </div>
            </div>

            {/* Featured Project Card */}
            <div className="hidden lg:block">
              <TzfatCanaanProjectCard className="transform hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Personal Story Section */}
      <section className="py-24 bg-white border-b border-neutral-100">
        <div className="container mx-auto px-4">
          <PersonalStory />
        </div>
      </section>

      {/* Vision Statement */}
      <VisionStatement />

      {/* Professionals Section */}
      <ProfessionalsSection />

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-2 group-hover:text-gold-600 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-neutral-700 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-neutral-600">
                  {stat.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-cream-50 to-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold text-neutral-900 mb-6">
              הפיצ'רים החדשים שפיתחנו
            </h2>
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
              מערכת מתקדמת ומקיפה עם כל הכלים שדייר צריך
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {newFeatures.map((feature, index) => (
              <Link 
                key={index}
                to={user ? feature.path : '/resident-login'}
                className="group bg-white p-8 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-neutral-200 hover:border-gold-300 transform hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-800 mb-3 group-hover:text-gold-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 mb-5 leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex items-center text-gold-600 font-medium text-sm mt-auto">
                  <span>גישה מיידית</span>
                  <ChevronRight className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link
              to={user ? '/resident-dashboard' : '/register'}
              className="inline-flex items-center space-x-3 space-x-reverse px-8 py-4 bg-gradient-to-r from-gold-500 to-warmGold-400 text-white rounded-xl hover:shadow-luxury transition-all duration-300 font-medium text-lg shadow-md border border-gold-400/50"
            >
              {user ? <User className="w-5 h-5" /> : <User className="w-5 h-5" />}
              <span>{user ? 'כניסה לאזור האישי' : 'הצטרף עכשיו'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-24 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold text-neutral-900 mb-6">
              בחר את החוויה שלך
            </h2>
            <p className="text-xl text-neutral-700 max-w-4xl mx-auto leading-relaxed">
              פתרונות מותאמים אישית לכל סוג משתמש עם טכנולוגיה מתקדמת וחוויה יוקרתית
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {userTypes.map((userType, index) => (
              <Card key={index} hover className="overflow-hidden border border-neutral-200 shadow-card">
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${userType.gradient} rounded-xl flex items-center justify-center shadow-luxury group-hover:scale-110 transition-transform duration-300`}>
                      <userType.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-xs font-bold text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-full shadow-sm border border-neutral-200/50">
                      PREMIUM
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                    {userType.title}
                  </h3>
                  <h4 className={`text-base font-semibold mb-4 bg-gradient-to-r ${userType.gradient} bg-clip-text text-transparent`}>
                    {userType.subtitle}
                  </h4>
                  
                  <p className="text-neutral-700 mb-6">
                    {userType.description}
                  </p>
                  
                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {userType.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3 space-x-reverse text-neutral-700">
                        <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0" />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Action Button */}
                  <Link
                    to={userType.path}
                    className="flex items-center justify-center space-x-3 space-x-reverse w-full py-3.5 bg-gradient-to-r from-navy-600 to-navy-700 text-white rounded-xl hover:shadow-luxury transition-all duration-300 font-medium text-lg shadow-md"
                  >
                    <span>{user ? 'כניסה לאזור האישי' : 'התחל עכשיו'}</span>
                    <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Features */}
      <section className="py-24 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-shimmer-gold bg-[length:200%_100%] animate-shimmer opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gold-400 to-warmGold-400 rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-warmGold-400 to-gold-400 rounded-full opacity-15 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gold-300 via-warmGold-200 to-gold-400 bg-clip-text text-transparent">
                הטכנולוגיה שלנו
              </span>
            </h2>
            <p className="text-xl text-cream-300 max-w-3xl mx-auto leading-relaxed">
              פתרונות טכנולוגיים חדשניים עם בינה מלאכותית לחוויה מושלמת ויעילות מקסימלית
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-luxury relative`}>
                  <feature.icon className="w-8 h-8 text-white" />
                  <div className="absolute -top-2 -right-2 bg-white text-neutral-800 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {feature.stats}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-cream-100 mb-4 group-hover:text-gold-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-cream-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold text-neutral-900 mb-6">
              מה הלקוחות המובילים שלנו אומרים
            </h2>
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
              חוות דעת אמיתיות מלקוחות מרוצים ומובילים בתחום
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} hover className="p-8 shadow-card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-500 fill-current" />
                  ))}
                </div>
                
                <p className="text-neutral-700 mb-8 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center space-x-4 space-x-reverse border-t border-neutral-200 pt-5">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover shadow-sm"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-neutral-900">{testimonial.name}</div>
                    <div className="text-gold-600 font-medium text-sm">{testimonial.role}</div>
                    <div className="text-neutral-600 text-xs">{testimonial.company}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-cream-50 to-neutral-50 border-t border-neutral-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-neutral-900 mb-8">
            מוכן להצטרף למהפכת ההתחדשות העירונית?
          </h2>
          <p className="text-xl text-neutral-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            הצטרף לאלפי לקוחות מרוצים והפוך לחלק מהמהפכה האנושית בתחום ההתחדשות העירונית
          </p>
          <p className="text-lg text-gold-600 font-medium mb-12 max-w-3xl mx-auto">
            כי בסוף, מאחורי כל דירה יש אנשים, משפחות וסיפורים. ואנחנו כאן בשבילם.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {!user && (
              <Link
                to="/register"
                className="group relative px-8 py-4 bg-gradient-to-r from-navy-600 to-navy-700 text-white rounded-xl hover:shadow-luxury transition-all duration-300 font-medium text-lg shadow-md overflow-hidden"
              >
                <div className="absolute inset-0 bg-shimmer-gold bg-[length:200%_100%] animate-shimmer opacity-30"></div>
                <span className="relative flex items-center justify-center space-x-2 space-x-reverse">
                  <User className="w-5 h-5" />
                  אור לדרך
                </span>
              </Link>
            )}
            
            <Link
              to="/tzfat-canaan"
              className="px-8 py-4 border-2 border-gold-500 text-gold-600 rounded-xl hover:bg-gold-50 transition-all duration-300 font-medium text-lg shadow-sm"
            >
              <span className="flex items-center justify-center space-x-2 space-x-reverse">
                <Building className="w-5 h-5" />
                <span>הצטרף לפרויקט צפת</span>
              </span>
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 space-x-reverse bg-white p-4 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-gold-600" />
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-neutral-800">אבטחה מתקדמת</h3>
                <p className="text-sm text-neutral-600">הגנה מלאה על המידע שלך</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse bg-white p-4 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-gold-600" />
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-neutral-800">פריסה ארצית</h3>
                <p className="text-sm text-neutral-600">פרויקטים בכל רחבי הארץ</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse bg-white p-4 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-gold-600" />
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-neutral-800">מובילים בתחום</h3>
                <p className="text-sm text-neutral-600">מעל 5 שנות ניסיון</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Widget */}
      <AccessibilityWidget />
    </div>
  );
};

export default HomePage;