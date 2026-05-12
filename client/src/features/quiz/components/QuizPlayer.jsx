import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import QuestionCard from './QuestionCard';

const QuizPlayer = ({ quiz, onComplete }) => {
  const questions = quiz?.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === totalQuestions - 1;
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  const handleSelect = (optionValue) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionValue }));
  };

  const handleNext = () => {
    if (isLast) {
      const formattedAnswers = questions.map((q, i) => ({
        question_id: q.id,
        selected_option: answers[i],
      }));
      onComplete?.(formattedAnswers);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No questions available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <Card>
        <QuestionCard
          question={currentQuestion}
          selectedOption={answers[currentIndex]}
          onSelect={handleSelect}
        />
      </Card>

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <Button
          variant="secondary"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>

        <Button
          variant={isLast ? 'gold' : 'primary'}
          onClick={handleNext}
          disabled={answers[currentIndex] == null}
        >
          {isLast ? 'Submit Quiz' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default QuizPlayer;
