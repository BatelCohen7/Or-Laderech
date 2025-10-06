import React from 'react';
import { 
  Users, 
  Building, 
  FileText, 
  MapPin, 
  Search, 
  Shield, 
  Clock, 
  CheckCircle,
  Star,
  ArrowLeft,
  Sparkles,
  Zap,
  Globe,
  Target,
  Award
} from 'lucide-react';
import ProfessionalsSection from '../components/ProfessionalsSection';

const ServicesPage = () => {
  const services = [
    {
      icon: Users,
      title: 'שירותי דיירים פרימיום',
      subtitle: 'חוויה יוקרתית לדיירים',
      description: 'פתרונות מתקדמים וחכמים לדיירים המעוניינים בהתחדשות עירונית ברמה הגבוהה ביותר',
      features: [
        'הרשמה פשוטה עם AI ואימות ביומטרי',
        'ניהול מסמכים דיגיטלי חכם',
        'מעקב אחר התקדמות הפרויקט בזמן אמת',
        'מערכת הודעות מתקדמת עם AI',
        'התחייבות לבלעדיות מוחלטת',
        'ייעוץ משפטי ושמאי 24/7'
      ],
      price: 'חינם',
      popular: false,
      gradient: 'from-gold-500 to-warmGold-400',
      bgGradient: 'from-gold-50 to-cream-50'
    },
    {
      icon: Building,
      title: 'שירותי יזמים מתקדמים',
      subtitle: 'פלטפורמה עסקית יוקרתית',
      description: 'פלטפורמה מקצועית ומתקדמת ליזמים לניהול פרויקטים, קבלת פניות איכותיות וניהול עסקי חכם',
      features: [
        'פרופיל עסקי יוקרתי עם AI',
        'חבילות מנוי גמישות ומותאמות',
        'קבלת פניות איכותיות מדיירים מאומתים',
        'מערכת CRM חכמה ומתקדמת',
        'דוחות וניתוחים עם בינה מלאכותית',
        'תמיכה טכנית יוקרתית 24/7'
      ],
      price: 'מ-₪499/חודש',
      popular: true,
      gradient: 'from-gold-500 to-warmGold-400',
      bgGradient: 'from-gold-50 to-cream-50'
    },
    {
      icon: FileText,
      title: 'שירותי בעלי מקצוע',
      subtitle: 'רשת מקצועית אקסקלוסיבית',
      description: 'הצגת שירותים מקצועיים, חיבור לפרויקטים איכותיים וניהול לקוחות חכם ומתקדם',
      features: [
        'הצגת תיק עבודות דיגיטלי מתקדם',
        'חיבור לפרויקטים איכותיים ורלוונטיים',
        'ניהול לקוחות חכם עם AI',
        'מערכת הצעות מחיר אוטומטית',
        'דירוגים וחוות דעת מאומתות',
        'קידום מקצועי וחשיפה מקסימלית'
      ],
      price: 'מ-₪299/חודש',
      popular: false,
      gradient: 'from-gold-500 to-warmGold-400',
      bgGradient: 'from-gold-50 to-cream-50'
    },
    {
      icon: MapPin,
      title: 'שירותי רשויות מקומיות',
      subtitle: 'כלים ממשלתיים מתקדמים',
      description: 'כלים מתקדמים לרשויות מקומיות לניהול, מעקב וחתימות דיגיטליות עם אבטחה ברמה ממשלתית',
      features: [
        'צפייה בפרויקטים לפי עיר עם מפות חכמות',
        'חתימות דיגיטליות מאובטחות',
        'מעקב אחר התקדמות בזמן אמת',
        'דוחות ממשלתיים מפורטים ומתקדמים',
        'ממשק אינטגרציה עם מערכות עירוניות',
        'תמיכה ייעודית ברמה ממשלתית'
      ],
      price: 'לפי הצעה',
      popular: false,
      gradient: 'from-gold-600 to-warmGold-700',
      bgGradient: 'from-gold-50 to-cream-50'
    }
  ];

  const additionalServices = [
    {
      icon: Search,
      title: 'מודול איתור נכסים AI',
      description: 'מערכת חיפוש מתקדמת עם בינה מלאכותית, מפות לוויין ותמונות תלת-מימד',
      gradient: 'from-gold-500 to-warmGold-400',
      stats: 'AI Powered'
    },
    {
      icon: Shield,
      title: 'מודול זכויות בנייה חכם',
      description: 'מנוע חיפוש חכם מחובר למקורות חוקיים בלבד עם עדכונים אוטומטיים',
      gradient: 'from-gold-500 to-warmGold-400',
      stats: 'Legal DB'
    },
    {
      icon: Clock,
      title: 'ניהול פרויקטים מתקדם',
      description: 'כלים מתקדמים לניהול ומעקב אחר התקדמות הפרויקט עם אוטומציה חכמה',
      gradient: 'from-gold-500 to-warmGold-400',
      stats: 'Automated'
    }
  ];

  const process = [
    {
      step: '01',
      title: 'הרשמה והגדרה חכמה',
      description: 'הרשמה פשוטה למערכת עם AI והגדרת הפרופיל האישי המותאם',
      icon: Target
    },
    {
      step: '02',
      title: 'חיבור ושיתוף מתקדם',
      description: 'חיבור אוטומטי עם בעלי עניין רלוונטיים ושיתוף מידע חכם',
      icon: Globe
    },
    {
      step: '03',
      title: 'ניהול ומעקב בזמן אמת',
      description: 'ניהול הפרויקט ומעקב אחר התקדמות בזמן אמת עם התראות חכמות',
      icon: Zap
    },
    {
      step: '04',
      title: 'השלמה והסגירה מושלמת',
      description: 'השלמת הפרויקט בהצלחה עם כל הצדדים המעורבים ודוח סיכום מפורט',
      icon: Award
    }
  ];

  const testimonials = [
    {
      name: 'אמיר כהן',
      role: 'יזם בנייה מוביל',
      company: 'כהן דיוולופמנט',
      content: 'השירות המקצועי והפלטפורמה המתקדמת שינו לי את כל הגישה לעבודה. הצלחתי לחבר עם דיירים איכותיים בקלות ולנהל פרויקטים ברמה שלא הכרתי קודם.',
      rating: 5,
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'שרה לוי',
      role: 'דיירת ויועצת נדל"ן',
      company: 'פרויקט תל אביב',
      content: 'התהליך היה פשוט, שקוף ויוקרתי. קיבלתי עדכונים קבועים, שירות אישי מעולה וידעתי בדיוק מה קורה עם הפרויקט שלי בכל רגע.',
      rating: 5,
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'מיכאל שפירא',
      role: 'אדריכל ראשי',
      company: 'שפירא אדריכלות',
      content: 'כאדריכל עם 25 שנות ניסיון, אני יכול להגיד שזו הפלטפורמה הכי מתקדמת ומקצועית שראיתי. הטכנולוגיה, השירות והתוצאות ברמה עולמית.',
      rating: 5,
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

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
              <Sparkles className="w-6 h-6 text-gold-600" />
              <span className="font-medium text-lg">שירותים מתקדמים ויוקרתיים</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight text-neutral-900">
              השירותים <span className="bg-gradient-to-r from-gold-600 via-warmGold-500 to-gold-700 bg-clip-text text-transparent">שלנו</span>
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-700 leading-relaxed max-w-4xl mx-auto">
              פתרונות מקיפים, מתקדמים ומותאמים אישית לכל בעלי העניין בתחום ההתחדשות העירונית 
              עם טכנולוגיה חדשנית ושירות ברמה יוקרתית
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-24 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-10">
              שירותים עיקריים
            </h2>
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
              חבילות שירותים מתקדמות ומותאמות לכל סוג משתמש עם טכנולוגיה חדשנית
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <div key={index} className={`relative group bg-gradient-to-br ${service.bgGradient} rounded-3xl shadow-luxury hover:shadow-luxury-lg transition-all duration-700 transform hover:-translate-y-4 overflow-hidden border border-neutral-200 ${service.popular ? 'ring-2 ring-gold-500' : ''}`}>
                {service.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="bg-gradient-to-r from-gold-500 to-warmGold-400 text-white px-6 py-2 rounded-full text-sm font-bold shadow-luxury">
                      הכי פופולרי
                    </div>
                  </div>
                )}
                
                <div className="relative p-12">
                  <div className="flex items-center justify-between mb-8">
                    <div className={`w-20 h-20 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center shadow-luxury group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-xs font-bold text-neutral-600 bg-white px-3 py-1.5 rounded-full shadow-md border border-neutral-200/50">
                      PREMIUM
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-neutral-900 mb-4">
                    {service.title}
                  </h3>
                  <h4 className={`text-lg font-semibold mb-4 bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                    {service.subtitle}
                  </h4>
                  
                  <p className="text-neutral-700 mb-8 leading-relaxed text-lg">
                    {service.description}
                  </p>
                  
                  <div className="text-3xl font-bold text-neutral-900 mb-8">
                    <span className="text-gradient-gold">{service.price}</span>
                  </div>
                  
                  <ul className="space-y-4 mb-10">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3 space-x-reverse text-neutral-700">
                        <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0" />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`w-full py-4 bg-gradient-to-r ${service.gradient} text-white rounded-2xl hover:shadow-luxury-lg transition-all duration-500 font-bold text-lg group-hover:scale-105 transform`}>
                    התחל עכשיו &larr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professionals Section */}
      <ProfessionalsSection />

      {/* Additional Services */}
      <section className="py-32 bg-gradient-to-br from-cream-50 to-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-10">
              שירותים טכנולוגיים מתקדמים
            </h2>
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
              כלים וטכנולוגיות חדשניות עם בינה מלאכותית לחוויה מושלמת ויעילות מקסימלית
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {additionalServices.map((service, index) => (
              <div key={index} className="group bg-white p-10 rounded-3xl shadow-luxury text-center hover:shadow-luxury-lg transition-all duration-500 transform hover:-translate-y-4 border border-neutral-200">
                <div className={`w-24 h-24 bg-gradient-to-br ${service.gradient} rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-luxury relative`}>
                  <service.icon className="w-12 h-12 text-white" />
                  <div className="absolute -top-2 -right-2 bg-navy-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {service.stats}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-6 group-hover:text-gold-600 transition-colors leading-tight">
                  {service.title}
                </h3>
                <p className="text-neutral-700 leading-relaxed px-2">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-32 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-10">
              איך זה עובד?
            </h2>
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
              תהליך פשוט, יעיל ומתקדם בארבעה שלבים עם ליווי אישי וטכנולוגיה חכמה
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {process.map((step, index) => (
              <div key={index} className="group text-center relative">
                <div className="w-24 h-24 bg-gradient-to-br from-gold-500 to-warmGold-400 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 text-2xl font-bold shadow-luxury-lg group-hover:scale-110 transition-transform duration-300">
                  {step.step}
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-warmGold-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-luxury group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4 group-hover:text-gold-600 transition-colors leading-tight">
                  {step.title}
                </h3>
                <p className="text-neutral-700 leading-relaxed px-2">
                  {step.description}
                </p>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full">
                    <ArrowLeft className="w-6 h-6 text-gold-300 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-gradient-to-br from-cream-50 to-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-10">
              מה הלקוחות המובילים שלנו אומרים
            </h2>
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
              חוות דעת אמיתיות מלקוחות מרוצים ומובילים בתחום
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-10 rounded-3xl shadow-luxury hover:shadow-luxury-lg transition-all duration-500 border border-neutral-200 group transform hover:-translate-y-2">
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-gold-500 fill-current" />
                  ))}
                </div>
                
                <p className="text-neutral-700 mb-8 leading-relaxed text-lg italic px-2">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center space-x-4 space-x-reverse border-t border-neutral-200 pt-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover shadow-md"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-neutral-900 text-lg">{testimonial.name}</div>
                    <div className="text-gold-600 font-semibold">{testimonial.role}</div>
                    <div className="text-neutral-600 text-sm">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-shimmer-gold bg-[length:200%_100%] animate-shimmer opacity-5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gold-400 to-warmGold-400 rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-warmGold-400 to-gold-400 rounded-full opacity-15 blur-3xl"></div>
        
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl lg:text-5xl font-bold mb-10">
            מוכן להתחיל?
          </h2>
          <p className="text-xl lg:text-2xl mb-8 text-cream-300 max-w-4xl mx-auto leading-relaxed">
            בחר את החבילה המתאימה לך והתחל את המסע שלך להתחדשות עירונית מוצלחת
          </p>
          <p className="text-lg mb-14 text-cream-400 max-w-3xl mx-auto">
            עם הטכנולוגיה המתקדמת ביותר, השירות המקצועי ביותר והתוצאות המרשימות ביותר בתחום
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <a
              href="/contact"
              className="group relative px-12 py-6 bg-gradient-to-r from-gold-500 via-warmGold-400 to-gold-500 text-white rounded-2xl hover:shadow-luxury-lg transition-all duration-500 transform hover:scale-105 font-bold text-xl shadow-luxury overflow-hidden border border-gold-400/50"
            >
              <div className="absolute inset-0 bg-shimmer-gold bg-[length:200%_100%] animate-shimmer opacity-30"></div>
              <span className="relative">צור קשר</span>
            </a>
            <a
              href="/login/residents"
              className="px-12 py-6 border-2 border-cream-300 text-cream-100 rounded-2xl hover:bg-white/5 transition-all duration-500 font-bold text-xl"
            >
              הרשמה חינם
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;