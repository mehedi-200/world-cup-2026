const http = require('http');
const app = require('./app');
const env = require('./config/env');
const initSocket = require('./config/socket');
const { syncLiveAndEmit, syncTodayMatches } = require('./features/matches/match.sync');

const server = http.createServer(app);
const io = initSocket(server);

// Make io accessible in Express
app.set('io', io);

server.listen(env.port, () => {
  console.log(`\n🏆 WorldCup2026 API running on http://localhost:${env.port}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);

  // Initial sync on startup
  if (env.footballApi.key) {
    console.log('   Live data: football-data.org connected');
    console.log(`   Polling interval: ${env.footballApi.syncInterval / 1000}s\n`);

    // Sync today's matches on startup
    syncTodayMatches().catch((err) =>
      console.error('[Startup Sync] Failed:', err.message)
    );

    // Poll for live score updates every SYNC_INTERVAL_MS
    setInterval(() => {
      syncLiveAndEmit(io).then((result) => {
        if (result.live > 0) {
          console.log(`[Live Poll] Updated ${result.live} live matches`);
        }
      });
    }, env.footballApi.syncInterval);
  } else {
    console.log('   Live data: No API key set (using local data only)\n');
  }
});
