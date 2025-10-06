import React from 'react';
import { Award, Users, Target, Heart, CheckCircle, TrendingUp, Sparkles, Globe, Shield, Zap } from 'lucide-react';
import PersonalStory from '../components/PersonalStory';
import VisionStatement from '../components/VisionStatement';

const AboutPage = () => {
  const values = [
    {
      icon: Target,
      title: 'מקצועיות מתקדמת',
      description: 'רמת מקצועיות יוקרתית עם טכנולוגיה חדשנית בכל פרויקט ופעילות',
      gradient: 'from-gold-500 to-warmGold-400'
    },
    {
      icon: Heart,
      title: 'אמינות מוחלטת',
      description: 'בונים יחסי אמון עמוקים עם כל הגורמים המעורבים בפרויקט',
      gradient: 'from-warmGold-500 to-gold-400'
    },
    {
      icon: Users,
      title: 'שיתוף פעולה חכם',
      description: 'מאמינים בכוח השיתוף החכם בין כל בעלי העניין',
      gradient: 'from-gold-500 to-warmGold-400'
    },
    {
      icon: TrendingUp,
      title: 'חדשנות טכנולוגית',
      description: 'משתמשים בטכנולוגיות מתקדמות ובינה מלאכותית לפתרונות יעילים',
      gradient: 'from-warmGold-600 to-gold-800'
    }
  ];

  const achievements = [
    { number: '₪2.5B+', label: 'שווי פרויקטים', sublabel: 'בניהול הפלטפורמה' },
    { number: '15,000+', label: 'לקוחות מרוצים', sublabel: 'ברחבי הארץ' },
    { number: '98.7%', label: 'שביעות רצון', sublabel: 'מהלקוחות שלנו' },
    { number: '50+', label: 'ערים בישראל', sublabel: 'עם נוכחות פעילה' }
  ];

  const teamMembers = [
    {
      name: 'אדר׳ יעקב כהן',
      role: 'מנכ"ל ומייסד',
      description: 'מעל 20 שנות ניסיון בתחום ההתחדשות העירונית ופיתוח טכנולוגי',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
      gradient: 'from-gold-500 to-warmGold-400'
    },
    {
      name: 'עו"ד רחל לוי',
      role: 'סמנכ"לית משפטים',
      description: 'מומחית מובילה לחקיקה ורגולציה בתחום הבנייה והתכנון',
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400',
      gradient: 'from-warmGold-500 to-gold-400'
    },
    {
      name: 'מהנ׳ דוד שפירא',
      role: 'מנהל טכנולוגיות',
      description: 'מוביל בפיתוח פתרונות טכנולוגיים חדשניים ובינה מלאכותית',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400',
      gradient: 'from-gold-500 to-warmGold-400'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cream-50 via-neutral-50 to-cream-100 text-neutral-900 py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-shimmer-gold bg-[length:200%_100%] animate-shimmer opacity-20"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-gold-300 to-warmGold-300 rounded-full opacity-30 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-gold-300 to-warmGold-300 rounded-full opacity-30 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center space-x-3 space-x-reverse bg-gradient-to-r from-gold-100 to-warmGold-100 backdrop-blur-sm border border-gold-200 text-gold-800 px-8 py-4 rounded-full mb-12 shadow-luxury">
              <Sparkles className="w-6 h-6 text-gold-600" />
              <span className="font-medium text-lg">המובילים בתחום ההתחדשות העירונית</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight text-neutral-900">
              אודות <span className="bg-gradient-to-r from-gold-600 via-warmGold-500 to-gold-700 bg-clip-text text-transparent">אור&nbsp;לדרך</span>
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-700 leading-relaxed max-w-4xl mx-auto">
              אנחנו המרכז הטכנולוגי המוביל בישראל להתחדשות עירונית, המתמחה בחיבור חכם 
              בין כל בעלי העניין בתחום עם רמת שירות יוקרתית ללא פשרות
            </p>
          </div>
        </div>
      </section>

      {/* Personal Story Section */}
      <section className="py-32 bg-gradient-to-br from-cream-50 to-neutral-50 border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <PersonalStory />
        </div>
      </section>

      {/* Vision Statement */}
      <VisionStatement />

      {/* Mission & Vision */}
      <section id="vision" className="py-32 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-10">המשימה שלנו</h2>
              <p className="text-xl text-neutral-700 leading-relaxed mb-6">
                להוביל את המהפכה האנושית בתחום ההתחדשות העירונית בישראל באמצעות 
                טכנולוגיה מתקדמת, שירות אישי ויצירת פלטפורמה אמינה המאפשרת לכל הגורמים 
                לעבוד יחד בצורה יעילה, שקופה ומתקדמת.
              </p>
              <p className="text-xl text-neutral-700 leading-relaxed mb-10">
                אנו מאמינים שמאחורי כל דירה יש אנשים, משפחות וסיפורים. ואנחנו כאן בשבילם.
              </p>
              <div className="space-y-6">
                {[
                  'ליווי אנושי ואישי לכל דייר',
                  'שקיפות מלאה בכל שלבי הפרויקט',
                  'יצירת תחושת ביטחון ואמון',
                  'טכנולוגיה מתקדמת בשירות האדם'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 space-x-reverse group">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-xl flex items-center justify-center shadow-luxury-lg group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-lg font-medium text-neutral-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-luxury-lg">
                <img
                  src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="משימה" 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-warmGold-400/20"></div>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-warmGold-400 to-gold-400 rounded-2xl opacity-80 animate-bounce-gentle"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-gold-400 to-warmGold-400 rounded-2xl opacity-60 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 bg-gradient-to-br from-cream-50 to-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-10">
              הערכים שמנחים אותנו
            </h2>
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
              הערכים הטכנולוגיים והמקצועיים המנחים אותנו בכל פעילות ופרויקט
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="group bg-white p-10 rounded-3xl shadow-luxury hover:shadow-luxury-lg text-center transition-all duration-500 transform hover:-translate-y-4 border border-neutral-200">
                <div className={`w-20 h-20 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-luxury group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-6 leading-tight">
                  {value.title}
                </h3>
                <p className="text-neutral-700 leading-relaxed px-2">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-32 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-shimmer-gold bg-[length:200%_100%] animate-shimmer opacity-5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gold-400 to-warmGold-400 rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-warmGold-400 to-gold-400 rounded-full opacity-15 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-5xl font-bold mb-10">
              ההישגים המרשימים שלנו
            </h2>
            <p className="text-xl text-cream-300 max-w-3xl mx-auto leading-relaxed">
              מספרים שמספרים את סיפור ההצלחה והמובילות שלנו בתחום
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gold-300 to-warmGold-200 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {achievement.number}
                </div>
                <div className="text-xl font-semibold text-cream-200 mb-2 leading-tight">
                  {achievement.label}
                </div>
                <div className="text-sm text-cream-400">
                  {achievement.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-32 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-10">
              הצוות המוביל שלנו
            </h2>
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
              אנשי מקצוע מובילים עם ניסיון רב ומומחיות טכנולוגית בתחום ההתחדשות העירונית
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="group bg-white rounded-3xl shadow-luxury hover:shadow-luxury-lg overflow-hidden transition-all duration-500 transform hover:-translate-y-4 border border-neutral-200">
                <div className="relative">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${member.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                </div>
                <div className="p-10">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-3 leading-tight">
                    {member.name}
                  </h3>
                  <div className={`text-lg font-semibold mb-4 bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent`}>
                    {member.role}
                  </div>
                  <p className="text-neutral-700 leading-relaxed px-2">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-cream-50 to-neutral-50 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-gold-200 to-warmGold-300 rounded-full opacity-30 animate-bounce-gentle"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-warmGold-200 to-gold-300 rounded-full opacity-30 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-10">
            רוצה לדעת עוד?
          </h2>
          <p className="text-xl text-neutral-700 mb-14 max-w-3xl mx-auto leading-relaxed">
            נשמח לפגוש אותך ולספר עוד על החזון שלנו, הטכנולוגיה המתקדמת ואיך נוכל לעזור לך להגשים את הפרויקט שלך
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
              href="/services"
              className="px-12 py-6 border-2 border-gold-500 text-gold-600 rounded-2xl hover:bg-gold-50 transition-all duration-500 font-bold text-xl shadow-sm hover:shadow-md"
            >
              השירותים שלנו
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;