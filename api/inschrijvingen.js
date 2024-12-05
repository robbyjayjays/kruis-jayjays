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
    if (req.method === 'GET') {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        try {
            // Fetch user_id based on email
            const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
            const user = userResult.rows[0];

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const userId = user.id;

            // Fetch inschrijving details
            const inschrijvingResult = await pool.query(
                'SELECT * FROM inschrijvingen WHERE user_id = $1',
                [userId]
            );

            if (inschrijvingResult.rows.length > 0) {
                res.status(200).json({
                    exists: true,
                    inschrijving: inschrijvingResult.rows[0], // Return inschrijving details
                });
            } else {
                res.status(200).json({ exists: false });
            }
        } catch (error) {
            console.error('Error checking inschrijvingen:', error.message);
            res.status(500).send('Server error');
        }
    } else if (req.method === 'PUT') {
        const {
            email,
            department,
            province,
            functions,
            morningWorkshop,
            afternoonWorkshop,
            dietaryPreferences,
            allergies,
            carpoolPreferences,
        } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        try {
            // Fetch user_id based on email
            const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
            const user = userResult.rows[0];

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const userId = user.id;

            // Update the inschrijving for the user
            const updateResult = await pool.query(
                `UPDATE inschrijvingen
                 SET department = $1,
                     province = $2,
                     functions = $3,
                     workshop_morning = $4,
                     workshop_afternoon = $5,
                     food_choice = $6,
                     allergies = $7,
                     carpool = $8
                 WHERE user_id = $9`,
                [
                    department,
                    province,
                    functions,
                    morningWorkshop,
                    afternoonWorkshop,
                    dietaryPreferences,
                    allergies,
                    carpoolPreferences,
                    userId,
                ]
            );

            if (updateResult.rowCount > 0) {
                // Configure Nodemailer for SendGrid
                const transporter = nodemailer.createTransport({
                    host: 'smtp.sendgrid.net',
                    port: 587,
                    auth: {
                        user: 'apikey',
                        pass: process.env.SENDGRID_API_KEY,
                    },
                });

                const mailOptions = {
                    to: user.email,
                    from: process.env.EMAIL_USER,
                    subject: 'Inschrijving Updated',
                    text: `Hello ${user.email}, your inschrijving has been successfully updated.`,
                };

                // Send the email
                await transporter.sendMail(mailOptions);
                res.status(200).json({ message: 'Inschrijving successfully updated!' });
            } else {
                res.status(404).json({ error: 'No inschrijving found to update.' });
            }
        } catch (error) {
            console.error('Error updating inschrijving:', error.message);
            res.status(500).send('Server error');
        }
    } else if (req.method === 'DELETE') {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        try {
            // Fetch user_id based on email
            const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
            const user = userResult.rows[0];

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const userId = user.id;

            // Delete the inschrijving for the user
            const deleteResult = await pool.query(
                'DELETE FROM inschrijvingen WHERE user_id = $1',
                [userId]
            );

            if (deleteResult.rowCount > 0) {
              // Configure Nodemailer for SendGrid
                const transporter = nodemailer.createTransport({
                    host: 'smtp.sendgrid.net',
                    port: 587,
                    auth: {
                        user: 'apikey',
                        pass: process.env.SENDGRID_API_KEY,
                    },
                });

                const mailOptions = {
                    to: user.email,
                    from: process.env.EMAIL_USER,
                    subject: 'Inschrijving Deleted',
                    text: `Hello ${user.email}, your inschrijving has been successfully deleted.`,
                };

                // Send the email
                await transporter.sendMail(mailOptions);
                res.status(200).json({ message: 'Inschrijving successfully deleted' });
            } else {
                res.status(404).json({ error: 'No inschrijving found to delete' });
            }
        } catch (error) {
            console.error('Error deleting inschrijvingen:', error.message);
            res.status(500).send('Server error');
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
