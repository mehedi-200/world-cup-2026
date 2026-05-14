import { comboResults } from '../data/results';

export function matchResult(name, selectedIds) {
  const sorted = [...selectedIds].sort();
  const key = sorted.join('+');
  const result = comboResults[key];

  const voiceText = result.voiceTemplate.replace(/\{name\}/g, name);

  return { ...result, voiceText, userName: name };
}
