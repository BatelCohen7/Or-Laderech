import { useState, useEffect } from 'react';

interface Document {
  id: string;
  title: string;
  status: 'PENDING' | 'SIGNED';
  assignedAt: string;
}

interface Vote {
  id: string;
  title: string;
  status: 'OPEN' | 'CLOSED';
  closesAt: string;
  hasVoted?: boolean;
}

interface Message {
  id: string;
  message: {
    id: string;
    title: string;
    body: string;
    createdAt: string;
  };
  status: 'UNREAD' | 'READ';
  deliveredAt: string;
}

interface DashboardData {
  documents: Document[];
  votes: Vote[];
  messages: Message[];
}

/**
 * Hook to fetch dashboard data from /api/v1/me/* endpoints
 * 
 * Fetches:
 * - /api/v1/me/documents (show pending count)
 * - /api/v1/me/votes (show open votes + userVoted)
 * - /api/v1/me/messages (show unread count + latest message preview)
 */
export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Fetch all data in parallel
      const [documentsRes, votesRes, messagesRes] = await Promise.all([
        fetch('/api/v1/me/documents', { headers }),
        fetch('/api/v1/me/votes', { headers }),
        fetch('/api/v1/me/messages', { headers }),
      ]);

      // Check for errors
      if (!documentsRes.ok || !votesRes.ok || !messagesRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const [documents, votes, messages] = await Promise.all([
        documentsRes.json(),
        votesRes.json(),
        messagesRes.json(),
      ]);

      setData({
        documents: Array.isArray(documents) ? documents : [],
        votes: Array.isArray(votes) ? votes : [],
        messages: Array.isArray(messages) ? messages : [],
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      // Non-blocking: set empty data on error
      setData({
        documents: [],
        votes: [],
        messages: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const retry = () => {
    fetchData();
  };

  return { data, loading, error, retry };
};
