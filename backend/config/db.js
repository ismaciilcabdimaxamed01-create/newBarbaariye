const path = require('path');
const { Pool } = require('pg');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

/**
 * Build connection string so password is always part of a string (fixes SASL error).
 */
function getConnectionString() {
  const user = process.env.DB_USER || 'postgres';
  const host = process.env.DB_HOST || 'localhost';
  const database = process.env.DB_NAME || 'postgres';
  const port = parseInt(process.env.DB_PORT, 10) || 5432;
  const raw = process.env.DB_PASSWORD;
  const password = raw != null && raw !== '' ? encodeURIComponent(String(raw).trim()) : '';
  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
}

const pool = new Pool({
  connectionString: getConnectionString(),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Qalad lama filaan ah oo ku yimid macmiilka shaqaynaya', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
