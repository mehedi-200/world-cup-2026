import React, { useState } from 'react';

const sizeConfig = {
  sm: { flag: 'w-7 h-7', text: 'text-sm', fallback: 'w-7 h-7 text-[10px]' },
  md: { flag: 'w-9 h-9', text: 'text-base font-medium', fallback: 'w-9 h-9 text-xs' },
  lg: { flag: 'w-12 h-12', text: 'text-lg font-semibold', fallback: 'w-12 h-12 text-sm' },
};

// Simple hash to get a consistent hue from a string
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < (str?.length || 0); i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 55%, 45%)`;
}

const TeamBadge = ({
  team,
  size = 'md',
  showCode = false,
  reverse = false,
  vertical = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const config = sizeConfig[size] || sizeConfig.md;

  const displayName = showCode ? team?.code : team?.name;
  const bgColor = stringToColor(team?.code || team?.name || '');

  const layoutClass = vertical
    ? 'flex flex-col items-center gap-1.5 text-center'
    : `inline-flex items-center gap-2.5 ${reverse ? 'flex-row-reverse' : ''}`;

  return (
    <div className={layoutClass}>
      {/* Flag / Fallback circle */}
      {team?.flag && !imgError ? (
        <div className={`${config.flag} rounded-full overflow-hidden ring-2 ring-white/10 shadow-md flex-shrink-0`}>
          <img
            src={team.flag}
            alt={`${team.name} flag`}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div
          className={`${config.fallback} rounded-full flex items-center justify-center ring-2 ring-white/10 shadow-md font-bold text-white flex-shrink-0`}
          style={{ backgroundColor: bgColor }}
        >
          {(team?.code || team?.name || '?').charAt(0)}
        </div>
      )}

      {/* Team name */}
      <span className={`${config.text} text-gray-100 truncate`}>
        {displayName || 'TBD'}
      </span>
    </div>
  );
};

export default TeamBadge;
