const https = require('https');
const db = require('../../config/db');
const env = require('../../config/env');

const API_URL = env.footballApi.url;
const API_KEY = env.footballApi.key;

// Map football-data.org status to our status
const STATUS_MAP = {
  SCHEDULED: 'scheduled',
  TIMED: 'scheduled',
  IN_PLAY: 'live',
  PAUSED: 'half_time',
  FINISHED: 'completed',
  SUSPENDED: 'postponed',
  POSTPONED: 'postponed',
  CANCELLED: 'postponed',
  AWARDED: 'completed',
};

// Map stage names
const STAGE_MAP = {
  REGULAR_SEASON: 'group',
  GROUP_STAGE: 'group',
  LAST_16: 'round_of_16',
  ROUND_OF_16: 'round_of_16',
  QUARTER_FINALS: 'quarter_final',
  SEMI_FINALS: 'semi_final',
  THIRD_PLACE: 'third_place',
  FINAL: 'final',
};

function fetchFromApi(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}${endpoint}`;
    const options = {
      headers: { 'X-Auth-Token': API_KEY },
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse API response: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

// Ensure team exists in our DB, return our internal team ID
async function ensureTeam(apiTeam) {
  if (!apiTeam || !apiTeam.id) return null;

  const [existing] = await db.query(
    'SELECT id FROM teams WHERE external_id = ?',
    [apiTeam.id]
  );

  if (existing.length > 0) return existing[0].id;

  const code = (apiTeam.tla || apiTeam.shortName || 'UNK').substring(0, 3).toUpperCase();

  // Check if code already exists
  const [byCode] = await db.query('SELECT id FROM teams WHERE code = ?', [code]);
  if (byCode.length > 0) {
    await db.query('UPDATE teams SET external_id = ?, crest_url = ? WHERE id = ?', [
      apiTeam.id, apiTeam.crest || null, byCode[0].id,
    ]);
    return byCode[0].id;
  }

  const [result] = await db.query(
    `INSERT INTO teams (name, code, flag_url, external_id, crest_url)
     VALUES (?, ?, ?, ?, ?)`,
    [apiTeam.name, code, apiTeam.crest || null, apiTeam.id, apiTeam.crest || null]
  );

  return result.insertId;
}

// Sync a single match from API data into our DB
async function syncMatch(apiMatch) {
  const homeTeamId = await ensureTeam(apiMatch.homeTeam);
  const awayTeamId = await ensureTeam(apiMatch.awayTeam);

  if (!homeTeamId || !awayTeamId) return null;

  const status = STATUS_MAP[apiMatch.status] || 'scheduled';
  const stage = STAGE_MAP[apiMatch.stage] || 'group';
  const homeScore = apiMatch.score?.fullTime?.home ?? null;
  const awayScore = apiMatch.score?.fullTime?.away ?? null;
  const minute = apiMatch.minute ? parseInt(apiMatch.minute, 10) : null;

  // Convert ISO date to MySQL datetime format
  const matchDate = apiMatch.utcDate
    ? new Date(apiMatch.utcDate).toISOString().slice(0, 19).replace('T', ' ')
    : null;

  const [existing] = await db.query(
    'SELECT id FROM matches WHERE external_id = ?',
    [apiMatch.id]
  );

  if (existing.length > 0) {
    // Update existing match
    await db.query(
      `UPDATE matches SET
        home_score = ?, away_score = ?, status = ?, minute = ?,
        venue = ?, competition_name = ?, competition_code = ?,
        competition_emblem = ?, home_team_crest = ?, away_team_crest = ?,
        updated_at = NOW()
      WHERE external_id = ?`,
      [
        homeScore, awayScore, status, minute,
        apiMatch.venue || null,
        apiMatch.competition?.name || null,
        apiMatch.competition?.code || null,
        apiMatch.competition?.emblem || null,
        apiMatch.homeTeam?.crest || null,
        apiMatch.awayTeam?.crest || null,
        apiMatch.id,
      ]
    );
    return existing[0].id;
  }

  // Insert new match
  const [result] = await db.query(
    `INSERT INTO matches
      (external_id, home_team_id, away_team_id, stage, match_date, venue, city,
       home_score, away_score, status, minute,
       competition_name, competition_code, competition_emblem,
       home_team_crest, away_team_crest)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      apiMatch.id, homeTeamId, awayTeamId, stage,
      matchDate, apiMatch.venue || null,
      apiMatch.area?.name || null,
      homeScore, awayScore, status, minute,
      apiMatch.competition?.name || null,
      apiMatch.competition?.code || null,
      apiMatch.competition?.emblem || null,
      apiMatch.homeTeam?.crest || null,
      apiMatch.awayTeam?.crest || null,
    ]
  );

  return result.insertId;
}

// Sync goal events for a match
async function syncGoals(apiMatch, matchId) {
  if (!apiMatch.goals || !apiMatch.goals.length) return;

  for (const goal of apiMatch.goals) {
    const teamId = await ensureTeam(goal.team);
    if (!teamId) continue;

    const [existing] = await db.query(
      `SELECT id FROM match_events
       WHERE match_id = ? AND minute = ? AND player_name = ? AND event_type IN ('goal','penalty_goal')`,
      [matchId, goal.minute, goal.scorer?.name || 'Unknown']
    );

    if (existing.length > 0) continue;

    const eventType = goal.type === 'PENALTY' ? 'penalty_goal' : 'goal';
    await db.query(
      `INSERT INTO match_events (match_id, team_id, event_type, player_name, minute, details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [matchId, teamId, eventType, goal.scorer?.name || 'Unknown', goal.minute, null]
    );
  }
}

// Main sync functions

async function syncTodayMatches() {
  console.log('[Sync] Fetching today\'s matches from football-data.org...');
  try {
    const data = await fetchFromApi('/matches');
    const matches = data.matches || [];
    console.log(`[Sync] Found ${matches.length} matches`);

    let synced = 0;
    for (const apiMatch of matches) {
      const matchId = await syncMatch(apiMatch);
      if (matchId) {
        await syncGoals(apiMatch, matchId);
        synced++;
      }
    }

    console.log(`[Sync] Synced ${synced} matches`);
    return { synced, total: matches.length };
  } catch (err) {
    console.error('[Sync] Error:', err.message);
    throw err;
  }
}

async function syncByDate(dateFrom, dateTo) {
  console.log(`[Sync] Fetching matches from ${dateFrom} to ${dateTo}...`);
  try {
    const data = await fetchFromApi(`/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`);
    const matches = data.matches || [];
    console.log(`[Sync] Found ${matches.length} matches`);

    let synced = 0;
    for (const apiMatch of matches) {
      const matchId = await syncMatch(apiMatch);
      if (matchId) {
        await syncGoals(apiMatch, matchId);
        synced++;
      }
    }

    console.log(`[Sync] Synced ${synced} matches for ${dateFrom} to ${dateTo}`);
    return { synced, total: matches.length };
  } catch (err) {
    console.error('[Sync] Error:', err.message);
    throw err;
  }
}

async function syncCompetition(competitionId) {
  console.log(`[Sync] Fetching matches for competition ${competitionId}...`);
  try {
    const data = await fetchFromApi(`/competitions/${competitionId}/matches`);
    const matches = data.matches || [];

    let synced = 0;
    for (const apiMatch of matches) {
      const matchId = await syncMatch(apiMatch);
      if (matchId) {
        await syncGoals(apiMatch, matchId);
        synced++;
      }
    }

    console.log(`[Sync] Synced ${synced} matches for competition ${competitionId}`);
    return { synced, total: matches.length };
  } catch (err) {
    console.error('[Sync] Error:', err.message);
    throw err;
  }
}

// Get live matches and push updates via socket
async function syncLiveAndEmit(io) {
  try {
    const data = await fetchFromApi('/matches?status=LIVE,IN_PLAY,PAUSED');
    const matches = data.matches || [];

    if (matches.length === 0) return { live: 0 };

    for (const apiMatch of matches) {
      const matchId = await syncMatch(apiMatch);
      if (matchId) {
        await syncGoals(apiMatch, matchId);

        // Fetch updated match from our DB to emit
        const [rows] = await db.query(
          `SELECT m.*,
            ht.name AS home_team_name, ht.code AS home_team_code,
            COALESCE(m.home_team_crest, ht.flag_url) AS home_team_flag,
            at2.name AS away_team_name, at2.code AS away_team_code,
            COALESCE(m.away_team_crest, at2.flag_url) AS away_team_flag
          FROM matches m
          JOIN teams ht ON m.home_team_id = ht.id
          JOIN teams at2 ON m.away_team_id = at2.id
          WHERE m.id = ?`,
          [matchId]
        );

        if (rows.length > 0 && io) {
          io.emit('matches:update', rows[0]);
          io.to(`match:${matchId}`).emit('score:update', rows[0]);
        }
      }
    }

    return { live: matches.length };
  } catch (err) {
    // Silent fail for polling — don't crash the server
    console.error('[Sync Live] Error:', err.message);
    return { live: 0, error: err.message };
  }
}

module.exports = {
  syncTodayMatches,
  syncByDate,
  syncCompetition,
  syncLiveAndEmit,
};
