import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout';
import { PollList, PollResults } from '@/features/voting';
import { useVoting } from '@/features/voting/hooks/useVoting';
import { Modal } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import votingService from '@/features/voting/services/votingService';
import { useToast } from '@/hooks/useToast';

export default function VotingPage() {
  const { polls, loading, error, refetch } = useVoting();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [pollDetail, setPollDetail] = useState(null);

  useEffect(() => {
    if (selectedPoll) {
      votingService.getById(selectedPoll)
        .then((res) => setPollDetail(res.data.data))
        .catch(() => setSelectedPoll(null));
    }
  }, [selectedPoll]);

  const handleVote = async (pollId, optionId) => {
    if (!isAuthenticated) {
      showToast('Please log in to vote', 'warning');
      return;
    }
    try {
      await votingService.castVote(pollId, optionId);
      showToast('Vote cast successfully!', 'success');
      const res = await votingService.getById(pollId);
      setPollDetail(res.data.data);
      refetch();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to vote', 'error');
    }
  };

  return (
    <PageLayout title="Polls" subtitle="Vote on World Cup topics">
      <PollList
        polls={polls}
        loading={loading}
        error={error}
        onPollClick={(id) => setSelectedPoll(id)}
      />

      <Modal
        isOpen={!!selectedPoll}
        onClose={() => { setSelectedPoll(null); setPollDetail(null); }}
        title={pollDetail?.title || 'Poll'}
        size="md"
      >
        {pollDetail && (
          <PollResults poll={pollDetail} onVote={(optionId) => handleVote(pollDetail.id, optionId)} />
        )}
      </Modal>
    </PageLayout>
  );
}
