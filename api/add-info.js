import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.PORT || 5432,
  ssl: {
    rejectUnauthorized: false, // Necessary for many cloud providers
  },
});

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { email, firstname, lastname } = req.body;

    if (!email || !firstname || !lastname) {
      return res.status(400).json({ error: 'Email, firstname, and lastname are required' });
    }

    try {
      // Check if the user exists
      const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = userResult.rows[0];

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update the firstname and lastname fields
      await pool.query(
        'UPDATE users SET firstname = $1, lastname = $2 WHERE email = $3',
        [firstname, lastname, email]
      );

      res.status(200).json({
        message: 'User information updated successfully',
        updatedFields: {
          firstname,
          lastname,
        },
      });
    } catch (error) {
      console.error('Error updating user:', error.message);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
