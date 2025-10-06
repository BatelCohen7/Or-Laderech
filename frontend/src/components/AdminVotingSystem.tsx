import React, { useState } from 'react';
import { Calendar, Download, Eye, Trash, X, Plus, CheckCircle, Info } from 'lucide-react';
import { Card, Button, Badge, Modal, Input, LoadingSpinner } from './ui';

interface VoteOption {
  id: string;
  text: string;
  votes: number;
}

interface Vote {
  id: string;
  title: string;
  description: string;
  deadline: string;
  options: VoteOption[];
  project_id: string;
  status: 'active' | 'completed';
  created_at: string;
}

interface AdminVotingSystemProps {
  votes: Vote[];
  projects: any[];
  onCreateVote: (vote: Omit<Vote, 'id' | 'created_at'>) => void;
  onCloseVote: (voteId: string) => void;
  onDeleteVote: (voteId: string) => void;
  onExportResults: (vote: Vote) => void;
  loading?: boolean;
}

const AdminVotingSystem: React.FC<AdminVotingSystemProps> = ({
  votes,
  projects,
  onCreateVote,
  onCloseVote,
  onDeleteVote,
  onExportResults,
  loading = false
}) => {
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [voteFormData, setVoteFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    options: ['', ''],
    project_id: ''
  });

  const handleCreateVote = () => {
    // Validate form
    if (!voteFormData.title || !voteFormData.description || !voteFormData.deadline || !voteFormData.project_id || voteFormData.options.some(option => !option.trim())) {
      return;
    }

    // Create vote object
    const newVote = {
      title: voteFormData.title,
      description: voteFormData.description,
      deadline: new Date(voteFormData.deadline).toISOString(),
      options: voteFormData.options.map(text => ({ 
        id: `option_${Date.now()}_${Math.random()}`, 
        text, 
        votes: 0 
      })),
      project_id: voteFormData.project_id,
      status: 'active' as const
    };

    // Call parent handler
    onCreateVote(newVote);

    // Reset form and close modal
    setVoteFormData({
      title: '',
      description: '',
      deadline: '',
      options: ['', ''],
      project_id: ''
    });
    setShowVoteModal(false);
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <LoadingSpinner size="md" color="primary" text="טוען הצבעות..." centered />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-900">מרכז הצבעות</h2>
        <Button 
          variant="primary"
          className="shadow-sm border border-gold-400/50"
          icon={Plus}
          onClick={() => setShowVoteModal(true)}
        >
          הצבעה חדשה
        </Button>
      </div>

      {votes.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-700 mb-2">אין הצבעות</h3>
          <p className="text-neutral-600 mb-6">לא נמצאו הצבעות במערכת</p>
          <Button 
            variant="primary" 
            icon={Plus}
            className="shadow-sm border border-gold-400/50"
            onClick={() => setShowVoteModal(true)}
          >
            צור הצבעה חדשה
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {votes.map((vote) => (
            <Card key={vote.id} hover className="shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{vote.title}</h3>
                  <p className="text-neutral-600 mb-3">{vote.description}</p>
                  <div className="flex items-center space-x-4 space-x-reverse text-sm">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      <span className="text-neutral-600">
                        {new Date(vote.deadline) > new Date() ? 
                          `מסתיים ב-${new Date(vote.deadline).toLocaleDateString('he-IL')}` : 
                          `הסתיים ב-${new Date(vote.deadline).toLocaleDateString('he-IL')}`}
                      </span>
                    </div>
                    <span className="text-neutral-600">
                      {vote.options.reduce((sum, option) => sum + option.votes, 0)} הצבעות
                    </span>
                  </div>
                </div>
                <Badge variant={vote.status === 'active' ? 'warning' : 'success'}>
                  {vote.status === 'active' ? 'פעיל' : 'הסתיים'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                {vote.options.map((option, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-neutral-800">{option.text}</span>
                      <span className="text-sm text-neutral-600">
                        {option.votes} קולות ({Math.round((option.votes / vote.options.reduce((sum, opt) => sum + opt.votes, 0) || 0) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          index === 0 ? 'bg-green-500' :
                          index === 1 ? 'bg-red-500' : 'bg-neutral-400'
                        }`}
                        style={{ width: `${vote.options.reduce((sum, opt) => sum + opt.votes, 0) > 0 ? 
                          (option.votes / vote.options.reduce((sum, opt) => sum + opt.votes, 0)) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-4 pt-4 border-t border-neutral-200">
                <div className="flex space-x-2 space-x-reverse">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="shadow-sm"
                    icon={Download}
                    onClick={() => onExportResults(vote)}
                  >
                    ייצוא תוצאות
                  </Button>
                  {vote.status === 'active' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="shadow-sm"
                      icon={X}
                      onClick={() => onCloseVote(vote.id)}
                    >
                      סגור הצבעה
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-red-50 hover:text-red-600"
                    icon={Trash}
                    onClick={() => onDeleteVote(vote.id)}
                  >
                    מחק
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Vote Modal */}
      <Modal
        isOpen={showVoteModal}
        onClose={() => setShowVoteModal(false)}
        title="יצירת הצבעה חדשה"
        size="lg"
      >
        <div className="space-y-6">
          <Input
            label="כותרת ההצבעה *"
            name="title"
            value={voteFormData.title}
            onChange={(e) => setVoteFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">תיאור ההצבעה *</label>
            <textarea
              name="description"
              value={voteFormData.description}
              onChange={(e) => setVoteFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-vertical"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">תאריך סיום *</label>
              <input
                type="date"
                name="deadline"
                value={voteFormData.deadline}
                onChange={(e) => setVoteFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">פרויקט *</label>
              <select
                name="project_id"
                value={voteFormData.project_id}
                onChange={(e) => setVoteFormData(prev => ({ ...prev, project_id: e.target.value }))}
                className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                required
              >
                <option value="">בחר פרויקט</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.title}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">אפשרויות הצבעה *</label>
            <div className="space-y-3">
              {voteFormData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 space-x-reverse">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...voteFormData.options];
                      newOptions[index] = e.target.value;
                      setVoteFormData(prev => ({ ...prev, options: newOptions }));
                    }}
                    placeholder={`אפשרות ${index + 1}`}
                  />
                  {voteFormData.options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={X}
                      onClick={() => {
                        const newOptions = voteFormData.options.filter((_, i) => i !== index);
                        setVoteFormData(prev => ({ ...prev, options: newOptions }));
                      }}
                    />
                  )}
                </div>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={() => {
                  setVoteFormData(prev => ({ ...prev, options: [...prev.options, ''] }));
                }}
              >
                הוסף אפשרות
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-4 space-x-reverse">
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleCreateVote}
              disabled={
                !voteFormData.title || 
                !voteFormData.description || 
                !voteFormData.deadline || 
                !voteFormData.project_id || 
                voteFormData.options.some(option => !option.trim())
              }
            >
              צור הצבעה
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowVoteModal(false)}
            >
              ביטול
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminVotingSystem;