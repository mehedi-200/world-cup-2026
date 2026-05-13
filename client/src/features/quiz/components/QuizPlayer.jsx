import React, { useState } from 'react';
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
  const answeredCount = Object.keys(answers).length;

  const handleSelect = (optionKey) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionKey }));
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

  if (!currentQuestion) {
    return <div className="text-center py-12"><p className="text-gray-400">No questions available</p></div>;
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 font-medium">{currentIndex + 1} / {totalQuestions}</span>
          <span className="text-xs text-gray-500">{answeredCount} answered</span>
        </div>
        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-fifa-gold to-yellow-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex gap-1 mt-3 justify-center flex-wrap">
          {questions.map((_, i) => (
            <button key={i} onClick={() => setCurrentIndex(i)}
              className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${
                i === currentIndex ? 'bg-fifa-gold text-fifa-dark scale-110'
                  : answers[i] != null ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-white/[0.04] text-gray-600 border border-white/[0.06]'
              }`}>{i + 1}</button>
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 mb-6">
        <QuestionCard question={currentQuestion} selectedOption={answers[currentIndex]} onSelect={handleSelect} questionNumber={currentIndex + 1} />
      </div>

      {/* Nav */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0} fullWidth size="lg">Back</Button>
        <Button variant={isLast ? 'gold' : 'primary'} onClick={handleNext} disabled={answers[currentIndex] == null} fullWidth size="lg">{isLast ? 'Submit' : 'Next'}</Button>
      </div>
    </div>
  );
};

export default QuizPlayer;
