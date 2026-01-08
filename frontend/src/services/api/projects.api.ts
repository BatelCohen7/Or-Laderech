import { apiClient } from './client';

/**
 * API endpoints for /api/v1/projects/:projectId/* (Project-scoped)
 */

export const projectsApi = {
  /**
   * GET /api/v1/projects/:projectId/documents
   */
  getDocuments: async (projectId: string): Promise<any[]> => {
    const response = await apiClient.get(`/api/v1/projects/${projectId}/documents`);
    return response.data;
  },

  /**
   * POST /api/v1/projects/:projectId/documents (multipart)
   */
  uploadDocument: async (projectId: string, file: File, title: string, docType: string): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('docType', docType);

    const response = await apiClient.post(`/api/v1/projects/${projectId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * POST /api/v1/projects/:projectId/documents/:documentId/assign
   */
  assignDocument: async (
    projectId: string,
    documentId: string,
    target: 'apartment' | 'users',
    apartmentId?: string,
    userIds?: string[]
  ): Promise<any> => {
    const response = await apiClient.post(
      `/api/v1/projects/${projectId}/documents/${documentId}/assign`,
      { target, apartmentId, userIds }
    );
    return response.data;
  },

  /**
   * GET /api/v1/projects/:projectId/documents/:documentId/assignments/summary
   */
  getDocumentAssignmentsSummary: async (projectId: string, documentId: string): Promise<any> => {
    const response = await apiClient.get(`/api/v1/projects/${projectId}/documents/${documentId}/assignments/summary`);
    return response.data;
  },

  /**
   * GET /api/v1/projects/:projectId/votes
   */
  getVotes: async (projectId: string): Promise<any[]> => {
    const response = await apiClient.get(`/api/v1/projects/${projectId}/votes`);
    return response.data;
  },

  /**
   * POST /api/v1/projects/:projectId/votes
   */
  createVote: async (projectId: string, voteData: any): Promise<any> => {
    const response = await apiClient.post(`/api/v1/projects/${projectId}/votes`, voteData);
    return response.data;
  },

  /**
   * POST /api/v1/projects/:projectId/votes/:voteId/close
   */
  closeVote: async (projectId: string, voteId: string): Promise<any> => {
    const response = await apiClient.post(`/api/v1/projects/${projectId}/votes/${voteId}/close`);
    return response.data;
  },

  /**
   * GET /api/v1/projects/:projectId/votes/:voteId/results
   */
  getVoteResults: async (projectId: string, voteId: string): Promise<any> => {
    const response = await apiClient.get(`/api/v1/projects/${projectId}/votes/${voteId}/results`);
    return response.data;
  },

  /**
   * GET /api/v1/projects/:projectId/votes/:voteId/participation
   */
  getVoteParticipation: async (projectId: string, voteId: string): Promise<any> => {
    const response = await apiClient.get(`/api/v1/projects/${projectId}/votes/${voteId}/participation`);
    return response.data;
  },

  /**
   * GET /api/v1/projects/:projectId/messages
   */
  getMessages: async (projectId: string): Promise<any[]> => {
    const response = await apiClient.get(`/api/v1/projects/${projectId}/messages`);
    return response.data;
  },

  /**
   * POST /api/v1/projects/:projectId/messages
   */
  createMessage: async (projectId: string, messageData: any): Promise<any> => {
    const response = await apiClient.post(`/api/v1/projects/${projectId}/messages`, messageData);
    return response.data;
  },

  /**
   * POST /api/v1/projects/:projectId/messages/:messageId/send
   */
  sendMessage: async (projectId: string, messageId: string): Promise<any> => {
    const response = await apiClient.post(`/api/v1/projects/${projectId}/messages/${messageId}/send`);
    return response.data;
  },

  /**
   * POST /api/v1/projects/:projectId/messages/:messageId/schedule
   */
  scheduleMessage: async (projectId: string, messageId: string, scheduledAt: string): Promise<any> => {
    const response = await apiClient.post(`/api/v1/projects/${projectId}/messages/${messageId}/schedule`, { scheduledAt });
    return response.data;
  },

  /**
   * POST /api/v1/projects/:projectId/messages/:messageId/cancel
   */
  cancelMessage: async (projectId: string, messageId: string): Promise<any> => {
    const response = await apiClient.post(`/api/v1/projects/${projectId}/messages/${messageId}/cancel`);
    return response.data;
  },

  /**
   * GET /api/v1/projects/:projectId/messages/:messageId/deliveries/summary
   */
  getMessageDeliveriesSummary: async (projectId: string, messageId: string): Promise<any> => {
    const response = await apiClient.get(`/api/v1/projects/${projectId}/messages/${messageId}/deliveries/summary`);
    return response.data;
  },
};
