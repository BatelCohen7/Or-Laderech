import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, Search, Filter, MapPin, CheckCircle, Clock, Star, Info } from 'lucide-react';
import { Card, Button, Badge, Input, LoadingSpinner } from '../components/ui';
import TzfatCanaanProjectCard from '../components/TzfatCanaanProjectCard';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      // Mock data for projects
      const mockProjects = [
        {
          id: '1',
          title: 'צפת – שכונת כנען',
          description: 'פרויקט התחדשות עירונית מקיף בשכונת כנען בצפת, הכולל שיפוץ ושדרוג מבנים קיימים.',
          city: 'צפת',
          address: 'רחובות זלמן שזר והשבעה, שכונת כנען',
          stage: 'איסוף חתימות',
          progress: 35,
          apartments: 632,
          residents_count: 632,
          developer_name: 'חגג\' צים',
          image_url: 'https://images.pexels.com/photos/3182826/pexels-photo-3182826.jpeg?auto=compress&cs=tinysrgb&w=600',
          start_date: '2023-10-01',
          expected_completion: '2026-12-31',
          rating: 4.6
        },
        {
          id: '2',
          title: 'תל אביב – אבן גבירול 187–193',
          description: 'פרויקט התחדשות עירונית בשלב מתקדם, לפני החלטת ועדה. 100% מהדיירים חתמו על ההסכם.',
          city: 'תל אביב-יפו',
          address: 'רחוב אבן גבירול 187-193',
          stage: 'לפני החלטת ועדה',
          progress: 100,
          apartments: 64,
          residents_count: 128,
          developer_name: 'אבירים יזמות ובנייה',
          image_url: 'https://images.pexels.com/photos/3182834/pexels-photo-3182834.jpeg?auto=compress&cs=tinysrgb&w=600',
          start_date: '2023-01-15',
          expected_completion: '2025-12-31',
          rating: 4.8
        },
        {
          id: '3',
          title: 'אור יהודה – רחוב העצמאות',
          description: 'פרויקט התחדשות עירונית בשלב מוקדם עם 16 דיירים חתומים. תב״ע מאושרת ותקפה.',
          city: 'אור יהודה',
          address: 'רחוב העצמאות',
          stage: 'שלב מוקדם',
          progress: 15,
          apartments: 128,
          residents_count: 744,
          developer_name: 'קבוצת יזמות אור',
          image_url: 'https://images.pexels.com/photos/3182823/pexels-photo-3182823.jpeg?auto=compress&cs=tinysrgb&w=600',
          start_date: '2024-03-01',
          expected_completion: '2027-12-31',
          rating: 4.5
        },
        {
          id: '4',
          title: 'רעננה – אוסטרובסקי 36',
          description: 'פרויקט התחדשות עירונית בשלב בחירת ועד נציגות ושכירת אנשי מקצוע.',
          city: 'רעננה',
          address: 'רחוב אוסטרובסקי 36',
          stage: 'בחירת ועד נציגות',
          progress: 10,
          apartments: 90,
          residents_count: 0,
          developer_name: 'רעננה התחדשות בע״מ',
          image_url: 'https://images.pexels.com/photos/3182827/pexels-photo-3182827.jpeg?auto=compress&cs=tinysrgb&w=600',
          start_date: '2024-05-01',
          expected_completion: '2028-01-31',
          rating: 4.3
        }
      ];
      
      setProjects(mockProjects);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  // Filter projects based on search query and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCity = cityFilter === '' || project.city === cityFilter;
    const matchesStage = stageFilter === '' || project.stage === stageFilter;
    
    return matchesSearch && matchesCity && matchesStage;
  });

  // Get unique cities and stages for filters
  const cities = [...new Set(projects.map(project => project.city))];
  const stages = [...new Set(projects.map(project => project.stage))];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cream-50 via-neutral-50 to-cream-100 text-neutral-900 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-shimmer-gold bg-[length:200%_100%] animate-shimmer opacity-20"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-gold-300 to-warmGold-300 rounded-full opacity-30 blur-3xl animate-pulse"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight text-neutral-900">
              <span className="bg-gradient-to-r from-gold-600 via-warmGold-500 to-gold-700 bg-clip-text text-transparent">פרויקטים</span> פעילים
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-700 leading-relaxed max-w-4xl mx-auto mb-12">
              גלה את פרויקטי ההתחדשות העירונית הפעילים שלנו ברחבי הארץ
            </p>

            {/* Search Interface */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-luxury-lg p-8 max-w-4xl mx-auto border border-neutral-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <div className="relative">
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gold-500 w-6 h-6" />
                    <input
                      aria-label="חיפוש פרויקטים"
                      type="text"
                      placeholder="חפש לפי שם, עיר או כתובת..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pr-12 pl-4 py-4 bg-white backdrop-blur-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent text-neutral-800 placeholder-neutral-500 font-medium text-lg shadow-sm"
                    />
                  </div>
                </div>
                <select
                  aria-label="סינון לפי עיר"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="px-4 py-3 bg-white backdrop-blur-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent text-neutral-800 placeholder-neutral-500 font-medium shadow-sm"
                >
                  <option value="">כל הערים</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <select
                  aria-label="סינון לפי שלב"
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="px-4 py-3 bg-white backdrop-blur-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent text-neutral-800 placeholder-neutral-500 font-medium shadow-sm"
                >
                  <option value="">כל השלבים</option>
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
                <Button
                  variant="primary"
                  size="lg"
                  aria-label="נקה סינון"
                  className="md:col-span-1"
                  onClick={() => {
                    setSearchQuery('');
                    setCityFilter('');
                    setStageFilter('');
                  }}
                >
                  נקה סינון
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-gradient-to-br from-cream-50 to-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-neutral-900 mb-6">
              הפרויקטים שלנו
            </h2>
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
              פרויקטי התחדשות עירונית איכותיים ומתקדמים ברחבי הארץ
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" color="primary" text="טוען פרויקטים..." centered />
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {filteredProjects.map((project) => (
                <div key={project.id} className="transform hover:-translate-y-1 transition-transform duration-300">
                  <Card hover className="overflow-hidden">
                    <div className="relative">
                      <img 
                        src={project.image_url || "https://images.pexels.com/photos/3182826/pexels-photo-3182826.jpeg?auto=compress&cs=tinysrgb&w=600"} 
                        alt={project.title}
                        className="w-full h-56 object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant="warning">
                          {project.stage}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <div className="flex items-center space-x-2 space-x-reverse bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">
                          <CheckCircle className="w-4 h-4 text-gold-500" />
                          <span className="font-medium text-neutral-900">{project.progress}% התקדמות</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-neutral-900 mb-2">
                        {project.title}
                      </h3>
                      
                      <div className="flex items-center space-x-3 space-x-reverse text-neutral-600 mb-2">
                        <MapPin className="w-4 h-4 text-gold-500" />
                        <span className="text-sm">{project.address}, {project.city}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 space-x-reverse text-neutral-600 mb-4">
                        <Building className="w-4 h-4 text-warmGold-500" />
                        <span className="text-sm">{project.developer_name}</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-5">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-medium text-neutral-700">התקדמות</span>
                          <span className="text-xs font-bold text-gold-600">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-gold-500 to-warmGold-400 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="text-center p-2 bg-neutral-50 rounded-lg">
                          <div className="text-lg font-bold text-neutral-900">{project.apartments}</div>
                          <div className="text-xs font-medium text-neutral-600">דירות</div>
                        </div>
                        <div className="text-center p-2 bg-neutral-50 rounded-lg">
                          <div className="text-lg font-bold text-neutral-900">{project.residents_count}</div>
                          <div className="text-xs font-medium text-neutral-600">דיירים</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3 space-x-reverse">
                        <Link to={`/tzfat-canaan`} className="flex-1">
                          <Button variant="primary" size="sm" fullWidth>
                            פרטי הפרויקט
                          </Button>
                        </Link>
                        <Link to={`/property-3d/1?address=${encodeURIComponent(project.address)}`} className="flex-1">
                          <Button variant="outline" size="sm" fullWidth>
                            מודל תלת-ממדי
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Building className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">לא נמצאו פרויקטים</h3>
              <p className="text-neutral-600 mb-6">נסה לשנות את הסינון או לחפש מחדש</p>
              <Button 
                variant="primary" 
                onClick={() => {
                  setSearchQuery('');
                  setCityFilter('');
                  setStageFilter('');
                }}
              >
                הצג את כל הפרויקטים
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Project */}
      <section className="py-20 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-neutral-900 mb-6">
              פרויקט מוביל
            </h2>
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
              פרויקט ההתחדשות העירונית המוביל שלנו בצפת
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <TzfatCanaanProjectCard />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-shimmer-gold bg-[length:200%_100%] animate-shimmer opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gold-400 to-warmGold-400 rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-warmGold-400 to-gold-400 rounded-full opacity-15 blur-3xl"></div>
        
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl lg:text-5xl font-bold mb-10">
            מעוניין בפרויקט משלך?
          </h2>
          <p className="text-xl lg:text-2xl mb-14 text-cream-300 max-w-4xl mx-auto leading-relaxed">
            אנחנו מחפשים פרויקטים חדשים להתחדשות עירונית. אם יש לך נכס או קבוצת דיירים מאורגנת, נשמח לשמוע ממך.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Link to="/contact">
              <Button variant="primary" size="lg" className="shadow-luxury border border-gold-400/50 px-10 py-5">
                צור קשר עכשיו
              </Button>
            </Link>
            <Link to="/planning-rights">
              <Button variant="outline" size="lg" className="border-cream-300 text-cream-100 px-10 py-5">
                בדוק זכויות תכנוניות
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;