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
        try {
            const query = 'SELECT preference_name FROM eetvoorkeuren;';
            const result = await pool.query(query);
            console.log(result)
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error fetching dietary preferences:', error.message);
            res.status(500).json({ error: 'Server error while fetching dietary preferences' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
