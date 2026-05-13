import { useState, useEffect } from 'react';

const STEPS = [
  'Scanning personal data...',
  'Detecting emotional contradictions...',
  'Consulting relationship mathematics...',
  'Comparing with global statistics...',
  'Preparing final verdict...',
  'Generating roast...',
];

const STEP_DELAY = 600;
const FINAL_DELAY = 500;

export default function LoadingSequence({ name, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, STEP_DELAY);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        onComplete();
      }, FINAL_DELAY);
      return () => clearTimeout(timer);
    }
  }, [currentStep, onComplete]);

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-fifa-darker/95 backdrop-blur-md flex items-center justify-center">
      <div className="max-w-md w-full mx-4 animate-fade-in">
        {/* Name header */}
        <h3 className="text-center text-lg text-white mb-8">
          Analyzing <span className="text-fifa-gold font-bold">{name}</span>...
        </h3>

        {/* Steps */}
        <div className="space-y-3 mb-8">
          {STEPS.map((step, index) => {
            const isComplete = index < currentStep;
            const isActive = index === currentStep;

            return (
              <div
                key={index}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  isComplete
                    ? 'opacity-100'
                    : isActive
                      ? 'opacity-100'
                      : 'opacity-20'
                }`}
              >
                {/* Icon */}
                <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  {isComplete ? (
                    <span className="text-green-400 text-lg">✓</span>
                  ) : isActive ? (
                    <span className="w-5 h-5 border-2 border-fifa-gold border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="w-2 h-2 bg-gray-600 rounded-full" />
                  )}
                </span>

                {/* Text */}
                <span
                  className={`text-sm ${
                    isComplete
                      ? 'text-green-400'
                      : isActive
                        ? 'text-white'
                        : 'text-gray-600'
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-fifa-gold to-yellow-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          Please wait while our AI analyzes your life choices...
        </p>
      </div>
    </div>
  );
}
