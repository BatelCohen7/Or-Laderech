import React from 'react';
import { Edit, Eye, Trash, Info } from 'lucide-react';
import { Button, Badge, LoadingSpinner, Card } from './ui';

interface Resident {
  id: string;
  full_name: string;
  id_number: string;
  phone?: string;
  email?: string;
  building?: string;
  apartment?: string;
  registered: boolean;
}

interface AdminResidentTableProps {
  residents: Resident[];
  onEdit: (resident: Resident) => void;
  onView: (resident: Resident) => void;
  onDelete: (residentId: string) => void;
  loading?: boolean;
}

const AdminResidentTable: React.FC<AdminResidentTableProps> = ({
  residents,
  onEdit,
  onView,
  onDelete,
  loading = false
}) => {
  if (loading) {
    return (
      <Card className="p-8 text-center">
        <LoadingSpinner size="md" color="primary" text="טוען דיירים..." centered />
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
                שם
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                ת.ז
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                טלפון
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                בניין
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
            {residents.map((resident) => (
              <tr key={resident.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-neutral-900">{resident.full_name}</div>
                  {resident.registered && (
                    <div className="text-xs text-accent-600">✓ רשום למערכת</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-600">{resident.id_number || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-600">{resident.phone || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-600">{resident.building || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={resident.registered ? 'success' : 'warning'}>
                    {resident.registered ? 'רשום' : 'לא רשום'}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                  <div className="flex space-x-2 space-x-reverse">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-gold-50 hover:text-gold-600"
                      icon={Edit}
                      onClick={() => onEdit(resident)}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-blue-50 hover:text-blue-600"
                      icon={Eye}
                      onClick={() => onView(resident)}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-red-50 hover:text-red-600"
                      icon={Trash}
                      onClick={() => onDelete(resident.id)}
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

export default AdminResidentTable;