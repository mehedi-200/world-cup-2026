import React from 'react';
import Loader from '@/components/ui/Loader';
import QuizCard from './QuizCard';

const QuizList = ({ quizzes = [], loading, error, onStartQuiz }) => {
  if (loading) {
    return <Loader size="lg" text="Loading quizzes..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No quizzes available</p>
        <p className="text-gray-500 text-sm mt-1">Check back later for new quizzes!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} onStart={onStartQuiz} />
      ))}
    </div>
  );
};

export default QuizList;
