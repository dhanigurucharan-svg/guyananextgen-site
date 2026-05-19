const { sql } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');
const { createToken, setTokenCookie } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await sql`
      SELECT id, name, email, password_hash FROM users WHERE email = ${email.toLowerCase()}
    `;

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = createToken(user);
    setTokenCookie(res, token);

    return res.status(200).json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
