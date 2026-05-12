export function formatScore(home, away) {
  if (home === null || home === undefined) return 'vs';
  return `${home} - ${away}`;
}

export function getResultLabel(points) {
  if (points === 10) return 'Exact!';
  if (points === 5) return 'Difference';
  if (points === 3) return 'Winner';
  return 'Wrong';
}

export function getResultColor(points) {
  if (points === 10) return 'success';
  if (points === 5) return 'warning';
  if (points === 3) return 'info';
  return 'neutral';
}
