const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    await sql`
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (${name}, ${email.toLowerCase()}, ${subject || ''}, ${message})
    `;

    return res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
