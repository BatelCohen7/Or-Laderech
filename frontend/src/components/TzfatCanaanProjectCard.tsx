import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Users, CheckCircle, Clock, MapPin } from 'lucide-react';
import { Card, Button, Badge } from './ui';
interface TzfatCanaanProjectCardProps {
  className?: string;
}

const TzfatCanaanProjectCard: React.FC<TzfatCanaanProjectCardProps> = ({ className = '' }) => {
  // נתונים קבועים לפרויקט צפת - שכונת כנען
  const projectData = {
    title: 'פרויקט התחדשות שכונת כנען',
    city: 'צפת',
    address: 'רחובות זלמן שזר והשבעה',
    stage: 'איסוף חתימות',
    progress: 35,
    apartments: 632,
    buildings: 63,
    residents_count: 632,
    developer_name: 'חגג\' צים',
    signedPercentage: 35,
    amidars: 120,
    complexes: 7
  };

  return (
    <div className="transform hover:-translate-y-1 transition-transform duration-300">
      <Card hover className={`overflow-hidden ${className}`}>
        <div className="relative">
          <img 
            src="https://images.pexels.com/photos/3182826/pexels-photo-3182826.jpeg?auto=compress&cs=tinysrgb&w=600" 
            alt="פרויקט התחדשות שכונת כנען"
            className="w-full h-56 object-cover transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute top-3 right-3">
            <Badge variant="warning">
              {projectData.stage}
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center space-x-2 space-x-reverse bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">
              <CheckCircle className="w-4 h-4 text-gold-500" />
              <span className="font-medium text-neutral-900">{projectData.signedPercentage}% חתמו</span>
            </div>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="text-lg font-bold text-neutral-900 mb-2">
            {projectData.title}
          </h3>
          
          <div className="flex items-center space-x-3 space-x-reverse text-neutral-600 mb-2">
            <MapPin className="w-4 h-4 text-gold-500" />
            <span className="text-sm">{projectData.address}, {projectData.city}</span>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse text-neutral-600 mb-4">
            <Building className="w-4 h-4 text-warmGold-500" />
            <span className="text-sm">{projectData.developer_name}</span>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-medium text-neutral-700">התקדמות חתימות</span>
              <span className="text-xs font-bold text-gold-600">{projectData.signedPercentage}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-gold-500 to-warmGold-400 h-2 rounded-full"
                style={{ width: `${projectData.signedPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="text-center p-2 bg-neutral-50 rounded-lg">
              <div className="text-lg font-bold text-neutral-900">{projectData.apartments}</div>
              <div className="text-xs font-medium text-neutral-600">דירות</div>
            </div>
            <div className="text-center p-2 bg-neutral-50 rounded-lg">
              <div className="text-lg font-bold text-neutral-900">{projectData.buildings}</div>
              <div className="text-xs font-medium text-neutral-600">בניינים</div>
            </div>
          </div>
          
          <div className="flex space-x-3 space-x-reverse">
            <Link to="/tzfat-canaan" className="flex-1">
              <Button variant="primary" size="sm" fullWidth>
                פרטי הפרויקט
              </Button>
            </Link>
            <Link to="/property-3d/1?address=רחוב זלמן שזר, צפת" className="flex-1">
              <Button variant="outline" size="sm" fullWidth>
                מודל תלת-ממדי
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TzfatCanaanProjectCard;