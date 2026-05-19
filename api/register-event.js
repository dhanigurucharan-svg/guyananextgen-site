const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, event_name, event_date } = req.body;

    if (!name || !email || !event_name) {
      return res.status(400).json({ error: 'Name, email, and event name are required' });
    }

    // Check for duplicate registration
    const existing = await sql`
      SELECT id FROM event_registrations
      WHERE email = ${email.toLowerCase()} AND event_name = ${event_name}
    `;

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'You are already registered for this event' });
    }

    await sql`
      INSERT INTO event_registrations (name, email, event_name, event_date)
      VALUES (${name}, ${email.toLowerCase()}, ${event_name}, ${event_date || ''})
    `;

    return res.status(201).json({ success: true, message: 'Registered for event successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
