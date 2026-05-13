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
import { ProtectedRoute } from '@/features/auth';
import AdminLayout from '@/features/admin/components/AdminLayout';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminMatchesPage from '@/pages/admin/AdminMatchesPage';
import AdminTeamsPage from '@/pages/admin/AdminTeamsPage';
import AdminGroupsPage from '@/pages/admin/AdminGroupsPage';
import AdminQuizzesPage from '@/pages/admin/AdminQuizzesPage';
import AdminPollsPage from '@/pages/admin/AdminPollsPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminPredictionsPage from '@/pages/admin/AdminPredictionsPage';

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

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="matches" element={<AdminMatchesPage />} />
        <Route path="teams" element={<AdminTeamsPage />} />
        <Route path="groups" element={<AdminGroupsPage />} />
        <Route path="quizzes" element={<AdminQuizzesPage />} />
        <Route path="polls" element={<AdminPollsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="predictions" element={<AdminPredictionsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
