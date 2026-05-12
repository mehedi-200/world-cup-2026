import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import matchService from '../services/matchService';

export function useLiveMatch(matchId) {
  const socket = useSocket();
  const [match, setMatch] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) return;

    const fetchMatch = async () => {
      setLoading(true);
      try {
        const { data } = await matchService.getById(matchId);
        const d = data.data;
        const matchData = d?.match || (d?.id ? d : data);
        setMatch(matchData);
        setEvents(matchData.events || []);
      } catch (err) {
        console.error('Failed to fetch match:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId]);

  useEffect(() => {
    if (!socket || !matchId) return;

    const room = `match:${matchId}`;
    socket.emit('join', room);

    const handleScoreUpdate = (data) => {
      setMatch((prev) => (prev ? { ...prev, ...data } : prev));
    };

    const handleMatchEvent = (event) => {
      setEvents((prev) => [...prev, event]);
      if (event.event_type === 'goal') {
        setMatch((prev) => {
          if (!prev) return prev;
          const isHome = event.team_id === prev.home_team_id;
          return {
            ...prev,
            home_score: isHome ? (prev.home_score || 0) + 1 : prev.home_score,
            away_score: !isHome ? (prev.away_score || 0) + 1 : prev.away_score,
          };
        });
      }
    };

    socket.on('score:update', handleScoreUpdate);
    socket.on('match:event', handleMatchEvent);

    return () => {
      socket.emit('leave', room);
      socket.off('score:update', handleScoreUpdate);
      socket.off('match:event', handleMatchEvent);
    };
  }, [socket, matchId]);

  return { match, events, loading };
}
