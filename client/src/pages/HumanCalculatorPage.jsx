import { useState, useCallback } from 'react';
import WelcomeScreen from '@/features/human-calculator/components/WelcomeScreen';
import StatusSelection from '@/features/human-calculator/components/StatusSelection';
import LoadingSequence from '@/features/human-calculator/components/LoadingSequence';
import ResultScreen from '@/features/human-calculator/components/ResultScreen';
import { matchResult } from '@/features/human-calculator/utils/matchResult';

export default function HumanCalculatorPage() {
  const [screen, setScreen] = useState('welcome');
  const [name, setName] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [result, setResult] = useState(null);

  const handleWelcomeSubmit = (userName) => {
    setName(userName);
    setScreen('select');
  };

  const handleSelectSubmit = (ids) => {
    setSelectedStatuses(ids);
    setScreen('loading');
  };

  const handleLoadingComplete = useCallback(() => {
    const computed = matchResult(name, selectedStatuses);
    setResult(computed);
    setScreen('result');
  }, [name, selectedStatuses]);

  const handleReplay = () => {
    setSelectedStatuses([]);
    setResult(null);
    setScreen('select');
  };

  return (
    <div className="min-h-screen bg-fifa-dark text-white overflow-x-hidden">
      {screen === 'welcome' && <WelcomeScreen onStart={handleWelcomeSubmit} />}

      {screen === 'select' && (
        <StatusSelection name={name} onSubmit={handleSelectSubmit} />
      )}

      {screen === 'loading' && (
        <LoadingSequence name={name} onComplete={handleLoadingComplete} />
      )}

      {screen === 'result' && result && (
        <ResultScreen result={result} onReplay={handleReplay} />
      )}
    </div>
  );
}
