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
        const { email, title, description, workshop_date, preference_name, allergy_name } = req.body;
        const { eetvoorkeur, allergy } = req.query; // Query parameters for creating Eetvoorkeur or Allergy

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        try {
            // Handle food preference creation
            if (eetvoorkeur === 'true' && preference_name) {
                const insertEetvoorkeurQuery = `
                    INSERT INTO eetvoorkeuren (preference_name)
                    VALUES ($1) RETURNING id
                `;
                const eetvoorkeurResult = await pool.query(insertEetvoorkeurQuery, [preference_name]);

                return res.status(200).json({
                    message: 'Food preference created successfully',
                    preferenceId: eetvoorkeurResult.rows[0].id,
                });
            }

            // Handle allergy creation
            if (allergy === 'true' && allergy_name) {
                const insertAllergyQuery = `
                    INSERT INTO allergies (allergy_name)
                    VALUES ($1) RETURNING id
                `;
                const allergyResult = await pool.query(insertAllergyQuery, [allergy_name]);

                return res.status(200).json({
                    message: 'Allergy created successfully',
                    allergyId: allergyResult.rows[0].id,
                });
            }

            // Workshop creation logic
            if (!title || !description || !workshop_date) {
                return res.status(400).json({
                    error: 'Title, description, and workshop date are required for creating a workshop',
                });
            }

            // Get the user ID from the email
            const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
            const user = userResult.rows[0];

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const userId = user.id;

            const insertWorkshopQuery = `
                INSERT INTO workshops (title, description, creator_id, subscribers, workshop_date)
                VALUES ($1, $2, $3, $4, $5) RETURNING id
            `;
            const workshopResult = await pool.query(insertWorkshopQuery, [title, description, userId, [], workshop_date]);

            return res.status(200).json({
                message: 'Workshop created successfully',
                workshopId: workshopResult.rows[0].id,
            });
        } catch (error) {
            console.error('Error processing request:', error.message);
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
