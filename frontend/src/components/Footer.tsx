import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, ChevronRight, Globe, Shield, Zap, Info } from 'lucide-react';

const Footer = () => {
  const domain = import.meta.env.VITE_DOMAIN || 'orbaderech.co.il';
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-br from-navy-800 to-navy-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-shimmer-gold bg-[length:200%_100%] animate-shimmer opacity-5"></div>
      
      <div className="container mx-auto px-4 py-16 relative">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div 
            className="space-y-6"
          >
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-xl flex items-center justify-center shadow-luxury">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-gold-400 to-warmGold-300 bg-clip-text text-transparent">
                  אור לדרך
                </div>
                <div className="text-sm text-cream-200 font-medium">שקיפות, ביטחון, תמיכה אנושית</div>
              </div>
            </div>
            <p className="text-cream-100 text-sm leading-relaxed">
              המרכז המוביל בישראל להתחדשות עירונית, המחבר בין דיירים, יזמים, בעלי מקצוע ורשויות מקומיות לקידום פרויקטים איכותיים ויעילים.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a 
                href="#" 
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div 
            className="space-y-6"
          >
            <h3 className="text-lg font-bold text-cream-100 after:content-[''] after:block after:w-12 after:h-1 after:bg-gold-500 after:mt-2">קישורים מהירים</h3>
            <nav className="space-y-3">
              <Link to="/about" className="flex items-center text-cream-200 hover:text-gold-400 transition-colors text-sm font-medium group">
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>אודות</span>
              </Link>
              <Link to="/services" className="flex items-center text-cream-200 hover:text-gold-400 transition-colors text-sm font-medium group">
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>שירותים</span>
              </Link>
              <Link to="/projects" className="flex items-center text-cream-200 hover:text-gold-400 transition-colors text-sm font-medium group">
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>פרויקטים</span>
              </Link>
              <Link to="/planning-rights" className="flex items-center text-cream-200 hover:text-gold-400 transition-colors text-sm font-medium group">
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>ניתוח זכויות תכנוניות</span>
              </Link>
              <Link to="/contact" className="flex items-center text-cream-200 hover:text-gold-400 transition-colors text-sm font-medium group">
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>צור קשר</span>
              </Link>
            </nav>
          </div>

          {/* User Areas */}
          <div 
            className="space-y-6"
          >
            <h3 className="text-lg font-bold text-cream-100 after:content-[''] after:block after:w-12 after:h-1 after:bg-gold-500 after:mt-2">אזורים אישיים</h3>
            <nav className="space-y-3">
              <Link to="/resident-login" className="flex items-center text-cream-200 hover:text-gold-400 transition-colors text-sm font-medium group">
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>כניסת דיירים</span>
              </Link>
              <Link to="/login/developers" className="flex items-center text-cream-200 hover:text-warmGold-400 transition-colors text-sm font-medium group">
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>כניסת יזמים</span>
              </Link>
              <Link to="/login/professionals" className="flex items-center text-cream-200 hover:text-gold-500 transition-colors text-sm font-medium group">
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>כניסת בעלי מקצוע</span>
              </Link>
              <Link to="/login/authorities" className="flex items-center text-cream-200 hover:text-warmGold-500 transition-colors text-sm font-medium group">
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>כניסת רשויות</span>
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div 
            className="space-y-6"
          >
            <h3 className="text-lg font-bold text-cream-100 after:content-[''] after:block after:w-12 after:h-1 after:bg-gold-500 after:mt-2">יצירת קשר</h3>
            <div className="space-y-4">
              <div 
                className="flex items-center space-x-3 space-x-reverse text-sm group"
              >
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500 transition-colors">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span className="text-cream-200 group-hover:text-gold-400 transition-colors">050-2871717</span>
              </div>
              <div 
                className="flex items-center space-x-3 space-x-reverse text-sm group"
              >
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500 transition-colors">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span className="text-cream-200 group-hover:text-gold-400 transition-colors">ladereh@gmail.com</span>
              </div>
              <div 
                className="flex items-start space-x-3 space-x-reverse text-sm group"
              >
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-gold-500 transition-colors">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-cream-200 group-hover:text-gold-400 transition-colors">
                  אחוזה 70<br />
                  רעננה, ישראל
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 border-t border-neutral-700 pt-12">
          <div 
            className="flex items-center space-x-4 space-x-reverse group"
          >
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
              <Shield className="w-6 h-6 text-gold-300" />
            </div>
            <div>
              <h4 className="font-semibold text-cream-100 group-hover:text-gold-300 transition-colors">אבטחה מתקדמת</h4>
              <p className="text-sm text-cream-300 group-hover:text-cream-200 transition-colors">הגנה מלאה על המידע האישי שלך</p>
            </div>
          </div>
          <div 
            className="flex items-center space-x-4 space-x-reverse group"
          >
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
              <Zap className="w-6 h-6 text-gold-300" />
            </div>
            <div>
              <h4 className="font-semibold text-cream-100 group-hover:text-gold-300 transition-colors">מענה מהיר</h4>
              <p className="text-sm text-cream-300 group-hover:text-cream-200 transition-colors">תגובה תוך שעתיים בימי עבודה</p>
            </div>
          </div>
          <div 
            className="flex items-center space-x-4 space-x-reverse group"
          >
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
              <Globe className="w-6 h-6 text-gold-300" />
            </div>
            <div>
              <h4 className="font-semibold text-cream-100 group-hover:text-gold-300 transition-colors">זמינות גלובלית</h4>
              <p className="text-sm text-cream-300 group-hover:text-cream-200 transition-colors">שירות מקצועי בכל מקום בעולם</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-cream-400">
              © {currentYear} אור לדרך - המרכז להתחדשות עירונית. כל הזכויות שמורות.
            </div>
            <div className="text-sm text-cream-400">
              <span className="text-gold-400 font-medium">"</span>
              שדייר לא ירגיש לבד
              <span className="text-gold-400 font-medium">"</span>
            </div>
            <div className="flex space-x-6 space-x-reverse text-sm">
              <a href="#" className="text-cream-400 hover:text-gold-300 transition-colors font-medium">
                תקנון השימוש
              </a>
              <a href="#" className="text-cream-400 hover:text-gold-300 transition-colors font-medium">
                מדיניות פרטיות
              </a>
              <a href="#" className="text-cream-400 hover:text-gold-300 transition-colors font-medium">
                הצהרת נגישות
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;