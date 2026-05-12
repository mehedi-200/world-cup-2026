import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import MatchesPage from '@/pages/MatchesPage';
import MatchDetailPage from '@/pages/MatchDetailPage';
import PredictionsPage from '@/pages/PredictionsPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import GroupsPage from '@/pages/GroupsPage';
import QuizPage from '@/pages/QuizPage';
import QuizPlayPage from '@/pages/QuizPlayPage';
import VotingPage from '@/pages/VotingPage';
import ProfilePage from '@/pages/ProfilePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/matches" element={<MatchesPage />} />
      <Route path="/matches/:id" element={<MatchDetailPage />} />
      <Route path="/predictions" element={<PredictionsPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/groups" element={<GroupsPage />} />
      <Route path="/quizzes" element={<QuizPage />} />
      <Route path="/quizzes/:id" element={<QuizPlayPage />} />
      <Route path="/polls" element={<VotingPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
