import React, { useState } from 'react';
import { 
  Building, 
  Info,
  Eye, 
  Download, 
  Share, 
  Layers, 
  Ruler, 
  Camera, 
  Palette,
  Home,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Maximize,
} from 'lucide-react';
import { Card, Button, Badge } from '../ui';
import { useNavigate } from 'react-router-dom';

interface Property3D {
  id: string;
  name: string;
  address: string;
  type: 'current' | 'planned' | 'alternative';
  status: 'available' | 'processing' | 'ready';
  thumbnail: string;
  modelUrl?: string;
  lastUpdated: string;
  fileSize: string;
  quality: 'high' | 'medium' | 'low';
}

const PropertyManagement3D: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  const properties3D: Property3D[] = [
    {
      id: '1',
      name: 'המבנה הנוכחי - הרצל 45',
      address: 'רחוב הרצל 45, תל אביב',
      type: 'current',
      status: 'ready',
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      modelUrl: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
      lastUpdated: '2024-01-20',
      fileSize: '2.4 MB',
      quality: 'high'
    },
    {
      id: '2',
      name: 'התכנית המוצעת - מגדל חדש',
      address: 'רחוב הרצל 45, תל אביב',
      type: 'planned',
      status: 'ready',
      thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
      modelUrl: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
      lastUpdated: '2024-01-18',
      fileSize: '3.1 MB',
      quality: 'high'
    },
    {
      id: '3',
      name: 'חלופה ב - עיצוב מודרני',
      address: 'רחוב הרצל 45, תל אביב',
      type: 'alternative',
      status: 'processing',
      thumbnail: 'https://images.pexels.com/photos/3184834/pexels-photo-3184834.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastUpdated: '2024-01-15',
      fileSize: '2.8 MB',
      quality: 'medium'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'current': return 'text-blue-600 bg-blue-100';
      case 'planned': return 'text-accent-600 bg-accent-100';
      case 'alternative': return 'text-gold-600 bg-gold-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'current': return 'נוכחי';
      case 'planned': return 'מתוכנן';
      case 'alternative': return 'חלופי';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-accent-600 bg-accent-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'available': return 'text-neutral-600 bg-neutral-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'מוכן לצפייה';
      case 'processing': return 'בעיבוד';
      case 'available': return 'זמין';
      default: return status;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'high': return 'text-accent-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-neutral-600';
    }
  };

  const handleView3D = (property: Property3D) => {
    if (property.status === 'ready') {
      navigate(`/property-3d/${property.id}?address=${encodeURIComponent(property.address)}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center space-x-4 space-x-reverse mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">מודלים תלת-ממדיים</h2>
            <p className="text-neutral-600">צפה במודלים אינטראקטיביים של הנכס</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{properties3D.length}</div>
            <div className="text-sm text-blue-700">מודלים זמינים</div>
          </div>
          <div className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-accent-600">
              {properties3D.filter(p => p.status === 'ready').length}
            </div>
            <div className="text-sm text-accent-700">מוכנים לצפייה</div>
          </div>
          <div className="bg-gradient-to-r from-gold-50 to-warmGold-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gold-600">WebGL</div>
            <div className="text-sm text-gold-700">טכנולוגיה</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">4K</div>
            <div className="text-sm text-purple-700">רזולוציה</div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2 space-x-reverse">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              רשת
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              רשימה
            </button>
          </div>
          
          <div className="text-sm text-neutral-600">
            {properties3D.length} מודלים • עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')}
          </div>
        </div>
      </Card>

      {/* 3D Models Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties3D.map((property) => (
            <Card key={property.id} hover>
              <div className="relative">
                {/* Thumbnail */}
                <div className="relative h-48 bg-neutral-100 rounded-xl overflow-hidden mb-4">
                  <img 
                    src={property.thumbnail} 
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge variant={property.status === 'ready' ? 'success' : 
                                   property.status === 'processing' ? 'warning' : 'default'}>
                      {getStatusText(property.status)}
                    </Badge>
                  </div>
                  
                  {/* Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(property.type)}`}>
                      {getTypeLabel(property.type)}
                    </span>
                  </div>
                  
                  {/* Play Button Overlay */}
                  {property.status === 'ready' && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20 cursor-pointer"
                      onClick={() => handleView3D(property)}
                    >
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-neutral-900 mb-1">{property.name}</h3>
                    <p className="text-sm text-neutral-600">{property.address}</p>
                  </div>
                  
                  {/* Model Info */}
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>גודל: {property.fileSize}</span>
                    <span className={`font-medium ${getQualityColor(property.quality)}`}>
                      איכות: {property.quality === 'high' ? 'גבוהה' : 
                               property.quality === 'medium' ? 'בינונית' : 'נמוכה'}
                    </span>
                  </div>
                  
                  <div className="text-xs text-neutral-500">
                    עודכן: {new Date(property.lastUpdated).toLocaleDateString('he-IL')}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 space-x-reverse pt-3">
                    {property.status === 'ready' ? (
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="flex-1" 
                        icon={Eye}
                        onClick={() => handleView3D(property)}
                      >
                        צפה במודל
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="flex-1" disabled>
                        {property.status === 'processing' ? 'בעיבוד...' : 'לא זמין'}
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="sm" icon={Download}>
                      הורד
                    </Button>
                    <Button variant="ghost" size="sm" icon={Share}>
                      שתף
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {properties3D.map((property) => (
            <Card key={property.id} hover>
              <div className="flex items-center space-x-4 space-x-reverse">
                {/* Thumbnail */}
                <div className="w-24 h-24 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={property.thumbnail} 
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 space-x-reverse mb-1">
                        <h3 className="font-bold text-neutral-900">{property.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(property.type)}`}>
                          {getTypeLabel(property.type)}
                        </span>
                        <Badge variant={property.status === 'ready' ? 'success' : 
                                       property.status === 'processing' ? 'warning' : 'default'} size="sm">
                          {getStatusText(property.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">{property.address}</p>
                      <div className="flex items-center space-x-4 space-x-reverse text-xs text-neutral-500">
                        <span>גודל: {property.fileSize}</span>
                        <span className={`font-medium ${getQualityColor(property.quality)}`}>
                          איכות: {property.quality === 'high' ? 'גבוהה' : 
                                   property.quality === 'medium' ? 'בינונית' : 'נמוכה'}
                        </span>
                        <span>עודכן: {new Date(property.lastUpdated).toLocaleDateString('he-IL')}</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex space-x-2 space-x-reverse">
                      {property.status === 'ready' ? (
                        <Button 
                          variant="primary" 
                          size="sm" 
                          icon={Eye}
                          onClick={() => handleView3D(property)}
                        >
                          צפה במודל
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          {property.status === 'processing' ? 'בעיבוד...' : 'לא זמין'}
                        </Button>
                      )}
                      
                      <Button variant="ghost" size="sm" icon={Download} />
                      <Button variant="ghost" size="sm" icon={Share} />
                      <Button variant="ghost" size="sm" icon={Info} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Instructions */}
      <Card>
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">איך להשתמש במודלים תלת-ממדיים</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-800">צפייה במודל</h4>
                <p className="text-sm text-neutral-600">לחץ על "צפה במודל" כדי לפתוח את המודל התלת-ממדי האינטראקטיבי</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-4 h-4 text-accent-600" />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-800">סיבוב ותנועה</h4>
                <p className="text-sm text-neutral-600">גרור עם העכבר כדי לסובב, השתמש בגלגל כדי להתקרב או להתרחק</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-8 h-8 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Layers className="w-4 h-4 text-gold-600" />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-800">השוואת תכניות</h4>
                <p className="text-sm text-neutral-600">השווה בין המבנה הנוכחי לתכניות המוצעות</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Download className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-800">הורדה ושיתוף</h4>
                <p className="text-sm text-neutral-600">הורד את המודל או שתף אותו עם אחרים</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PropertyManagement3D;