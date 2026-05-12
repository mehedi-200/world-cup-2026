import React from 'react';

const optionLabels = ['A', 'B', 'C', 'D'];

const QuestionCard = ({ question, selectedOption, onSelect }) => {
  const options = question?.options || [];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-100">
        {question?.text || question?.question}
      </h3>

      <div className="space-y-2">
        {options.map((option, index) => {
          const isSelected = selectedOption === index || selectedOption === option.id;
          const optionValue = option.id != null ? option.id : index;

          return (
            <button
              key={optionValue}
              type="button"
              className={`
                w-full text-left p-3 rounded-lg cursor-pointer
                border transition-all flex items-center gap-3
                ${
                  isSelected
                    ? 'bg-primary-600/20 border-primary-600 text-gray-100'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                }
              `.trim()}
              onClick={() => onSelect?.(optionValue)}
            >
              <span
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                  ${
                    isSelected
                      ? 'bg-primary-600 text-white'
                      : 'bg-white/10 text-gray-400'
                  }
                `.trim()}
              >
                {optionLabels[index] || index + 1}
              </span>
              <span>{option.text || option.label || option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
