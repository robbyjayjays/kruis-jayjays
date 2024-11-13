import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.PORT || 5432,
    ssl: {
        rejectUnauthorized: false,
    },
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, workshopId, action } = req.body;

        if (!email || !workshopId || !action) {
            return res.status(400).json({ error: 'Email, workshop ID, and action are required' });
        }

        try {
            // Get the user ID from the email
            const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
            const user = userResult.rows[0];

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const userId = user.id;

            // Update the workshop's subscribers list based on the action
            if (action === 'subscribe') {
                await pool.query('UPDATE workshops SET subscribers = array_append(subscribers, $1) WHERE id = $2', [userId, workshopId]);
            } else if (action === 'unsubscribe') {
                await pool.query('UPDATE workshops SET subscribers = array_remove(subscribers, $1) WHERE id = $2', [userId, workshopId]);
            } else {
                return res.status(400).json({ error: 'Invalid action' });
            }

            res.status(200).json({ message: `Successfully ${action}d` });
        } catch (error) {
            console.error('Error updating subscription:', error.message);
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
