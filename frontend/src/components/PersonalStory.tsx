import React from 'react';
import { Heart, Target, Shield, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './ui';

interface PersonalStoryProps {
  className?: string;
  compact?: boolean;
}

const PersonalStory: React.FC<PersonalStoryProps> = ({ className = '', compact = false }) => {
  return (
    <div className={`${className}`}>
      {compact ? (
        <Card className="p-8 shadow-luxury border-gold-200 bg-gradient-to-br from-cream-50 to-neutral-50">
          <div className="flex items-start space-x-6 space-x-reverse">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-xl flex items-center justify-center shadow-luxury flex-shrink-0">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">הסיפור שלי – למה "לדרך" נולדה</h3>
              <p className="text-neutral-700 leading-relaxed mb-4">
                המסע שלי בעולם ההתחדשות העירונית התחיל הרבה לפני שהפכתי את זה לעשייה.
                הוא התחיל בבית, בתוך משפחה שחוותה על בשרה את חוסר הוודאות, את ההבטחות שנשברו, את ההרגשה שאתה רק מספר.
              </p>
              <div className="text-gold-600 font-medium">
                "לדרך" נולדה מתוך הרצון לתת לדיירים בדיוק את מה שלי לא היה – שקיפות, ביטחון, תמיכה אנושית.
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-12">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-3 space-x-reverse bg-gradient-to-r from-gold-100 to-warmGold-100 backdrop-blur-sm border border-gold-200 text-gold-800 px-8 py-4 rounded-full mb-8 shadow-luxury"
            >
              <Heart className="w-6 h-6 text-gold-600" />
              <span className="font-medium text-lg">הסיפור האישי שלי</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-8"
            >
              למה "לדרך" <span className="bg-gradient-to-r from-gold-600 via-warmGold-500 to-gold-700 bg-clip-text text-transparent">נולדה</span>
            </motion.h2>
          </div>
          
          <div className="bg-white rounded-3xl shadow-luxury-lg p-10 lg:p-16 border border-neutral-200 max-w-5xl mx-auto">
            <div className="space-y-8">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-xl text-neutral-800 leading-relaxed"
              >
                המסע שלי בעולם ההתחדשות העירונית התחיל הרבה לפני שהפכתי את זה לעשייה.
              </motion.p>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-xl text-neutral-800 leading-relaxed"
              >
                הוא התחיל בבית, בתוך משפחה שחוותה על בשרה את חוסר הוודאות, את ההבטחות שנשברו, את ההרגשה שאתה רק מספר.
              </motion.p>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-xl text-neutral-800 leading-relaxed"
              >
                ראיתי הורים, שכנים, קשישים – מבולבלים, מתוחים, לא יודעים למי לפנות.
                <br />הרגשתי את הכאב, את האכזבה, את תחושת חוסר האונים.
                <br />לא יכולתי להישאר אדיש.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="text-2xl font-bold text-gold-600 py-6 border-y border-gold-200 my-8"
              >
                "לדרך" נולדה מתוך הרצון לתת לדיירים בדיוק את מה שלי לא היה –
                <br />שקיפות, ביטחון, תמיכה אנושית, וליווי שמרגיש כמו שותפות אמיתית.
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                className="text-xl text-neutral-800 leading-relaxed"
              >
                לא עוד פלטפורמה קרה ומרוחקת, אלא מקום שמדבר בגובה העיניים.
              </motion.p>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                viewport={{ once: true }}
                className="text-xl text-neutral-800 leading-relaxed"
              >
                המטרה שלי ברורה: שדייר לא ירגיש לבד.
                <br />שהמסע להתחדשות יהיה ברור, נעים, ועם מישהו שמהצד שלך – גם מקצועית, גם רגשית.
              </motion.p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalStory;