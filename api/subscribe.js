const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, interests } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const interestsStr = Array.isArray(interests) ? interests.join(',') : (interests || '');

    // Upsert: update interests/name if email already exists
    await sql`
      INSERT INTO subscribers (name, email, interests)
      VALUES (${name || ''}, ${email.toLowerCase()}, ${interestsStr})
      ON CONFLICT (email)
      DO UPDATE SET
        name = COALESCE(NULLIF(${name || ''}, ''), subscribers.name),
        interests = ${interestsStr}
    `;

    return res.status(200).json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
