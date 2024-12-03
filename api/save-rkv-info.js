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
  if (req.method === 'POST') {
    const {
      user_id,
      department,
      province,
      functions,
      workshop_morning,
      workshop_afternoon,
      food_choice,
      allergies,
      carpool,
    } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      // Insert data into the "inschrijvingen" table
      const query = `
        INSERT INTO inschrijvingen (
          user_id,
          department,
          province,
          functions,
          workshop_morning,
          workshop_afternoon,
          food_choice,
          allergies,
          carpool,
          created_at,
          updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()
        ) RETURNING *;
      `;

      const values = [
        user_id,
        department || null,
        province || null,
        Array.isArray(functions) ? functions.join(',') : null, // Store functions as a comma-separated string
        workshop_morning || null,
        workshop_afternoon || null,
        food_choice || null,
        allergies || null,
        carpool || null,
      ];

      const result = await pool.query(query, values);
      const insertedRecord = result.rows[0];

      res.status(201).json({
        message: 'RKV information saved successfully',
        data: insertedRecord,
      });
    } catch (error) {
      console.error('Error saving RKV information:', error.message);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
