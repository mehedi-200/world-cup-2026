const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  port: process.env.PORT || 5000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'worldcup2026',
    socketPath: process.env.DB_SOCKET || '/opt/lampp/var/mysql/mysql.sock',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  footballApi: {
    key: process.env.FOOTBALL_API_KEY || '',
    url: process.env.FOOTBALL_API_URL || 'https://api.football-data.org/v4',
    syncInterval: parseInt(process.env.SYNC_INTERVAL_MS, 10) || 60000,
  },
};
