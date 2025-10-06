import React from 'react';
import { 
  Scale, 
  Calculator, 
  HardHat, 
  Ruler, 
  FileText, 
  Briefcase, 
  Award, 
  Users, 
  Shield, 
  Heart, 
  Handshake, 
  Sparkles, 
  ArrowRight, 
  CheckCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Card } from './ui';
import { Link } from 'react-router-dom';

interface ProfessionalsSectionProps {
  className?: string;
  compact?: boolean;
}

const ProfessionalsSection: React.FC<ProfessionalsSectionProps> = ({ className = '', compact = false }) => {
  const professionals = [
    {
      title: 'עורכי דין',
      icon: Scale,
      description: 'ליווי משפטי מקצועי בתהליכי התחדשות עירונית',
      benefits: ['חשיפה ללקוחות איכותיים', 'פרופיל מקצועי מתקדם', 'כלים לייעול תהליכים משפטיים'],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'שמאים',
      icon: Calculator,
      description: 'שמאות מקרקעין ובדיקות כדאיות כלכלית',
      benefits: ['גישה למאגר נתונים עדכני', 'כלים לניתוח כלכלי מתקדם', 'חיבור ליזמים ודיירים'],
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'מהנדסים',
      icon: HardHat,
      description: 'תכנון הנדסי, פיקוח וליווי פרויקטים',
      benefits: ['הצגת פרויקטים קודמים', 'חיבור לפרויקטים חדשים', 'כלים לניהול פרויקטים'],
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'אדריכלים',
      icon: Ruler,
      description: 'תכנון אדריכלי ועיצוב פרויקטי התחדשות',
      benefits: ['תיק עבודות דיגיטלי', 'חשיפה ליזמים', 'כלים לשיתוף תכניות ומודלים'],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const coreValues = [
    {
      title: 'אמון',
      icon: Shield,
      description: 'אנו בונים מערכת יחסים המבוססת על אמון הדדי עם כל בעלי המקצוע בפלטפורמה',
      color: 'from-gold-500 to-warmGold-400'
    },
    {
      title: 'שקיפות',
      icon: FileText,
      description: 'מחויבים לשקיפות מלאה בכל התהליכים, המסמכים והתקשורת בין כל הצדדים',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'שותפות',
      icon: Handshake,
      description: 'אנו רואים בבעלי המקצוע שותפים אמיתיים להצלחת פרויקטי ההתחדשות',
      color: 'from-accent-500 to-accent-600'
    }
  ];

  if (compact) {
    return (
      <Card className={`p-8 shadow-luxury border-gold-200 ${className}`}>
        <div className="flex items-start space-x-6 space-x-reverse">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-xl flex items-center justify-center shadow-luxury flex-shrink-0">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">בעלי מקצוע - הצטרפו אלינו</h3>
            <p className="text-neutral-700 leading-relaxed mb-4">
              אנו מזמינים עורכי דין, שמאים, מהנדסים ואדריכלים להצטרף לפלטפורמה שלנו ולהיות חלק ממהפכת ההתחדשות העירונית.
            </p>
            <Link to="/services" className="text-gold-600 font-medium flex items-center">
              למידע נוסף
              <ArrowRight className="w-4 h-4 mr-1" />
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <section className={`py-24 bg-gradient-to-br from-cream-50 to-neutral-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-3 space-x-reverse bg-gradient-to-r from-gold-100 to-warmGold-100 backdrop-blur-sm border border-gold-200 text-gold-800 px-8 py-4 rounded-full mb-8 shadow-luxury"
          >
            <Briefcase className="w-6 h-6 text-gold-600" />
            <span className="font-medium text-lg">בעלי מקצוע</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6"
          >
            הצטרפו ל<span className="bg-gradient-to-r from-gold-600 via-warmGold-500 to-gold-700 bg-clip-text text-transparent">קהילת המקצוענים</span> שלנו
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-neutral-700 leading-relaxed"
          >
            אנו מזמינים בעלי מקצוע מובילים בתחום ההתחדשות העירונית להצטרף לפלטפורמה שלנו
            ולהיות חלק ממהפכה שמשנה את פני הענף - עם דגש על אנושיות, מקצועיות ושקיפות
          </motion.p>
        </div>

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-20">
          {professionals.map((professional, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card hover className="h-full p-8 shadow-sm border-neutral-200 transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-br ${professional.color} rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <professional.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-gold-600 transition-colors">
                  {professional.title}
                </h3>
                
                <p className="text-neutral-700 mb-6">
                  {professional.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  {professional.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start space-x-2 space-x-reverse">
                      <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700">{benefit}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-auto pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-center border-gold-300 text-gold-600 hover:bg-gold-50"
                  >
                    הצטרף עכשיו
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Why Join Us */}
        <div className="max-w-5xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="p-10 shadow-luxury border-gold-200">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-luxury">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">למה להצטרף אלינו?</h3>
                <p className="text-neutral-700 max-w-3xl mx-auto">
                  הצטרפות לפלטפורמת "אור לדרך" מעניקה לך יתרונות ייחודיים שיעזרו לך להתבלט בשוק התחרותי של ההתחדשות העירונית
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-gradient-to-r from-gold-50 to-warmGold-50 rounded-xl">
                  <Users className="w-10 h-10 text-gold-600 mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-neutral-900 mb-2">חשיפה ללקוחות</h4>
                  <p className="text-neutral-700 text-sm">
                    גישה ישירה לדיירים ויזמים המחפשים בעלי מקצוע איכותיים ומהימנים
                  </p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                  <Briefcase className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-neutral-900 mb-2">פרופיל מקצועי</h4>
                  <p className="text-neutral-700 text-sm">
                    הצגת הניסיון, ההסמכות והפרויקטים שלך בפרופיל מקצועי מתקדם
                  </p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl">
                  <Sparkles className="w-10 h-10 text-accent-600 mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-neutral-900 mb-2">כלים מתקדמים</h4>
                  <p className="text-neutral-700 text-sm">
                    גישה לכלים טכנולוגיים מתקדמים שיסייעו לך לעבוד ביעילות ומקצועיות
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Core Values */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-neutral-900 mb-4"
            >
              הערכים המובילים אותנו
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-neutral-700 max-w-3xl mx-auto"
            >
              אנו מאמינים שהצלחת פרויקטי התחדשות עירונית תלויה ביחסים המבוססים על ערכים משותפים
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card hover className="h-full p-8 text-center shadow-sm border-neutral-200 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-gold-600 transition-colors">
                    {value.title}
                  </h3>
                  
                  <p className="text-neutral-700">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Button 
              variant="primary" 
              size="lg" 
              className="px-10 py-6 text-lg shadow-luxury border border-gold-400/50"
            >
              הצטרף לקהילת המקצוענים
            </Button>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-neutral-600 mt-4"
          >
            הצטרפו ל-500+ בעלי מקצוע שכבר נהנים מהיתרונות של הפלטפורמה
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalsSection;