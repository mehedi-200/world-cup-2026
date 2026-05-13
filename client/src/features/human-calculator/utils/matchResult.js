import { comboResults, singleResults, defaultResult } from '../data/results';
import { funnyLines } from '../data/funnyLines';
import { achievements } from '../data/achievements';

export function matchResult(name, selectedIds) {
  const sorted = [...selectedIds].sort();
  const key = sorted.join('+');

  let result;
  if (sorted.length === 2) {
    result = comboResults[key] || defaultResult;
  } else if (sorted.length === 1) {
    result = singleResults[sorted[0]] || defaultResult;
  } else {
    result = defaultResult;
  }

  const funnyLine = funnyLines[Math.floor(Math.random() * funnyLines.length)];
  const achievement = achievements[key] || null;
  const voiceText = result.voiceTemplate.replace(/\{name\}/g, name);

  return { ...result, funnyLine, achievement, voiceText, userName: name };
}
