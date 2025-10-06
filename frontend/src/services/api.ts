export const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

async function req(path: string, opts: RequestInit = {})
{
    const token = localStorage.getItem('accessToken');
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    if (token) (headers as any).Authorization = `Bearer ${token}`;

    const res = await fetch(`${apiBase}${path}`, { ...opts, headers });
    if (!res.ok)
    {
        console.error('API error', res.status, res.statusText);
        throw new Error(await res.text());
    }
    return res.status === 204 ? null : res.json();
}

// ------------------ Projects ------------------
export const ProjectsAPI = {
    getAll: () => req('/projects'),
    getOne: (id: string) => req(`/projects/${id}`),
    create: (data: { title: string; address: string; stage: string }) =>
        req('/projects', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};

// ------------------ Votes ------------------
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

// ------------------ Documents (להמשך) ------------------
// כאן אפשר להוסיף /documents endpoints כשה־backend יהיה מוכן

// ------------------ Property rights (להמשך) ------------------
// כאן אפשר לחבר ל־backend אמיתי או ל־GIS API
