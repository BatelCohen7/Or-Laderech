import React, { useState } from 'react';
import { CheckCircle, X, Edit, AlertTriangle, Info } from 'lucide-react';
import { Card, Button, Badge, Modal, LoadingSpinner } from './ui';

interface Objection {
  id: string;
  title: string;
  description: string;
  type: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  submitted_date: string;
  last_update: string;
  resident_id: string;
  resident_name: string;
  project_id: string;
  reviewer_notes?: string;
}

interface AdminObjectionsListProps {
  objections: Objection[];
  onApprove: (objectionId: string) => void;
  onReject: (objectionId: string) => void;
  onAddNotes: (objectionId: string, notes: string) => void;
  loading?: boolean;
}

const AdminObjectionsList: React.FC<AdminObjectionsListProps> = ({
  objections,
  onApprove,
  onReject,
  onAddNotes,
  loading = false
}) => {
  const [selectedObjection, setSelectedObjection] = useState<Objection | null>(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState('');

  const handleAddNotes = () => {
    if (selectedObjection) {
      onAddNotes(selectedObjection.id, notes);
      setShowNotesModal(false);
      setSelectedObjection(null);
      setNotes('');
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <LoadingSpinner size="md" color="primary" text="טוען התנגדויות..." centered />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {objections.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-700 mb-2">אין התנגדויות</h3>
          <p className="text-neutral-600">לא נמצאו התנגדויות במערכת</p>
        </Card>
      ) : (
        objections.map((objection) => (
          <Card key={objection.id} hover className="shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 space-x-reverse mb-2">
                  <h3 className="text-lg font-semibold text-neutral-900">{objection.title}</h3>
                  <Badge variant={
                    objection.status === 'approved' ? 'success' :
                    objection.status === 'rejected' ? 'error' :
                    objection.status === 'under_review' ? 'warning' :
                    'info'
                  }>
                    {objection.status === 'approved' ? 'אושר' :
                     objection.status === 'rejected' ? 'נדחה' :
                     objection.status === 'under_review' ? 'בבדיקה' :
                     'הוגש'}
                  </Badge>
                  <Badge variant="default">
                    {objection.type === 'planning' ? 'תכנוני' :
                     objection.type === 'environmental' ? 'סביבתי' :
                     objection.type}
                  </Badge>
                </div>
                <p className="text-neutral-600 mb-3">{objection.description}</p>
                <div className="flex items-center space-x-4 space-x-reverse text-sm">
                  <span className="text-neutral-600">דייר: {objection.resident_name}</span>
                  <span className="text-neutral-600">
                    הוגש: {new Date(objection.submitted_date).toLocaleDateString('he-IL')}
                  </span>
                </div>
              </div>
            </div>
            
            {objection.reviewer_notes && (
              <div className="bg-accent-50 border border-accent-200 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2 space-x-reverse mb-1">
                  <Info className="w-4 h-4 text-accent-600" />
                  <span className="font-medium text-accent-800">הערות בוחן:</span>
                </div>
                <p className="text-accent-700 text-sm">{objection.reviewer_notes}</p>
              </div>
            )}
            
            <div className="flex justify-end pt-3 border-t border-neutral-200">
              <div className="flex space-x-2 space-x-reverse">
                {objection.status !== 'approved' && (
                  <Button 
                    variant="outline"
                    size="sm"
                    className="shadow-sm"
                    icon={CheckCircle}
                    onClick={() => onApprove(objection.id)}
                  >
                    אשר
                  </Button>
                )}
                {objection.status !== 'rejected' && (
                  <Button 
                    variant="outline"
                    size="sm"
                    className="shadow-sm"
                    icon={X}
                    onClick={() => onReject(objection.id)}
                  >
                    דחה
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-blue-50 hover:text-blue-600"
                  icon={Edit}
                  onClick={() => {
                    setSelectedObjection(objection);
                    setNotes(objection.reviewer_notes || '');
                    setShowNotesModal(true);
                  }}
                >
                  הוסף הערות
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}

      {/* Notes Modal */}
      <Modal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        title="הוספת הערות להתנגדות"
        size="md"
      >
        {selectedObjection && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-neutral-900 mb-2">{selectedObjection.title}</h3>
              <p className="text-neutral-600 mb-4">{selectedObjection.description}</p>
              <div className="flex items-center space-x-4 space-x-reverse text-sm text-neutral-600 mb-4">
                <span>דייר: {selectedObjection.resident_name}</span>
                <span>הוגש: {new Date(selectedObjection.submitted_date).toLocaleDateString('he-IL')}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">הערות בוחן</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-vertical"
                placeholder="הוסף הערות לגבי ההתנגדות..."
              />
            </div>
            
            <div className="flex space-x-4 space-x-reverse">
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleAddNotes}
              >
                שמור הערות
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowNotesModal(false)}
              >
                ביטול
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminObjectionsList;