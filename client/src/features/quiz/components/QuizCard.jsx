import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const difficultyVariant = {
  easy: 'success',
  medium: 'warning',
  hard: 'danger',
};

const QuizCard = ({ quiz, onStart }) => {
  const { title, description, difficulty, questions_count } = quiz;

  return (
    <Card hoverable className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
          {difficulty && (
            <Badge variant={difficultyVariant[difficulty] || 'neutral'} size="sm">
              {difficulty}
            </Badge>
          )}
        </div>

        {description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{description}</p>
        )}

        <p className="text-gray-500 text-xs">
          {questions_count || 0} question{questions_count !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="mt-4">
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={() => onStart?.(quiz)}
        >
          Start Quiz
        </Button>
      </div>
    </Card>
  );
};

export default QuizCard;
