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
  if (req.method === 'GET') {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    try {
      // Fetch user_id based on email
      const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      const user = userResult.rows[0];

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userId = user.id;

      // Check if there is an existing inschrijving for the user
      const inschrijvingResult = await pool.query(
        'SELECT * FROM inschrijvingen WHERE user_id = $1',
        [userId]
      );

      if (inschrijvingResult.rows.length > 0) {
        res.status(200).json({ exists: true });
      } else {
        res.status(200).json({ exists: false });
      }
    } catch (error) {
      console.error('Error checking inschrijvingen:', error.message);
      res.status(500).send('Server error');
    }
  } else if (req.method === 'DELETE') {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    try {
      // Fetch user_id based on email
      const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      const user = userResult.rows[0];

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userId = user.id;

      // Delete the inschrijving for the user
      const deleteResult = await pool.query(
        'DELETE FROM inschrijvingen WHERE user_id = $1',
        [userId]
      );

      if (deleteResult.rowCount > 0) {
        res.status(200).json({ message: 'Inschrijving successfully deleted' });
      } else {
        res.status(404).json({ error: 'No inschrijving found to delete' });
      }
    } catch (error) {
      console.error('Error deleting inschrijving:', error.message);
      res.status(500).send('Server error');
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
