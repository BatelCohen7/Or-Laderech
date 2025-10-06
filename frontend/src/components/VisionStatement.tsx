import React from 'react';
import { Target, Sparkles, Heart, Users, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface VisionStatementProps {
  className?: string;
  compact?: boolean;
}

const VisionStatement: React.FC<VisionStatementProps> = ({ className = '', compact = false }) => {
  if (compact) {
    return (
      <div className={`bg-gradient-to-br from-navy-800 to-navy-900 text-white rounded-xl p-8 shadow-luxury ${className}`}>
        <div className="flex items-start space-x-4 space-x-reverse">
          <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-3">החזון של "לדרך"</h3>
            <p className="text-cream-200 leading-relaxed">
              להפוך את תהליך ההתחדשות העירונית בישראל לשקוף, אנושי ובטוח –
              כך שכל דייר ירגיש שיש לו כתובת, שותף, ודרך ברורה עד המפתח.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative py-24 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900"></div>
      <div className="absolute inset-0 bg-shimmer-gold bg-[length:200%_100%] animate-shimmer opacity-10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gold-400 to-warmGold-400 rounded-full opacity-15 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-warmGold-400 to-gold-400 rounded-full opacity-15 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-3 space-x-reverse bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full mb-8 shadow-luxury"
          >
            <Target className="w-6 h-6 text-gold-300" />
            <span className="font-medium text-lg">החזון שלנו</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-6xl font-bold mb-12 leading-tight"
          >
            <span className="bg-gradient-to-r from-gold-300 via-warmGold-200 to-gold-400 bg-clip-text text-transparent">
              החזון של "לדרך"
            </span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl text-white leading-relaxed font-light"
          >
            להפוך את תהליך ההתחדשות העירונית בישראל 
            <br />
            <span className="font-bold">לשקוף, אנושי ובטוח</span> –
            <br />
            כך שכל דייר ירגיש שיש לו כתובת, שותף, 
            <br />
            ודרך ברורה עד המפתח.
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-luxury">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">אנושיות</h3>
            <p className="text-cream-300 leading-relaxed">
              מאחורי כל דירה יש אנשים, משפחות וסיפורים. אנחנו מחויבים לשים את האנושיות במרכז.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-luxury">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">ביטחון</h3>
            <p className="text-cream-300 leading-relaxed">
              אנו מספקים את הכלים, המידע והליווי שיוצרים תחושת ביטחון לאורך כל הדרך.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-luxury">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">שותפות</h3>
            <p className="text-cream-300 leading-relaxed">
              אנחנו לא רק פלטפורמה, אנחנו שותפים אמיתיים בדרך להתחדשות מוצלחת.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VisionStatement;