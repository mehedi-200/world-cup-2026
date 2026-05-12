import React, { useState } from 'react';

const sizeConfig = {
  sm: { flag: 'w-6 h-4', text: 'text-sm' },
  md: { flag: 'w-8 h-5', text: 'text-base' },
  lg: { flag: 'w-10 h-7', text: 'text-lg font-semibold' },
};

const TeamBadge = ({ team, size = 'md', showCode = false, reverse = false }) => {
  const [imgError, setImgError] = useState(false);
  const config = sizeConfig[size] || sizeConfig.md;

  const displayName = showCode ? team?.code : team?.name;

  return (
    <div className={`inline-flex items-center gap-2 ${reverse ? 'flex-row-reverse' : ''}`}>
      {team?.flag && !imgError ? (
        <img
          src={team.flag}
          alt={`${team.name} flag`}
          className={`${config.flag} rounded-sm object-cover shadow`}
          onError={() => setImgError(true)}
        />
      ) : (
        <span className={`${config.flag} flex items-center justify-center bg-white/10 rounded-sm text-xs text-gray-400 font-medium`}>
          {team?.code || '???'}
        </span>
      )}
      <span className={`${config.text} text-gray-100`}>
        {displayName || 'TBD'}
      </span>
    </div>
  );
};

export default TeamBadge;
