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
        const { email, title, description, workshop_date, preference_name, allergy_name, carpool_role, provincie_name, departement_name, function_name } = req.body;
        const { eetvoorkeur, allergy, carpool, province, departement, functie } = req.query; // Query parameters for creating different records

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

            // Handle carpool role creation
            if (carpool === 'true' && carpool_role) {
                const insertCarpoolQuery = `
                    INSERT INTO carpool (carpool_role)
                    VALUES ($1) RETURNING id
                `;
                const carpoolResult = await pool.query(insertCarpoolQuery, [carpool_role]);

                return res.status(200).json({
                    message: 'Carpool role created successfully',
                    carpoolId: carpoolResult.rows[0].id,
                });
            }

            // Handle carpool role creation
            if (province === 'true' && provincie_name) {
                const insertProvinceQuery = `
                    INSERT INTO provincies (provincie_name)
                    VALUES ($1) RETURNING id
                `;
                const provinceResult = await pool.query(insertProvinceQuery, [provincie_name]);

                return res.status(200).json({
                    message: 'Provincie created successfully',
                    carpoolId: provinceResult.rows[0].id,
                });
            }

            // Handle carpool role creation
            if (departement === 'true' && departement_name) {
                const insertDepartementQuery = `
                    INSERT INTO departement (departement_name)
                    VALUES ($1) RETURNING id
                `;
                const departementResult = await pool.query(insertDepartementQuery, [departement_name]);

                return res.status(200).json({
                    message: 'Departement created successfully',
                    carpoolId: departementResult.rows[0].id,
                });
            }

            // Handle carpool role creation
            if (functie === 'true' && function_name) {
                const insertFunctieQuery = `
                    INSERT INTO functions (function_name)
                    VALUES ($1) RETURNING id
                `;
                const functieResult = await pool.query(insertFunctieQuery, [function_name]);

                return res.status(200).json({
                    message: 'Functie created successfully',
                    carpoolId: functieResult.rows[0].id,
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
    } else if (req.method === 'DELETE') {
        const { id } = req.query; // `id` of the record to delete
        const { type } = req.query; // Type of record: 'eetvoorkeur', 'allergy', 'carpool'

        if (!id || !type) {
            return res.status(400).json({ error: 'ID and type are required' });
        }

        try {
            let deleteQuery = '';

            // Determine the appropriate table to delete from
            if (type === 'eetvoorkeur') {
                deleteQuery = 'DELETE FROM eetvoorkeuren WHERE id = $1';
            } else if (type === 'allergy') {
                deleteQuery = 'DELETE FROM allergies WHERE id = $1';
            } else if (type === 'carpool') {
                deleteQuery = 'DELETE FROM carpool WHERE id = $1';
            } else if (type === 'workshop') {
                deleteQuery = 'DELETE FROM workshops WHERE id = $1';
            } else if (type === 'provincie') {
                deleteQuery = 'DELETE FROM provincies WHERE id = $1';
            } else if (type === 'departement') {
                deleteQuery = 'DELETE FROM departement WHERE id = $1';
            } else if (type === 'functie') {
                deleteQuery = 'DELETE FROM functions WHERE id = $1';
            }else {
                return res.status(400).json({ error: 'Invalid type for deletion' });
            }

            // Execute deletion
            await pool.query(deleteQuery, [id]);
            res.status(200).json({ message: `${type} deleted successfully` });
        } catch (error) {
            console.error('Error deleting item:', error.message);
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
