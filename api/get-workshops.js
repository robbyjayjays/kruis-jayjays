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
        const { email, isAdmin } = req.query;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        try {
            // Get the user ID from the email
            const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
            const user = userResult.rows[0];

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const userId = user.id;

            // Determine the query based on isAdmin parameter
            const workshopQuery = isAdmin === 'true'
                ? 'SELECT id, title, description, created_at FROM workshops WHERE creator_id = $1'
                : 'SELECT id, title, description, created_at FROM workshops WHERE creator_id != $1';

            const workshopResult = await pool.query(workshopQuery, [userId]);

            res.status(200).json({ workshops: workshopResult.rows });
        } catch (error) {
            console.error('Error fetching workshops:', error.message);
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
