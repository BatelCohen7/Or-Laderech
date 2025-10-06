import React, { useState } from 'react';
import { 
  BookOpen, 
  Info,
  Search, 
  Filter, 
  Download, 
  Eye, 
  Star, 
  Clock, 
  User,
  Tag,
  Video,
  FileText,
  Globe,
  Headphones,
  Play,
  Bookmark,
  Share,
  ThumbsUp,
  MessageSquare,
  TrendingUp,
  Award,
  Lightbulb,
  Shield,
  Calculator, 
  Scale,
  Home,
  Building
} from 'lucide-react';
import { Card, Button, Input, Badge } from '../ui';
import toast from 'react-hot-toast';

interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'podcast' | 'guide' | 'interactive' | 'webinar';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  author: string;
  publishDate: string;
  rating: number;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  thumbnail?: string;
  isFeatured: boolean;
  isBookmarked: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  itemCount: number;
}

const KnowledgeCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'browse' | 'categories' | 'bookmarks' | 'trending'>('browse');
  
  // Handle bookmark toggle
  const handleBookmark = (itemId: string) => {
    toast.success('פריט נשמר בהצלחה (מצב דמו)');
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const categories: Category[] = [
    {
      id: 'rights',
      name: 'זכויות דיירים',
      description: 'כל מה שצריך לדעת על זכויותיך כדייר',
      icon: Shield,
      color: 'text-blue-600 bg-blue-100',
      itemCount: 45
    },
    {
      id: 'process',
      name: 'תהליכי התחדשות',
      description: 'הבנת התהליכים והשלבים השונים',
      icon: TrendingUp,
      color: 'text-accent-600 bg-accent-100',
      itemCount: 32
    },
    {
      id: 'legal',
      name: 'היבטים משפטיים',
      description: 'מידע משפטי וחוקי רלוונטי',
      icon: Scale,
      color: 'text-purple-600 bg-purple-100',
      itemCount: 28
    },
    {
      id: 'financial',
      name: 'היבטים כלכליים',
      description: 'מימון, פיצויים וחישובים כלכליים',
      icon: Calculator,
      color: 'text-gold-600 bg-gold-100',
      itemCount: 23
    },
    {
      id: 'planning',
      name: 'תכנון ובנייה',
      description: 'תכניות, היתרים ותהליכי בנייה',
      icon: Building,
      color: 'text-orange-600 bg-orange-100',
      itemCount: 38
    },
    {
      id: 'tips',
      name: 'טיפים ועצות',
      description: 'עצות מעשיות ממומחים בתחום',
      icon: Lightbulb,
      color: 'text-yellow-600 bg-yellow-100',
      itemCount: 56
    }
  ];

  const knowledgeItems: KnowledgeItem[] = [
    {
      id: '1',
      title: 'מדריך מקיף לזכויות הדייר בהתחדשות עירונית',
      description: 'מדריך מפורט הכולל את כל הזכויות החוקיות של הדייר, תהליכי ההתנגדות ואפשרויות הפיצוי',
      type: 'guide',
      category: 'rights',
      difficulty: 'beginner',
      duration: '25 דקות קריאה',
      author: 'עו"ד רחל כהן',
      publishDate: '2024-01-20',
      rating: 4.8,
      views: 2340,
      likes: 187,
      comments: 23,
      tags: ['זכויות', 'התנגדות', 'פיצוי', 'חוקי'],
      isFeatured: true,
      isBookmarked: false
    },
    {
      id: '2',
      title: 'איך לחשב את שווי הדירה לפני ואחרי ההתחדשות',
      description: 'סרטון הדרכה המסביר איך לחשב נכון את שווי הדירה ולהבין את הרווח הצפוי',
      type: 'video',
      category: 'financial',
      difficulty: 'intermediate',
      duration: '18 דקות',
      author: 'שמאי יוסי לוי',
      publishDate: '2024-01-18',
      rating: 4.6,
      views: 1890,
      likes: 142,
      comments: 31,
      tags: ['שמאות', 'חישוב', 'שווי', 'רווח'],
      isFeatured: false,
      isBookmarked: true
    },
    {
      id: '3',
      title: 'תהליך קבלת היתר בנייה - מה חשוב לדעת',
      description: 'הסבר מפורט על תהליך קבלת היתר הבנייה, המסמכים הנדרשים ולוחות הזמנים',
      type: 'article',
      category: 'planning',
      difficulty: 'intermediate',
      duration: '15 דקות קריאה',
      author: 'אדר\' מיכאל שפירא',
      publishDate: '2024-01-15',
      rating: 4.7,
      views: 1560,
      likes: 98,
      comments: 17,
      tags: ['היתר בנייה', 'תכנון', 'מסמכים'],
      isFeatured: false,
      isBookmarked: false
    },
    {
      id: '4',
      title: 'פודקאסט: ראיון עם דיירים שעברו התחדשות בהצלחה',
      description: 'ראיון מעמיק עם דיירים שעברו תהליך התחדשות עירונית וחולקים את הניסיון שלהם',
      type: 'podcast',
      category: 'tips',
      difficulty: 'beginner',
      duration: '45 דקות',
      author: 'רדיו התחדשות',
      publishDate: '2024-01-12',
      rating: 4.9,
      views: 3200,
      likes: 256,
      comments: 89,
      tags: ['ניסיון', 'טיפים', 'סיפורי הצלחה'],
      isFeatured: true,
      isBookmarked: true
    },
    {
      id: '5',
      title: 'סימולטור אינטראקטיבי: תהליך ההתחדשות העירונית',
      description: 'כלי אינטראקטיבי המדמה את כל שלבי תהליך ההתחדשות העירונית',
      type: 'interactive',
      category: 'process',
      difficulty: 'beginner',
      duration: '30 דקות',
      author: 'צוות הפיתוח',
      publishDate: '2024-01-10',
      rating: 4.5,
      views: 987,
      likes: 76,
      comments: 12,
      tags: ['סימולציה', 'אינטראקטיבי', 'תהליך'],
      isFeatured: false,
      isBookmarked: false
    },
    {
      id: '6',
      title: 'וובינר: שאלות ותשובות עם מומחים',
      description: 'וובינר חי עם מומחים בתחום ההתחדשות העירונית לשאלות ותשובות',
      type: 'webinar',
      category: 'legal',
      difficulty: 'advanced',
      duration: '90 דקות',
      author: 'מומחי התחום',
      publishDate: '2024-01-08',
      rating: 4.4,
      views: 1234,
      likes: 89,
      comments: 45,
      tags: ['וובינר', 'מומחים', 'שאלות ותשובות'],
      isFeatured: false,
      isBookmarked: false
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return FileText;
      case 'video': return Video;
      case 'podcast': return Headphones;
      case 'guide': return BookOpen;
      case 'interactive': return Globe;
      case 'webinar': return Video;
      default: return FileText;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'article': return 'מאמר';
      case 'video': return 'סרטון';
      case 'podcast': return 'פודקאסט';
      case 'guide': return 'מדריך';
      case 'interactive': return 'אינטראקטיבי';
      case 'webinar': return 'וובינר';
      default: return type;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-accent-600 bg-accent-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'מתחיל';
      case 'intermediate': return 'בינוני';
      case 'advanced': return 'מתקדם';
      default: return difficulty;
    }
  };

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesType = !selectedType || item.type === selectedType;
    const matchesDifficulty = !selectedDifficulty || item.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesType && matchesDifficulty;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      case 'oldest':
        return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'views':
        return b.views - a.views;
      case 'likes':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  const featuredItems = knowledgeItems.filter(item => item.isFeatured);
  const bookmarkedItems = knowledgeItems.filter(item => item.isBookmarked);
  const trendingItems = [...knowledgeItems].sort((a, b) => b.views - a.views).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center space-x-4 space-x-reverse mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">מרכז הידע</h2>
            <p className="text-neutral-600">מידע מקצועי, מדריכים וכלים לדיירים</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{knowledgeItems.length}</div>
            <div className="text-sm text-blue-700">פריטי תוכן</div>
          </div>
          <div className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-accent-600">{categories.length}</div>
            <div className="text-sm text-accent-700">קטגוריות</div>
          </div>
          <div className="bg-gradient-to-r from-gold-50 to-warmGold-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gold-600">4.7</div>
            <div className="text-sm text-gold-700">דירוג ממוצע</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">15K+</div>
            <div className="text-sm text-purple-700">צפיות חודשיות</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 space-x-reverse border-b border-neutral-200">
          {[
            { id: 'browse', label: 'עיון', icon: Search },
            { id: 'categories', label: 'קטגוריות', icon: Tag },
            { id: 'bookmarks', label: 'שמורים', icon: Bookmark },
            { id: 'trending', label: 'פופולרי', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 space-x-reverse pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.id === 'bookmarks' && bookmarkedItems.length > 0 && (
                <Badge variant="info" size="sm">{bookmarkedItems.length}</Badge>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Featured Items */}
          {featuredItems.length > 0 && (
            <Card>
              <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center space-x-2 space-x-reverse">
                <Award className="w-5 h-5 text-gold-500" />
                <span>תוכן מומלץ</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredItems.map((item) => {
                  const TypeIcon = getTypeIcon(item.type);
                  return (
                    <div key={item.id} className="bg-gradient-to-r from-gold-50 to-warmGold-50 rounded-xl p-4 border border-gold-200">
                      <div className="flex items-start space-x-3 space-x-reverse">
                        <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-lg flex items-center justify-center">
                          <TypeIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-neutral-900 mb-1">{item.title}</h4>
                          <p className="text-neutral-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                          <div className="flex items-center space-x-4 space-x-reverse text-xs text-neutral-500">
                            <span>{item.duration}</span>
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span>{item.rating}</span>
                            </div>
                            <span>{item.views} צפיות</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Search and Filters */}
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="חפש במרכז הידע..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={Search}
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">כל הקטגוריות</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">כל הסוגים</option>
                <option value="article">מאמר</option>
                <option value="video">סרטון</option>
                <option value="podcast">פודקאסט</option>
                <option value="guide">מדריך</option>
                <option value="interactive">אינטראקטיבי</option>
                <option value="webinar">וובינר</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">החדשים ביותר</option>
                <option value="oldest">הישנים ביותר</option>
                <option value="rating">דירוג גבוה</option>
                <option value="views">הכי נצפים</option>
                <option value="likes">הכי אהובים</option>
              </select>
            </div>
          </Card>

          {/* Content Items */}
          <div className="space-y-4">
            {sortedItems.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              const categoryInfo = categories.find(cat => cat.id === item.category);
              
              return (
                <Card key={item.id} hover>
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                      <TypeIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 space-x-reverse mb-1">
                            <h3 className="text-lg font-bold text-neutral-900">{item.title}</h3>
                            {item.isFeatured && (
                              <Badge variant="warning" size="sm">
                                <Award className="w-3 h-3 mr-1" />
                                מומלץ
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-3 space-x-reverse mb-2">
                            <Badge variant="default" size="sm">{getTypeText(item.type)}</Badge>
                            <Badge variant="info" size="sm">{categoryInfo?.name}</Badge>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                              {getDifficultyText(item.difficulty)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button className="p-2 text-neutral-400 hover:text-gold-600 transition-colors">
                            <Bookmark className={`w-5 h-5 ${item.isBookmarked ? 'fill-current text-gold-600' : ''}`} />
                          </button>
                          <button className="p-2 text-neutral-400 hover:text-blue-600 transition-colors">
                            <Share className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-neutral-700 mb-3 line-clamp-2">{item.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 space-x-reverse text-sm text-neutral-600">
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <User className="w-4 h-4" />
                            <span>{item.author}</span>
                          </div>
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <Clock className="w-4 h-4" />
                            <span>{item.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{item.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <Eye className="w-4 h-4" />
                            <span>{item.views}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 space-x-reverse">
                          <Button variant="outline" size="sm" icon={Eye}>
                            צפה
                          </Button>
                          {item.type !== 'interactive' && item.type !== 'webinar' && (
                            <Button variant="ghost" size="sm" icon={Download}>
                              הורד
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 space-x-reverse mt-3 pt-3 border-t border-neutral-200">
                        <div className="flex items-center space-x-1 space-x-reverse text-sm text-neutral-500">
                          <ThumbsUp className="w-4 h-4" />
                          <span onClick={() => handleBookmark(item.id)}>{item.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse text-sm text-neutral-500">
                          <MessageSquare className="w-4 h-4" />
                          <span>{item.comments}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {sortedItems.length === 0 && (
            <Card className="text-center py-12">
              <Search className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">לא נמצאו תוצאות</h3>
              <p className="text-neutral-600">נסה לשנות את קריטריוני החיפוש</p>
            </Card>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} hover>
              <div className="text-center p-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${category.color}`}>
                  <category.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">{category.name}</h3>
                <p className="text-neutral-600 mb-4">{category.description}</p>
                <div className="text-sm text-neutral-500 mb-4">{category.itemCount} פריטים</div>
                <Button variant="outline" size="sm" onClick={() => {
                  setSelectedCategory(category.id);
                  setActiveTab('browse');
                }}>
                  עיין בקטגוריה
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Bookmarks Tab */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          {bookmarkedItems.length > 0 ? (
            bookmarkedItems.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <Card key={item.id} hover>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-100 to-warmGold-100 rounded-xl flex items-center justify-center">
                      <TypeIcon className="w-6 h-6 text-gold-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-neutral-900 mb-1">{item.title}</h3>
                      <p className="text-neutral-600 text-sm mb-2">{item.description}</p>
                      <div className="flex items-center space-x-4 space-x-reverse text-xs text-neutral-500">
                        <span>{getTypeText(item.type)}</span>
                        <span>{item.duration}</span>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 space-x-reverse">
                      <Button variant="outline" size="sm" icon={Eye}>
                        צפה
                      </Button>
                      <button className="p-2 text-gold-600 hover:text-gold-700 transition-colors">
                        <Bookmark className="w-5 h-5 fill-current" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="text-center py-12">
              <Bookmark className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">אין פריטים שמורים</h3>
              <p className="text-neutral-600 mb-6">שמור פריטים מעניינים לקריאה מאוחרת</p>
              <Button variant="primary" onClick={() => setActiveTab('browse')}>
                עיין בתוכן
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* Trending Tab */}
      {activeTab === 'trending' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center space-x-2 space-x-reverse">
              <TrendingUp className="w-5 h-5 text-red-500" />
              <span>הכי פופולרי השבוע</span>
            </h3>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendingItems.map((item, index) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <Card key={item.id} hover>
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                      <TypeIcon className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-neutral-900 mb-1">{item.title}</h4>
                      <p className="text-neutral-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex items-center space-x-4 space-x-reverse text-xs text-neutral-500">
                        <span>{item.duration}</span>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Eye className="w-3 h-3" />
                          <span>{item.views}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{item.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeCenter;