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
        const { id } = req.query; // Extract workshop ID from query parameters

        if (!id) {
            return res.status(400).json({ error: 'Workshop ID is required' });
        }

        try {
            // Query to get the workshop details by ID
            const workshopResult = await pool.query(
                'SELECT id, title, description, creator_id, subscribers, created_at FROM workshops WHERE id = $1',
                [id]
            );

            if (workshopResult.rows.length === 0) {
                return res.status(404).json({ error: 'Workshop not found' });
            }

            const workshop = workshopResult.rows[0];
            res.status(200).json({ workshop });
        } catch (error) {
            console.error('Error fetching workshop:', error.message);
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
