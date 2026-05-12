import React from 'react';

const eventIcons = {
  goal: (
    <svg className="w-5 h-5 text-fifa-gold" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <line x1="12" y1="2" x2="12" y2="8" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="16" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" />
      <line x1="2" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="16" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  yellow_card: (
    <div className="w-4 h-5 bg-yellow-400 rounded-sm" />
  ),
  red_card: (
    <div className="w-4 h-5 bg-red-500 rounded-sm" />
  ),
  substitution: (
    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  ),
};

const eventLabels = {
  goal: 'Goal',
  yellow_card: 'Yellow Card',
  red_card: 'Red Card',
  substitution: 'Substitution',
};

const MatchEventTimeline = ({ events = [] }) => {
  if (events.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">No events yet</p>
    );
  }

  const sortedEvents = [...events].sort((a, b) => (a.minute || 0) - (b.minute || 0));

  return (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10" />

      <div className="space-y-4">
        {sortedEvents.map((event, index) => (
          <div key={index} className="flex items-center gap-4 relative">
            <div className="w-12 text-right">
              <span className="text-sm font-bold text-gray-300">
                {event.minute != null ? `${event.minute}'` : '--'}
              </span>
            </div>

            <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-fifa-dark rounded-full border border-white/10">
              {eventIcons[event.event_type] || (
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
              )}
            </div>

            <div className="flex-1">
              <p className="text-gray-200 text-sm font-medium">
                {event.player_name || 'Unknown Player'}
              </p>
              <p className="text-gray-500 text-xs">
                {eventLabels[event.event_type] || event.event_type}
                {event.details ? ` - ${event.details}` : ''}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchEventTimeline;
