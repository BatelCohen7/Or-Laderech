import req from './api.ts-old';

export const ProjectsAPI = {
    getAll: () => req('/projects'),
    getOne: (id: string) => req(`/projects/${id}`),
    create: (data: { title: string; address: string; stage: string }) =>
        req('/projects', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};
