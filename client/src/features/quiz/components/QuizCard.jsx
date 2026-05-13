import React from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const difficultyConfig = {
  easy: { variant: 'success', label: 'Easy', icon: '🟢' },
  medium: { variant: 'warning', label: 'Medium', icon: '🟡' },
  hard: { variant: 'danger', label: 'Hard', icon: '🔴' },
};

const QuizCard = ({ quiz, onStart }) => {
  const { title, description, difficulty } = quiz;
  const questionCount = quiz.question_count ?? quiz.questions_count ?? 0;
  const config = difficultyConfig[difficulty] || difficultyConfig.medium;

  return (
    <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.08] shadow-lg group">
      {/* Color bar */}
      <div className={`h-1 ${
        difficulty === 'easy' ? 'bg-gradient-to-r from-green-500 to-green-400'
          : difficulty === 'hard' ? 'bg-gradient-to-r from-red-500 to-red-400'
          : 'bg-gradient-to-r from-yellow-500 to-yellow-400'
      }`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <h3 className="text-base font-bold text-white leading-snug">{title}</h3>
          </div>
          <Badge variant={config.variant} size="sm">{config.label}</Badge>
        </div>

        {description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>
        )}

        <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {questionCount} question{questionCount !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            {questionCount * 10} pts
          </span>
        </div>

        <Button variant="gold" size="lg" fullWidth onClick={() => onStart?.(quiz)}>
          Start Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizCard;
