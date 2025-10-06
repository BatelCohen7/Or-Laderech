import req from './api.ts-old';

export const VotesAPI = {
    getByProject: (projectId: string) => req(`/votes/project/${projectId}`),

    create: (projectId: string, data: { title: string; deadline: string }) =>
        req(`/votes/project/${projectId}`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    cast: (voteId: string, choice: string) =>
        req(`/votes/${voteId}/cast`, {
            method: 'POST',
            body: JSON.stringify({ choice }),
        }),
};
