import { useState, useEffect } from 'react';
import { projectService } from '../services/api.ts-old';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  city: string;
  address: string;
  stage: string;
  progress: number;
  apartments: number;
  residents_count: number;
  developer_id?: string;
  developer_name?: string;
  image_url?: string;
  start_date?: string;
  expected_completion?: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

interface ProjectFilters {
  city?: string;
  stage?: string;
  search?: string;
}

export const useProjects = (filters?: ProjectFilters) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get projects from the service
        const projectsData = await projectService.getAllProjects();
        if (!projectsData || !Array.isArray(projectsData)) {
          throw new Error('Invalid projects data');
        }
        
        let filteredProjects = [...projectsData];

        if (filters?.city) {
          filteredProjects = filteredProjects.filter(p => p.city === filters.city);
        }

        if (filters?.stage) {
          filteredProjects = filteredProjects.filter(p => p.stage === filters.stage);
        }

        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          filteredProjects = filteredProjects.filter(p => 
            p.title.toLowerCase().includes(searchLower) ||
            p.address.toLowerCase().includes(searchLower) ||
            p.city.toLowerCase().includes(searchLower) ||
            (p.developer_name && p.developer_name.toLowerCase().includes(searchLower))
          );
        }

        setProjects(filteredProjects);
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        const errorMessage = err.message || 'שגיאה בטעינת הפרויקטים';
        setError(errorMessage);
        toast.error(errorMessage);
        // Return empty array as fallback
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [filters]);

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Create a new project using the service
      const newProject = await projectService.addProject(projectData);
      
      if (newProject) {
        setProjects(prev => [newProject, ...prev]);
        return newProject;
      }
      
      throw new Error('Failed to create project');
    } catch (err: any) {
      console.error('Error creating project:', err);
      const errorMessage = err.message || 'שגיאה ביצירת הפרויקט';
      toast.error(errorMessage);
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    createProject
  };
};