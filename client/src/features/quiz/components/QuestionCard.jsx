import React from 'react';

const optionKeys = ['a', 'b', 'c', 'd'];
const optionLabels = ['A', 'B', 'C', 'D'];

const QuestionCard = ({ question, selectedOption, onSelect, questionNumber }) => {
  // Build options from flat fields (option_a, option_b, option_c, option_d)
  const options = question?.options || optionKeys.map((key) => ({
    key,
    text: question?.[`option_${key}`],
  })).filter(o => o.text);

  return (
    <div>
      <p className="text-xs text-fifa-gold font-semibold uppercase tracking-wider mb-2">
        Question {questionNumber || ''}
      </p>
      <h3 className="text-base md:text-lg font-bold text-white leading-snug mb-5">
        {question?.question_text || question?.text || question?.question}
      </h3>

      <div className="space-y-2.5">
        {options.map((option, index) => {
          const key = option.key || optionKeys[index];
          const text = option.text || option.label || option;
          const isSelected = selectedOption === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect?.(key)}
              className={`w-full text-left rounded-2xl p-4 border transition-all duration-200 active:scale-[0.98] flex items-center gap-3 ${
                isSelected
                  ? 'bg-gradient-to-r from-fifa-gold/15 to-fifa-gold/5 border-fifa-gold/30'
                  : 'bg-white/[0.03] border-white/[0.06] active:bg-white/[0.06]'
              }`}
            >
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                isSelected
                  ? 'bg-fifa-gold text-fifa-dark'
                  : 'bg-white/[0.06] text-gray-400'
              }`}>
                {optionLabels[index]}
              </span>
              <span className={`text-sm font-medium ${isSelected ? 'text-fifa-gold' : 'text-gray-300'}`}>
                {text}
              </span>
              {isSelected && (
                <svg className="w-5 h-5 text-fifa-gold ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
