import { apiClient } from './client';

/**
 * API endpoints for /api/v1/me/* (Single Project Mode)
 */

export interface Document {
  id: string;
  document: {
    id: string;
    title: string;
    type: string;
  };
  status: 'PENDING' | 'SIGNED';
  assignedAt: string;
  signedAt?: string;
}

export interface Vote {
  id: string;
  title: string;
  description?: string;
  status: 'OPEN' | 'CLOSED';
  opensAt: string;
  closesAt: string;
  hasVoted?: boolean;
  myBallot?: {
    optionId: string;
    optionLabel: string;
  };
}

export interface Message {
  id: string;
  message: {
    id: string;
    title: string;
    body: string;
    createdAt: string;
  };
  status: 'UNREAD' | 'READ';
  deliveredAt: string;
  readAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
}

export const meApi = {
  /**
   * GET /api/v1/me/documents
   */
  getDocuments: async (): Promise<Document[]> => {
    const response = await apiClient.get('/api/v1/me/documents');
    return response.data;
  },

  /**
   * GET /api/v1/me/documents/:assignmentId/download
   */
  getDocumentDownloadUrl: async (assignmentId: string): Promise<{ downloadUrl: string; expiresAt: string }> => {
    const response = await apiClient.get(`/api/v1/me/documents/${assignmentId}/download`);
    return response.data;
  },

  /**
   * POST /api/v1/me/documents/:assignmentId/sign
   */
  signDocument: async (assignmentId: string, signatureMetadata?: any): Promise<Document> => {
    const response = await apiClient.post(`/api/v1/me/documents/${assignmentId}/sign`, signatureMetadata);
    return response.data;
  },

  /**
   * GET /api/v1/me/votes
   */
  getVotes: async (): Promise<Vote[]> => {
    const response = await apiClient.get('/api/v1/me/votes');
    return response.data;
  },

  /**
   * GET /api/v1/me/votes/:voteId
   */
  getVote: async (voteId: string): Promise<Vote> => {
    const response = await apiClient.get(`/api/v1/me/votes/${voteId}`);
    return response.data;
  },

  /**
   * POST /api/v1/me/votes/:voteId/ballot
   */
  castVote: async (voteId: string, optionId: string): Promise<any> => {
    const response = await apiClient.post(`/api/v1/me/votes/${voteId}/ballot`, { optionId });
    return response.data;
  },

  /**
   * GET /api/v1/me/messages
   */
  getMessages: async (): Promise<Message[]> => {
    const response = await apiClient.get('/api/v1/me/messages');
    return response.data;
  },

  /**
   * POST /api/v1/me/messages/:deliveryId/read
   */
  markMessageAsRead: async (deliveryId: string): Promise<Message> => {
    const response = await apiClient.post(`/api/v1/me/messages/${deliveryId}/read`);
    return response.data;
  },

  /**
   * GET /api/v1/me/project
   */
  getProject: async (): Promise<Project> => {
    const response = await apiClient.get('/api/v1/me/project');
    return response.data;
  },

  /**
   * GET /api/v1/me/apartment
   */
  getApartment: async (): Promise<any> => {
    const response = await apiClient.get('/api/v1/me/apartment');
    return response.data;
  },
};
