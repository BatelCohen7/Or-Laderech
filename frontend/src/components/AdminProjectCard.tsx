import React from 'react';
import { Building, Eye, Edit, Trash, MapPin, Info } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description?: string;
  city: string;
  address: string;
  stage: string;
  progress: number;
  apartments: number;
  residents_count: number;
  developer_name?: string;
  image_url?: string;
  start_date?: string;
  expected_completion?: string;
}

interface AdminProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

const AdminProjectCard: React.FC<AdminProjectCardProps> = ({
  project,
  onView,
  onEdit,
  onDelete
}) => {
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'בביצוע': return 'info';
      case 'הושלם': return 'success';
      case 'איסוף חתימות': return 'warning';
      case 'תכנון ראשוני': return 'default';
      case 'הליכי רישוי': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="transform hover:-translate-y-1 transition-transform duration-300">
      <Card hover className="overflow-hidden h-full shadow-sm">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 space-x-reverse">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-100 to-warmGold-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                {project.image_url ? (
                  <img 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                    src={project.image_url}
                  />
                ) : (
                  <Building className="w-8 h-8 text-gold-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 text-lg">{project.title}</h3>
                <div className="flex items-center space-x-3 space-x-reverse text-neutral-600 mb-2">
                  <MapPin className="w-4 h-4 text-gold-500" />
                  <span className="text-sm font-medium">{project.address}, {project.city}</span>
                </div>
                <div className="flex items-center space-x-4 space-x-reverse text-sm text-neutral-600">
                  <span>{project.apartments} דירות</span>
                  <span>{project.residents_count} דיירים</span>
                  {project.start_date && (
                    <span>התחלה: {new Date(project.start_date).toLocaleDateString('he-IL')}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge variant={getStageColor(project.stage) as any}>
                {project.stage}
              </Badge>
              <div className="flex space-x-1 space-x-reverse">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hover:bg-blue-50 hover:text-blue-600"
                  icon={Eye} 
                  onClick={() => onView(project)}
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hover:bg-gold-50 hover:text-gold-600"
                  icon={Edit} 
                  onClick={() => onEdit(project)}
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hover:bg-red-50 hover:text-red-600"
                  icon={Trash} 
                  onClick={() => onDelete(project.id)}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-neutral-600">התקדמות</span>
              <span className="text-sm font-semibold text-gold-600">{project.progress}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-gold-500 to-warmGold-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminProjectCard;