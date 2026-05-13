import React from 'react';
import Button from '@/components/ui/Button';

const QuizResult = ({ score, totalQuestions, totalPoints, onPlayAgain, onGoBack }) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const getEmoji = () => {
    if (percentage >= 80) return '🏆';
    if (percentage >= 60) return '⭐';
    if (percentage >= 40) return '💪';
    return '📚';
  };

  const getMessage = () => {
    if (percentage >= 80) return 'Outstanding!';
    if (percentage >= 60) return 'Well Done!';
    if (percentage >= 40) return 'Good Try!';
    return 'Keep Learning!';
  };

  const getColor = () => {
    if (percentage >= 80) return 'text-fifa-gold';
    if (percentage >= 60) return 'text-green-400';
    if (percentage >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="max-w-sm mx-auto text-center">
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-8">
        {/* Emoji */}
        <div className="text-6xl mb-2 animate-trophy-enter">{getEmoji()}</div>
        <h2 className="text-xl font-bold text-white mb-1">{getMessage()}</h2>

        {/* Circular score */}
        <div className="relative inline-flex items-center justify-center my-6">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle cx="60" cy="60" r="54" fill="none" stroke={percentage >= 60 ? '#D4AF37' : percentage >= 40 ? '#facc15' : '#f87171'}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-black ${getColor()}`}>{percentage}%</span>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-1">
          <span className={`font-bold ${getColor()}`}>{score}</span> / {totalQuestions} correct
        </p>

        {totalPoints != null && totalPoints > 0 && (
          <p className="text-fifa-gold font-bold text-lg mt-2">
            +{totalPoints} points earned!
          </p>
        )}

        <div className="flex gap-3 mt-6">
          {onGoBack && <Button variant="secondary" onClick={onGoBack} fullWidth size="lg">Back to Quizzes</Button>}
          {onPlayAgain && <Button variant="gold" onClick={onPlayAgain} fullWidth size="lg">Play Again</Button>}
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
