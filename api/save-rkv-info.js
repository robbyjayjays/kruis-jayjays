import pkg from 'pg';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

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
    console.log('Request body received:', req.body);
    const {
      email, // Email will be provided instead of user_id
      department,
      province,
      functions,
      morningWorkshop: workshop_morning,
      afternoonWorkshop: workshop_afternoon,
      dietaryPreferences: food_choice,
      allergies,
      carpoolPreferences: carpool,
    } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required to fetch user IDs' });
    }

    try {
      // Step 1: Retrieve user_id using the provided email
      const userQuery = 'SELECT id FROM users WHERE email = $1 LIMIT 1;';
      const userResult = await pool.query(userQuery, [email]);

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found for the provided email' });
      }

      const user_id = userResult.rows[0].id;

      // Step 2: Insert data into the "inschrijvingen" table
      const insertQuery = `
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

      const insertValues = [
        user_id,
        department || null,
        province || null,
        Array.isArray(functions) ? `{${functions.map(func => func.replace(/"/g, '\\"')).join(',')}}` : null,
        workshop_morning || null,
        workshop_afternoon || null,
        food_choice || null,
        allergies || null,
        carpool || null,
      ];

      const result = await pool.query(insertQuery, insertValues);
      const insertedRecord = result.rows[0];
      const transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
          user: 'apikey', // SendGrid requires 'apikey' as the user
          pass: process.env.SENDGRID_API_KEY, // Your SendGrid API Key
        },
      });

      const mailOptions = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: 'Inschrijving Confirmation',
        text: `Hallo, Jouw inschrijving was succesvol, hier zijn de details van jouw inschrijving:
        
        - Departement: ${department || 'N/A'}
        - Provincie: ${province || 'N/A'}
        - Ochtend Workshop: ${workshop_morning || 'N/A'}
        - Namiddag Workshop: ${workshop_afternoon || 'N/A'}
        - Eetvoorkeur: ${food_choice || 'N/A'}
        - Allergieën: ${allergies || 'N/A'}
        - Carpool Optie: ${carpool || 'N/A'}

        Bedankt voor jouw registratie!`,
      };

      await transporter.sendMail(mailOptions);

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
