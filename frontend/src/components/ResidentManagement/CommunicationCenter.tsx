import React, { useState } from 'react';
import { MessageSquare, Send, Users, User, Search, Filter, Phone, Mail, Bell, Info } from 'lucide-react';
import { Card, Button, Input, Badge } from '../ui';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  sender: {
    name: string;
    role: 'resident' | 'developer' | 'professional' | 'authority';
    avatar?: string;
  };
  recipient: {
    name: string;
    type: 'individual' | 'group';
  };
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isImportant: boolean;
  attachments?: string[];
}

interface ChatGroup {
  id: string;
  name: string;
  type: 'building' | 'floor' | 'project' | 'committee';
  memberCount: number;
  lastMessage: string;
  lastActivity: string;
  unreadCount: number;
}

const CommunicationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'messages' | 'groups' | 'compose'>('messages');
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: ''
  });

  const messages: Message[] = [
    {
      id: '1',
      sender: { name: 'אדר\' יוסי לוי', role: 'developer' },
      recipient: { name: 'כל הדיירים', type: 'group' },
      subject: 'עדכון לגבי מועד תחילת עבודות',
      content: 'שלום לכולם, רציתי לעדכן שתחילת עבודות הבנייה נדחתה בשבועיים בשל עיכוב באישורים. המועד החדש הוא 15 ביוני.',
      timestamp: '2024-01-20T10:30:00',
      isRead: false,
      isImportant: true
    },
    {
      id: '2',
      sender: { name: 'שרה כהן', role: 'resident' },
      recipient: { name: 'ועד הבית', type: 'group' },
      subject: 'שאלה לגבי חניות',
      content: 'האם יהיו מספיק חניות במבנה החדש? אני מודאגת מהנושא.',
      timestamp: '2024-01-19T15:45:00',
      isRead: true,
      isImportant: false
    },
    {
      id: '3',
      sender: { name: 'מהנדס רון גולד', role: 'professional' },
      recipient: { name: 'יוסי כהן', type: 'individual' },
      subject: 'דוח סקר טכני',
      content: 'הדוח הטכני מוכן לעיון. אשמח לתאם פגישה לדיון בממצאים.',
      timestamp: '2024-01-18T09:15:00',
      isRead: true,
      isImportant: false,
      attachments: ['דוח_סקר_טכני.pdf']
    }
  ];

  const chatGroups: ChatGroup[] = [
    {
      id: '1',
      name: 'כל הדיירים - בניין הרצל 45',
      type: 'building',
      memberCount: 24,
      lastMessage: 'עדכון לגבי מועד תחילת עבודות',
      lastActivity: '2024-01-20T10:30:00',
      unreadCount: 3
    },
    {
      id: '2',
      name: 'ועד הבית',
      type: 'committee',
      memberCount: 5,
      lastMessage: 'שאלה לגבי חניות',
      lastActivity: '2024-01-19T15:45:00',
      unreadCount: 1
    },
    {
      id: '3',
      name: 'קומה 3',
      type: 'floor',
      memberCount: 6,
      lastMessage: 'תיאום לגבי רעש עבודות',
      lastActivity: '2024-01-18T14:20:00',
      unreadCount: 0
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'developer': return 'text-blue-600';
      case 'professional': return 'text-green-600';
      case 'authority': return 'text-purple-600';
      case 'resident': return 'text-gold-600';
      default: return 'text-neutral-600';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'developer': return 'יזם';
      case 'professional': return 'בעל מקצוע';
      case 'authority': return 'רשות';
      case 'resident': return 'דייר';
      default: return '';
    }
  };

  const handleSendMessage = () => {
    // כאן נשלח את ההודעה
    toast.success('ההודעה נשלחה בהצלחה (מצב דמו)');
    setNewMessage({ recipient: '', subject: '', content: '' });
    setActiveTab('messages');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center space-x-4 space-x-reverse mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-warmGold-400 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">מרכז תקשורת</h2>
            <p className="text-neutral-600">הודעות וקבוצות דיון עם כל המעורבים בפרויקט</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 space-x-reverse border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'messages'
                ? 'border-gold-500 text-gold-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            הודעות
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'groups'
                ? 'border-gold-500 text-gold-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            קבוצות
          </button>
          <button
            onClick={() => setActiveTab('compose')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'compose'
                ? 'border-gold-500 text-gold-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            הודעה חדשה
          </button>
        </div>
      </Card>

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-neutral-900">הודעות</h3>
            <div className="flex space-x-2 space-x-reverse">
              <Button variant="ghost" size="sm" icon={Search}>
                חיפוש
              </Button>
              <Button variant="ghost" size="sm" icon={Filter}>
                סינון
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                  !message.isRead 
                    ? 'border-gold-300 bg-gold-50' 
                    : 'border-neutral-200 hover:border-gold-200'
                } ${selectedMessage === message.id ? 'ring-2 ring-gold-500' : ''}`}
                onClick={() => setSelectedMessage(selectedMessage === message.id ? null : message.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 space-x-reverse flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-gold-100 to-warmGold-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gold-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 space-x-reverse mb-1">
                        <span className="font-semibold text-neutral-900">{message.sender.name}</span>
                        <span className={`text-xs ${getRoleColor(message.sender.role)}`}>
                          {getRoleLabel(message.sender.role)}
                        </span>
                        {message.isImportant && (
                          <Badge variant="error" size="sm">חשוב</Badge>
                        )}
                      </div>
                      <h4 className="font-medium text-neutral-800 mb-1">{message.subject}</h4>
                      <p className="text-neutral-600 text-sm line-clamp-2">{message.content}</p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="flex items-center space-x-1 space-x-reverse mt-2">
                          <span className="text-xs text-neutral-500">קבצים מצורפים:</span>
                          {message.attachments.map((file, idx) => (
                            <span key={idx} className="text-xs text-gold-600">{file}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-neutral-500">
                    {new Date(message.timestamp).toLocaleDateString('he-IL')}
                  </div>
                </div>

                {/* Expanded Message */}
                {selectedMessage === message.id && (
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-neutral-700 leading-relaxed">{message.content}</p>
                      <div className="flex space-x-2 space-x-reverse mt-4">
                        <Button variant="outline" size="sm">
                          השב
                        </Button>
                        <Button variant="ghost" size="sm">
                          העבר
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Groups Tab */}
      {activeTab === 'groups' && (
        <Card>
          <h3 className="text-xl font-bold text-neutral-900 mb-6">קבוצות דיון</h3>
          <div className="space-y-4">
            {chatGroups.map((group) => (
              <div
                key={group.id}
                className="p-4 border border-neutral-200 rounded-xl hover:border-gold-300 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-100 to-warmGold-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-gold-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900">{group.name}</h4>
                      <p className="text-sm text-neutral-600">{group.memberCount} חברים</p>
                      <p className="text-xs text-neutral-500 mt-1">{group.lastMessage}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-neutral-500 mb-2">
                      {new Date(group.lastActivity).toLocaleDateString('he-IL')}
                    </div>
                    {group.unreadCount > 0 && (
                      <Badge variant="error" size="sm">
                        {group.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Compose Tab */}
      {activeTab === 'compose' && (
        <Card>
          <h3 className="text-xl font-bold text-neutral-900 mb-6">הודעה חדשה</h3>
          <div className="space-y-4">
            <Input
              label="נמען"
              placeholder="בחר נמען או קבוצה"
              value={newMessage.recipient}
              onChange={(e) => setNewMessage(prev => ({ ...prev, recipient: e.target.value }))}
            />
            <Input
              label="נושא"
              placeholder="נושא ההודעה"
              value={newMessage.subject}
              onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
            />
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">תוכן ההודעה</label>
              <textarea
                rows={6}
                placeholder="כתוב את ההודעה שלך כאן..."
                value={newMessage.content}
                onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white resize-vertical"
              />
            </div>
            <div className="flex space-x-4 space-x-reverse">
              <Button variant="primary" icon={Send} onClick={handleSendMessage}>
                שלח הודעה
              </Button>
              <Button variant="outline">
                שמור כטיוטה
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">פעולות מהירות</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-neutral-200 rounded-xl hover:border-gold-300 transition-colors text-center">
            <Phone className="w-8 h-8 text-gold-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-neutral-800">צור קשר עם היזם</span>
          </button>
          <button className="p-4 border border-neutral-200 rounded-xl hover:border-gold-300 transition-colors text-center">
            <Mail className="w-8 h-8 text-gold-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-neutral-800">פנה לועד הבית</span>
          </button>
          <button className="p-4 border border-neutral-200 rounded-xl hover:border-gold-300 transition-colors text-center">
            <Bell className="w-8 h-8 text-gold-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-neutral-800">הגדר התראות</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default CommunicationCenter;