import React, { useEffect, useState } from 'react';
import { Card, Button } from '../ui';
import { VotesAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface VotingSystemProps
{
  projectId: string;
}

const VotingSystem: React.FC<VotingSystemProps> = ({ projectId }) =>
{
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() =>
  {
    const loadVotes = async () =>
    {
      setLoading(true);
      try
      {
        const data = await VotesAPI.getByProject(projectId);
        setVotes(data);
      } catch (e)
      {
        console.error(e);
        toast.error('שגיאה בטעינת הצבעות');
      } finally
      {
        setLoading(false);
      }
    };
    loadVotes();
  }, [projectId]);

  const handleVote = async (voteId: string, choice: string) =>
  {
    try
    {
      await VotesAPI.cast(voteId, choice);
      toast.success(`הצבעת ${choice} נשמרה`);
    } catch (e)
    {
      console.error(e);
      toast.error('שגיאה בשמירת ההצבעה');
    }
  };

  if (loading)
  {
    return <Card className="p-6 text-center">טוען הצבעות...</Card>;
  }

  if (!votes.length)
  {
    return <Card className="p-6 text-center">אין הצבעות פעילות</Card>;
  }

  return (
    <div className="space-y-4">
      {votes.map((vote) => (
        <Card key={vote.id} className="p-4">
          <h3 className="font-bold text-lg">{vote.title}</h3>
          <p className="text-sm text-gray-500">
            מועד סיום: {new Date(vote.deadline).toLocaleDateString('he-IL')}
          </p>
          <div className="mt-4 flex gap-2">
            <Button variant="primary" onClick={() => handleVote(vote.id, 'בעד')}>בעד</Button>
            <Button variant="secondary" onClick={() => handleVote(vote.id, 'נגד')}>נגד</Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default VotingSystem;
