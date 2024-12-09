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
        const { email, isAdmin, Eetvoorkeuren, Allergies, Carpool, Province } = req.query;

        try {
            // Fetch all food preferences if Eetvoorkeuren is true
            if (Eetvoorkeuren === 'true') {
                const foodQuery = `
                    SELECT id, preference_name
                    FROM eetvoorkeuren
                `;
                const foodResult = await pool.query(foodQuery);
                return res.status(200).json({ food_preferences: foodResult.rows });
            }

            // Fetch all allergies if Allergies is true
            if (Allergies === 'true') {
                const allergyQuery = `
                    SELECT id, allergy_name
                    FROM allergies
                `;
                const allergyResult = await pool.query(allergyQuery);
                return res.status(200).json({ allergies: allergyResult.rows });
            }

            // Fetch all carpool roles if Carpool is true
            if (Carpool === 'true') {
                const carpoolQuery = `
                    SELECT id, carpool_role
                    FROM carpool
                `;
                const carpoolResult = await pool.query(carpoolQuery);
                return res.status(200).json({ carpool_roles: carpoolResult.rows });
            }

            // Fetch all carpool roles if Carpool is true
            if (Province === 'true') {
                const provincieQuery = `
                    SELECT id, provincie_name
                    FROM provincies
                `;
                const carpoolResult = await pool.query(carpoolQuery);
                return res.status(200).json({ provincies: provincieQuery.rows });
            }

            // Validate email
            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }

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

            return res.status(200).json({ workshops: workshopResult.rows });
        } catch (error) {
            console.error('Error processing request:', error.message);
            return res.status(500).json({ error: 'Server error' });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
