import React, { useState } from 'react';
import { Edit, Eye, Trash, Plus, Info } from 'lucide-react';
import { Card, Button, Badge, Modal, Input, LoadingSpinner } from './ui';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  published_date: string;
  views: number;
  status: string;
}

interface AdminKnowledgeCenterProps {
  articles: Article[];
  onCreateArticle: (article: Omit<Article, 'id' | 'views' | 'published_date'>) => void;
  onUpdateArticle: (id: string, updates: Partial<Article>) => void;
  onDeleteArticle: (id: string) => void;
  loading?: boolean;
}

const AdminKnowledgeCenter: React.FC<AdminKnowledgeCenterProps> = ({
  articles,
  onCreateArticle,
  onUpdateArticle,
  onDeleteArticle,
  loading = false
}) => {
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articleFormData, setArticleFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    status: 'published'
  });

  const handleOpenModal = (article?: Article) => {
    if (article) {
      setSelectedArticle(article);
      setArticleFormData({
        title: article.title,
        content: article.content,
        category: article.category,
        tags: article.tags.join(', '),
        status: article.status
      });
    } else {
      setSelectedArticle(null);
      setArticleFormData({
        title: '',
        content: '',
        category: '',
        tags: '',
        status: 'published'
      });
    }
    setShowArticleModal(true);
  };

  const handleSubmit = () => {
    if (!articleFormData.title || !articleFormData.content || !articleFormData.category) {
      return;
    }

    if (selectedArticle) {
      // Update existing article
      onUpdateArticle(selectedArticle.id, {
        title: articleFormData.title,
        content: articleFormData.content,
        category: articleFormData.category,
        tags: articleFormData.tags.split(',').map(tag => tag.trim()),
        status: articleFormData.status
      });
    } else {
      // Create new article
      onCreateArticle({
        title: articleFormData.title,
        content: articleFormData.content,
        category: articleFormData.category,
        tags: articleFormData.tags.split(',').map(tag => tag.trim()),
        author: 'מנהל המערכת',
        status: articleFormData.status
      });
    }

    setShowArticleModal(false);
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <LoadingSpinner size="md" color="primary" text="טוען מאמרים..." centered />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-900">מרכז ידע</h2>
        <Button 
          variant="primary"
          className="shadow-sm border border-gold-400/50"
          icon={Plus}
          onClick={() => handleOpenModal()}
        >
          מאמר חדש
        </Button>
      </div>

      {articles.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-700 mb-2">אין מאמרים</h3>
          <p className="text-neutral-600 mb-6">לא נמצאו מאמרים במערכת</p>
          <Button 
            variant="primary" 
            icon={Plus}
            className="shadow-sm border border-gold-400/50"
            onClick={() => handleOpenModal()}
          >
            הוסף מאמר חדש
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <Card key={article.id} hover className="shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{article.title}</h3>
                  <div className="flex items-center space-x-2 space-x-reverse mb-3">
                    <Badge variant="info">{article.category}</Badge>
                    <Badge variant={article.status === 'published' ? 'success' : 'warning'}>
                      {article.status === 'published' ? 'פורסם' : 'טיוטה'}
                    </Badge>
                  </div>
                  <p className="text-neutral-600 mb-3 line-clamp-2">{article.content}</p>
                  <div className="flex items-center space-x-4 space-x-reverse text-sm">
                    <span className="text-neutral-600">מחבר: {article.author}</span>
                    <span className="text-neutral-600">
                      פורסם: {new Date(article.published_date).toLocaleDateString('he-IL')}
                    </span>
                    <span className="text-neutral-600">{article.views} צפיות</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-3 border-t border-neutral-200">
                <div className="flex space-x-2 space-x-reverse">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="shadow-sm"
                    icon={Edit}
                    onClick={() => handleOpenModal(article)}
                  >
                    ערוך
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-blue-50 hover:text-blue-600"
                    icon={Eye}
                  >
                    צפה
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-red-50 hover:text-red-600"
                    icon={Trash}
                    onClick={() => onDeleteArticle(article.id)}
                  >
                    מחק
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Article Modal */}
      <Modal
        isOpen={showArticleModal}
        onClose={() => setShowArticleModal(false)}
        title={selectedArticle ? 'עריכת מאמר' : 'מאמר חדש'}
        size="lg"
      >
        <div className="space-y-6">
          <Input
            label="כותרת *"
            name="title"
            value={articleFormData.title}
            onChange={(e) => setArticleFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">תוכן *</label>
            <textarea
              name="content"
              value={articleFormData.content}
              onChange={(e) => setArticleFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={8}
              className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-vertical"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">קטגוריה *</label>
              <select
                name="category"
                value={articleFormData.category}
                onChange={(e) => setArticleFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                required
              >
                <option value="">בחר קטגוריה</option>
                <option value="זכויות דיירים">זכויות דיירים</option>
                <option value="היבטים כלכליים">היבטים כלכליים</option>
                <option value="תכנון ובנייה">תכנון ובנייה</option>
                <option value="תהליכי התחדשות">תהליכי התחדשות</option>
                <option value="טיפים ועצות">טיפים ועצות</option>
              </select>
            </div>
            
            <Input
              label="תגיות (מופרדות בפסיקים)"
              name="tags"
              value={articleFormData.tags}
              onChange={(e) => setArticleFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="למשל: זכויות, תכנון, פיצוי"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">סטטוס</label>
            <select
              name="status"
              value={articleFormData.status}
              onChange={(e) => setArticleFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="published">פורסם</option>
              <option value="draft">טיוטה</option>
            </select>
          </div>
          
          <div className="flex space-x-4 space-x-reverse">
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleSubmit}
              disabled={!articleFormData.title || !articleFormData.content || !articleFormData.category}
            >
              {selectedArticle ? 'עדכן מאמר' : 'צור מאמר'}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowArticleModal(false)}
            >
              ביטול
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminKnowledgeCenter;