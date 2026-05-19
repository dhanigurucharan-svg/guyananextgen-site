const { sql } = require('@vercel/postgres');

async function query(text, params = []) {
  const result = await sql.query(text, params);
  return result;
}

module.exports = { sql, query };
