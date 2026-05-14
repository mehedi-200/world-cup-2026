import { useState, useEffect } from 'react';

const STEPS = [
  'Scanning life choices…',
  'Loading cinematic verdict…',
  'Preparing roast…',
];

const STEP_DELAY = 500;
const FINAL_DELAY = 400;

export default function LoadingSequence({ name, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < STEPS.length) {
      const timer = setTimeout(() => setCurrentStep((p) => p + 1), STEP_DELAY);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, FINAL_DELAY);
      return () => clearTimeout(timer);
    }
  }, [currentStep, onComplete]);

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-fifa-darker/95 backdrop-blur-md flex items-center justify-center">
      <div className="max-w-sm w-full mx-4 animate-fade-in text-center">
        <h3 className="text-xl text-white mb-8">
          Analyzing <span className="text-fifa-gold font-bold">{name}</span>…
        </h3>

        <div className="space-y-3 mb-8 text-left">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 transition-all duration-300 ${
                i < currentStep ? 'opacity-100' : i === currentStep ? 'opacity-100' : 'opacity-20'
              }`}
            >
              <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                {i < currentStep ? (
                  <span className="text-green-400 text-lg">✓</span>
                ) : i === currentStep ? (
                  <span className="w-5 h-5 border-2 border-fifa-gold border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="w-2 h-2 bg-gray-600 rounded-full" />
                )}
              </span>
              <span className={`text-sm ${i < currentStep ? 'text-green-400' : i === currentStep ? 'text-white' : 'text-gray-600'}`}>
                {step}
              </span>
            </div>
          ))}
        </div>

        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-fifa-gold to-yellow-500 rounded-full transition-all duration-400 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
