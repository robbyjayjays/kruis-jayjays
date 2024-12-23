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
            // Get the workshop details along with the creator's information and workshop date
            const workshopResult = await pool.query(
                `SELECT w.id, w.title, w.description, w.creator_id, w.subscribers, w.created_at, w.workshop_date,
                        u.email AS creator_email, u.firstname AS creator_firstname, u.lastname AS creator_lastname
                 FROM workshops w
                 JOIN users u ON w.creator_id = u.id
                 WHERE w.id = $1`,
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
