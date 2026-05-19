const { sql } = require('@vercel/postgres');
const { getUserFromRequest } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const result = await sql`
      SELECT id, name, email, interests, created_at
      FROM subscribers
      ORDER BY created_at DESC
      LIMIT 200
    `;

    return res.status(200).json({ subscribers: result.rows, total: result.rowCount });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
