import pkg from 'pg';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

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
    const { email, workshopId, action } = req.body;

    if (!email || !workshopId || !['subscribe', 'unsubscribe'].includes(action)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    try {
      // Check if user exists
      const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      const user = userResult.rows[0];

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userId = user.id;

      // Perform action (subscribe or unsubscribe)
      if (action === 'subscribe') {
        await pool.query(
          'UPDATE workshops SET subscribers = array_append(subscribers, $1::int) WHERE id = $2 AND NOT subscribers @> ARRAY[$1::int]',
          [userId, workshopId]
        );
      } else if (action === 'unsubscribe') {
        await pool.query(
          'UPDATE workshops SET subscribers = array_remove(subscribers, $1::int) WHERE id = $2',
          [userId, workshopId]
        );
      }

      // Configure Nodemailer for SendGrid
      const transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        },
      });

      // Email content
      const actionMessage =
        action === 'subscribe'
          ? 'You have successfully subscribed to the workshop.'
          : 'You have successfully unsubscribed from the workshop.';
      const subject =
        action === 'subscribe'
          ? 'Workshop Subscription Confirmation'
          : 'Workshop Unsubscription Confirmation';

      const mailOptions = {
        to: email,
        from: process.env.EMAIL_USER,
        subject,
        text: actionMessage,
        html: `<p>${actionMessage}</p>`, // Optional: add an HTML version
      };

      // Send the email
      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: `Successfully ${action}d and confirmation email sent` });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
