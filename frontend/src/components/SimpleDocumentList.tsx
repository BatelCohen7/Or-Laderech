import React from 'react';
import { FileText, Download, Eye, CheckCircle, Clock, AlertTriangle, Info } from 'lucide-react';
import { Card, Badge, Button } from './ui';

interface Document {
  id: string;
  title: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadDate: string;
  fileSize: number;
}

interface SimpleDocumentListProps {
  documents: Document[];
  onView: (doc: Document) => void;
  onDownload: (doc: Document) => void;
}

const SimpleDocumentList: React.FC<SimpleDocumentListProps> = ({
  documents,
  onView,
  onDownload
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-accent-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <FileText className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL');
  };

  if (documents.length === 0) {
    return (
      <Card className="text-center py-12">
        <FileText className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-neutral-700 mb-2">אין מסמכים</h3>
        <p className="text-neutral-600">טרם הועלו מסמכים</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-xl font-bold text-neutral-900 mb-6">מסמכים</h3>
      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-4 border border-cream-200 rounded-xl hover:border-gold-300 transition-colors">
            <div className="flex items-center space-x-4 space-x-reverse flex-1">
              {getStatusIcon(doc.status)}
              <div className="flex-1">
                <h4 className="font-semibold text-neutral-900">{doc.title}</h4>
                <div className="flex items-center space-x-4 space-x-reverse text-sm text-neutral-600 mt-1">
                  <span>{formatFileSize(doc.fileSize)}</span>
                  <span>•</span>
                  <span>{formatDate(doc.uploadDate)}</span>
                </div>
              </div>
              <Badge variant={getStatusVariant(doc.status) as any}>
                {doc.status === 'approved' ? 'אושר' : 
                 doc.status === 'pending' ? 'ממתין' : 'נדחה'}
              </Badge>
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <Button
                variant="ghost"
                size="sm"
                icon={Eye}
                onClick={() => onView(doc)}
              />
              <Button
                variant="ghost"
                size="sm"
                icon={Download}
                onClick={() => onDownload(doc)}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SimpleDocumentList;