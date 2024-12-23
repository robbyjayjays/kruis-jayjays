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
    if (req.method === 'PUT') {
        const { id, title, description, workshop_date } = req.body;

        if (!id || !title || !description || !workshop_date) {
            return res.status(400).json({ error: 'Workshop ID, title, description, and date are required' });
        }

        try {
            // Update the workshop title, description, and workshop_date
            const updateQuery = `
                UPDATE workshops
                SET title = $1, description = $2, workshop_date = $3
                WHERE id = $4
            `;
            await pool.query(updateQuery, [title, description, workshop_date, id]);

            res.status(200).json({ message: 'Workshop updated successfully' });
        } catch (error) {
            console.error('Error updating workshop:', error.message);
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
