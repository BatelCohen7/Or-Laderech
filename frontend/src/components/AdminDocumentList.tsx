import React from 'react';
import { Eye, Download, CheckCircle, X, Trash, Info } from 'lucide-react';
import { Button, Badge, LoadingSpinner, Card } from './ui';

interface Document {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
  file_size: string;
  status: 'pending' | 'approved' | 'rejected';
  uploaded_at: string;
  project_id?: string;
  user_id?: string;
}

interface AdminDocumentListProps {
  documents: Document[];
  onApprove: (documentId: string) => void;
  onReject: (documentId: string) => void;
  onDelete: (documentId: string) => void;
  loading?: boolean;
}

const AdminDocumentList: React.FC<AdminDocumentListProps> = ({
  documents,
  onApprove,
  onReject,
  onDelete,
  loading = false
}) => {
  if (loading) {
    return (
      <Card className="p-8 text-center">
        <LoadingSpinner size="md" color="primary" text="טוען מסמכים..." centered />
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                כותרת
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                סוג
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                גודל
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                תאריך העלאה
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                סטטוס
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                פעולות
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {documents.map((document) => (
              <tr key={document.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-neutral-900">{document.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-600">{document.file_type.toUpperCase()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-600">{document.file_size}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-600">
                    {new Date(document.uploaded_at).toLocaleDateString('he-IL')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={
                    document.status === 'approved' ? 'success' :
                    document.status === 'rejected' ? 'error' :
                    'warning'
                  }>
                    {document.status === 'approved' ? 'מאושר' :
                     document.status === 'rejected' ? 'נדחה' :
                     'ממתין לאישור'}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                  <div className="flex space-x-2 space-x-reverse">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-blue-50 hover:text-blue-600"
                      icon={Eye}
                      onClick={() => window.open(document.file_url, '_blank')}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-green-50 hover:text-green-600"
                      icon={Download}
                      onClick={() => window.open(document.file_url, '_blank')}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-accent-50 hover:text-accent-600"
                      icon={CheckCircle}
                      onClick={() => onApprove(document.id)}
                      disabled={document.status === 'approved'}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-yellow-50 hover:text-yellow-600"
                      icon={X}
                      onClick={() => onReject(document.id)}
                      disabled={document.status === 'rejected'}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-red-50 hover:text-red-600"
                      icon={Trash}
                      onClick={() => onDelete(document.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AdminDocumentList;