export function calculatePoints(predicted, actual) {
  const predHome = predicted.home_score;
  const predAway = predicted.away_score;
  const actHome = actual.home_score;
  const actAway = actual.away_score;

  // Exact score match
  if (predHome === actHome && predAway === actAway) return 10;

  // Correct goal difference
  if (predHome - predAway === actHome - actAway) return 5;

  // Correct winner
  const predWinner = predHome > predAway ? 'home' : predHome < predAway ? 'away' : 'draw';
  const actWinner = actHome > actAway ? 'home' : actHome < actAway ? 'away' : 'draw';
  if (predWinner === actWinner) return 3;

  return 0;
}
