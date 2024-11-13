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
        const { email, title, description } = req.body;

        if (!email || !title || !description) {
            return res.status(400).json({ error: 'Email, title, and description are required' });
        }

        try {
            // Get the user ID from the email
            const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
            const user = userResult.rows[0];

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const userId = user.id;

            // Insert the new workshop into the database
            const insertQuery = `
                INSERT INTO workshops (title, description, creator_id, subscribers, created_at)
                VALUES ($1, $2, $3, $4, NOW()) RETURNING id
            `;
            const result = await pool.query(insertQuery, [title, description, userId, []]);

            const newWorkshopId = result.rows[0].id;

            res.status(200).json({ message: 'Workshop created successfully', workshopId: newWorkshopId });
        } catch (error) {
            console.error('Error creating workshop:', error.message);
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
