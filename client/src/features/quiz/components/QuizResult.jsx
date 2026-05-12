import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const QuizResult = ({ score, totalQuestions, totalPoints, onPlayAgain, onGoBack }) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStrokeColor = () => {
    if (percentage >= 80) return '#4ade80';
    if (percentage >= 50) return '#facc15';
    return '#f87171';
  };

  return (
    <Card className="text-center max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Quiz Complete!</h2>

      {/* Circular score indicator */}
      <div className="relative inline-flex items-center justify-center mb-6">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={getStrokeColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold ${getColor()}`}>{percentage}%</span>
        </div>
      </div>

      <p className="text-xl text-gray-200 mb-2">
        You scored <span className={`font-bold ${getColor()}`}>{score}</span> / {totalQuestions}
      </p>

      {totalPoints != null && (
        <p className="text-fifa-gold font-semibold text-lg mb-6">
          +{totalPoints} points earned
        </p>
      )}

      <div className="flex gap-3 justify-center">
        {onPlayAgain && (
          <Button variant="primary" onClick={onPlayAgain}>
            Play Again
          </Button>
        )}
        {onGoBack && (
          <Button variant="secondary" onClick={onGoBack}>
            Go Back
          </Button>
        )}
      </div>
    </Card>
  );
};

export default QuizResult;
