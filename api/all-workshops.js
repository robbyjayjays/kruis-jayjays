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
        const { email } = req.query; // Extract email from query parameters

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

            // Fetch all workshops where the creator_id is not equal to the current user's ID
            const workshopResult = await pool.query(
                'SELECT id, title, description, creator_id, created_at FROM workshops WHERE creator_id != $1',
                [userId]
            );

            res.status(200).json({ workshops: workshopResult.rows });
        } catch (error) {
            console.error('Error fetching all workshops:', error.message);
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
