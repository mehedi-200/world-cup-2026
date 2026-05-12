export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  HALF_TIME: 'half_time',
  COMPLETED: 'completed',
  POSTPONED: 'postponed',
};

export const MATCH_STAGES = {
  GROUP: 'group',
  ROUND_OF_32: 'round_of_32',
  ROUND_OF_16: 'round_of_16',
  QUARTER_FINAL: 'quarter_final',
  SEMI_FINAL: 'semi_final',
  THIRD_PLACE: 'third_place',
  FINAL: 'final',
};

export const STAGE_LABELS = {
  group: 'Group Stage',
  round_of_32: 'Round of 32',
  round_of_16: 'Round of 16',
  quarter_final: 'Quarter Final',
  semi_final: 'Semi Final',
  third_place: 'Third Place',
  final: 'Final',
};

export const STATUS_COLORS = {
  scheduled: 'info',
  live: 'danger',
  half_time: 'warning',
  completed: 'success',
  postponed: 'neutral',
};

export const PREDICTION_POINTS = {
  EXACT: 10,
  DIFFERENCE: 5,
  WINNER: 3,
  WRONG: 0,
};
