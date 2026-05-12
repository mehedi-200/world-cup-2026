const mysql = require('mysql2/promise');
const env = require('./env');

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  socketPath: env.db.socketPath || undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then((conn) => {
    console.log('✓ MySQL connected successfully');
    conn.release();
  })
  .catch((err) => {
    console.error('✗ MySQL connection failed:', err.message);
  });

module.exports = pool;
